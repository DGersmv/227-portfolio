import React from 'react';
import { motion } from 'framer-motion';

const imageVariants = {
  initialLeft: { opacity: 0, x: -200, rotateY: -60 },
  animateLeft: { opacity: 1, x: 0, rotateY: 0, transition: { duration: 1, delay: 0.2, ease: [0.25, 1, 0.5, 1] } },

  initialCenter: { opacity: 0, y: 100, scale: 0.9 },
  animateCenter: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, delay: 0.4, ease: [0.25, 1, 0.5, 1] } },

  initialRight: { opacity: 0, x: 200, rotateY: 60 },
  animateRight: { opacity: 1, x: 0, rotateY: 0, transition: { duration: 1, delay: 0.6, ease: [0.25, 1, 0.5, 1] } },
};

export default function HeroIntro3D() {
  return (
    <div
      className="relative w-full h-[700px] overflow-hidden flex items-center justify-center gap-10"
      style={{ perspective: 1200 }}
    >
      <motion.img
        src="/img/ui-left.jpg"
        alt="UI Left"
        initial="initialLeft"
        animate="animateLeft"
        variants={imageVariants}
        className="w-[320px] h-auto"
        style={{ transformStyle: 'preserve-3d' }}
      />

      <motion.img
        src="/img/ui-center.jpg"
        alt="UI Center"
        initial="initialCenter"
        animate="animateCenter"
        variants={imageVariants}
        className="w-[420px] h-auto"
        style={{ transformStyle: 'preserve-3d' }}
      />

      <motion.img
        src="/img/ui-right.jpg"
        alt="UI Right"
        initial="initialRight"
        animate="animateRight"
        variants={imageVariants}
        className="w-[320px] h-auto"
        style={{ transformStyle: 'preserve-3d' }}
      />
    </div>
  );
}
