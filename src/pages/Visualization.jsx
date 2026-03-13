import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TechLogoViz from "../components/TechLogoViz";
import ProjectGrid from "../components/ProjectGrid";

export default function Visualization({ lang = 'ru' }) {
  const title = {
    ru: 'Визуализация',
    en: 'Visualization'
  };

  const description = {
    ru: `На этом этапе проекты получают внешнюю «оболочку» — визуальную форму, понятную заказчику. Используемые средства (Enscape, V-Ray) позволяют получить красивую картинку, но оставляют ощущение компромисса: между скоростью и выразительностью, реализмом и управляемостью.

В Enscape получаем быстро, но с ограничениями. В V-Ray — дольше, но больше контроля. Поэтому здесь скорее промежуточный этап, чем финальный результат.

Модели подготавливаются с учётом света, окружения и композиции. Отдельные элементы (мебель, текстуры, растения) заменяются на визуально точные, не нарушая структуру проекта.`,

    en: `This stage gives projects their outer layer — a form clients can see and relate to. Tools like Enscape and V-Ray deliver visual results, but always leave a sense of compromise: speed versus expression, realism versus control.

Enscape is fast but limiting. V-Ray is flexible but slower. That makes this more of an intermediate step than a final outcome.

Models are prepared with light, environment, and composition in mind. Key elements (furniture, textures, vegetation) are swapped for visually accurate ones, while maintaining the underlying project logic.`
  };

  return (
    // ⬇️ заменили абсолютную структуру на адаптивную
    <div className="relative w-full min-h-screen text-white px-4 py-8">

      <div className="flex flex-col md:flex-row md:items-start gap-8">

        {/* ⬇️ логотип слева или сверху */}
        <div className="md:w-[120px] w-full flex-shrink-0">
          <TechLogoViz lang={lang} />
        </div>

        {/* ⬇️ контент */}
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            className="flex-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-8">{title[lang]}</h1>

            {description[lang].split('\n').map((line, idx) => (
              <p key={idx} className="mb-4 text-lg text-gray-300 max-w-3xl">{line}</p>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
              <ProjectGrid folder="viz" lang={lang} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
