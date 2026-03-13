import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Menu.css';

export default function Menu({ lang, translations, isHomePage = false, onMenuExpand, menuExpanded = false }) {
  const location = useLocation();
  const menuRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  const PERSONAL_URL = 'https://personal.227.info';
  const menuStructure = {
    architecture: {
      label: lang === 'ru' ? 'Архитектура и проектирование' : 'Architecture & Design',
      items: [
        { path: "/projects/architecture", label: translations.archiveArchitecture },
        { path: "/projects/landscape", label: translations.archiveLandscape },
      ]
    },
    development: {
      label: lang === 'ru' ? 'Разработка' : 'Development',
      items: [
        { path: "/projects/archicad-grasshopper", label: translations.archicadGrasshopper },
        { path: "/projects/archicad-plugins", label: translations.archicadPlugins },
        { path: "/projects/revit-plugins", label: translations.revitPlugins },
        { path: "/projects/renga-plugins", label: translations.rengaPlugins },
        { path: "/plugins", label: translations.pluginCatalog },
        { path: "/projects/web", label: translations.webDev },
        { path: "/projects/android", label: translations.androidApp },
      ]
    },
    visualization: {
      label: lang === 'ru' ? 'Визуализация' : 'Visualization',
      items: [
        { path: "/projects/unreal", label: translations.unreal },
        { path: "/projects/visualization", label: translations.visualization },
      ]
    },
    personal: {
      label: lang === 'ru' ? 'Личный кабинет' : 'Personal Account',
      items: [
        { external: true, href: `${PERSONAL_URL}/#/my-plugins`, label: translations.myPlugins },
      ]
    }
  };

  // Закрытие панели при клике вне ее
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // Закрываем панель при клике вне ее
        if (menuExpanded && onMenuExpand) {
          onMenuExpand(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuExpanded, onMenuExpand]);

  // Закрытие при изменении маршрута
  useEffect(() => {
    if (onMenuExpand) {
      onMenuExpand(false);
    }
  }, [location.pathname, onMenuExpand]);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };


  const handleMenuToggle = () => {
    if (onMenuExpand) {
      onMenuExpand(!menuExpanded);
    }
  };

  const handleLinkClick = () => {
    // При клике на любую ссылку из панели - сворачиваем
    if (onMenuExpand) {
      onMenuExpand(false);
    }
  };

  return (
    <>
      {/* Кнопка меню с иконкой гамбургера */}
      <div ref={menuRef}>
        <button
          onClick={handleMenuToggle}
          className="px-4 py-2 rounded-lg bg-gray-800/80 backdrop-blur-md border border-gray-700/50 
            text-white hover:bg-gray-700/80 transition-all duration-300 flex items-center gap-2
            shadow-lg hover:shadow-purple-500/20"
        >
          <span className="text-sm font-medium">{lang === 'ru' ? 'Меню' : 'Menu'}</span>
          <div className="flex flex-col gap-1">
            {isMobile ? (
              <>
                <span className={`block w-5 h-0.5 bg-white transition-transform ${menuExpanded ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block w-5 h-0.5 bg-white transition-opacity ${menuExpanded ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`block w-5 h-0.5 bg-white transition-transform ${menuExpanded ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </>
            ) : (
              <>
                <motion.span
                  animate={menuExpanded ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="block w-5 h-0.5 bg-white"
                />
                <motion.span
                  animate={menuExpanded ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="block w-5 h-0.5 bg-white"
                />
                <motion.span
                  animate={menuExpanded ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="block w-5 h-0.5 bg-white"
                />
              </>
            )}
          </div>
        </button>
      </div>

      {/* Отдельные панели для каждого раздела */}
      <AnimatePresence>
        {menuExpanded && (
          <motion.div
            initial={isMobile ? false : { opacity: 0 }}
            animate={isMobile ? {} : { opacity: 1 }}
            exit={isMobile ? false : { opacity: 0 }}
            transition={isMobile ? {} : { duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => onMenuExpand && onMenuExpand(false)}
          >
            <div className="max-w-7xl mx-auto">
              {/* Кнопка закрытия и Главная */}
              <div className="flex justify-between items-center mb-4">
                <Link
                  to="/"
                  onClick={handleLinkClick}
                  className={`px-6 py-3 rounded-lg backdrop-blur-md border text-base font-medium transition-all duration-300 shadow-lg
                    ${
                      isActive('/')
                        ? 'bg-gradient-to-r from-purple-600/40 to-blue-600/40 text-white border-purple-500/50 shadow-purple-500/30'
                        : 'bg-gray-800/90 border-gray-700/50 text-gray-200 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-blue-600/30 hover:text-white hover:border-purple-500/50 hover:shadow-purple-500/20'
                    }`}
                >
                  {lang === 'ru' ? 'Главная' : 'Home'}
                </Link>
                <button
                  onClick={() => onMenuExpand && onMenuExpand(false)}
                  className="px-4 py-2 rounded-lg bg-gray-800/90 backdrop-blur-md text-gray-300 hover:bg-gray-700 transition text-sm border border-gray-700/50"
                >
                  {lang === 'ru' ? '✕ Закрыть' : '✕ Close'}
                </button>
              </div>

              {/* Сетка с отдельными панелями для каждой категории */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(menuStructure).map(([key, category], categoryIdx) => {
                  // Если это личный кабинет с внешней ссылкой
                  if (category.externalUrl) {
                    return (
                      <motion.a
                        key={key}
                        href={category.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={isMobile ? false : { opacity: 0, scale: 0.9, y: 30 }}
                        animate={isMobile ? {} : { opacity: 1, scale: 1, y: 0 }}
                        exit={isMobile ? false : { opacity: 0, scale: 0.9, y: 30 }}
                        transition={isMobile ? {} : { 
                          delay: categoryIdx * 0.15, 
                          duration: 0.5,
                          type: "spring",
                          stiffness: 100
                        }}
                        whileHover={isMobile ? {} : { scale: 1.05, y: -5 }}
                        className="relative bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-purple-600/20 
                          backdrop-blur-md rounded-xl shadow-2xl border-2 border-purple-500/50 p-6
                          transition-all duration-300 cursor-pointer overflow-hidden
                          hover:border-purple-400/80 hover:shadow-purple-500/40
                          hover:from-purple-600/30 hover:via-blue-600/30 hover:to-purple-600/30"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onMenuExpand) {
                            onMenuExpand(false);
                          }
                        }}
                      >
                        {/* Декоративный градиентный фон */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Содержимое */}
                        <div className="relative z-10">
                          {/* Заголовок */}
                          <div className="mb-4 pb-4 border-b border-purple-500/30">
                            <h4 className="text-xl font-bold text-white flex items-center gap-3">
                              <span>{category.label}</span>
                              {!isMobile && (
                                <motion.span
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ 
                                    duration: 1.5, 
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                  className="text-lg text-purple-300 ml-auto"
                                >
                                  →
                                </motion.span>
                              )}
                              {isMobile && (
                                <span className="text-lg text-purple-300 ml-auto">→</span>
                              )}
                            </h4>
                          </div>
                          
                          {/* Описание */}
                          <div className="text-sm text-gray-300 flex items-center gap-2">
                            <span>{category.externalUrl.replace('https://', '')}</span>
                            <span className="text-purple-400">•</span>
                            <span>{lang === 'ru' ? 'Управление проектами' : 'Project management'}</span>
                          </div>
                        </div>
                      </motion.a>
                    );
                  }

                  // Обычная панель с элементами
                  return (
                    <motion.div
                      key={key}
                      initial={isMobile ? false : { opacity: 0, scale: 0.9, y: 30 }}
                      animate={isMobile ? {} : { opacity: 1, scale: 1, y: 0 }}
                      exit={isMobile ? false : { opacity: 0, scale: 0.9, y: 30 }}
                      transition={isMobile ? {} : { 
                        delay: categoryIdx * 0.15, 
                        duration: 0.5,
                        type: "spring",
                        stiffness: 100
                      }}
                      className="bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 p-6
                        hover:border-purple-500/50 transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Заголовок панели категории */}
                      <div className="mb-6 pb-4 border-b border-gray-700/30">
                        <h4 className="text-xl font-semibold text-white">
                          {category.label}
                        </h4>
                      </div>

                      {/* Карточки разделов в панели */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {category.items.map((item, itemIdx) => {
                          const key = item.external ? item.href : item.path;
                          const linkClass = `block px-4 py-3 rounded-lg backdrop-blur-md 
                            border text-sm font-medium transition-all duration-300 shadow-lg
                            bg-gray-800/80 border-gray-700/50 text-gray-200 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-blue-600/30 hover:text-white hover:border-purple-500/50 hover:shadow-purple-500/20`;
                          return (
                            <motion.div
                              key={key}
                              initial={isMobile ? false : { opacity: 0, x: -20 }}
                              animate={isMobile ? {} : { opacity: 1, x: 0 }}
                              transition={isMobile ? {} : { 
                                delay: categoryIdx * 0.15 + itemIdx * 0.08, 
                                duration: 0.4 
                              }}
                              whileHover={isMobile ? {} : { scale: 1.03, x: 5 }}
                            >
                              {item.external ? (
                                <a
                                  href={item.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={handleLinkClick}
                                  className={linkClass}
                                >
                                  {item.label} ↗
                                </a>
                              ) : (
                                <Link
                                  to={item.path}
                                  onClick={handleLinkClick}
                                  className={`${linkClass} ${
                                    isActive(item.path)
                                      ? 'bg-gradient-to-r from-purple-600/40 to-blue-600/40 text-white border-purple-500/50 shadow-purple-500/30'
                                      : ''
                                  }`}
                                >
                                  {item.label}
                                </Link>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
