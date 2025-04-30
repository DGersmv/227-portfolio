import React, { useState, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
    const audioModules = import.meta.glob('./assets/audio/*.mp3', { eager: true });
    const tracks = Object.values(audioModules).map(mod => mod.default);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

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

    const togglePlay = () => {
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        const next = (currentTrackIndex + 1) % tracks.length;
        setCurrentTrackIndex(next);
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.load();
                if (isPlaying) audioRef.current.play();
            }
        }, 50);
    };

    const prevTrack = () => {
        const prev = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        setCurrentTrackIndex(prev);
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.load();
                if (isPlaying) audioRef.current.play();
            }
        }, 50);
    };

    return (
        <div className="relative min-h-screen bg-gray-900 text-white font-sans">
            

            <div className="fixed bottom-4 right-4 z-[100]">
              <div className="relative w-[300px] h-[80px]">
              <AnimatedBackground audioRef={audioRef} isPlaying={isPlaying} isHomePage={isHomePage} />
                <motion.div
                className="absolute inset-0 z-[10] flex items-center gap-3 p-3 rounded-full bg-transparent max-w-fit"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.3 }}
               >
                <motion.button onClick={prevTrack} className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600"
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Previous track">⏮️</motion.button>
               <motion.button onClick={togglePlay}
                   className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg"
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                   animate={isPlaying ? { scale: [1, 1.15, 1], rotate: [0, 360] } : {}}
                    transition={isPlaying ? { repeat: Infinity, duration: 3, ease: 'easeInOut' } : {}}
                    aria-label={isPlaying ? "Pause music" : "Play music"}>
                    {isPlaying ? '⏸️' : '▶️'}
               </motion.button>
                <motion.button onClick={nextTrack} className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600"
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Next track">⏭️</motion.button>
                    <span className="text-sm text-gray-300">Музыка</span>
               </motion.div>
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
                        <Route path="/" element={
                            <About
                                name={t.name}
                                role={t.role}
                                title={t.aboutTitle}
                                text1={t.aboutText1}
                                text2={t.aboutText2}
                            />
                        } />

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
