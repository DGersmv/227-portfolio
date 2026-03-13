// Вызывается Database Webhook при INSERT в resend_queue.
// Сервер Supabase вызывает этот URL — CORS не нужен.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const EMAIL_HTML = (zipUrl: string) => `<!DOCTYPE html>
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
</html>`

Deno.serve(async (req) => {
  try {
    const payload = await req.json()
    const record = payload?.record
    if (!record?.email || !record?.product_code) {
      return new Response('Bad request', { status: 400 })
    }
    const emailLower = String(record.email).trim().toLowerCase()
    const productCode = String(record.product_code)

    const resendKey = Deno.env.get('RESEND_API_KEY')
    if (!resendKey) {
      console.error('RESEND_API_KEY not configured')
      return new Response('Server error', { status: 500 })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: product, error: productErr } = await supabase
      .from('products')
      .select('storage_path')
      .eq('code', productCode)
      .eq('is_active', true)
      .maybeSingle()

    if (productErr || !product?.storage_path) {
      console.error('Product or storage_path not found:', productErr || 'no storage_path')
      return new Response('Server error', { status: 500 })
    }

    const { data: signed, error: signedErr } = await supabase.storage
      .from('plugins')
      .createSignedUrl(product.storage_path, 604800)

    if (signedErr || !signed?.signedUrl) {
      console.error('Failed to create signed URL:', signedErr)
      return new Response('Server error', { status: 500 })
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
        html: EMAIL_HTML(zipUrl),
        attachments: [{ path: zipUrl, filename: 'dwg-mesh.zip' }],
      }),
    })

    if (!emailRes.ok) {
      console.error('Resend error:', await emailRes.text())
      return new Response('Send failed', { status: 500 })
    }

    await supabase.from('delivery_log').insert({
      email: emailLower,
      product_code: productCode,
      delivery_type: 'resend',
      status: 'sent',
    })

    await supabase.from('resend_queue').update({ status: 'sent' }).eq('id', record.id)

    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response('Internal error', { status: 500 })
  }
})
