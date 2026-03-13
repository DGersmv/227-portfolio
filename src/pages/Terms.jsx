import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Terms({ lang = 'ru' }) {
  const navigate = useNavigate();
  const t = {
    ru: {
      title: 'Условия использования',
      back: 'Назад',
    },
    en: {
      title: 'Terms of Service',
      back: 'Back',
    }
  }[lang];

  const isEn = lang === 'en';

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
          {isEn && (
            <>
              <p className="text-sm text-gray-500 mb-10">Last updated: 7 March 2026</p>

              <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300 leading-relaxed">
                <h2 className="text-lg font-semibold text-white">1. General</h2>
                <p>These Terms of Service govern the use of the website:</p>
                <p><a href="https://227.info" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">https://227.info</a></p>
                <p>By accessing the website or purchasing any product, you agree to these Terms.</p>
                <p>If you do not agree, you must not use the website or purchase the products.</p>

                <h2 className="text-lg font-semibold text-white">2. Company Information</h2>
                <p>The website is operated by:</p>
                <p><strong>LLC "227.INFO"</strong></p>
                <p>Email: <a href="mailto:admin@227.info" className="text-purple-400 hover:underline">admin@227.info</a></p>
                <p>The company provides digital products including software plugins and related services.</p>

                <h2 className="text-lg font-semibold text-white">3. Digital Products</h2>
                <p>Products sold on this website are digital goods, including:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>software plugins</li>
                  <li>digital files</li>
                  <li>downloadable materials</li>
                  <li>access to digital services</li>
                </ul>
                <p>After purchase, users receive the product via email delivery or download link.</p>

                <h2 className="text-lg font-semibold text-white">4. User Account</h2>
                <p>Authentication on the website is performed using email verification.</p>
                <p>Users enter their email address and receive a one-time verification code.</p>
                <p>This ensures secure access to the purchased products.</p>
                <p>Users are responsible for maintaining control of their email account.</p>

                <h2 className="text-lg font-semibold text-white">5. Payments</h2>
                <p>Payments are processed through a third-party payment provider.</p>
                <p>The website does not store or process payment card details directly.</p>
                <p>Prices are displayed on the website before purchase.</p>
                <p>All purchases are considered final once payment is successfully processed.</p>

                <h2 className="text-lg font-semibold text-white">6. License</h2>
                <p>Upon purchase, the user receives a non-exclusive license to use the digital product.</p>
                <p>The license allows the user to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>download</li>
                  <li>install</li>
                  <li>use the product</li>
                </ul>
                <p>The license does not allow:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>resale</li>
                  <li>redistribution</li>
                  <li>public sharing</li>
                  <li>uploading to file sharing platforms</li>
                </ul>

                <h2 className="text-lg font-semibold text-white">7. Intellectual Property</h2>
                <p>All products, software, code, files, and materials are protected by copyright and intellectual property laws.</p>
                <p>The ownership remains with the company or the original author.</p>

                <h2 className="text-lg font-semibold text-white">8. Limitation of Liability</h2>
                <p>The website and products are provided "as is".</p>
                <p>The company shall not be liable for:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>indirect damages</li>
                  <li>lost profits</li>
                  <li>data loss</li>
                  <li>technical incompatibilities</li>
                </ul>

                <h2 className="text-lg font-semibold text-white">9. Termination</h2>
                <p>The company may suspend access if the user:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>violates these Terms</li>
                  <li>abuses the service</li>
                  <li>distributes the product illegally</li>
                </ul>

                <h2 className="text-lg font-semibold text-white">10. Governing Law</h2>
                <p>These Terms are governed by applicable international commercial principles.</p>
                <p>Any disputes shall be resolved according to applicable law.</p>
              </div>
            </>
          )}
          {!isEn && (
            <p className="text-gray-400 mb-6">
              Подробные условия — см. <Link to="/oferta" className="text-purple-400 hover:underline">Публичную оферту</Link>. English version available in English.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
