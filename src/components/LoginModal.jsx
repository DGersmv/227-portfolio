import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const recaptchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, token }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка входа');

      onSubmit?.(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="relative w-full max-w-md bg-white/10 text-white border border-white/20 rounded-xl shadow-2xl p-8 backdrop-blur-xl"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-xl text-white hover:text-red-400"
          >
            &times;
          </button>

          <h2 className="text-2xl font-semibold mb-6 text-center">Вход в систему</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
              required
            />

            <ReCAPTCHA
              sitekey="6Ld_7UYrAAAAADQ3EkIyrCJu108GltCMte8qqXbM"
              ref={recaptchaRef}
              className="mx-auto"
            />

            <div className="flex justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2 rounded bg-gray-600 hover:bg-gray-500 font-semibold"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 rounded bg-blue-600 hover:bg-blue-700 font-semibold"
              >
                Войти
              </button>
            </div>

            {error && <div className="text-red-400 text-sm mt-2 text-center">{error}</div>}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
