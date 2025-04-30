// src/components/About.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ProfileIntro from './ProfileIntro';

export default function About({ title, text1, text2, name, role }) {
  return (
    <motion.section
      className="max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <ProfileIntro name={name} role={role} />
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-300 leading-relaxed">{text1}</p>
      <p className="text-gray-300 leading-relaxed mt-4">{text2}</p>
    </motion.section>
  );
}

