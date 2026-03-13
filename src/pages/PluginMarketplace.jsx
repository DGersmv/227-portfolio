import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { fetchProduct } from '../api/plugins';

const translations = {
  ru: {
    title: 'Расширения',
    subtitle: 'Плагины для Archicad, Revit и Renga',
    archicad: 'Archicad',
    empty: 'Плагины скоро появятся',
    myPlugins: 'Мои плагины',
    loginToBuy: 'Войдите, чтобы купить',
    dwgMeshDesc: 'DWG-mesh — это аддон для Graphisoft Archicad 27–29 для Windows, который автоматически создаёт Topo Mesh по отметкам высот, импортированным из DWG.',
    moreAndBuy: 'Подробнее и купить'
  },
  en: {
    title: 'Extensions',
    subtitle: 'Plugins for Archicad, Revit and Renga',
    archicad: 'Archicad',
    empty: 'Plugins coming soon',
    myPlugins: 'My plugins',
    loginToBuy: 'Log in to purchase',
    dwgMeshDesc: 'DWG-mesh is an add-on for Graphisoft Archicad 27–29 for Windows that automatically creates Topo Mesh from elevation points imported from DWG.',
    moreAndBuy: 'More details & buy'
  }
};

export default function PluginMarketplace({ lang = 'ru' }) {
  const [dwgProduct, setDwgProduct] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProduct('dwg-mesh').then(setDwgProduct);
  }, []);

  const t = translations[lang] || translations.ru;

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription?.unsubscribe();
  }, []);


  return (
    <div className="min-h-screen text-white px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-gray-400 mt-1">{t.subtitle}</p>
        </div>

        <Link
          to="/plugins/archicad/DWG-mesh"
          className="block mb-8 group"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all group-hover:shadow-lg group-hover:shadow-purple-500/10"
          >
            <div className="flex flex-col">
              <div>
                <span className="text-xs font-medium text-purple-400 uppercase tracking-wide">{t.archicad}</span>
                <h3 className="text-xl font-semibold text-white mt-1 mb-2">DWG-mesh</h3>
                <p className="text-gray-400 text-sm">{t.dwgMeshDesc}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-white">
                  {dwgProduct ? `${Number(dwgProduct.price_rub).toLocaleString('ru-RU')} ₽` : '—'}
                </span>
                <span className="text-sm text-purple-400 group-hover:text-purple-300 transition-colors">
                  {t.moreAndBuy} →
                </span>
              </div>
            </div>
          </motion.div>
        </Link>

      </motion.div>
    </div>
  );
}
