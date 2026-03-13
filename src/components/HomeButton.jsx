import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomeButton({ lang }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!isHomePage) {
      // Показываем кнопку через небольшую задержку
      const showTimer = setTimeout(() => {
        setShowButton(true);
      }, 500);

      return () => {
        clearTimeout(showTimer);
      };
    } else {
      setShowButton(false);
    }
  }, [isHomePage, location.pathname]);

  if (isHomePage) return null;

  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          initial={{ 
            opacity: 0, 
            y: 100,
            scale: 0.9
          }}
          animate={{ 
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{ 
            opacity: 0, 
            y: 100,
            scale: 0.9
          }}
          transition={{ 
            duration: 0.9,
            type: "spring",
            stiffness: 100,
            damping: 25
          }}
          className="fixed top-20 right-6 z-50"
        >
          <Link
            to="/"
            className="px-4 py-2 rounded-lg bg-gray-800/90 backdrop-blur-md border border-gray-700/50 
              text-white hover:bg-gray-700/80 transition-all duration-300 flex items-center gap-2
              shadow-lg hover:shadow-purple-500/20 text-sm font-medium"
          >
            <span>{lang === 'ru' ? 'Главная' : 'Home'}</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

