import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Details({ lang = 'ru' }) {
  const navigate = useNavigate();
  const isEn = lang === 'en';
  const t = {
    ru: {
      title: 'Реквизиты',
      back: 'Назад',
    },
    en: {
      title: 'Company Details',
      back: 'Back',
    }
  }[lang];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-sm"
      onClick={() => navigate(-1)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-800/95 backdrop-blur-md rounded-xl p-6 md:p-10 border border-gray-700/50 shadow-2xl max-h-[85vh] overflow-y-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            ← {t.back}
          </Link>

          <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
            {t.title}
          </h1>

          {isEn ? (
            <>
              <p className="text-sm text-gray-500 mb-10">Last updated: March 7, 2026</p>

              <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300 leading-relaxed">
                <p>
                  This page provides official information about the company operating the website:{' '}
                  <a href="https://227.info" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">https://227.info</a>
                </p>

                <h2 className="text-lg font-semibold text-white">Company Information</h2>
                <p><strong>Company name:</strong><br />LLC &quot;227.INFO&quot;</p>
                <p><strong>Legal form:</strong><br />Limited Liability Company</p>
                <p><strong>Registration number (OGRN):</strong><br />1264700000399</p>
                <p><strong>Tax ID (INN):</strong><br />4704119987</p>
                <p><strong>Registered address:</strong><br />188802, Russia<br />Leningrad Region<br />Vyborg<br />Gagarina Street 41, Apt. 51</p>
                <p><strong>Contact email:</strong><br /><a href="mailto:admin@227.info" className="text-purple-400 hover:underline">admin@227.info</a></p>

                <h2 className="text-lg font-semibold text-white">Business Activity</h2>
                <p>The company operates an online platform that distributes digital products, including software plugins and related digital services.</p>
                <p>Products are delivered electronically via email after payment confirmation.</p>

                <h2 className="text-lg font-semibold text-white">Payment Processing</h2>
                <p>Payments on the website are processed through third-party payment providers.</p>
                <p>The website does not store payment card details.</p>

                <h2 className="text-lg font-semibold text-white">Contact</h2>
                <p>For questions related to the website, products, payments, or legal matters please contact: <a href="mailto:admin@227.info" className="text-purple-400 hover:underline">admin@227.info</a></p>
              </div>
            </>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed mt-6">
              <p className="whitespace-pre-line">
ООО «227.ИНФО»
ОГРН: 1264700000399
ИНН: 4704119987
КПП: 470401001
Юридический адрес: 188802, Россия, Ленинградская область, г. Выборг, ул. Гагарина, д. 41, кв. 51
Телефон: <a href="tel:+793122772777" className="text-purple-400 hover:underline">+7 931 227 72777</a>, <a href="tel:+79112277276" className="text-purple-400 hover:underline">+7 911 227 7276</a>
Email: <a href="mailto:admin@227.info" className="text-purple-400 hover:underline">admin@227.info</a>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
