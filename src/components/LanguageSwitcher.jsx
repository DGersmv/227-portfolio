import React from 'react';

export default function LanguageSwitcher({ lang, setLang }) {
  return (
    <div className="flex justify-end mb-6 space-x-4">
      <button onClick={() => setLang('ru')} className={lang === 'ru' ? 'text-blue-400 font-bold' : 'text-gray-400'}>🇷🇺 RU</button>
      <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-blue-400 font-bold' : 'text-gray-400'}>🇬🇧 EN</button>
    </div>
  );
}