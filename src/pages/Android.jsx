import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TechLogoAndroid from "../components/TechLogoAndroid";
import ProjectGrid from "../components/ProjectGrid";

export default function Android({ lang = 'ru' }) {
  const text = {
    ru: {
      title: "Android-приложение",
      description: `Приложение разработано для строительных сотрудников и максимально упрощено для использования на объекте.

Авторизация:
— вход по логину и паролю, выданным на сайте;
— сотрудник видит только те объекты, где он назначен исполнителем.

Отправка фото:
— выбирает объект;
— выбирает фото из галереи;
— нажимает "Отправить".

Фото автоматически загружаются:
— в нужный альбом объекта;
— в соответствующую папку по роли: сантехника/, отделка/, электрика/, прочее/.

Заказчик видит фото в своём личном кабинете, привязанные к этапам строительства.`
    },
    en: {
      title: "Android App",
      description: `This app is designed for construction workers and is intentionally simplified for use directly on-site.

Authorization:
— login with credentials provided on the website;
— the worker sees only the objects assigned to them.

Sending photos:
— select a project;
— choose photos from the gallery;
— press "Send".

Photos are uploaded automatically:
— to the correct project album;
— to the correct folder based on role: plumbing/, finishing/, electrical/, general/.

Clients see the photos in their dashboard, attached to the construction stages.`
    }
  };

  const t = text[lang] || text.ru;

  return (
    <div className="relative w-full min-h-screen text-white px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-start gap-8">

        {/* Логотипы технологий */}
        <div className="md:w-[120px] w-full flex-shrink-0">
          <TechLogoAndroid lang={lang} />
        </div>

        {/* Контент и карточки проекта */}
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            className="flex-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-6">{t.title}</h1>

            <p className="text-lg text-gray-300 whitespace-pre-line mb-6">
              {t.description}
            </p>

            <a
              href="https://www.rustore.ru/catalog/app/ru.taonline.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-blue-400 hover:underline text-lg font-medium"
            >
              {lang === 'ru' ? 'Скачать в RuStore' : 'Get it on RuStore'}
            </a>

            {/* Встроенная карточка проекта */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-12">
              <ProjectGrid folder="android" lang={lang} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
