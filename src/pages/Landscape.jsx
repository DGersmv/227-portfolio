import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TechLogoLandscape from "../components/TechLogoLandscape";

export default function Landscape({ lang = 'ru' }) {
  return (
    <div className="relative w-full min-h-screen text-white">
      
      {/* Логотипы — слева сверху, всегда фиксированы */}
      <div className="absolute top-[0px] left-8 w-[100px]">
        <TechLogoLandscape lang={lang} />
      </div>

      {/* Контент с анимацией появления */}
      <AnimatePresence mode="wait">
        <motion.div
          key={lang} // важно, чтобы анимация перезапускалась при смене языка
          className="max-w-6xl mx-auto pl-[200px] px-4 py-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-6">Архив ландшафтных проектов</h1>
          <p className="text-lg text-gray-300">
            Здесь будет подробное описание и галерея проектов по направлению: архив ландшафтных проектов.
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
