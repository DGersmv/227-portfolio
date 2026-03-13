-- Путь к файлу в Supabase Storage bucket 'plugins' для продукта dwg-mesh
-- Путь должен соответствовать структуре файлов в bucket plugins

ALTER TABLE products ADD COLUMN IF NOT EXISTS storage_path TEXT;

UPDATE products SET storage_path = 'dwg-mesh.zip' WHERE code = 'dwg-mesh';
