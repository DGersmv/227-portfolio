import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TechLogoRenga from '../components/TechLogoRenga';

export default function RengaPlugins({ lang = 'ru' }) {
  const text = {
    ru: 'Плагины для Renga',
    en: 'Renga Plugins'
  };

  const description = {
    ru: `Также нами был создан плагин для Renga с интеграцией в Grasshopper, обеспечивающий двустороннюю передачу параметров между BIM-средой и параметрическим моделированием.

Мы разрабатываем индивидуальные плагины и сервисы для Renga и других платформ под задачи заказчика — от автоматизации документации до сложных BIM-интеграций.`,

    en: `We have also created a plugin for Renga with Grasshopper integration, enabling two-way parameter transfer between the BIM environment and parametric modeling.

We develop custom plugins and services for Renga and other platforms to meet client needs — from documentation automation to complex BIM integrations.`
  };

  return (
    <div className="relative w-full min-h-screen text-white px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        <div className="md:w-[120px] w-full flex-shrink-0">
          <TechLogoRenga lang={lang} />
        </div>

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

            <div className="h-32 sm:h-20" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
