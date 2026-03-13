import { supabase } from '../lib/supabase';

export async function fetchProduct(code) {
  if (!supabase || !code) return null;
  const { data, error } = await supabase
    .from('products')
    .select('code, title_ru, title_en, price_rub, storage_path, is_active')
    .eq('code', code)
    .eq('is_active', true)
    .maybeSingle();
  if (error) {
    console.error('fetchProduct:', error);
    return null;
  }
  return data;
}

export async function fetchPlugins(platform = null) {
  if (!supabase) return [];
  let query = supabase.from('plugins').select('*').eq('is_active', true);
  if (platform) {
    query = query.eq('platform', platform);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) {
    console.error('fetchPlugins:', error);
    return [];
  }
  return data || [];
}

export async function fetchUserPurchases(userId) {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase
    .from('plugin_purchases')
    .select(`
      id,
      status,
      paid_at,
      plugin:plugins(id, slug, title_ru, title_en, platform, storage_path)
    `)
    .eq('user_id', userId)
    .eq('status', 'paid');
  if (error) {
    console.error('fetchUserPurchases:', error);
    return [];
  }
  return data || [];
}

export async function getDownloadUrl(storagePath) {
  if (!supabase || !storagePath) return null;
  const { data, error } = await supabase.storage
    .from('plugins')
    .createSignedUrl(storagePath, 604800);
  if (error) {
    console.error('getDownloadUrl:', error);
    return null;
  }
  return data?.signedUrl || null;
}
