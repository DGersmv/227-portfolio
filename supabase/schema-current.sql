-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.
-- Актуальное состояние таблиц Supabase (проект khkzkgmwpnfloujpohki).

CREATE TABLE public.customer_access (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  product_code text NOT NULL,
  is_paid boolean DEFAULT false,
  payment_id text,
  paid_at timestamp with time zone,
  max_resends integer DEFAULT 5,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT customer_access_pkey PRIMARY KEY (id)
);

CREATE TABLE public.delivery_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  product_code text NOT NULL,
  delivery_type text NOT NULL,
  status text NOT NULL,
  sent_at timestamp with time zone DEFAULT now(),
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
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id)
);

CREATE TABLE public.resend_queue (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  product_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT resend_queue_pkey PRIMARY KEY (id)
);

-- Добавляется миграцией 20250313000001_plugins_table.sql (если ещё нет)
CREATE TABLE IF NOT EXISTS public.plugins (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_ru text NOT NULL,
  title_en text,
  platform text NOT NULL,
  price integer DEFAULT 0,
  description_ru text,
  description_en text,
  storage_path text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT plugins_pkey PRIMARY KEY (id)
);
