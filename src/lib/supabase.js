import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Поддержка обоих имён: VITE_SUPABASE_ANON_KEY или VITE_SUPABASE_KEY
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY;

// Убираем не-ASCII символы (причина "non ISO-8859-1 code point" в fetch)
if (typeof supabaseAnonKey === 'string') {
  supabaseAnonKey = supabaseAnonKey.replace(/[^\x20-\x7E]/g, '').trim();
}

// Ключ обязателен — при деплое или в Telegram WebView .env может не подгружаться
if (!supabaseAnonKey || !supabaseUrl) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY (или VITE_SUPABASE_KEY) должны быть заданы в .env. ' +
    'При деплое добавьте их в переменные окружения хостинга.'
  );
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
