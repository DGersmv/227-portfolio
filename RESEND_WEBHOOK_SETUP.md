# Настройка повторной отправки плагина

Повторная отправка работает через **Supabase RPC + Database Webhook**. Браузер вызывает только RPC (стабильно), письмо отправляется по webhook.

## 1. Выполните миграцию

В Supabase Dashboard → SQL Editor выполните содержимое файла:

```
supabase/migrations/20250308120000_resend_queue.sql
```

Или через CLI:

```bash
npx supabase db push
```

## 2. Разверните Edge Function resend-webhook

```bash
npx supabase functions deploy resend-webhook --project-ref khkzkgmwpnfloujpohki --no-verify-jwt
```

## 3. Настройте Database Webhook

1. Supabase Dashboard → **Database** → **Webhooks**
2. **Create a new hook**
3. **Name:** `resend-plugin`
4. **Table:** `resend_queue`
5. **Events:** только **Insert**
6. **Type:** HTTP
7. **URL:** `https://khkzkgmwpnfloujpohki.supabase.co/functions/v1/resend-webhook`
8. **HTTP Method:** POST
9. **Create**

Готово. При клике «Отправить плагин повторно»:
- Фронт вызывает RPC `queue_plugin_resend` (Supabase REST API, без Edge Function из браузера)
- RPC проверяет оплату, лимит и вставляет строку в `resend_queue`
- Webhook вызывает `resend-webhook` (с сервера Supabase), тот отправляет письмо
