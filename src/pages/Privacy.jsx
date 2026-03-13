import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Privacy({ lang = 'ru' }) {
  const navigate = useNavigate();
  const isEn = lang === 'en';
  const t = {
    ru: {
      title: 'Политика конфиденциальности',
      back: 'Назад',
    },
    en: {
      title: 'Privacy Policy',
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
          {!isEn && <p className="text-gray-400 text-lg mb-2">Политика обработки персональных данных</p>}
          {!isEn && <p className="text-sm text-gray-500 mb-10">Редакция от: 7 марта 2026 г.</p>}
          {isEn && <p className="text-sm text-gray-500 mb-10">Last updated: March 7, 2026</p>}

          {!isEn ? (
            <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300 leading-relaxed">
              <p>
                Настоящая политика обработки персональных данных разработана в соответствии с требованиями законодательства Российской Федерации, включая Федеральный закон №152-ФЗ «О персональных данных».
              </p>

              <h2 className="text-lg font-semibold text-white">1. Общие положения</h2>
              <p>Оператором персональных данных является:</p>
              <p><strong>ООО «227.ИНФО»</strong></p>
              <p>Email: <a href="mailto:admin@227.info" className="text-purple-400 hover:underline">admin@227.info</a></p>
              <p>
                Настоящая политика определяет порядок обработки и защиты персональных данных пользователей сайта:{' '}
                <a href="https://227.info" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">https://227.info</a>
              </p>

              <h2 className="text-lg font-semibold text-white">2. Какие данные мы собираем</h2>
              <p>При использовании сайта могут обрабатываться следующие данные:</p>
              <p><strong>Персональные данные</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>адрес электронной почты</li>
              </ul>
              <p><strong>Технические данные</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>IP-адрес</li>
                <li>информация о браузере</li>
                <li>cookies</li>
                <li>дата и время доступа</li>
              </ul>

              <h2 className="text-lg font-semibold text-white">3. Цели обработки данных</h2>
              <p>Персональные данные используются для:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>авторизации пользователя через email</li>
                <li>отправки одноразового кода входа</li>
                <li>проверки оплаты</li>
                <li>отправки приобретённых цифровых продуктов</li>
                <li>предоставления доступа к сервису</li>
                <li>технической поддержки пользователей</li>
              </ul>

              <h2 className="text-lg font-semibold text-white">4. Авторизация пользователя</h2>
              <p>Для входа в систему используется email-подтверждение с одноразовым кодом.</p>
              <p>Пользователь вводит адрес электронной почты и получает код подтверждения, который используется для входа в систему.</p>
              <p>Этот механизм используется для подтверждения владения email и обеспечения безопасности аккаунта.</p>

              <h2 className="text-lg font-semibold text-white">5. Передача данных третьим лицам</h2>
              <p>Персональные данные могут передаваться следующим сервисам:</p>
              <p><strong>Платёжная система Robokassa</strong> — для обработки платежей.</p>
              <p><strong>Облачная инфраструктура Supabase</strong> — для хранения данных и авторизации пользователей.</p>
              <p>Передача осуществляется только в объёме, необходимом для работы сервиса.</p>

              <h2 className="text-lg font-semibold text-white">6. Отправка цифровых продуктов</h2>
              <p>После подтверждения оплаты пользователю отправляется электронное письмо, содержащее ссылку для скачивания плагина или файл продукта.</p>
              <p>Email используется исключительно для доставки цифрового продукта и сервисных уведомлений.</p>

              <h2 className="text-lg font-semibold text-white">7. Срок хранения данных</h2>
              <p>Персональные данные хранятся в течение срока, необходимого для:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>предоставления услуг</li>
                <li>выполнения обязательств перед пользователями</li>
                <li>соблюдения требований законодательства</li>
              </ul>

              <h2 className="text-lg font-semibold text-white">8. Права пользователя</h2>
              <p>Пользователь имеет право:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>получать информацию о своих персональных данных</li>
                <li>требовать исправления данных</li>
                <li>требовать удаления данных</li>
                <li>отозвать согласие на обработку</li>
              </ul>
              <p>Запрос можно направить на email: <a href="mailto:admin@227.info" className="text-purple-400 hover:underline">admin@227.info</a></p>

              <h2 className="text-lg font-semibold text-white">9. Защита персональных данных</h2>
              <p>Оператор принимает необходимые организационные и технические меры для защиты персональных данных, включая:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>использование защищённого соединения HTTPS</li>
                <li>ограничение доступа к данным</li>
                <li>использование защищённой инфраструктуры</li>
              </ul>

              <h2 className="text-lg font-semibold text-white">10. Cookies</h2>
              <p>Сайт может использовать cookies для:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>авторизации пользователей</li>
                <li>улучшения работы сайта</li>
                <li>анализа использования сервиса</li>
              </ul>
              <p>Пользователь может отключить cookies в настройках браузера.</p>

              <h2 className="text-lg font-semibold text-white">11. Изменение политики</h2>
              <p>Оператор вправе изменять настоящую политику.</p>
              <p>Актуальная версия всегда доступна по адресу: <a href="https://227.info/privacy" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">https://227.info/privacy</a></p>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300 leading-relaxed">
              <p>
                This Privacy Policy explains how personal data is collected, used and protected when using the website:{' '}
                <a href="https://227.info" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">https://227.info</a>
              </p>

              <h2 className="text-lg font-semibold text-white">1. Data Controller</h2>
              <p>The website is operated by:</p>
              <p><strong>LLC &quot;227.INFO&quot;</strong></p>
              <p><strong>Contact email:</strong><br /><a href="mailto:admin@227.info" className="text-purple-400 hover:underline">admin@227.info</a></p>

              <h2 className="text-lg font-semibold text-white">2. Information We Collect</h2>
              <p>When using the website we may collect:</p>
              <p><strong>Personal Information</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>email address</li>
              </ul>
              <p><strong>Technical Information</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>IP address</li>
                <li>browser information</li>
                <li>cookies</li>
                <li>access time</li>
              </ul>

              <h2 className="text-lg font-semibold text-white">3. Purpose of Data Processing</h2>
              <p>Personal data may be used for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>user authentication</li>
                <li>email verification via one-time code</li>
                <li>payment verification</li>
                <li>delivering purchased digital products</li>
                <li>customer support</li>
              </ul>

              <h2 className="text-lg font-semibold text-white">4. Authentication Method</h2>
              <p>The website uses email verification with a one-time code.</p>
              <p>Users enter their email address and receive a verification code used to access the service.</p>
              <p>This helps confirm ownership of the email and improves security.</p>

              <h2 className="text-lg font-semibold text-white">5. Third-Party Services</h2>
              <p>We may share limited data with third-party service providers:</p>
              <p><strong>Payment provider</strong> — Robokassa: payment processing</p>
              <p><strong>Cloud infrastructure</strong> — Supabase: authentication and data storage</p>
              <p>These providers receive only the information required to perform their services.</p>

              <h2 className="text-lg font-semibold text-white">6. Digital Product Delivery</h2>
              <p>After payment confirmation, users receive an email containing a download link or digital product file.</p>
              <p>Email addresses are used solely for delivering purchased products and service notifications.</p>

              <h2 className="text-lg font-semibold text-white">7. Data Retention</h2>
              <p>Personal data is stored only for as long as necessary to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>provide services</li>
                <li>comply with legal obligations</li>
                <li>maintain system security</li>
              </ul>

              <h2 className="text-lg font-semibold text-white">8. User Rights</h2>
              <p>Users may request:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>access to their personal data</li>
                <li>correction of inaccurate data</li>
                <li>deletion of personal data</li>
              </ul>
              <p>Requests can be sent to: <a href="mailto:admin@227.info" className="text-purple-400 hover:underline">admin@227.info</a></p>

              <h2 className="text-lg font-semibold text-white">9. Data Security</h2>
              <p>We implement security measures including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>encrypted connections (HTTPS)</li>
                <li>access control</li>
                <li>secure infrastructure</li>
              </ul>

              <h2 className="text-lg font-semibold text-white">10. Cookies</h2>
              <p>Cookies may be used for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>authentication</li>
                <li>analytics</li>
                <li>improving user experience</li>
              </ul>
              <p>Users can disable cookies in their browser settings.</p>

              <h2 className="text-lg font-semibold text-white">11. Policy Updates</h2>
              <p>This policy may be updated from time to time.</p>
              <p>The latest version will always be available at: <a href="https://227.info/privacy" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">https://227.info/privacy</a></p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
