import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProfileIntro from './ProfileIntro';
import LogoWall from './LogoWall';

const PERSONAL_URL = 'https://personal.227.info';

const authBlockTranslations = {
  ru: {
    catalog: 'Расширения'
  },
  en: {
    catalog: 'Extensions'
  }
};

export default function About({ title, text1, text2, name, role, lang, menuExpanded = false }) {
  const controls = useAnimation();
  const textControls = useAnimation();
  const logoControls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (inView || isMobile) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  useEffect(() => {
    if (menuExpanded) {
      textControls.start({ opacity: 0, y: -20, transition: { duration: 0.4, ease: 'easeInOut' } });
      logoControls.start({ opacity: 0, scale: 0.9, transition: { duration: 0.4, ease: 'easeInOut' } });
    } else {
      textControls.start({ opacity: 1, y: 0, x: 0, transition: { duration: 0.4, ease: 'easeInOut' } });
      logoControls.start({ opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeInOut' } });
    }
  }, [menuExpanded, textControls, logoControls]);

  const authT = authBlockTranslations[lang] || authBlockTranslations.ru;

  return (
    <motion.section
      ref={ref}
      className="relative flex flex-col lg:flex-row lg:justify-between gap-8 lg:gap-16 w-full min-h-[60vh]"
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="lg:w-1/2 mt-24 md:mt-32"
        animate={textControls}
      >
        <ProfileIntro name={name} role={role} />
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-300 leading-relaxed">{text1}</p>
        <div className="mt-4">
          {text2.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="text-gray-300 leading-relaxed mb-4">{paragraph}</p>
          ))}
        </div>
        <div className="mt-8">
          <Link
            to="/plugins"
            className="inline-flex items-center px-6 py-4 rounded-xl bg-gray-700/80 hover:bg-gray-600/80 border border-gray-600/50 text-white font-semibold transition-all hover:border-purple-500/50"
          >
            {authT.catalog} →
          </Link>
        </div>
      </motion.div>

      <motion.div
        className="lg:w-1/2"
        animate={logoControls}
      >
        <LogoWall lang={lang} exiting={false} />
      </motion.div>
    </motion.section>
  );
}
