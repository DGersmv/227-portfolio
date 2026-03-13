# Структура проекта ready_portfolio

> Общая схема проекта: портфолио 227.info + маркетплейс плагинов с оплатой.

---

## Корневая директория

```
ready_portfolio/
├── public/              # Статика
├── src/                 # Исходный код
├── .env                 # Переменные окружения (не в Git)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── PROJECT_STRUCTURE.md # Этот файл
```

---

## public/

| Путь | Назначение |
|------|------------|
| `projects/` | Проекты по категориям (architecture, revitplugin, archplugin и др.) |
| `projects/*/index.json` | Список элементов (изображения, подписи) |
| `projects/*/text.json` | Тексты и описания (ru/en) |
| `audio/index.json` | Список аудиотреков |
| `architecture/images/` | Изображения архитектурных проектов |

---

## src/

### Точки входа

| Файл | Описание |
|------|----------|
| `main.jsx` | Точка входа React |
| `App.jsx` | Роутинг, глобальное состояние, layout |
| `style.css` | Глобальные стили |

### Страницы (pages/)

| Файл | Маршрут | Описание |
|------|---------|----------|
| `Architecture.jsx` | `/projects/architecture` | Архитектурные проекты |
| `Landscape.jsx` | `/projects/landscape` | Ландшафтные проекты |
| `ArchicadGrasshopper.jsx` | `/projects/archicad-grasshopper` | Archicad + Grasshopper |
| `ArchicadPlugins.jsx` | `/projects/archicad-plugins` | Плагины Archicad |
| `RevitPlugins.jsx` | `/projects/revit-plugins` | Плагины Revit |
| `RengaPlugins.jsx` | `/projects/renga-plugins` | Плагины Renga |
| `Android.jsx` | `/projects/android` | Android-приложения |
| `Web.jsx` | `/projects/web` | Веб-разработка |
| `Visualization.jsx` | `/projects/visualization` | Визуализация |
| `Unreal.jsx` | `/projects/unreal` | Unreal Engine |
| `TelegramApp.jsx` | `/tg-app` | Telegram-приложение |
| `CreateClient.jsx` | `/create` | Создание личного кабинета (заглушка) |
| `ClientOffice.jsx` | — | Личный кабинет заказчика |
| `company/Login.jsx` | `/login`, `/company/login` | Редирект на company.227.info |
| `company/Register.jsx` | `/company/register` | Регистрация компании |

**Планируется добавить:**

| Файл | Маршрут | Описание |
|------|---------|----------|
| `PluginMarketplace.jsx` | `/plugins` | Маркетплейс плагинов |
| `MyPlugins.jsx` | `/my-plugins` | Мои покупки и скачивания |
| `AuthPage.jsx` | `/login`, `/register` | Вход/регистрация (Magic Link) |

### Компоненты (components/)

| Файл | Описание |
|------|----------|
| `Menu.jsx`, `Menu.css` | Боковое меню навигации |
| `LanguageSwitcher.jsx` | Переключатель ru/en |
| `About.jsx` | Блок «О компании» |
| `Contact.jsx` | Контакты |
| `ProjectGrid.jsx` | Сетка проектов с галереей |
| `FancyBackground.jsx` | Декоративный фон |
| `AnimatedBackground.jsx` | Анимированный фон (Three.js) |
| `AudioAnalyzer.js` | Анализатор аудио |
| `Header.jsx` | Шапка |
| `LoginModal.jsx` | Модальное окно входа |
| `CompanyRegisterForm.jsx` | Форма регистрации компании |
| `HeroIntro3D.jsx` | 3D-интро |
| `ProfileIntro.jsx` | Профиль |
| `TechLogo*.jsx` | Логотипы технологий (Revit, Archicad, Renga и др.) |
| `LogoWall.jsx` | Стенка логотипов |
| `LandscapeAutomation.jsx` | Блок автоматизации ландшафта |
| `Projects.jsx` | Список проектов |
| `GoogleDriveAudioList.jsx` | Список аудио из Google Drive |

