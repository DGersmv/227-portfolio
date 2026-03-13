# Настройка Telegram Mini App

## Переменные окружения

Создайте файл `.env` в корне проекта со следующими переменными:

```env
# Telegram Bot Token (для серверных операций, если потребуется)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# URL Telegram Mini App
NEXT_PUBLIC_TG_APP_URL=https://227.info/tg-app
VITE_TG_APP_URL=https://227.info/tg-app
```

**Важно:** В Vite переменные окружения должны начинаться с префикса `VITE_` для доступа на клиенте.

## Настройка бота в Telegram

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите токен бота
3. Настройте Mini App:
   ```
   /newapp
   ```
   Выберите вашего бота и укажите URL: `https://227.info/tg-app`

## Использование

Страница доступна по адресу: `/tg-app` или `/#/tg-app` (в зависимости от роутинга)

## Функциональность

- Автоматическое определение запуска в Telegram
- Отображение информации о пользователе
- Интеграция с Telegram Web App SDK
- Главная кнопка для взаимодействия
- Настройка темы приложения

## Разработка

Для тестирования вне Telegram приложение будет работать, но некоторые функции (например, данные пользователя) будут недоступны.


