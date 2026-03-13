# Настройка Robokassa для отправки письма после оплаты

## Ошибка 29 — неверный SignatureValue

Подпись: `MerchantLogin:OutSum:InvId:Password1:Shp_email=email` (алгоритм — как в Robokassa).

**Чек-лист:**

1. **Robokassa** → Мои магазины → **Технические настройки**:
   - **Алгоритм расчёта контрольной суммы** — MD5 или SHA256. То же значение задайте в `ROBOKASSA_HASH` (см. ниже).
   - **Идентификатор магазина** — скопируйте в `ROBOKASSA_MERCHANT_LOGIN`.
   - **Пароль №1** (и тестовый, если IsTest=1) — без пробелов, точно как в настройках.

2. **Supabase** → Project Settings → Edge Functions → **Secrets**:
   - `ROBOKASSA_MERCHANT_LOGIN` — как в Robokassa
   - `ROBOKASSA_PASS1` — Пароль №1 (боевой)
   - `ROBOKASSA_PASS1_TEST` — тестовый Пароль №1 (при `ROBOKASSA_IS_TEST=1`)
   - `ROBOKASSA_HASH` — `md5` или `sha256` (должно совпадать с Robokassa). По умолчанию `md5`.

3. **Режим:** `ROBOKASSA_IS_TEST=1` → используется `ROBOKASSA_PASS1_TEST`, иначе `ROBOKASSA_PASS1`.

4. После изменения секретов задеплойте:
   ```bash
   npx supabase functions deploy create-robokassa-payment --project-ref khkzkgmwpnfloujpohki --no-verify-jwt
   ```

---

Чтобы **письмо с плагином** приходило после оплаты, в личном кабинете Robokassa нужно указать **Result URL**.

## Result URL

1. Откройте **личный кабинет Robokassa** → **Технические настройки**
2. Найдите поле **Result URL** (или «URL для уведомления о результате операции»)
3. Укажите:

```
https://khkzkgmwpnfloujpohki.supabase.co/functions/v1/robokassa-result
```

4. Сохраните настройки

Без Result URL Robokassa не вызывает наш webhook, поэтому:
- в БД не помечается оплата
- письмо не отправляется
- при возврате на сайт не показывается статус «оплачено»

## Тестовый режим

Для тестовых платежей (IsTest=1) убедитесь, что в Robokassa указан тестовый Result URL или тот же URL — он обрабатывает и тест, и боевой режим.

## Проверка

После оплаты:

1. **Supabase Dashboard** → Edge Functions → `robokassa-result` → **Logs** — должны быть вызовы и без ошибок
2. Письмо должно прийти на email, указанный при оплате
3. При возврате «Вернуться в магазин» — панель «Спасибо за покупку» с итогом
