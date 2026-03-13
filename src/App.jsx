import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import FancyBackground from './components/FancyBackground';
import AnimatedBackground from './components/AnimatedBackground';
import AudioAnalyzer from './components/AudioAnalyzer';
import About from './components/About';
import Contact from './components/Contact';
import LanguageSwitcher from './components/LanguageSwitcher';
import Menu from './components/Menu';
import Architecture from './pages/Architecture';
import Landscape from './pages/Landscape';
import ArchicadGrasshopper from './pages/ArchicadGrasshopper';
import ArchicadPlugins from './pages/ArchicadPlugins';
import RevitPlugins from './pages/RevitPlugins';
import RengaPlugins from './pages/RengaPlugins';
import Android from './pages/Android';
import Web from './pages/Web';
import Visualization from './pages/Visualization';
import Unreal from './pages/Unreal';
import CreateClient from './pages/CreateClient';
import CompanyLogin from './pages/company/Login';
import CompanyRegister from './pages/company/Register';
import TelegramApp from './pages/TelegramApp';
import PluginMarketplace from './pages/PluginMarketplace';
import PluginDetail from './pages/PluginDetail';
import PublicOffer from './pages/PublicOffer';
import Refund from './pages/Refund';
import Details from './pages/Details';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
export default function App() {
  const [lang, setLang] = useState('ru');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showContact, setShowContact] = useState(window.innerWidth > 768);

  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [menuExpanded, setMenuExpanded] = useState(false);

  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);

  // Загрузка треков
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}audio/index.json`)
      .then(res => res.json())
      .then(data => {
        
        setTracks(data.map(t => import.meta.env.BASE_URL + t.url.substring(1)));
      })
      .catch(err => {});
  }, []);

  // Изменение размера окна
  useEffect(() => {
    const handleResize = () => setShowContact(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Инициализация AudioContext
  useEffect(() => {
    if (!audioRef.current) return;

    const context = new AudioContext();
    const source = context.createMediaElementSource(audioRef.current);
    const analyser = context.createAnalyser();
    analyser.fftSize = 256; // Увеличиваем fftSize для чувствительности
    source.connect(analyser);
    analyser.connect(context.destination);
    analyserRef.current = analyser;
    audioContextRef.current = context;

    const resumeContext = () => {
      if (context.state === 'suspended') {
        context.resume().catch(() => {});
      }
    };
    document.addEventListener('click', resumeContext, { once: true });

    return () => {
      document.removeEventListener('click', resumeContext);
      source.disconnect();
      analyser.disconnect();
    };
  }, []);

  // Загрузка нового трека
  useEffect(() => {
    if (audioRef.current && tracks.length > 0) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrackIndex, tracks, isPlaying]);

  // Отладка audioLevel
  useEffect(() => {
    
  }, [audioLevel]);

  const togglePlay = () => {
    if (!tracks.length || !audioRef.current || !audioContextRef.current) {
      return;
    }
    const audio = audioRef.current;
    const context = audioContextRef.current;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (context.state === 'suspended') {
        context.resume().then(() => {
          audio.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {});
        }).catch(() => {});
      } else {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
    }
  };

  const nextTrack = () => {
    const next = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(next);
  };

  const prevTrack = () => {
    const prev = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prev);
  };

  const translations = {
ru: {
  name: "227.info",
  role: "Цифровые решения для проектирования, автоматизации и визуализации",
  aboutTitle: "О компании",
  aboutText1: "Мы создаём цифровые инструменты для архитекторов, инженеров и дизайнеров: от автоматизации в Archicad и Revit до визуализаций в Unreal Engine и собственных веб-платформ.",
  aboutText2: "Компания 227.info специализируется на разработке плагинов, скриптов, web-интерфейсов и визуализаций для проектирования, строительства и эксплуатации. Мы объединяем технологии и практику, чтобы ускорить процессы, минимизировать ошибки и открыть новые горизонты в AEC-индустрии.",
  contact: "Контакты",
  telegram: "Телеграм",
  site: "227.info",
  showContacts: "Информация о компании и условия",
  menu: {
    about: "О компании",
    archiveArchitecture: "Архитектурные проекты",
    archiveLandscape: "Ландшафтные проекты",
    archicadGrasshopper: "Archicad + Grasshopper",
    archicadPlugins: "Плагины Archicad",
    revitPlugins: "Плагины Revit",
    androidApp: "Android-приложения",
    webDev: "Веб-разработка",
    rengaPlugins: "Плагины Renga",
    pluginCatalog: "Расширения",
    myPlugins: "Мои плагины",
    visualization: "Визуализация",
    unreal: "Unreal Engine"
  }
}
,
en: {
  name: "227.info",
  role: "Digital solutions for design, automation, and visualization",
  aboutTitle: "About the Company",
  aboutText1: "We create digital tools for architects, engineers, and designers: from automation in Archicad and Revit to visualizations in Unreal Engine and custom web platforms.",
  aboutText2: "227.info specializes in developing plugins, scripts, web interfaces, and visualizations for design, construction, and building operation. We combine technology with real-world practice to accelerate workflows, minimize errors, and open up new frontiers in the AEC industry.",
  contact: "Contact",
  telegram: "Telegram",
  site: "227.info",
  showContacts: "Company information and terms",
  menu: {
    about: "About",
    archiveArchitecture: "Architecture Projects",
    archiveLandscape: "Landscape Projects",
    archicadGrasshopper: "Archicad + Grasshopper",
    archicadPlugins: "Archicad Plugins",
    revitPlugins: "Revit Plugins",
    androidApp: "Android Apps",
    webDev: "Web Development",
    rengaPlugins: "Renga Plugins",
    pluginCatalog: "Extensions",
    myPlugins: "My Plugins",
    visualization: "Visualization",
    unreal: "Unreal Engine"
  }
}

  };

  const t = translations[lang];

  return (
    <div className="relative min-h-screen bg-gray-900 text-white font-sans overflow-x-hidden">
      <FancyBackground audioLevel={audioLevel} />
      {analyserRef.current && <AudioAnalyzer analyserRef={analyserRef} onLevelChange={setAudioLevel} />}
      <AnimatedBackground isHomePage={isHomePage} audioLevel={audioLevel} />

      <div className="fixed bottom-4 right-4 z-[100]">
        <motion.div
          className="relative flex items-center gap-3 p-3 rounded-full bg-gray-800/50 backdrop-blur max-w-fit shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
        >
          <button onClick={prevTrack} className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600">⏮️</button>
          <motion.button onClick={togglePlay} className="p-2 rounded-full bg-blue-600 text-white shadow-lg">
            {isPlaying ? '⏸️' : '▶️'}
          </motion.button>
          <button onClick={nextTrack} className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600">⏭️</button>
          <span className="text-sm text-gray-300">Music</span>
        </motion.div>
      </div>

      <audio ref={audioRef} onEnded={nextTrack}>
        <source src={tracks[currentTrackIndex]} type="audio/mp3" />
      </audio>

      <div className="relative z-10 px-6 py-10">
        <LanguageSwitcher 
          lang={lang} 
          setLang={setLang}
          isHomePage={isHomePage}
          onMenuExpand={setMenuExpanded}
          menuExpanded={menuExpanded}
          translations={t.menu}
        />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/projects/architecture" element={<Architecture lang={lang} />} />
            <Route path="/projects/landscape" element={<Landscape lang={lang} />} />
            <Route path="/projects/archicad-grasshopper" element={<ArchicadGrasshopper lang={lang} />} />
            <Route path="/projects/archicad-plugins" element={<ArchicadPlugins lang={lang} />} />
            <Route path="/projects/revit-plugins" element={<RevitPlugins lang={lang} />} />
            <Route path="/projects/renga-plugins" element={<RengaPlugins lang={lang} />} />
            <Route path="/projects/android" element={<Android lang={lang} />} />
            <Route path="/projects/web" element={<Web lang={lang} />} />
            <Route path="/projects/visualization" element={<Visualization lang={lang} />} />
            <Route path="/projects/unreal" element={<Unreal lang={lang} />} />
            <Route path="/plugins" element={<PluginMarketplace lang={lang} />} />
            <Route path="/plugins/archicad/:slug" element={<PluginDetail lang={lang} />} />
            <Route path="/oferta" element={<PublicOffer lang={lang} />} />
            <Route path="/offer" element={<PublicOffer lang={lang} />} />
            <Route path="/refund" element={<Refund lang={lang} />} />
            <Route path="/details" element={<Details lang={lang} />} />
            <Route path="/terms" element={<Terms lang={lang} />} />
            <Route path="/privacy" element={<Privacy lang={lang} />} />
            <Route index element={<About key={lang} lang={lang} name={t.name} role={t.role} title={t.aboutTitle} text1={t.aboutText1} text2={t.aboutText2} menuExpanded={menuExpanded} />} />
            <Route path="*" element={<div className="text-center text-red-400 text-xl mt-10">⚠ Страница не найдена</div>} />
            <Route path="/create" element={<CreateClient />} />
            <Route path="/login" element={<CompanyLogin />} />
            <Route path="/company/login" element={<CompanyLogin />} />
            <Route path="/company/register" element={<CompanyRegister />} />
            <Route path="/tg-app" element={<TelegramApp lang={lang} />} />

          </Routes>
        </AnimatePresence>

        {!showContact && (
          <div className="fixed bottom-4 left-4 z-[100] md:hidden">
            <button onClick={() => setShowContact(true)} className="px-4 py-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition">
              {t.showContacts}
            </button>
          </div>
        )}

        {showContact && (
          <div className="fixed bottom-4 left-4 z-[100]">
            <Contact lang={lang} isVisible={true} title={t.contact} telegram={t.telegram}/>
          </div>
        )}
      </div>
    </div>
  );
}