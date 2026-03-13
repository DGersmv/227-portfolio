import React from 'react';
import { motion } from 'framer-motion';

export default function Login() {
  const handleRedirect = () => {
    window.location.href = 'https://company.227.info/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent text-white">
      <motion.button
        onClick={handleRedirect}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full shadow-lg text-lg font-semibold hover:shadow-xl"
      >
        Переход в систему
      </motion.button>
    </div>
  );
}
