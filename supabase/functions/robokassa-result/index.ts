import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import md5 from 'npm:md5@2.3.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const isTest = req.url.includes('IsTest=1') || false
    const pass2 = isTest ? Deno.env.get('ROBOKASSA_PASS2_TEST') : Deno.env.get('ROBOKASSA_PASS2')
    if (!pass2) {
      console.error('Robokassa Pass2 not configured')
      return new Response('Internal error', { status: 500 })
    }

    const contentType = req.headers.get('content-type') || ''
    let params: Record<string, string>
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await req.text()
      params = Object.fromEntries(new URLSearchParams(text))
    } else if (contentType.includes('application/json')) {
      params = await req.json()
    } else {
      const text = await req.text()
      params = Object.fromEntries(new URLSearchParams(text))
    }

    const outSum = params.OutSum || params.out_summ || ''
    const invId = params.InvId || params.inv_id || ''
    const signatureValue = params.SignatureValue || params.signature_value || ''
    const shpEmail = params.Shp_email || params.shp_email || ''

    if (!outSum || !invId || !signatureValue) {
      return new Response('Bad request', { status: 400 })
    }

    const signParts = [outSum, invId, pass2]
    if (shpEmail) signParts.push(`Shp_email=${shpEmail}`)
    const signString = signParts.join(':')
    const expectedSign = md5(signString)
    if (signatureValue.toLowerCase() !== expectedSign.toLowerCase()) {
      console.error('Signature mismatch')
      return new Response('Invalid signature', { status: 400 })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase
      .from('customer_access')
      .update({ is_paid: true, paid_at: new Date().toISOString() })
      .eq('payment_id', invId)

    if (error) {
      console.error('Update customer_access failed:', error)
      return new Response('DB error', { status: 500 })
    }

    const productCode = 'dwg-mesh'
    const resendKey = Deno.env.get('RESEND_API_KEY')
    if (resendKey && shpEmail) {
      const { data: product, error: productErr } = await supabase
        .from('products')
        .select('storage_path')
        .eq('code', productCode)
        .eq('is_active', true)
        .maybeSingle()

      if (productErr || !product?.storage_path) {
        console.error('Product or storage_path not found:', productErr || 'no storage_path')
      } else {
        const { data: signed, error: signedErr } = await supabase.storage
          .from('plugins')
          .createSignedUrl(product.storage_path, 604800)

        if (signedErr || !signed?.signedUrl) {
          console.error('Failed to create signed URL:', signedErr)
        } else {
          const zipUrl = signed.signedUrl
          try {
            const emailRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: Deno.env.get('RESEND_FROM_EMAIL') || '227.info <noreply@227.info>',
                to: [shpEmail],
                subject: 'DWG-mesh — плагин для Archicad | ООО «227.ИНФО»',
                html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#333;max-width:560px;margin:0 auto;padding:20px;">
  <p>Здравствуйте!</p>
  <p>Благодарим за покупку плагина <strong>DWG-mesh</strong> для Graphisoft Archicad.</p>
  <p>Архив <strong>dwg-mesh.zip</strong> прикреплён к письму. Также его можно скачать по ссылке: <a href="${zipUrl}" style="color:#6366f1;">dwg-mesh.zip</a></p>
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
            if (emailRes.ok) {
              await supabase.from('delivery_log').insert({
                email: shpEmail,
                product_code: productCode,
                delivery_type: 'payment',
                status: 'sent',
              })
            } else {
              console.error('Resend error:', await emailRes.text())
            }
          } catch (e) {
            console.error('Send email error:', e)
          }
        }
      }
    }

    return new Response(`OK${invId}`, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (err) {
    console.error(err)
    return new Response('Internal error', { status: 500 })
  }
})