**Планируется добавить:**

| Файл | Описание |
|------|----------|
| `PluginCard.jsx` | Карточка плагина (цена, кнопка «Купить») |
| `AuthModal.jsx` | Модалка Magic Link (email → ссылка на почту) |
| `ProtectedRoute.jsx` | Обёртка для защищённых страниц |

### API (api/)

| Файл | Описание |
|------|----------|
| `login.js` | Форма входа (ReCAPTCHA, fetch к /api/login) |
| `company/register.js` | Регистрация компании |

**Планируется добавить:**

| Файл | Описание |
|------|----------|
| `plugins.js` | Запросы к Supabase: plugins, purchases |

### Библиотеки и утилиты

**Планируется добавить:**

| Файл | Описание |
|------|----------|
| `lib/supabase.js` | Инициализация Supabase client |

### Типы (types/)

| Файл | Описание |
|------|----------|
| `telegram.d.ts` | Типы для Telegram Web App |

### Ассеты (assets/)

| Путь | Описание |
|------|----------|
| `fonts/*.json` | Шрифты (IBM, Gost, Fira Sans) |
| `react.svg` | Иконка |

---

## Supabase (планируется)

### Edge Functions

| Функция | Описание |
|---------|----------|
| `create-payment` | Создание платежа (Альфа-Банк / международный сервис) |
| `payment-webhook` | Обработка callback от платёжного провайдера |

### Таблицы

| Таблица | Назначение |
|---------|------------|
| `profiles` | Профили пользователей (id, email, full_name) |
| `plugins` | Каталог плагинов (slug, title, platform, price, storage_path) |
| `plugin_purchases` | Покупки (user_id, plugin_id, status, payment_id) |

### Storage

| Bucket | Назначение |
|--------|------------|
| `plugins` | Файлы плагинов (.bundle, .zip) — приватный |

---

## Платёжные провайдеры

| Регион | Провайдер | Хранение ключей |
|--------|-----------|-----------------|
| РФ | Альфа-Банк | Supabase Secrets (Edge Functions) |
| За рубежом | Отдельный сервис (Stripe, PayPal и др.) | Supabase Secrets (Edge Functions) |

---

## Переменные окружения (.env)

```
# Supabase (фронт)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# VK Cloud (S3)
VK_CLOUD_ACCESS_KEY=
VK_CLOUD_SECRET_KEY=
VK_CLOUD_BUCKET=
VK_CLOUD_ENDPOINT=

# Telegram
TELEGRAM_BOT_TOKEN=
VITE_TELEGRAM_BOT_TOKEN=
VITE_TG_APP_URL=
```

**Секреты (только на сервере / Supabase Secrets):**

```
ALFA_CLIENT_ID=
ALFA_CLIENT_SECRET=
ALFA_MERCHANT_ID=
# + ключи международного провайдера
```

---

## Роуты (итого)

| Маршрут | Страница |
|---------|----------|
| `/` | About (главная) |
| `/projects/architecture` | Architecture |
| `/projects/landscape` | Landscape |
| `/projects/archicad-grasshopper` | ArchicadGrasshopper |
| `/projects/archicad-plugins` | ArchicadPlugins |
| `/projects/revit-plugins` | RevitPlugins |
| `/projects/renga-plugins` | RengaPlugins |
| `/projects/android` | Android |
| `/projects/web` | Web |
| `/projects/visualization` | Visualization |
| `/projects/unreal` | Unreal |
| `/plugins` | PluginMarketplace *(новый)* |
| `/my-plugins` | MyPlugins *(новый)* |
| `/login` | Auth / редирект *(изменить)* |
| `/create` | CreateClient |
| `/company/login` | CompanyLogin |
| `/company/register` | CompanyRegister |
| `/tg-app` | TelegramApp |
