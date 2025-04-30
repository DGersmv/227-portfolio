import React from 'react';
import { motion } from 'framer-motion';

export default function LandscapeAutomation({ lang }) {
  const content = {
    ru: {
      title: "Landscape Automation Toolkit",
      subtitle: "Archicad + Grasshopper + Enscape",
      desc: "Комплексное решение для ландшафтного дизайна: от чертежей до визуализаций и расчётов.",
      list: [
        "Иконки вместо 3D-растений на плане — по размеру и типу",
        "Grasshopper-плагин: пироги дорожек по траектории",
        "Автоматический расчёт объёмов + Excel-сводка",
        "Полная визуализация в Enscape с заглушками"
      ],
      tech: "Технологии: Archicad 27, Grasshopper, Python, Enscape"
    },
    en: {
      title: "Landscape Automation Toolkit",
      subtitle: "Archicad + Grasshopper + Enscape",
      desc: "A complete system for landscape design: from 2D plans to full visualization and material takeoff.",
      list: [
        "Symbolic icons instead of 3D plants on drawings (scaled by type)",
        "Path generator plugin in Grasshopper with full structural layers",
        "Automatic material quantity calculation + Excel export",
        "Full Enscape visualization using intelligent placeholders"
      ],
      tech: "Technologies: Archicad 27, Grasshopper, Python, Enscape"
    }
  };

  const t = content[lang];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-800 p-6 rounded-lg shadow hover:scale-105 transition-transform"
    >
      <h2 className="text-xl font-bold mb-1">{t.title}</h2>
      <p className="text-gray-400">{t.subtitle}</p>
      <p className="text-gray-300 mt-2">{t.desc}</p>
      <ul className="list-disc list-inside text-gray-300 space-y-1 my-3">
        {t.list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <p className="text-sm text-blue-400 italic">{t.tech}</p>
    </motion.div>
  );
}
