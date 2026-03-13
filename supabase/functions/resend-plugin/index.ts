import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const MAX_RESENDS = 5

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders })
  }

  try {
    const { email, product_code } = await req.json()
    const emailLower = (email || '').trim().toLowerCase()
    if (!emailLower || !product_code) {
      return new Response(
        JSON.stringify({ error: 'email and product_code required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: access, error: accessError } = await supabase
      .from('customer_access')
      .select('is_paid')
      .eq('email', emailLower)
      .eq('product_code', product_code)
      .eq('is_paid', true)
      .maybeSingle()

    if (accessError || !access) {
      return new Response(
        JSON.stringify({ error: 'Payment not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { count } = await supabase
      .from('delivery_log')
      .select('*', { count: 'exact', head: true })
      .eq('email', emailLower)
      .eq('product_code', product_code)
      .eq('delivery_type', 'resend')
      .eq('status', 'sent')

    if ((count ?? 0) >= MAX_RESENDS) {
      return new Response(
        JSON.stringify({ error: 'Resend limit reached' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const resendKey = Deno.env.get('RESEND_API_KEY')
    if (!resendKey) {
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: product, error: productErr } = await supabase
      .from('products')
      .select('storage_path')
      .eq('code', product_code)
      .eq('is_active', true)
      .maybeSingle()

    if (productErr || !product?.storage_path) {
      console.error('Product or storage_path not found:', productErr || 'no storage_path')
      return new Response(
        JSON.stringify({ error: 'Product file not available' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: signed, error: signedErr } = await supabase.storage
      .from('plugins')
      .createSignedUrl(product.storage_path, 604800)

    if (signedErr || !signed?.signedUrl) {
      console.error('Failed to create signed URL:', signedErr)
      return new Response(
        JSON.stringify({ error: 'Failed to generate download link' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const zipUrl = signed.signedUrl
    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || '227.info <noreply@227.info>'

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [emailLower],
        subject: 'DWG-mesh — плагин для Archicad (повторная отправка) | ООО «227.ИНФО»',
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#333;max-width:560px;margin:0 auto;padding:20px;">
  <p>Здравствуйте!</p>
  <p>По вашему запросу повторно отправляем плагин <strong>DWG-mesh</strong> для Graphisoft Archicad.</p>
  <p>Скачать архив: <a href="${zipUrl}" style="color:#6366f1;">dwg-mesh.zip</a></p>
  <p><strong>Установка:</strong> распакуйте архив. Внутри — файлы DWG-mesh_AC27.apx, DWG-mesh_AC28.apx, DWG-mesh_AC29.apx и инструкция. Скопируйте нужный .apx в папку Archicad/Add-Ons.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
  <p style="font-size:13px;color:#6b7280;">
    <strong>ООО «227.ИНФО»</strong><br>
    ИНН 4704119987 · ОГРН 1264700000399<br>
    <a href="https://227.info" style="color:#6366f1;">227.info</a> · 
    <a href="https://227.info/#/oferta" style="color:#6366f1;">Публичная оферта</a> · 
    <a href="https://227.info/#/privacy" style="color:#6366f1;">Политика конфиденциальности</a><br>
    По вопросам: <a href="mailto:admin@227.info" style="color:#6366f1;">admin@227.info</a>
  </p>
</body>
</html>`,
        attachments: [{ path: zipUrl, filename: 'dwg-mesh.zip' }],
      }),
    })

    if (!emailRes.ok) {
      const errText = await emailRes.text()
      console.error('Resend error:', errText)
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    await supabase.from('delivery_log').insert({
      email: emailLower,
      product_code,
      delivery_type: 'resend',
      status: 'sent',
    })

    const { count } = await supabase
      .from('delivery_log')
      .select('*', { count: 'exact', head: true })
      .eq('email', emailLower)
      .eq('product_code', product_code)
      .eq('delivery_type', 'resend')
      .eq('status', 'sent')

    const resendsLeft = Math.max(0, MAX_RESENDS - (count ?? 0))
    return new Response(
      JSON.stringify({ ok: true, resendsLeft }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
