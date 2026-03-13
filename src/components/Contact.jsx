import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact({ lang }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const recaptchaRef = useRef(null);

  const t = {
    ru: {
      button: 'Связаться',
      title: 'Контакты',
      phoneLabel: 'Телефон',
      emailLabel: 'Электронная почта',
      telegramLabel: 'Telegram',
      name: 'Ваше имя',
      email: 'Электронная почта',
      message: 'Сообщение',
      send: 'Отправить',
      success: 'Сообщение отправлено!',
      close: 'Закрыть',
      extensions: 'Расширения',
      offerAndTerms: 'Публичная оферта и Условия использования',
      refund: 'Возврат',
      details: 'Реквизиты',
      privacyPolicy: 'Политика конфиденциальности',
    },
    en: {
      button: 'Contact',
      title: 'Contact Us',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      telegramLabel: 'Telegram',
      name: 'Your name',
      email: 'Email',
      message: 'Message',
      send: 'Send',
      success: 'Message sent!',
      close: 'Close',
      extensions: 'Extensions',
      offerAndTerms: 'Terms of Service',
      refund: 'Refund Policy',
      details: 'Company details',
      privacyPolicy: 'Privacy policy',
    }
  }[lang || 'ru'];

  const footerLinks = [
    { label: t.extensions, to: '/plugins' },
    { label: t.offerAndTerms, to: lang === 'ru' ? '/oferta' : '/terms' },
    { label: t.refund, to: '/refund' },
    { label: t.details, to: '/details' },
    { label: t.privacyPolicy, to: '/privacy' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();

    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=6Ld_7UYrAAAAAOhBREGJ5vOC79RSKaX1KoctXGu2&response=${token}`
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      alert('Проверка reCAPTCHA не пройдена. Попробуйте снова.');
      return;
    }

    const message = `
📨 Новое сообщение с сайта 227.info

👤 Имя: ${form.name}
📧 Email: ${form.email}
📝 Сообщение:
${form.message}
    `;

    try {
      await fetch(`https://api.telegram.org/bot7978281073:AAFcdo3kO4S-JTlnSrzs1T0xFgvW-DcZ7sE/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: 1039304396,
          text: message,
        })
      });
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setOpen(false);
        setForm({ name: '', email: '', message: '' });
      }, 3000);
    } catch (err) {
      console.error('Ошибка при отправке в Telegram:', err);
      alert('Ошибка при отправке. Попробуйте позже.');
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 z-[100] flex flex-col gap-2">
        <button
          onClick={() => setOpen(true)}
          className="w-fit px-5 py-2.5 text-white font-semibold rounded-full
            bg-gradient-to-r from-purple-500 to-blue-500
            shadow-[0_0_12px_rgba(124,58,237,0.5)]
            transition-all duration-300 ease-in-out
            hover:scale-105 hover:shadow-[0_0_20px_rgba(124,58,237,0.8)]
            focus:outline-none"
        >
          {t.button}
        </button>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-gray-400">
          {footerLinks.map((link, i) => (
            <React.Fragment key={link.label}>
              {i > 0 && <span className="text-gray-500"> · </span>}
              {link.to ? (
                <Link to={link.to} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              ) : (
                <a href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </a>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black bg-opacity-60 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.3, y: 200 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.3, y: 200 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="bg-gray-900 p-6 rounded-lg max-w-md w-full relative text-white shadow-2xl"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-2 right-3 text-white text-xl hover:text-red-400"
              >
                ✖
              </button>

              <h2 className="text-xl font-bold mb-4">{t.title}</h2>

              <div className="space-y-1 text-sm text-gray-300 mb-6">
                <div>
                  📞 <span className="font-medium">{t.phoneLabel}:</span>{' '}
                  <a href="tel:+793122772777" className="underline hover:text-white">+7 931 227 72777</a>
                  {' · '}
                  <a href="tel:+79112277276" className="underline hover:text-white">+7 911 227 7276</a>
                </div>
                <div>
                  📧 <span className="font-medium">{t.emailLabel}:</span>{' '}
                  <a href="mailto:info@227.info" className="underline hover:text-white">info@227.info</a>
                </div>
                <div>
                  💬 <span className="font-medium">{t.telegramLabel}:</span>{' '}
                  <a href="https://t.me/info227_bot" className="underline hover:text-white">@info227_bot</a>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder={t.name}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 placeholder-gray-400"
                  required
                />
                <input
                  type="email"
                  placeholder={t.email}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 placeholder-gray-400"
                  required
                />
                <textarea
                  placeholder={t.message}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 placeholder-gray-400"
                  rows={4}
                  required
                />
                <ReCAPTCHA
                  sitekey="6Ld_7UYrAAAAADQ3EkIyrCJu108GltCMte8qqXbM"
                  ref={recaptchaRef}
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold"
                >
                  {t.send}
                </button>
                {sent && <div className="text-green-400 mt-2">{t.success}</div>}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
