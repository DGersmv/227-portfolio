import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

export default function ProjectGrid({ folder, lang = 'ru' }) {
  const [items, setItems] = useState([]);
  const [text, setText] = useState({ title: '', description: '' });
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const basePath = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/projects`;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemRes, textRes] = await Promise.all([
          fetch(`${basePath}/${folder}/index.json`).then(res => res.json()),
          fetch(`${basePath}/${folder}/text.json`).then(res => res.json())
        ]);
        // Фильтруем элементы и скрываем GDL to Excel для папки archplugin
        let filteredItems = itemRes.filter(item => item && item.file);
        let filteredText = textRes[lang] || textRes['ru'];
        
        if (folder === 'archplugin') {
          // Проверяем название и скрываем если содержит GDL
          const title = filteredText?.title || '';
          if (title.toLowerCase().includes('gdl')) {
            // Если это GDL проект, не показываем ничего
            setItems([]);
            setText({ title: '', description: '' });
            return;
          }
        }
        
        setItems(filteredItems);
        setText(filteredText);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
      }
    };
    loadData();
  }, [folder, lang, basePath]);

  const openGallery = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
    setIsLoading(true);
  };

  const closeGallery = () => setIsOpen(false);
  const prevItem = () => {
    setIsLoading(true);
    setCurrentIndex((currentIndex - 1 + items.length) % items.length);
  };
  const nextItem = () => {
    setIsLoading(true);
    setCurrentIndex((currentIndex + 1) % items.length);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prevItem();
      if (e.key === 'ArrowRight') nextItem();
      if (e.key === 'Escape') closeGallery();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, currentIndex, items.length]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextItem(),
    onSwipedRight: () => prevItem(),
    trackMouse: true
  });

  if (items.length === 0) return null;

  return (
    <>
      <motion.div
        className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl ring-0 hover:ring-4 ring-gray-500 cursor-pointer group max-w-[480px] w-full shadow-[0_12px_24px_rgba(0,0,0,0.3)]"
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => openGallery(0)}
      >
        {items[0].type === 'video' ? (
          <video
            src={`${basePath}/${folder}/${items[0].file}`}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            muted autoPlay loop playsInline
          />
        ) : (
          <img
            src={`${basePath}/${folder}/${items[0].file}`}
            alt=""
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.src = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/placeholder.png`;
            }}
          />
        )}

        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col p-4 overflow-hidden group">
          <h2 className="text-xl font-bold text-white mb-2">{text.title}</h2>
          <div className="relative overflow-hidden">
            <div className="text-sm text-gray-200 space-y-2 md:transition-transform md:duration-[20s] md:group-hover:-translate-y-full md:animate-none animate-[scrollText_20s_linear_infinite]">
              {text.description.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Модальное окно (галерея) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...swipeHandlers}
            className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeGallery}
          >
            <div onClick={(e) => e.stopPropagation()} className="relative flex flex-col items-center">
              <motion.button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl z-10 bg-black bg-opacity-50 rounded-full p-2 hover:scale-125 transition-transform duration-300"
                whileHover={{ scale: 1.3 }}
                onClick={prevItem}
              >
                ⟨
              </motion.button>

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                </div>
              )}

              {items[currentIndex].type === 'video' ? (
                <motion.video
                  key={items[currentIndex].file}
                  src={`${basePath}/${folder}/${items[currentIndex].file}`}
                  className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl shadow-lg"
                  controls autoPlay loop playsInline
                  onLoadedData={() => setIsLoading(false)}
                />
              ) : (
                <motion.img
                  key={items[currentIndex].file}
                  src={`${basePath}/${folder}/${items[currentIndex].file}`}
                  alt=""
                  className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl shadow-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  onLoad={() => setIsLoading(false)}
                  onError={(e) => {
                    e.target.src = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/placeholder.png`;
                  }}
                />
              )}

              <div className="mt-4 text-center text-gray-300 text-sm">
                {items[currentIndex][lang === 'ru' ? 'captionRu' : 'captionEn'] || items[currentIndex].file}
              </div>

              <motion.button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl z-10 bg-black bg-opacity-50 rounded-full p-2 hover:scale-125 transition-transform duration-300"
                whileHover={{ scale: 1.3 }}
                onClick={nextItem}
              >
                ⟩
              </motion.button>

              <motion.button
                className="absolute top-4 right-4 text-white text-4xl z-10 bg-black bg-opacity-50 rounded-full p-2 hover:rotate-90 transition-transform duration-300"
                whileHover={{ rotate: 90 }}
                onClick={closeGallery}
              >
                ✕
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⬇️ Отступ снизу от футера */}
      {!isOpen && (
        <div className="h-32 sm:h-20" />
      )}
    </>
  );
}

export function ProjectCardWrapper({ folder, lang }) {
  return (
    <div className="w-full flex justify-center">
      <ProjectGrid folder={folder} lang={lang} />
    </div>
  );
}