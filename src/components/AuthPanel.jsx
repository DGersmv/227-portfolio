import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const translations = {
  ru: {
    title: 'Вход для клиентов',
    subtitle: 'Введите email — мы отправим ссылку для входа',
    emailPlaceholder: 'Email',
    submit: 'Отправить ссылку',
    success: 'Проверьте почту — ссылка для входа отправлена',
    error: 'Ошибка. Попробуйте ещё раз.',
    back: 'Назад',
    loading: 'Отправка...'
  },
  en: {
    title: 'Client Login',
    subtitle: 'Enter your email — we\'ll send you a sign-in link',
    emailPlaceholder: 'Email',
    submit: 'Send link',
    success: 'Check your inbox — sign-in link has been sent',
    error: 'Error. Please try again.',
    back: 'Back',
    loading: 'Sending...'
  }
};

export default function AuthPanel({ lang = 'ru', onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const t = translations[lang] || translations.ru;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setError(lang === 'ru' ? 'Supabase не настроен. Проверьте .env' : 'Supabase not configured. Check .env');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const redirectUrl = window.location.origin + window.location.pathname;
      const { error: err } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: { emailRedirectTo: redirectUrl }
      });

      if (err) throw err;
      setSuccess(true);
    } catch (err) {
      const msg = err.message || '';
      const isEncodingError = msg.includes('ISO-8859-1') || msg.includes('code point');
      const isNetworkError = msg.includes('Failed to fetch') || msg.includes('ERR_NAME_NOT_RESOLVED');
      const is500 = msg.includes('500') || (err?.status === 500);
      let errorText = msg || t.error;
      if (isEncodingError) {
        errorText = lang === 'ru' ? 'Ошибка кодировки. Скопируйте ключ Supabase заново из дашборда.' : 'Encoding error. Re-copy Supabase key from dashboard.';
      } else if (isNetworkError) {
        errorText = lang === 'ru'
          ? 'Не удаётся подключиться. Проверьте VITE_SUPABASE_URL в .env (не должен быть xxxx). Перезапустите dev-сервер.'
          : 'Connection failed. Check VITE_SUPABASE_URL in .env (must not be xxxx). Restart dev server.';
      } else if (is500) {
        errorText = lang === 'ru'
          ? 'Ошибка Supabase при отправке письма. Проверьте SMTP в Authentication → Emails, или временно отключите Custom SMTP.'
          : 'Supabase error sending email. Check SMTP in Authentication → Emails, or temporarily disable Custom SMTP.';
      }
      setError(errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-700/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{t.title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition"
            aria-label={t.back}
          >
            ← {t.back}
          </button>
        </div>

        {success ? (
          <p className="text-green-400 text-center py-6">{t.success}</p>
        ) : (
          <>
            <p className="text-gray-400 mb-6">{t.subtitle}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-600 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t.loading : t.submit}
              </button>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
}
