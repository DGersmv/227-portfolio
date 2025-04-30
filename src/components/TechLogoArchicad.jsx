import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TechLogoArchicad({ lang = 'ru' }) {
  const title = {
    ru: "Инструменты:",
    en: "Tools:"
  };

  return (
    <div className="flex flex-col items-center space-y-2 opacity-80 scale-90">
      {/* Анимированный заголовок при смене языка */}
      <AnimatePresence mode="wait">
        <motion.h2
          key={lang} // обязательно!
          className="text-2xl font-semibold text-gray-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {title[lang]}
        </motion.h2>
      </AnimatePresence>
      

      {/* Логотип Archicad */}
      <motion.img
        src="/assets/logo/archicad.png"
        alt="Archicad Logo"
        className="w-24 h-20 object-contain"
        initial={{ opacity: 0, scale: 0.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0 }}
      />

      {/* Логотип Archiframe */}
      <motion.img
        src="/assets/logo/archiframe.png"
        alt="Archiframe Logo"
        className="w-24 h-24 object-contain"
        initial={{ opacity: 0, scale: 0.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />

      {/* Логотип Python */}
      <motion.img
        src="/assets/logo/python.png"
        alt="Puyhon Logo"
        className="w-24 h-24 object-contain"
        initial={{ opacity: 0, scale: 0.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      />

      {/* Логотип Excel */}
      <motion.img
        src="/assets/logo/excel.png"
        alt="Archiframe Logo"
        className="w-20 h-24 object-contain"
        initial={{ opacity: 0, scale: 0.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      />

      {/* Логотип Enscape */}
      <motion.img
        src="/assets/logo/enscape.webp"
        alt="Archiframe Logo"
        className="w-20 h-24 object-contain"
        initial={{ opacity: 0, scale: 0.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 2 }}
      />
      

    </div>
  );
}