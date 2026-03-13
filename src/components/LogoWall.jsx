import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const modules = import.meta.glob('../assets/logo/*.{png,jpg,jpeg,svg,webp}', { eager: true });
const images = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => {
    const key = path.split('/').pop().split('.')[0];
    return [key, mod.default];
  })
);

const translations = {
  ru: [
    { name: 'Archicad', key: 'archicad', description: 'BIM, автоматизация, плагины' },
    { name: 'Revit', key: 'arevit', description: 'Плагины и автоматизация проектирования' },
    { name: 'Grasshopper', key: 'grasshopper', description: 'Параметрические инструменты' },
    { name: 'Unreal Engine', key: 'unreal', description: 'Визуализация и цифровая среда' },
    { name: 'React', key: 'react', description: 'Web-интерфейсы, личные кабинеты, панели' },
    { name: 'Python', key: 'python', description: 'Автоматизация, API, интеграции' },
    { name: 'C++', key: 'cplus', description: 'Плагины для Archicad SDK' },
    { name: 'C#', key: 'cpo', description: 'Плагины для Revit и Renga' },
    { name: 'Android', key: 'android', description: 'Разработка приложений для Android' },
    { name: 'Rhino 8', key: 'rhino', description: 'NURBS-моделирование, связка с Grasshopper' },
    { name: 'Next.js', key: 'nextjs', description: 'Фуллстек, SSR, веб-приложения' },
    { name: 'Renga', key: 'renga', description: 'BIM, плагины и автоматизация' },
  ],
  en: [
    { name: 'Archicad', key: 'archicad', description: 'BIM, automation, plugin development' },
    { name: 'Revit', key: 'arevit', description: 'Plugin and workflow automation' },
    { name: 'Grasshopper', key: 'grasshopper', description: 'Parametric tools and geometry' },
    { name: 'Unreal Engine', key: 'unreal', description: 'Visualization and digital environments' },
    { name: 'React', key: 'react', description: 'Web interfaces and dashboards' },
    { name: 'Python', key: 'python', description: 'Automation, APIs, integrations' },
    { name: 'C++', key: 'cplus', description: 'Archicad SDK plugin development' },
    { name: 'C#', key: 'cpo', description: 'Plugins for Revit and Renga' },
    { name: 'Android', key: 'android', description: 'Android app development' },
    { name: 'Rhino 8', key: 'rhino', description: 'NURBS modeling, integrated with Grasshopper' },
    { name: 'Next.js', key: 'nextjs', description: 'Full-stack, SSR, web apps' },
    { name: 'Renga', key: 'renga', description: 'BIM, plugins and automation' },
  ]
};

export default function LogoWall({ lang, exiting = false }) {
  const [flipped, setFlipped] = useState({});
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  const logos = translations[lang] || translations['ru'];

  const handleClick = (key) => {
    setFlipped((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      ref={ref}
      className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-center pb-32"
    >
      <AnimatePresence>
        {inView &&
          logos.map((logo, index) => {
            const baseClasses =
              "relative w-full max-w-[140px] h-[160px] rounded-2xl cursor-pointer flex flex-col items-center justify-center overflow-hidden bg-gray-900/80 backdrop-blur-md ring-1 ring-white/10 shadow-[0_6px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out perspective-[1000px]";
            const inner = (
              <div className="relative z-10 px-2 text-center">
                {!flipped[logo.key] ? (
                  <img src={images[logo.key]} alt={logo.name} className="w-16 h-16 object-contain mx-auto" />
                ) : (
                  <div className="text-center p-2">
                    <div className="text-sm font-semibold mb-1">{logo.name}</div>
                    <div className="text-xs text-gray-400">{logo.description}</div>
                    <div className="text-xs text-green-400 mt-1">{logo.level}</div>
                  </div>
                )}
              </div>
            );

            // Исчезновение: по одной вниз за экран (при открытии меню)
            const stagger = 0.12;
            const duration = 0.4;
            const exitAnimate = {
              opacity: 0,
              y: '100vh',
              scale: 0.8,
              transition: { duration, delay: index * stagger, ease: 'easeIn' }
            };
            // Появление: без анимации выпрыгивания снизу — карточки сразу на месте
            const enterAnimate = {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0 }
            };

            if (isMobile) {
              return (
                <motion.div
                  key={logo.key}
                  className={baseClasses}
                  initial={!exiting ? { opacity: 0 } : undefined}
                  animate={
                    exiting
                      ? { opacity: 0, y: '100vh', transition: { duration: 0.35, delay: index * 0.08, ease: 'easeIn' } }
                      : { opacity: 1, y: 0, transition: { duration: 0 } }
                  }
                  onClick={() => !exiting && handleClick(logo.key)}
                >
                  {inner}
                </motion.div>
              );
            }

            return (
              <motion.div
                key={logo.key}
                className={baseClasses}
                style={{ transformStyle: 'preserve-3d' }}
                initial={{ opacity: 0 }}
                animate={
                  exiting
                    ? exitAnimate
                    : enterAnimate
                }
                exit={{ opacity: 0, scale: 0.1 }}
                transition={exiting ? { duration, ease: 'easeOut', delay: index * stagger } : { duration: 0 }}
                whileHover={
                  exiting ? {} : {
                    scale: 1.15,
                    zIndex: 10,
                    translateZ: 10,
                    transition: { type: 'spring', stiffness: 200, damping: 16 },
                  }
                }
                onClick={() => !exiting && handleClick(logo.key)}
              >
                {inner}
              </motion.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
}