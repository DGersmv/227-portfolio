import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TechLogoArchicad from '../components/TechLogoGrasshopper';

export default function ArchicadGrasshopper({ lang = 'ru' }) {
  const FOOD4RHINO_URL = 'https://www.food4rhino.com/en/app/parametric-dimensioning-point-export-gh-archicad';

  const text = {
    ru: 'Интеграция Archicad + Grasshopper',
    en: 'Archicad + Grasshopper integration'
  };

  const description = {
    ru: `Использование Archicad и Grasshopper позволяет нам достигать высокой степени инженерной автоматизации и точности проектирования.

На основе практического опыта были разработаны собственные параметрические системы, в том числе:

— система автоматического распределения досок по шагу перекрытия с мгновенным формированием размеров, раскроя и спецификаций, включая расчёт объёмов ветровлагозащиты, утеплителя и защитных сеток;

— модуль расстановки фасадных плит по заданному рисунку с автоматическим подбором цветов, расчётом креплений и возможностью проектирования поверхностей любой кривизны;

— система проектирования дорожек с автоматической прокладкой по линиям, распределением плитки и бордюров, а также формированием полного конструктивного «пирога».

Дополнительно нами был разработан собственный плагин интеграции Grasshopper и Archicad —
Parametric Dimensioning via Point Export (GH → Archicad), опубликованный на платформе Food4Rhino.

Плагин обеспечивает автоматическую генерацию нативных размерных цепочек в Archicad на основе параметрических данных из Grasshopper.

Основные возможности:

— передача упорядоченных массивов точек из Grasshopper в Archicad;
— автоматическое построение размеров средствами внутреннего API Archicad;
— поддержка трёх режимов параметрического размерения: по линиям, по последовательности точек и по опорным точкам;
— стабильная регенерация размеров при изменении параметров;
— лёгкий JSON-протокол обмена данными;
— поддержка версий Archicad 27–29.

Grasshopper отвечает за геометрию и расчёты,
Archicad — за выпуск корректной проектной документации.

Все решения формируются за минимальное время, позволяя проектировщику сразу получать точные расчёты, спецификации и рабочие схемы для строительства и производства.

Данный подход объединяет параметрическое моделирование, BIM-документацию и инженерную оптимизацию в единый, эффективный рабочий процесс.`,

    en: `Using Archicad and Grasshopper allows us to achieve a high degree of engineering automation and design accuracy.

Based on practical experience, we have developed custom parametric systems, including:

— a system for automatic distribution of boards over floor spans with instant generation of dimensions, cutting layouts and specifications, including calculation of wind and moisture barriers, insulation and protective mesh volumes;

— a facade panel placement module following a given pattern with automatic color selection, fastener calculation and support for surfaces of any curvature;

— a pathway design system with automatic layout along lines, distribution of paving and curbs, and generation of the full structural "pie".

We have also developed our own Grasshopper–Archicad integration plugin —
Parametric Dimensioning via Point Export (GH → Archicad), published on the Food4Rhino platform.

The plugin provides automatic generation of native dimension chains in Archicad from parametric data in Grasshopper.

Key features:

— transfer of ordered point arrays from Grasshopper to Archicad;
— automatic dimension creation via Archicad's internal API;
— support for three parametric dimensioning modes: by lines, by point sequences and by reference points;
— stable dimension regeneration when parameters change;
— lightweight JSON data exchange protocol;
— support for Archicad versions 27–29.

Grasshopper handles geometry and calculations,
Archicad handles correct design documentation output.

All solutions are produced in minimal time, giving the designer precise calculations, specifications and working layouts for construction and production.

This approach unifies parametric modeling, BIM documentation and engineering optimization into a single, efficient workflow.`
  };

  return (
    // ⬇️ Убрали абсолют и фиксированный padding
    <div className="relative w-full min-h-screen text-white px-4 py-8">

      {/* ⬇️ Flex: логотипы сверху на мобиле, слева на md+ */}
      <div className="flex flex-col md:flex-row md:items-start gap-8">

        {/* ⬇️ Логотипы инструментов */}
        <div className="md:w-[120px] w-full flex-shrink-0">
          <TechLogoArchicad lang={lang} />
        </div>

        {/* ⬇️ Контент */}
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

            {description[lang].split('\n').map((line, idx) => {
              if (line.includes('Food4Rhino')) {
                const [before, after] = line.split('Food4Rhino');
                return (
                  <p key={idx} className="mb-4 text-lg text-gray-300 max-w-3xl">
                    {before}
                    <a href={FOOD4RHINO_URL} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                      Food4Rhino
                    </a>
                    {after}
                  </p>
                );
              }
              return (
                <p key={idx} className="mb-4 text-lg text-gray-300 max-w-3xl">
                  {line}
                </p>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
