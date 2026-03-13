import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectCardWrapper } from '../components/ProjectGrid';
import TechLogoArchicad from '../components/TechLogoArchicad';

export default function Architecture({ lang = 'ru' }) {
  const text = {
    ru: 'Из опыта проектирования',
    en: 'From design experience'
  };

  const description = {
    ru: 'На основе практического опыта в проектировании мы разрабатываем инструменты, плагины и сервисы для архитекторов. Мы делаем BIM-процессы быстрее, точнее и удобнее.',
    en: 'Drawing on hands-on design experience, we develop tools, plugins and services for architects. We make BIM processes faster, more accurate and easier to use.'
  };

  return (
    <div className="relative w-full min-h-screen text-white px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-start gap-8">

        {/* Логотипы инструментов */}
        <div className="md:w-[120px] w-full flex-shrink-0">
          <TechLogoArchicad lang={lang} />
        </div>

        {/* Контент */}
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            className="flex-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-4">{text[lang]}</h1>
            <p className="mb-8 text-lg text-gray-300 max-w-3xl">
              {description[lang]}
            </p>

            {/* Карточки проекта — теперь через обёртку */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <ProjectCardWrapper folder="baths" lang={lang} />
              <ProjectCardWrapper folder="houses" lang={lang} />
              <ProjectCardWrapper folder="other" lang={lang} />
            </div>

            {/* Финальный отступ под плеер и контакты */}
            <div className="h-32 sm:h-20" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
