# Supabase Schema Reference

> Справочник схемы БД. Не для выполнения — только для контекста.
> Текущее состояние таблиц в Supabase (проект khkzkgmwpnfloujpohki).

---

## Цепочка оплаты (DWG-mesh)

1. Страница `/plugins/archicad/DWG-mesh` → PurchasePanel
2. Email → OTP → подтверждение
3. «Оплатить через Robokassa» → `create-robokassa-payment` Edge Function
4. Функция возвращает `params` → `window.Robokassa.StartPayment(params)` — оплата в iframe Robokassa (`auth.robokassa.ru`)
5. Robokassa при успехе редиректит на `https://227.info/#/plugins/archicad/DWG-mesh?payment=success`
6. При отказе — на `?payment=fail`
7. Callback `robokassa-result` вызывает Robokassa и отправляет письмо с файлом

**Важно:** Ошибки шрифтов (Inter-Medium.woff2 и т.п.) идут из Robokassa iframe, исправить нельзя.

---

## 1. Таблицы (текущее состояние)

### customer_access
Заказы/доступ покупателей. Связь email + product_code, Robokassa payment_id.

| Колонка      | Тип       | Ограничения | Описание                    |
|--------------|-----------|-------------|-----------------------------|
| id           | uuid      | PK          |                             |
| email        | text      | NOT NULL    | Email покупателя            |
| product_code | text      | NOT NULL    | Код продукта (dwg-mesh)     |
| is_paid      | boolean   | DEFAULT false | Оплачено                   |
| payment_id   | text      |             | InvId от Robokassa          |
| paid_at      | timestamptz |           | Время оплаты                |
| max_resends  | integer   | DEFAULT 5   | Лимит повторной отправки    |
| created_at   | timestamptz | DEFAULT now() | Создание записи           |

**RLS:** пользователь читает только свои записи (по email из JWT).

---

### delivery_log
Журнал доставки (email, статус отправки).

| Колонка      | Тип       | Ограничения | Описание               |
|--------------|-----------|-------------|------------------------|
| id           | uuid      | PK          |                        |
| email        | text      | NOT NULL    |                        |
| product_code | text      | NOT NULL    |                        |
| delivery_type| text      | NOT NULL    | 'payment' или 'resend' |
| status       | text      | NOT NULL    | 'sent'                 |
| sent_at      | timestamptz | DEFAULT now() |                     |
| notes        | text      |             |                        |

**RLS:** пользователь читает только свои записи.

---

### products
Продукты (плагины) для продажи. Путь к файлу в Storage.

| Колонка     | Тип       | Ограничения  | Описание                          |
|-------------|-----------|--------------|-----------------------------------|
| id          | uuid      | PK           |                                   |
| code        | text      | UNIQUE, NOT NULL | Код (dwg-mesh)                |
| title_ru    | text      | NOT NULL     |                                   |
| title_en    | text      |              |                                   |
| price_rub   | integer   | NOT NULL     |                                   |
| storage_path| text      | NOT NULL     | Путь в bucket plugins (dwg-mesh.zip) |
| is_active   | boolean   | DEFAULT true |                                   |
| created_at  | timestamptz | DEFAULT now() |                               |

---

### resend_queue
Очередь повторной отправки. Webhook при INSERT шлёт письмо.

| Колонка      | Тип       | Ограничения | Описание       |
|--------------|-----------|-------------|----------------|
| id           | uuid      | PK          |                |
| email        | text      | NOT NULL    |                |
| product_code | text      | NOT NULL    |                |
| status       | text      | DEFAULT 'pending' | 'pending' / 'sent' |
| created_at   | timestamptz | DEFAULT now() |               |

---

### plugins (новая, из миграции)
Каталог плагинов для маркетплейса.

| Колонка      | Тип       | Ограничения | Описание                |
|--------------|-----------|-------------|-------------------------|
| id           | uuid      | PK          |                         |
| slug         | text      | UNIQUE, NOT NULL | URL slug (DWG-mesh) |
| title_ru     | text      | NOT NULL    |                         |
| title_en     | text      |             |                         |
| platform     | text      | NOT NULL    | archicad, revit, renga  |
| price        | integer   | DEFAULT 0   |                         |
| description_ru | text    |             |                         |
| description_en | text    |             |                         |
| storage_path | text      |             | Путь в bucket plugins   |
| is_active    | boolean   | DEFAULT true|                         |
| created_at   | timestamptz | DEFAULT now() |                     |

**RLS:** публичный SELECT только для `is_active = true`.

---

## 2. RPC

### queue_plugin_resend(p_email, p_product_code)
Ставит запись в `resend_queue` для повторной отправки. Проверяет оплату в `customer_access` и лимит в `delivery_log`.  
Вызов: `supabase.rpc('queue_plugin_resend', { p_email, p_product_code })`.

---

## 3. Storage

**Bucket:** `plugins`  
Файлы плагинов. Путь берётся из `products.storage_path` (например `dwg-mesh.zip`).

---

## 4. Миграции и изменения

| Файл | Что делает |
|------|------------|
| `20250308000000_rls_purchase.sql` | RLS для customer_access, delivery_log |
| `20250308100000_delivery_log.sql` | CREATE delivery_log (если не было) |
| `20250308120000_resend_queue.sql` | CREATE resend_queue, RPC queue_plugin_resend |
| `20250313000000_products_storage_path.sql` | ADD storage_path если нет, UPDATE dwg-mesh |
| `20250313000001_plugins_table.sql` | CREATE plugins, RLS |

---

## 5. SQL-дамп для справки (НЕ ЗАПУСКАТЬ)

```sql
-- WARNING: Только для справки. Таблицы уже созданы в Supabase.

CREATE TABLE public.customer_access (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  product_code text NOT NULL,
  is_paid boolean DEFAULT false,
  payment_id text,
  paid_at timestamptz,
  max_resends integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT customer_access_pkey PRIMARY KEY (id)
);

CREATE TABLE public.delivery_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  product_code text NOT NULL,
  delivery_type text NOT NULL,
  status text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  notes text,
  CONSTRAINT delivery_log_pkey PRIMARY KEY (id)
);

CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title_ru text NOT NULL,
  title_en text,
  price_rub integer NOT NULL,
  storage_path text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id)
);

CREATE TABLE public.resend_queue (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  product_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT resend_queue_pkey PRIMARY KEY (id)
);

CREATE TABLE public.plugins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_ru text NOT NULL,
  title_en text,
  platform text NOT NULL,
  price integer DEFAULT 0,
  description_ru text,
  description_en text,
  storage_path text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```
