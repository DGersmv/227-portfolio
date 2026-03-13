import React from 'react';
import Menu from './Menu';
import HomeButton from './HomeButton';

export default function LanguageSwitcher({ lang, setLang, isHomePage, onMenuExpand, menuExpanded, translations }) {
  return (
    <>
      <div className="flex justify-end items-center gap-4 mb-6">
        <div className="flex space-x-4">
          <button onClick={() => setLang('ru')} className={lang === 'ru' ? 'text-blue-400 font-bold' : 'text-gray-400'}>🇷🇺 RU</button>
          <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-blue-400 font-bold' : 'text-gray-400'}>🇬🇧 EN</button>
        </div>
        <Menu 
          lang={lang} 
          translations={translations} 
          isHomePage={isHomePage}
          onMenuExpand={onMenuExpand}
          menuExpanded={menuExpanded}
        />
      </div>
      <HomeButton lang={lang} />
    </>
  );
}