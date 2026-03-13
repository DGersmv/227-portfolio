import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TechLogoRplugin from '../components/TechLogoRplugin';

export default function RevitPlugins({ lang = 'ru' }) {
  const text = {
    ru: 'Плагины для Revit',
    en: 'Revit Plugins'
  };

  const description = {
    ru: `Мы разработали плагин для автоматической расстановки видов по всем помещениям в Revit, который значительно упрощает работу проектировщиков и автоматизирует рутинные операции.

Функциональность плагина:

— автоматический поиск помещений;
— создание видов для каждого помещения;
— интеллектуальная компоновка листов;
— стандартизированное оформление документации.`,

    en: `We have developed a plugin for automatic placement of views for all rooms in Revit, which significantly simplifies designers' work and automates routine operations.

Plugin functionality:

— automatic room search;
— creation of views for each room;
— intelligent sheet layout;
— standardized documentation formatting.`
  };

  return (
    // ⬇️ Заменили absolute/left на padding + flex-раскладку
    <div className="relative w-full min-h-screen text-white px-4 py-8">

      <div className="flex flex-col md:flex-row md:items-start gap-8">

        {/* ⬇️ Логотипы сверху на мобилке, слева на md+ */}
        <div className="md:w-[120px] w-full flex-shrink-0">
          <TechLogoRplugin lang={lang} />
        </div>

        {/* ⬇️ Контент */}
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            className="flex-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-8">{text[lang]}</h1>

            {description[lang].split('\n').map((line, idx) => (
              <p key={idx} className="mb-4 text-lg text-gray-300 max-w-3xl">
                {line}
              </p>
            ))}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
