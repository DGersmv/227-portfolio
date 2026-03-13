import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TechLogoUnreal from "../components/TechLogoUnreal";

export default function Unreal({ lang = 'ru' }) {
  const text = {
    ru: 'Unreal Engine',
    en: 'Unreal Engine'
  };

  const description = {
    ru: `Проект по направлению Unreal Engine находится в разработке.

Задача — построить связку между CAD-чертежами, ландшафтным окружением и полноценной интерактивной визуализацией. Основной фокус — на реалистичном освещении, навигации по сцене в реальном времени и возможности использовать материалы проекта как презентационную среду для заказчиков или в рамках BIM-взаимодействия.`,

    en: `This Unreal Engine direction is currently in development.

The goal is to create a pipeline between CAD drawings, natural environments, and fully interactive real-time visualization. The focus is on realistic lighting, free scene navigation, and using the environment as a presentation space for clients or part of a BIM-integrated workflow.`
  };

  return (
    // ⬇️ Общий адаптивный контейнер
    <div className="relative w-full min-h-screen text-white px-4 py-8">

      <div className="flex flex-col md:flex-row md:items-start gap-8">

        {/* ⬇️ Логотип Unreal Engine */}
        <div className="md:w-[120px] w-full flex-shrink-0">
          <TechLogoUnreal lang={lang} />
        </div>

        {/* ⬇️ Контент с анимацией */}
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            className="flex-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-6">{text[lang]}</h1>
            {description[lang].split('\n').map((line, idx) => (
              <p key={idx} className="mb-4 text-lg text-gray-300 whitespace-pre-line">{line}</p>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
