-- Тестовые плагины для маркетплейса
-- Выполните в Supabase SQL Editor

-- Для скачивания: Storage → plugins → Policies → добавить политику
-- "Allow authenticated read" для SELECT на bucket plugins

INSERT INTO public.plugins (slug, title_ru, title_en, platform, price, description_ru, description_en, is_active)
VALUES
  (
    'revit-rooms-views',
    'Авторасстановка видов по помещениям',
    'Auto room views placement',
    'revit',
    1500,
    'Плагин для автоматической расстановки видов по всем помещениям в Revit. Поиск помещений, создание видов, компоновка листов.',
    'Plugin for automatic placement of views for all rooms in Revit. Room search, view creation, sheet layout.',
    true
  ),
  (
    'archicad-landscape-helper',
    'Landscape Helper для Archicad',
    'Landscape Helper for Archicad',
    'archicad',
    2990,
    'Многофункциональный плагин для ландшафтных архитекторов. Автоматизация рутинных операций.',
    'Multifunctional plugin for landscape architects. Automation of routine operations.',
    true
  ),
  (
    'renga-grasshopper-bridge',
    'Мост Renga — Grasshopper',
    'Renga — Grasshopper Bridge',
    'renga',
    0,
    'Интеграция Renga с Grasshopper. Двусторонняя передача параметров между BIM и параметрическим моделированием.',
    'Renga integration with Grasshopper. Two-way parameter transfer between BIM and parametric modeling.',
    true
  )
ON CONFLICT (slug) DO NOTHING;
