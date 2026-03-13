-- Таблица delivery_log (если ещё не создана)
-- Выполните в Supabase SQL Editor

CREATE TABLE IF NOT EXISTS delivery_log (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  product_code TEXT NOT NULL,
  delivery_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
