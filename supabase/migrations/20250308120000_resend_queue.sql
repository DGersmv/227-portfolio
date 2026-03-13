-- Таблица очереди повторной отправки (триггер для webhook)
-- RPC для фронтенда — вся логика в БД, без вызова Edge Function из браузера

CREATE TABLE IF NOT EXISTS public.resend_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  product_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RPC: проверка + постановка в очередь. Вызывается с фронта через supabase.rpc()
CREATE OR REPLACE FUNCTION public.queue_plugin_resend(
  p_email TEXT,
  p_product_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_paid BOOLEAN;
  v_count INT;
  v_resends_left INT;
  v_max_resends INT := 5;
BEGIN
  -- Проверка оплаты
  SELECT EXISTS (
    SELECT 1 FROM customer_access
    WHERE LOWER(email) = LOWER(TRIM(p_email))
      AND product_code = p_product_code
      AND is_paid = true
  ) INTO v_paid;

  IF NOT v_paid THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Payment not found', 'resendsLeft', 0);
  END IF;

  -- Подсчёт уже отправленных
  SELECT COUNT(*)::INT INTO v_count
  FROM delivery_log
  WHERE LOWER(email) = LOWER(TRIM(p_email))
    AND product_code = p_product_code
    AND delivery_type = 'resend'
    AND status = 'sent';

  IF v_count >= v_max_resends THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Resend limit reached', 'resendsLeft', 0);
  END IF;

  -- Ставим в очередь (webhook отправит письмо)
  INSERT INTO resend_queue (email, product_code)
  VALUES (LOWER(TRIM(p_email)), p_product_code);

  v_resends_left := v_max_resends - v_count - 1;
  RETURN jsonb_build_object('ok', true, 'resendsLeft', GREATEST(0, v_resends_left));
END;
$$;

-- Разрешить вызов RPC анонимным пользователям (валидация внутри функции)
GRANT EXECUTE ON FUNCTION public.queue_plugin_resend(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.queue_plugin_resend(TEXT, TEXT) TO authenticated;
