import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TechLogo227 from "../components/TechLogo227";

export default function Web({ lang = 'ru' }) {
  const [hoveredSite, setHoveredSite] = useState(null);

  const content = {
    ru: {
      title: "Разработка сайтов",
      description: `Собственно один из них перед Вами — самостоятельный, лаконичный интерфейс с инженерной чёткостью и визуальной лёгкостью.

Технологии:
— современный React с анимацией на Framer Motion, стили — Tailwind;
— музыка подгружается из Google Drive, а индексы и файлы автоматически обновляются по расписанию;
— фон реагирует на голосовые частоты музыки: яркость точек и линий управляется Web Audio API;
— анимация "печати кода" построена на canvas: каждую секунду отрисовывается новый символ фортрановского скрипта, со структурой как в терминале. Скорость зависит от уровня звука — при падении громкости до нуля код затирается и исчезает;
— переключение языков (русский/английский) без перезагрузки страниц;
— карточки проектов открываются мягко, с галереями и видео, которые листаются свайпом;
— логотипы технологий на каждой странице адаптированы под тему.`,
      sitesTitle: "Нами были разработаны сайты:"
    },
    en: {
      title: "Web Development",
      description: `This site is a self-contained, focused interface — precise in logic, smooth in feel.

Technologies:
— built with modern React, animated using Framer Motion and styled via Tailwind;
— music loads from Google Drive, with scheduled index and file updates;
— the background reacts to voice frequency energy: dot and line brightness driven by Web Audio API;
— a canvas-based terminal animation types out a FORTRAN-style script line by line. Typing speed is controlled by voice loudness — if volume drops to zero, the code fades and clears;
— language toggle (RU/EN) works instantly with no reloads;
— project cards open smoothly, with swipeable galleries and video support;
— each section uses a custom tech logo set.`,
      sitesTitle: "We have developed websites:"
    }
  };

  const sites = [
    {
      name: "Tashi Ani",
      url: "https://tashi-ani.ru",
      preview: "/previews/tashi-ani.PNG"
    },
    {
      name: "Pulse of Rain",
      url: "https://pulseofrain.shop",
      preview: "/previews/por.PNG"
    }
  ];

  const { title, description, sitesTitle } = content[lang];

  return (
    <div className="relative w-full min-h-screen text-white px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-start gap-8">

        {/* Логотипы технологий */}
        <div className="md:w-[120px] w-full flex-shrink-0">
          <TechLogo227 lang={lang} />
        </div>

        {/* Контент с текстом и отступом снизу */}
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            className="flex-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-6">{title}</h1>
            {description.split('\n').map((line, idx) => (
              <p key={idx} className="mb-4 text-lg text-gray-300 whitespace-pre-line">
                {line}
              </p>
            ))}

            {/* Разработанные сайты */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">{sitesTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sites.map((site, idx) => (
                  <motion.div
                    key={site.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2, duration: 0.5 }}
                    className="relative"
                    onMouseEnter={() => setHoveredSite(site.name)}
                    onMouseLeave={() => setHoveredSite(null)}
                  >
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-700/50 p-6
                        hover:border-purple-500/50 transition-all duration-300 cursor-pointer
                        hover:shadow-lg hover:shadow-purple-500/20 group"
                    >
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                        {site.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">{site.url.replace('https://', '')}</p>
                      <span className="text-sm text-purple-400 font-medium">Открыть сайт →</span>
                    </a>

                    {/* Всплывающее превью при hover */}
                    <AnimatePresence>
                      {hoveredSite === site.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className="absolute z-[9999] bottom-full left-0 mb-4 w-[600px] max-w-[90vw] max-h-[70vh] 
                            bg-gray-900 rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden
                            pointer-events-none"
                          style={{
                            overflowY: 'auto'
                          }}
                        >
                          <img
                            src={site.preview}
                            alt={`${site.name} preview`}
                            className="w-full h-auto"
                            onError={(e) => {
                              e.target.src = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/placeholder.png`;
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Защита от наезда плеера и контактов */}
            <div className="h-32 sm:h-20" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
