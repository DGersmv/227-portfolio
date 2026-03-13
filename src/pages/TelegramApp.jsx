import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function TelegramApp({ lang = 'ru' }) {
  const [webApp, setWebApp] = useState(null);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const text = {
    ru: {
      title: "Telegram Mini App",
      description: "Добро пожаловать в Telegram Mini App от 227.info",
      welcome: "Привет",
      userInfo: "Информация о пользователе",
      userId: "ID пользователя",
      firstName: "Имя",
      lastName: "Фамилия",
      username: "Username",
      notInTelegram: "Приложение запущено вне Telegram",
      expand: "Развернуть",
      close: "Закрыть",
      sendData: "Отправить данные",
      mainButton: "Главная кнопка"
    },
    en: {
      title: "Telegram Mini App",
      description: "Welcome to 227.info Telegram Mini App",
      welcome: "Hello",
      userInfo: "User Information",
      userId: "User ID",
      firstName: "First Name",
      lastName: "Last Name",
      username: "Username",
      notInTelegram: "App is running outside Telegram",
      expand: "Expand",
      close: "Close",
      sendData: "Send Data",
      mainButton: "Main Button"
    }
  };

  const t = text[lang] || text.ru;

  const handleMainButton = useCallback(() => {
    if (webApp) {
      webApp.sendData(JSON.stringify({ action: 'button_clicked', timestamp: Date.now() }));
    }
  }, [webApp]);

  const handleClose = useCallback(() => {
    if (webApp) {
      webApp.close();
    }
  }, [webApp]);

  useEffect(() => {
    // Проверяем, запущено ли приложение в Telegram
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      setWebApp(tg);
      setUser(tg.initDataUnsafe?.user || null);
      setIsReady(true);

      // Настраиваем тему
      tg.setHeaderColor('#0f172a');
      tg.setBackgroundColor('#0f172a');
    } else {
      // Для разработки вне Telegram
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (webApp && user) {
      // Настраиваем главную кнопку
      webApp.MainButton.setText(t.mainButton);
      webApp.MainButton.onClick(handleMainButton);
      webApp.MainButton.show();

      return () => {
        webApp.MainButton.offClick(handleMainButton);
        webApp.MainButton.hide();
      };
    }
  }, [webApp, user, t.mainButton, handleMainButton]);

  return (
    <div className="relative w-full min-h-screen text-white px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
        <p className="text-lg text-gray-300 mb-8">{t.description}</p>

        {isReady && (
          <div className="space-y-6">
            {user ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700"
              >
                <h2 className="text-xl font-semibold mb-4">{t.userInfo}</h2>
                <div className="space-y-2 text-gray-300">
                  <p><span className="font-medium">{t.userId}:</span> {user.id}</p>
                  {user.first_name && (
                    <p><span className="font-medium">{t.firstName}:</span> {user.first_name}</p>
                  )}
                  {user.last_name && (
                    <p><span className="font-medium">{t.lastName}:</span> {user.last_name}</p>
                  )}
                  {user.username && (
                    <p><span className="font-medium">{t.username}:</span> @{user.username}</p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700"
              >
                <p className="text-gray-300">{t.notInTelegram}</p>
              </motion.div>
            )}

            {webApp && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700"
              >
                <h2 className="text-xl font-semibold mb-4">Действия</h2>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    {t.close}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Дополнительная информация о WebApp */}
            {webApp && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700"
              >
                <h2 className="text-xl font-semibold mb-4">Информация о приложении</h2>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p><span className="font-medium">Версия:</span> {webApp.version}</p>
                  <p><span className="font-medium">Платформа:</span> {webApp.platform}</p>
                  <p><span className="font-medium">Цветовая схема:</span> {webApp.colorScheme}</p>
                  <p><span className="font-medium">Язык:</span> {webApp.initDataUnsafe?.user?.language_code || 'не определен'}</p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

