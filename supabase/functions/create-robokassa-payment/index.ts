import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import md5 from 'npm:md5@2.3.0'

async function hashSignature(signString: string, algorithm: string): Promise<string> {
  let hex: string
  if (algorithm === 'sha256') {
    const enc = new TextEncoder()
    const buf = await crypto.subtle.digest('SHA-256', enc.encode(signString))
    hex = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  } else {
    hex = md5(signString)
  }
  return hex.toLowerCase()
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
  const token = authHeader.slice(7)
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user?.email) {
    return new Response(
      JSON.stringify({ error: 'Invalid or expired session. Please sign in again.' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const { product_code, email } = await req.json()
    if (!product_code || !email) {
      return new Response(
        JSON.stringify({ error: 'product_code and email required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    const emailLower = email.toLowerCase().trim()
    if (emailLower !== user!.email!.toLowerCase()) {
      return new Response(
        JSON.stringify({ error: 'Email must match verified account' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const merchantLogin = Deno.env.get('ROBOKASSA_MERCHANT_LOGIN')!
    const isTest = Deno.env.get('ROBOKASSA_IS_TEST') === '1'
    const pass1 = isTest ? Deno.env.get('ROBOKASSA_PASS1_TEST') : Deno.env.get('ROBOKASSA_PASS1')
    if (!pass1) {
      return new Response(
        JSON.stringify({ error: 'Robokassa credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('code, title_ru, price_rub')
      .eq('code', product_code)
      .eq('is_active', true)
      .maybeSingle()

    if (productError || !product) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const priceRub = parseFloat(String(product.price_rub || 0))
    if (!priceRub || priceRub <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid product price' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const invId = String(Math.floor((Date.now() % 2147483647) + 1))
    const outSum = priceRub.toFixed(2)
    const description = (product.title_ru || product_code).slice(0, 100)

    const { error: insertError } = await supabase.from('customer_access').insert({
      email: emailLower,
      product_code,
      is_paid: false,
      payment_id: invId,
    })

    if (insertError) {
      const { error: updateError } = await supabase
        .from('customer_access')
        .update({ payment_id: invId, is_paid: false })
        .eq('email', emailLower)
        .eq('product_code', product_code)
      if (updateError) {
        return new Response(
          JSON.stringify({ error: 'Failed to create order' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    const signString = `${merchantLogin}:${outSum}:${invId}:${pass1}:Shp_email=${emailLower}`
    const hashAlgo = (Deno.env.get('ROBOKASSA_HASH') || 'md5').toLowerCase()
    const signatureValue = await hashSignature(signString, hashAlgo)

    const siteUrl = Deno.env.get('SITE_URL') || 'https://227.info'
    const successUrl = `${siteUrl}/#/plugins/archicad/DWG-mesh?payment=success`
    const failUrl = `${siteUrl}/#/plugins/archicad/DWG-mesh?payment=fail`

    const paymentParams: Record<string, string> = {
      MerchantLogin: merchantLogin,
      OutSum: outSum,
      InvId: invId,
      Description: description,
      SignatureValue: signatureValue,
      Email: email,
      Shp_email: emailLower,
      Culture: 'ru',
      Encoding: 'utf-8',
      SuccessURL: successUrl,
      FailURL: failUrl,
    }
    if (isTest) paymentParams.IsTest = '1'

    return new Response(
      JSON.stringify({ params: paymentParams }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
