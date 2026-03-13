-- RLS для покупки плагинов (customer_access, delivery_log, products)
-- Выполните в Supabase SQL Editor

-- customer_access: пользователь может читать только свои записи (по email из JWT)
ALTER TABLE customer_access ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own customer_access" ON customer_access;
CREATE POLICY "Users can read own customer_access" ON customer_access
  FOR SELECT
  USING (LOWER(email) = LOWER(auth.jwt() ->> 'email'));

-- delivery_log: пользователь может читать только свои записи
ALTER TABLE delivery_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own delivery_log" ON delivery_log;
CREATE POLICY "Users can read own delivery_log" ON delivery_log
  FOR SELECT
  USING (LOWER(email) = LOWER(auth.jwt() ->> 'email'));
