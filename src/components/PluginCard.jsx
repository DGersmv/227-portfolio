import React from 'react';
import { motion } from 'framer-motion';

const platformLabels = {
  revit: { ru: 'Revit', en: 'Revit' },
  archicad: { ru: 'Archicad', en: 'Archicad' },
  renga: { ru: 'Renga', en: 'Renga' }
};

export default function PluginCard({ plugin, lang = 'ru', onBuy, purchased = false }) {
  const title = lang === 'ru' ? plugin.title_ru : (plugin.title_en || plugin.title_ru);
  const desc = lang === 'ru' ? plugin.description_ru : (plugin.description_en || plugin.description_ru);
  const platform = platformLabels[plugin.platform]?.[lang] || plugin.platform;

  return (
    <motion.div
      className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-medium text-purple-400 uppercase tracking-wide">{platform}</span>
        {purchased && (
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
            {lang === 'ru' ? 'Куплено' : 'Purchased'}
          </span>
        )}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {desc && <p className="text-gray-400 text-sm mb-4 line-clamp-2">{desc}</p>}
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-white">
          {plugin.price === 0
            ? (lang === 'ru' ? 'Бесплатно' : 'Free')
            : `${Number(plugin.price).toLocaleString('ru-RU')} ₽`}
        </span>
        {onBuy && !purchased && (
          <motion.button
            onClick={() => onBuy(plugin)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium text-sm transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {lang === 'ru' ? 'Купить' : 'Buy'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
