import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { fetchUserPurchases, getDownloadUrl } from '../api/plugins';

const translations = {
  ru: {
    title: 'Мои плагины',
    subtitle: 'Скачайте купленные плагины',
    empty: 'У вас пока нет покупок',
    gotoCatalog: 'Перейти в каталог',
    login: 'Войдите, чтобы увидеть свои плагины',
    download: 'Скачать',
    downloading: 'Загрузка...',
    platform: 'Платформа'
  },
  en: {
    title: 'My Plugins',
    subtitle: 'Download your purchased plugins',
    empty: 'You have no purchases yet',
    gotoCatalog: 'Go to catalog',
    login: 'Log in to see your plugins',
    download: 'Download',
    downloading: 'Downloading...',
    platform: 'Platform'
  }
};

const platformLabels = { revit: 'Revit', archicad: 'Archicad', renga: 'Renga' };

export default function MyPlugins({ lang = 'ru' }) {
  const [purchases, setPurchases] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const navigate = useNavigate();

  const t = translations[lang] || translations.ru;

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        fetchUserPurchases(user.id).then(setPurchases);
      }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserPurchases(session.user.id).then(setPurchases);
      } else {
        setPurchases([]);
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  const handleDownload = async (purchase) => {
    const plugin = purchase.plugin;
    if (!plugin?.storage_path) {
      alert(lang === 'ru' ? 'Файл ещё не загружен' : 'File not uploaded yet');
      return;
    }
    setDownloading(purchase.id);
    try {
      const url = await getDownloadUrl(plugin.storage_path);
      if (url) {
        window.open(url, '_blank');
      } else {
        alert(lang === 'ru' ? 'Ошибка получения ссылки' : 'Failed to get download link');
      }
    } finally {
      setDownloading(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen text-white px-4 py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <h1 className="text-2xl font-bold mb-4">{t.title}</h1>
          <p className="text-gray-400 mb-6">{t.login}</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-500 hover:to-blue-500 transition"
          >
            {t.login}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-gray-400 mb-8">{t.subtitle}</p>

        {loading ? (
          <p className="text-gray-400">{lang === 'ru' ? 'Загрузка...' : 'Loading...'}</p>
        ) : purchases.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl p-8 text-center">
            <p className="text-gray-400 mb-6">{t.empty}</p>
            <Link
              to="/plugins"
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-500 hover:to-blue-500 transition"
            >
              {t.gotoCatalog}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((p) => {
              const plugin = p.plugin;
              if (!plugin) return null;
              const title = lang === 'ru' ? plugin.title_ru : (plugin.title_en || plugin.title_ru);
              const hasFile = !!plugin.storage_path;
              return (
                <motion.div
                  key={p.id}
                  className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div>
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {platformLabels[plugin.platform] || plugin.platform}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(p)}
                    disabled={!hasFile || downloading === p.id}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition shrink-0"
                  >
                    {downloading === p.id ? t.downloading : t.download}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
