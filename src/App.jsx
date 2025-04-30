import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import About from './components/About';
import Contact from './components/Contact';
import LanguageSwitcher from './components/LanguageSwitcher';
import Menu from './components/Menu';
import AnimatedBackground from './components/AnimatedBackground';

import Architecture from './pages/Architecture';
import Landscape from './pages/Landscape';
import ArchicadGrasshopper from './pages/ArchicadGrasshopper';
import ArchicadPlugins from './pages/ArchicadPlugins';
import RevitPlugins from './pages/RevitPlugins';
import Android from './pages/Android';
import Web from './pages/Web';
import Dashboard from './pages/Dashboard';
import Visualization from './pages/Visualization';
import Unreal from './pages/Unreal';
import ProfileIntro from './components/ProfileIntro';

export default function App() {
  const [lang, setLang] = useState('ru');
  const [isPlaying, setIsPlaying] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const audioRef = useRef(null);
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const loadAndPlay = () => {
  const audio = audioRef.current;
  if (!audio) return;

  audio.load();

  const onReady = () => {
    if (isPlaying) {
      audio.play().catch(console.warn);
    }
    audio.removeEventListener('canplaythrough', onReady);
  };

  audio.addEventListener('canplaythrough', onReady);
};


  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}audio/index.json`)
      .then(res => res.json())
      .then(data => setTracks(data.map(t => import.meta.env.BASE_URL + t.url.substring(1))))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (audioRef.current && tracks.length > 0) {
      audioRef.current.load();
    }
  }, [currentTrackIndex, tracks]);

  const togglePlay = () => {
    if (!tracks.length || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const play = () => audioRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
      if (audioRef.current.readyState >= 3) {
        play();
      } else {
        audioRef.current.addEventListener('canplaythrough', play, { once: true });
      }
    }
  };

	const nextTrack = () => {
		const next = (currentTrackIndex + 1) % tracks.length;
		setCurrentTrackIndex(next);
		setTimeout(loadAndPlay, 0);
	};

	const prevTrack = () => {
		const prev = (currentTrackIndex - 1 + tracks.length) % tracks.length;
		setCurrentTrackIndex(prev);
		setTimeout(loadAndPlay, 0);
	};

  const translations = {
    ru: {
      name: "Дмитрий Герасимов",
      role: "Специалист по автоматизации проектирования",
      aboutTitle: "Обо мне",
      aboutText1: "Я создаю цифровые решения для архитектуры, проектирования и строительства — от плагинов и параметрических инструментов до визуализаций и web-интерфейсов. Моя цель — точные, масштабируемые и применимые в реальной практике цифровые инструменты.",
      aboutText2: "Вне основной работы я исследую границы восприятия через точные и пространственные практики. Лицензированный частный пилот (PPL, одномоторные самолёты), прошёл лётную практику на вертолёте Robinson R44, сертифицированный дайвер и участник заплывов на открытой воде (2,4 км вокруг Петропавловской крепости и морская миля в Выборге). Погружался в Атлантическом, Красном, Средиземном, Индийском океанах и Финском заливе. Помимо технических дисциплин, уделяю внимание внутренней стороне восприятия. Жил с монахами монастыря Св. Екатерины на Синае, бывал на Афоне, в Иерусалиме, Вифлееме и Индии. Посетил основные храмовые комплексы Египта и Мексики. Эти опыты сформировали внимательное отношение к среде, структурам, символике и невидимым уровням контекста, с которыми мы работаем в архитектуре и инженерии. Цель — не только техническая точность, но и согласованное восприятие среды всеми, кто с ней взаимодействует.",
      contact: "Контакты",
      telegram: "Телеграм",
      github: "Гитхаб",
      menu: {
        about: "Обо мне",
        archiveArchitecture: "Архив архитектурных проектов",
        archiveLandscape: "Архив ландшафтных проектов",
        archicadGrasshopper: "Archicad + Grasshopper",
        archicadPlugins: "Плагины для Archicad",
        revitPlugins: "Плагины для Revit",
        androidApp: "Android-приложение",
        webDev: "Создание сайтов",
        dashboard: "Личный кабинет компании",
        visualization: "Визуализация",
        unreal: "Unreal Engine"
      }
    },
    en: {
      name: "Dmitry Gerasimov",
      role: "Design Automation Specialist",
      aboutTitle: "About Me",
      aboutText1: "I create digital solutions for architecture, design, and construction — from plugins and parametric tools to visualization and web interfaces. My focus is on precise, scalable tools with real-world application.",
      aboutText2: "Outside of my core work, I explore perception through precise and spatial disciplines. I’m a licensed private pilot (PPL, single-engine airplanes) with flight experience on the Robinson R44 helicopter, a certified diver, and an open-water swimmer (2.4 km around the Peter and Paul Fortress, and a nautical mile in Vyborg). I’ve dived in the Atlantic, Red, Mediterranean, and Indian Oceans, as well as in the Gulf of Finland. In parallel, I explore the inner dimension of space and meaning. I’ve lived with monks at Saint Catherine’s Monastery in Sinai, visited Mount Athos, Jerusalem, Bethlehem, and India. I’ve studied temple complexes in Egypt and Mexico. These experiences shaped a careful approach to context, deep structures, and the symbolic layers within space—relevant to both design and engineering. The goal is not only technical precision, but also a coherent perception of the environment by everyone who interacts with it.",
      contact: "Contact",
      telegram: "Telegram",
      github: "GitHub",
      menu: {
        about: "About Me",
        archiveArchitecture: "Architecture Archive",
        archiveLandscape: "Landscape Archive",
        archicadGrasshopper: "Archicad + Grasshopper",
        archicadPlugins: "Archicad Plugins",
        revitPlugins: "Revit Plugins",
        androidApp: "Android App",
        webDev: "Web Development",
        dashboard: "Company Dashboard",
        visualization: "Visualization",
        unreal: "Unreal Engine"
      }
    }
  };

  const t = translations[lang];

  return (
    <div className="relative min-h-screen bg-gray-900 text-white font-sans">
      <AnimatedBackground audioRef={audioRef} isPlaying={isPlaying} isHomePage={isHomePage} />

      <div className="fixed bottom-4 right-4 z-[100]">
        <div className="relative w-[300px] h-[80px]">
          <div className="absolute inset-0 z-[10] flex items-center gap-3 p-3 rounded-full bg-transparent max-w-fit">
            <button onClick={prevTrack} className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600">⏮️</button>
            <button onClick={togglePlay} className="p-2 rounded-full bg-blue-600 text-white shadow-lg">
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button onClick={nextTrack} className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600">⏭️</button>
            <span className="text-sm text-gray-300">Музыка</span>
          </div>
        </div>
      </div>

      <audio ref={audioRef} onEnded={nextTrack}>
        <source src={tracks[currentTrackIndex]} type="audio/mp3" />
      </audio>

      <div className="relative z-10 px-6 py-10">
        <LanguageSwitcher lang={lang} setLang={setLang} />
        <Menu lang={lang} translations={t.menu} />

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route index element={<About name={t.name} role={t.role} title={t.aboutTitle} text1={t.aboutText1} text2={t.aboutText2} />} />
            <Route path="/projects/architecture" element={<Architecture lang={lang} />} />
            <Route path="/projects/landscape" element={<Landscape lang={lang} />} />
            <Route path="/projects/archicad-grasshopper" element={<ArchicadGrasshopper lang={lang} />} />
            <Route path="/projects/archicad-plugins" element={<ArchicadPlugins lang={lang} />} />
            <Route path="/projects/revit-plugins" element={<RevitPlugins lang={lang} />} />
            <Route path="/projects/android" element={<Android lang={lang} />} />
            <Route path="/projects/web" element={<Web lang={lang} />} />
            <Route path="/projects/dashboard" element={<Dashboard lang={lang} />} />
            <Route path="/projects/visualization" element={<Visualization lang={lang} />} />
            <Route path="/projects/unreal" element={<Unreal lang={lang} />} />
            <Route path="*" element={<div className="text-center text-red-400 text-xl mt-10">⚠ Страница не найдена</div>} />
          </Routes>
        </AnimatePresence>

        <div className="fixed bottom-4 left-4 z-[100]">
          <Contact title={t.contact} telegram={t.telegram} github={t.github} />
        </div>
      </div>
    </div>
  );
}
