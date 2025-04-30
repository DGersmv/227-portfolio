import React from 'react';
import { motion } from 'framer-motion';

export default function Contact({ title, telegram, github }) {
  return (
    <motion.footer
      className="text-base text-gray-400 bg-transparent"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">{title}</h2> {/* Заголовок крупнее */}
          <ul className="space-y-1">
            <li>
              <a href="mailto:admin@227.info" className="hover:text-white transition-colors">admin@227.info</a>
            </li>
            <li>
              <a href="https://t.me/your_telegram_username" target="_blank" className="hover:text-white transition-colors">{telegram}</a>
            </li>
            <li>
              <a href="https://github.com/your_github" target="_blank" className="hover:text-white transition-colors">{github}</a>
            </li>
          </ul>
        </div>

        <div className="text-sm text-gray-500 mt-2">
          © {new Date().getFullYear()} Dmitriy Gerasimov
        </div>
      </div>
    </motion.footer>
  );
}
