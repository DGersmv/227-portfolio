-- Таблица плагинов для маркетплейса
CREATE TABLE IF NOT EXISTS public.plugins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_ru TEXT NOT NULL,
  title_en TEXT,
  platform TEXT NOT NULL,
  price INTEGER DEFAULT 0,
  description_ru TEXT,
  description_en TEXT,
  storage_path TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Публичный чтение для маркетплейса
ALTER TABLE plugins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active plugins" ON plugins;
CREATE POLICY "Public read active plugins" ON plugins
  FOR SELECT USING (is_active = true);
