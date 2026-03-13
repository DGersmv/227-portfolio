import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Импорты картинок из src/assets/logo
import rengaLogo from '../assets/logo/renga.png';
import grasshopperLogo from '../assets/logo/grasshopper.png';
import cpoLogo from '../assets/logo/cpo.png';

export default function TechLogoRenga({ lang = 'ru' }) {
  const [isOpen, setIsOpen] = useState(false);

  const title = {
    ru: "Инструменты:",
    en: "Tools:"
  };

  return (
    <div className="md:block">
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-gray-700 text-white text-sm rounded shadow"
        >
          {isOpen ? 'Скрыть инструменты' : 'Показать инструменты'}
        </button>
      </div>

      <AnimatePresence>
        {(isOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
          <motion.div
            key="tools"
            className="flex flex-col items-center space-y-2 opacity-80 scale-90"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-gray-300">{title[lang]}</h2>

            <motion.img
              src={rengaLogo}
              alt="Renga"
              className="w-24 h-20 object-contain"
              initial={{ opacity: 0, scale: 0.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0 }}
            />

            <motion.img
              src={grasshopperLogo}
              alt="Grasshopper"
              className="w-24 h-20 object-contain"
              initial={{ opacity: 0, scale: 0.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            />

            <motion.img
              src={cpoLogo}
              alt="C#"
              className="w-24 h-24 object-contain"
              initial={{ opacity: 0, scale: 0.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
