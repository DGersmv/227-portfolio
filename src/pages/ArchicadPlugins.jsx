import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectGrid from '../components/ProjectGrid';
import TechLogoAplugin from '../components/TechLogoAplugin';

export default function ArchicadPlugins({ lang = 'ru' }) {
  const text = {
    ru: 'Плагины для Archicad',
    en: 'Archicad Plugins'
  };

  const description = {
    ru: `Плагины для Archicad были разработаны как решение самых трудоёмких задач, с которыми сталкиваются архитекторы в реальной практике.

Да, Grasshopper — мощный инструмент, но для постоянного применения он часто оказывается слишком громоздким. Здесь появляются плагины, которые берут на себя рутинные или сложные задачи.

Как зарегистрированный разработчик Archicad, компания уже создала плагины на C++, которые:
— автоматически выбирают окна, считывают их размеры, положение, высоту и координаты в проекте;
— по ID элементов автоматически готовят чертежи на Python с сечениями, размерами и раскроем;
— вытаскивают параметры GDL и формируют раскрой досок по этапам строительства;
— выполняют поиск по площади зон, чтобы из сотни планировок быстро выделить нужную;
— позволяют сразу переходить от найденной планировки к её изменению без провалов и задержек.

Эти инструменты экономят время, сокращают количество ошибок и позволяют обрабатывать даже большие и сложные проекты точно и быстро.`,

    en: `Archicad plugins were developed to solve the most labor-intensive tasks architects face in real-world practice.

Yes, Grasshopper is a powerful tool, but for continuous use, it can often be too cumbersome. This is where plugins come in, handling routine or complex operations.

As a registered Archicad developer, the company has already created C++ plugins that:
— automatically select windows, read their sizes, positions, heights, and coordinates in the project;
— generate Python-based drawings with sections, dimensions, and cutting plans based on element IDs;
— extract GDL parameters and generate board cutting layouts for each construction phase;
— perform area-based searches across over a hundred layouts to quickly highlight the right one;
— allow immediate switching from a found layout to making changes without delays or breakdowns.

These tools save time, reduce errors, and enable even large and complex projects to be processed accurately and efficiently.`
  };

  return (
    <div className="relative w-full min-h-screen text-white px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        {/* Логотип */}
        <div className="md:w-[120px] w-full flex-shrink-0">
          <TechLogoAplugin lang={lang} />
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
            <h1 className="text-3xl font-bold mb-8">{text[lang]}</h1>

            {description[lang].split('\n').map((line, idx) => (
              <p key={idx} className="mb-4 text-lg text-gray-300 max-w-3xl">
                {line}
              </p>
            ))}

            {/* Новый абзац */}
            <p className="mb-6 text-lg text-gray-300 max-w-3xl">
              {lang === "ru"
                ? "Мы уже создали многофункциональный плагин для ландшафтных архитекторов. Он действительно гигантский — любой ландшафтный архитектор просто must have!"
                : "We have already created a multifunctional plugin for landscape architects. It's truly massive — a must-have for any landscape architect!"}
            </p>

            {/* Кнопка перехода на плагин */}
            <motion.a
              href="https://landscape.227.info"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
              }}
              transition={{ 
                duration: 0.5,
                delay: 0.3,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.1,
                y: -5,
                boxShadow: "0 10px 25px rgba(34, 197, 94, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                animate={{
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block"
              >
                Landscape Helper →
              </motion.span>
            </motion.a>

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
