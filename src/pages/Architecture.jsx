import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TechLogoArchicad from "../components/TechLogoArchicad";


const categories = {
  ru: [
    {
      key: "bath",
      title: "Бани",
      description: "Проекты современных бань премиум сегмента.",
      preview: "/architecture/images/bath_1.jpg",
      indexJson: "/architecture/images/bath.index.json"
    },
    {
      key: "houses",
      title: "Дома",
      description: "Проекты модульных домов.",
      preview: "/architecture/images/house_1.jpg",
      indexJson: "/architecture/images/houses.index.json"
    },
    {
      key: "other",
      title: "Хозблоки и прочее",
      description: "Гаражи, мастерские, беседки и прочее.",
      preview: "https://via.placeholder.com/600x300?text=Хозблоки",
      indexJson: "/architecture/images/other.index.json"
    }
  ],
  en: [
    {
      key: "bath",
      title: "Bathhouses",
      description: "Premium modern bathhouse designs.",
      preview: "/architecture/images/bath_1.jpg",
      indexJson: "/architecture/images/bath.index.json"
    },
    {
      key: "houses",
      title: "Houses",
      description: "Modular house projects.",
      preview: "/architecture/images/house_1.jpg",
      indexJson: "/architecture/images/houses.index.json"
    },
    {
      key: "other",
      title: "Utility structures",
      description: "Garages, workshops, gazebos, and more.",
      preview: "https://via.placeholder.com/600x300?text=Utility",
      indexJson: "/architecture/images/other.index.json"
    }
  ]
};

export default function Architecture({ lang = 'ru' }) {
  const [modal, setModal] = useState({ open: false, category: null, index: 0 });
  const [images, setImages] = useState([]);

  const openModal = async (category) => {
    try {
      const res = await fetch(category.indexJson);
      const list = await res.json();
      setImages(list);
      setModal({ open: true, category, index: 0 });
    } catch (err) {
      console.error("Ошибка загрузки index.json:", err);
      setImages([]);
      setModal({ open: true, category, index: 0 });
    }
  };

  const closeModal = () => {
    setModal({ open: false, category: null, index: 0 });
    setImages([]);
  };

  const nextImage = () => {
    setModal((prev) => ({
      ...prev,
      index: (prev.index + 1) % images.length
    }));
  };

  const prevImage = () => {
    setModal((prev) => ({
      ...prev,
      index: (prev.index - 1 + images.length) % images.length
    }));
  };

  const text = {
    ru: "Архив архитектурных проектов",
    en: "Architectural Project Archive"
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-8">{text[lang]}</h1>

      <div className="absolute top-[250px] left-6 w-[160px] h-[160px] opacity-80">
      <TechLogoArchicad lang={lang} />
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories[lang].map((cat, i) => (
          <motion.div
            key={cat.key}
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => openModal(cat)}
          >
            <img
              src={cat.preview}
              alt={cat.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x300?text=Нет+изображения";
              }}
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{cat.title}</h3>
              <p className="text-gray-400 text-sm">{cat.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modal.open && modal.category && images.length > 0 && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-white text-3xl"
            >
              ✕
            </button>

            <div className="max-w-5xl w-full text-center">
              <motion.img
                key={modal.index}
                src={`/architecture/images/${images[modal.index]}`}
                alt=""
                className="rounded-lg max-h-[80vh] mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              />
              <p className="text-sm text-gray-400 mt-4">
                {modal.index + 1} / {images.length}
              </p>
              <div className="mt-4 flex justify-center gap-6">
                <button onClick={prevImage} className="text-2xl hover:text-blue-400">⏮</button>
                <button onClick={nextImage} className="text-2xl hover:text-blue-400">⏭</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
