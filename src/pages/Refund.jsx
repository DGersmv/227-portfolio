import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Refund({ lang = 'ru' }) {
  const navigate = useNavigate();
  const isEn = lang === 'en';
  const t = {
    ru: {
      title: 'Возврат денежных средств',
      back: 'Назад',
    },
    en: {
      title: 'Refund Policy',
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
                  This Refund Policy describes the conditions under which refunds may be granted for purchases made on the website:
                </p>
                <p><a href="https://227.info" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">https://227.info</a></p>

                <h2 className="text-lg font-semibold text-white">1. Digital Products</h2>
                <p>All products sold on this website are digital goods, including software plugins and downloadable files.</p>
                <p>After payment confirmation, the product is delivered electronically via email or download link.</p>

                <h2 className="text-lg font-semibold text-white">2. Refund Eligibility</h2>
                <p>Refund requests may be considered in the following cases:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>duplicate payment</li>
                  <li>accidental payment error</li>
                  <li>product not delivered after payment</li>
                  <li>technical issue preventing use of the product</li>
                </ul>
                <p>Requests must be submitted to: <a href="mailto:admin@227.info" className="text-purple-400 hover:underline">admin@227.info</a></p>

                <h2 className="text-lg font-semibold text-white">3. Non-Refundable Situations</h2>
                <p>Due to the nature of digital products, once the product has been delivered, downloaded, or accessed, purchases are generally non-refundable.</p>
                <p>Exceptions may apply if:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>the product is defective</li>
                  <li>the product significantly differs from its description</li>
                  <li>access to the product was not provided</li>
                </ul>

                <h2 className="text-lg font-semibold text-white">4. Refund Request Procedure</h2>
                <p>To request a refund, the user must provide:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>the email used for the purchase</li>
                  <li>payment confirmation</li>
                  <li>a description of the issue</li>
                </ul>
                <p>Refund requests are reviewed individually.</p>

                <h2 className="text-lg font-semibold text-white">5. Refund Processing</h2>
                <p>If the refund request is approved, the refund will be issued to the original payment method used for the purchase.</p>
                <p>Processing time depends on the payment provider and the customer's bank.</p>

                <h2 className="text-lg font-semibold text-white">6. Contact</h2>
                <p>For refund requests or questions please contact: <a href="mailto:admin@227.info" className="text-purple-400 hover:underline">admin@227.info</a></p>
              </div>
            </>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300 leading-relaxed mt-6">
              <p>
                Покупатель вправе обратиться за возвратом денежных средств по адресу:{' '}
                <a href="mailto:admin@227.info" className="text-purple-400 hover:underline">admin@227.info</a>
              </p>

              <p><strong>Для обращения необходимо указать:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>ФИО / наименование покупателя;</li>
                <li>дату оплаты;</li>
                <li>сумму платежа;</li>
                <li>email, использованный при оформлении заказа;</li>
                <li>причину возврата;</li>
                <li>подтверждение оплаты.</li>
              </ul>

              <p><strong>Возврат возможен, в частности, при:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>ошибочном платеже;</li>
                <li>повторной оплате;</li>
                <li>непредоставлении оплаченной услуги или доступа по вине продавца;</li>
                <li>существенном несоответствии продукта или услуги описанию на сайте.</li>
              </ul>

              <p>
                Если покупателю уже был предоставлен цифровой доступ, лицензионный ключ, файл, ссылка на скачивание или иной результат исполнения, возврат, как правило, не производится, кроме случаев, предусмотренных законом или когда продукт неработоспособен / не был предоставлен надлежащим образом.
              </p>

              <p>
                Обращения рассматриваются в порядке очереди. При наличии оснований возврат производится тем же способом, которым была осуществлена оплата, если иное не предусмотрено правилами банка или платёжной системы. Robokassa указывает, что сам возврат в системе инициируется быстро, но фактический срок зачисления денег зависит от банка покупателя.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
