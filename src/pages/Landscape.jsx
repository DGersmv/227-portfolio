import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TechLogoLandscape from "../components/TechLogoLandscape";
import ProjectGrid from "../components/ProjectGrid";

export default function Landscape({ lang = 'ru' }) {
  const title = {
    ru: 'Из опыта ландшафтного проектирования',
    en: 'From landscape design experience'
  };

  const description = {
    ru: `Выполненные проекты ландшафтной архитектуры включают как частные участки, так и общественные пространства. Для каждой территории были выполнены точные измерения, моделирование рельефа, подбор покрытий, озеленения и инженерных элементов.

На этапе визуализации использовалась библиотека Enscape: модели деревьев, кустарников и малых архитектурных форм. Однако стандартные GDL-объекты не обеспечивали нужной точности отображения на планах — размеры, значки и геометрия часто не соответствовали визуализации. Поэтому мной была реализована система правки GDL-параметров: визуальный объект теперь соответствует обозначению на чертеже и наоборот.

Тем не менее, ограниченность библиотеки Enscape привела к решению о переходе на Unreal Engine. В данный момент ведётся разработка связки: точные CAD-чертежи → параметрическая генерация окружения → реалистичная визуализация с управлением в реальном времени.`,

    en: `The completed landscape architecture projects include both private sites and public environments. Each territory was surveyed, terrain was modeled, and material layers, greenery, and infrastructure were selected with precision.

For visualization, Enscape's plant and object library was used. However, native GDL objects often failed to match what was shown in renders — in terms of symbol, size, or geometry on technical plans. To solve this, I implemented a GDL parameter editing system: now each visual object corresponds exactly to its plan representation.

Despite that, the limitations of Enscape's library led to a transition toward Unreal Engine. A new system is currently being developed: precise CAD plans → parametric environment generation → realistic real-time visualization in UE.`
  };

  return (
    // ⬇️ Убрали абсолютные координаты и добавили padding
    <div className="relative w-full min-h-screen text-white px-4 py-8">

      {/* ⬇️ ЗАМЕНА: адаптивная flex-раскладка вместо absolute + pl */}
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        
        {/* ⬇️ Логотипы сверху на мобилке и слева на десктопе */}
        <div className="md:w-[120px] w-full flex-shrink-0">
          <TechLogoLandscape lang={lang} />
        </div>

        {/* ⬇️ Контент — без фиксированных отступов */}
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            className="flex-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-6">{title[lang]}</h1>
            {description[lang].split('\n').map((line, idx) => (
              <p key={idx} className="mb-4 text-lg text-gray-300 max-w-3xl">{line}</p>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
              <ProjectGrid folder="landscape" lang={lang} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
