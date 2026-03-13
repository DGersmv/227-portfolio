-- Публичное чтение активных продуктов (для отображения цен на маркетплейсе)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active products" ON products;
CREATE POLICY "Public read active products" ON products
  FOR SELECT USING (is_active = true);

-- Убедиться, что продукт dwg-mesh есть (если таблица пустая)
INSERT INTO products (code, title_ru, title_en, price_rub, storage_path, is_active)
VALUES ('dwg-mesh', 'DWG-mesh', 'DWG-mesh', 1990, 'dwg-mesh.zip', true)
ON CONFLICT (code) DO UPDATE SET
  storage_path = COALESCE(EXCLUDED.storage_path, products.storage_path),
  is_active = products.is_active;
