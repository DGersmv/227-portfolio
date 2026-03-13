import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { fetchProduct } from '../api/plugins';

const PRODUCT_CODE = 'dwg-mesh';
const MAX_RESENDS = 5;
const RUB_PER_USD = 80;
const RUB_PER_EUR = 90;
const OTP_COOLDOWN_SECONDS = 60;
const SUPPORT_EMAIL = 'admin@227.info';

const translations = {
  ru: {
    title: 'DWG-mesh',
    subtitle: 'Plugin for Graphisoft Archicad 27–29 (Windows)',
    priceMain: '—',
    priceNote: 'Оплата производится в российских рублях. Эквиваленты USD и EUR указаны ориентировочно.',
    delivery: 'Цифровой продукт. Доставка осуществляется по email после подтверждения оплаты.',
    emailLabel: 'Введите email для получения плагина',
    emailPlaceholder: 'Email',
    getCode: 'Получить код',
    otpLabel: 'Введите код из письма',
    otpPlaceholder: 'Код',
    confirmCode: 'Подтвердить код',
    legalCheckbox: 'Я принимаю условия Публичной оферты и Политики конфиденциальности',
    payButton: 'Оплатить через Robokassa',
    resendButton: 'Отправить плагин повторно',
    limitReached: 'Достигнут лимит повторной отправки. Напишите в поддержку:',
    securityNote: 'Безопасная оплата через Robokassa.',
    resultTitle: 'После оплаты вы получите:',
    result1: 'файл плагина',
    result2: 'инструкцию',
    spamWarning: 'Если письма нет во «Входящих», проверьте папку «Спам».',
    paymentSuccessTitle: 'Спасибо за покупку!',
    paymentSuccessSummary: 'Оплата прошла успешно.',
    paymentSuccessSent: 'Плагин и инструкция отправлены на вашу почту.',
    sellerLabel: 'Продавец',
    sellerName: 'ООО «227.ИНФО»',
    inn: 'ИНН: 4704119987',
    ogrn: 'ОГРН: 1264700000399',
    close: 'Закрыть',
    otpSending: 'Отправка...',
    otpVerifying: 'Проверка...',
    checkingPayment: 'Проверка...',
    resending: 'Отправка...',
    codeSent: 'Код отправлен. Проверьте почту.',
    resendCodeIn: 'Повторить через {n} с',
    requestNewCode: 'Запросить код повторно',
    alreadyPaid: 'Уже оплачено',
    robokassaSoon: 'Редирект на Robokassa скоро будет подключён',
    resendSoon: 'Повторная отправка будет подключена в ближайшее время.',
    resendServiceUnavailable: 'Сервис временно недоступен. Попробуйте позже.',
    resendSuccess: 'Плагин отправлен на вашу почту.',
    resendsLeft: 'Повторных отправок осталось: {n}',
    errorSupabase: 'Supabase не настроен. Проверьте .env',
    errorSendOtp: 'Ошибка отправки кода. Проверьте email.',
    errorVerifyOtp: 'Неверный или истёкший код.',
    errorCheckPayment: 'Ошибка проверки статуса.',
    paymentNotComplete: 'Оплата не завершена. Нажмите кнопку ниже, чтобы оплатить.',
  },
  en: {
    title: 'DWG-mesh',
    subtitle: 'Plugin for Graphisoft Archicad 27–29 (Windows)',
    priceMain: '—',
    priceNote: 'Payment is in Russian rubles. USD and EUR equivalents are approximate.',
    delivery: 'Digital product. Delivered via email after payment confirmation.',
    emailLabel: 'Enter email to receive the plugin',
    emailPlaceholder: 'Email',
    getCode: 'Get code',
    otpLabel: 'Enter code from email',
    otpPlaceholder: 'Code',
    confirmCode: 'Confirm code',
    legalCheckbox: 'I accept the Public Offer and Privacy Policy',
    payButton: 'Pay via Robokassa',
    resendButton: 'Resend plugin',
    limitReached: 'Resend limit reached. Contact support:',
    securityNote: 'Secure payment via Robokassa.',
    resultTitle: 'After payment you will receive:',
    result1: 'plugin file',
    result2: 'installation guide',
    spamWarning: 'If the email is not in Inbox, check your Spam folder.',
    paymentSuccessTitle: 'Thank you for your purchase!',
    paymentSuccessSummary: 'Payment successful.',
    paymentSuccessSent: 'Plugin and instructions sent to your email.',
    sellerLabel: 'Seller',
    sellerName: '227.INFO LLC',
    inn: 'INN: 4704119987',
    ogrn: 'OGRN: 1264700000399',
    close: 'Close',
    otpSending: 'Sending...',
    otpVerifying: 'Verifying...',
    checkingPayment: 'Checking...',
    resending: 'Sending...',
    codeSent: 'Code sent. Check your email.',
    resendCodeIn: 'Retry in {n} s',
    requestNewCode: 'Request new code',
    alreadyPaid: 'Already paid',
    robokassaSoon: 'Robokassa redirect will be connected soon',
    resendSoon: 'Resend will be connected soon.',
    resendServiceUnavailable: 'Service temporarily unavailable. Try again later.',
    resendSuccess: 'Plugin sent to your email.',
    resendsLeft: 'Resends left: {n}',
    errorSupabase: 'Supabase not configured. Check .env',
    errorSendOtp: 'Failed to send code. Check your email.',
    errorVerifyOtp: 'Invalid or expired code.',
    errorCheckPayment: 'Error checking payment status.',
    paymentNotComplete: 'Payment not completed. Click the button below to pay.',
  },
};

function formatPrice(rub) {
  const n = parseInt(String(rub), 10);
  if (isNaN(n)) return '—';
  return n.toLocaleString('ru-RU') + ' ₽';
}

function formatPriceAlt(rub) {
  const n = parseFloat(String(rub));
  if (isNaN(n) || n <= 0) return '—';
  let usd = n / RUB_PER_USD;
  let eur = n / RUB_PER_EUR;
  usd = Math.max(1, usd);
  eur = Math.max(1, eur);
  return `≈ $${usd.toFixed(2)} / €${eur.toFixed(2)}`;
}

export default function PurchasePanel({ lang = 'ru', onClose, initialPaymentSuccess = false }) {
  const [state, setState] = useState('idle');
  const [product, setProduct] = useState(null);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [cooldownSeconds, setCooldownSeconds] = useState(() => {
    const key = 'purchase_otp_cooldown';
    const stored = sessionStorage.getItem(key);
    if (stored) {
      const until = parseInt(stored, 10);
      const left = Math.max(0, Math.ceil((until - Date.now()) / 1000));
      return left;
    }
    return 0;
  });
  const [userEmail, setUserEmail] = useState(null);
  const [legalChecked, setLegalChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [resendSuccessInfo, setResendSuccessInfo] = useState(null);

  const t = translations[lang] || translations.ru;

  useEffect(() => {
    fetchProduct(PRODUCT_CODE).then(setProduct);
  }, []);

  useEffect(() => {
    if (window.Robokassa) return;
    const script = document.createElement('script');
    script.src = 'https://auth.robokassa.ru/Merchant/bundle/robokassa_iframe.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const setError = useCallback((msg) => {
    setState('error');
    setErrorMessage(msg);
  }, []);

  const sendOtp = useCallback(async () => {
    if (!supabase) {
      setError(t.errorSupabase);
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    setState('otp_sending');
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: { emailRedirectTo: window.location.origin + window.location.pathname },
    });

    if (error) {
      setError(t.errorSendOtp);
      return;
    }
    setCooldownSeconds(OTP_COOLDOWN_SECONDS);
    sessionStorage.setItem('purchase_otp_cooldown', String(Date.now() + OTP_COOLDOWN_SECONDS * 1000));
    setState('otp_sent');
  }, [email, t.errorSupabase, t.errorSendOtp, setError]);

  const checkResendLimit = useCallback(async (userMail) => {
    if (!supabase) {
      setError(t.errorSupabase);
      return;
    }
    try {
      const { count, error: countError } = await supabase
        .from('delivery_log')
        .select('*', { count: 'exact', head: true })
        .eq('email', userMail)
        .eq('product_code', PRODUCT_CODE)
        .eq('delivery_type', 'resend')
        .eq('status', 'sent');

      if (countError) {
        console.warn('checkResendLimit error:', countError);
        setState('paid');
        return;
      }
      setState(count >= MAX_RESENDS ? 'limit_reached' : 'paid');
    } catch (err) {
      console.warn('checkResendLimit:', err);
      setState('paid');
    }
  }, [t.errorSupabase, t.errorCheckPayment, setError]);

  const checkPaymentStatus = useCallback(async (userMail) => {
    if (!supabase) {
      setError(t.errorSupabase);
      return;
    }
    setState('checking_payment');
    setErrorMessage(null);

    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 10000)
      );
      const query = supabase
        .from('customer_access')
        .select('is_paid')
        .eq('email', userMail)
        .eq('product_code', PRODUCT_CODE)
        .maybeSingle();

      const { data, error } = await Promise.race([query, timeout]);

      if (error) {
        console.warn('checkPaymentStatus error:', error);
        setError(t.errorCheckPayment);
        return;
      }

      if (!data || data.is_paid !== true) {
        setState('unpaid');
        return;
      }
      checkResendLimit(userMail);
    } catch (err) {
      console.warn('checkPaymentStatus:', err);
      if (err?.message === 'timeout') {
        setState('unpaid');
      } else {
        setError(t.errorCheckPayment);
      }
    }
  }, [t.errorSupabase, t.errorCheckPayment, setError, checkResendLimit]);

  const verifyOtp = useCallback(async () => {
    if (!supabase) {
      setError(t.errorSupabase);
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    const token = otpCode.trim();
    if (!cleanEmail || !token) return;

    setState('otp_verifying');
    setErrorMessage(null);

    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token,
      type: 'email',
    });

    if (error) {
      setError(t.errorVerifyOtp);
      return;
    }
    const verifiedEmail = data?.user?.email || cleanEmail;
    setUserEmail(verifiedEmail);
    setState('verified');
    checkPaymentStatus(verifiedEmail);
  }, [email, otpCode, t.errorSupabase, t.errorVerifyOtp, setError, checkPaymentStatus]);

  const startRobokassaPayment = useCallback(async () => {
    if (!userEmail) return;
    if (!legalChecked) return;

    const payload = {
      product_code: PRODUCT_CODE,
      email: userEmail,
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.functions.invoke('create-robokassa-payment', {
          body: payload,
        });
        if (error) throw error;
        if (data?.params && typeof window.Robokassa?.StartPayment === 'function') {
          onClose?.();
          window.Robokassa.StartPayment(data.params);
          return;
        }
        if (data?.params && !window.Robokassa) {
          setError('Скрипт Robokassa не загружен. Обновите страницу.');
          return;
        }
        if (data?.error) {
          console.error('create-robokassa-payment:', data.error);
          setError(data.error);
          return;
        }
      } catch (err) {
        console.error('create-robokassa-payment:', err);
        const msg = err?.message || err?.error_description || String(err);
        setError(msg || t.robokassaSoon);
        return;
      }
    }
    setError(t.robokassaSoon);
  }, [userEmail, legalChecked, t.robokassaSoon, onClose]);

  const requestResend = useCallback(async () => {
    if (!userEmail) return;

    setState('resending');
    setErrorMessage(null);
    setResendSuccessInfo(null);

    if (!supabase) {
      setState('paid');
      alert(t.resendSoon);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('queue_plugin_resend', {
        p_email: userEmail,
        p_product_code: PRODUCT_CODE,
      });

      if (error) throw error;

      if (!data?.ok) {
        if (data?.error === 'Resend limit reached') {
          setState('limit_reached');
          return;
        }
        throw new Error(data?.error || 'Unknown error');
      }

      const left = data?.resendsLeft ?? 0;
      setResendSuccessInfo({ resendsLeft: left });
      setState(left <= 0 ? 'limit_reached' : 'paid');
    } catch (err) {
      console.warn('queue_plugin_resend:', err);
      setState('paid');
      alert(err?.message || t.resendSoon);
    }
  }, [userEmail, t.resendSoon]);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const id = setInterval(() => {
      setCooldownSeconds((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          sessionStorage.removeItem('purchase_otp_cooldown');
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [cooldownSeconds]);

  const isBlocked = ['otp_sending', 'otp_verifying', 'checking_payment', 'resending'].includes(state);
  const showOtpBlock = ['otp_sent', 'otp_verifying'].includes(state);
  const showPaymentBlock = ['unpaid', 'paid', 'limit_reached'].includes(state);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-800/95 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">{initialPaymentSuccess ? t.paymentSuccessTitle : t.title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition"
              aria-label={t.close}
            >
              ✕ {t.close}
            </button>
          </div>

          {initialPaymentSuccess ? (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-green-900/30 border border-green-700/50">
                <p className="text-green-400 font-medium">{t.paymentSuccessSummary}</p>
                <p className="text-gray-300 mt-2">{t.paymentSuccessSent}</p>
                <p className="text-amber-400/90 text-sm mt-3">{t.spamWarning}</p>
              </div>
              <div className="pt-4 border-t border-gray-700/50 text-sm text-gray-500">
                <p className="font-medium text-gray-400">{t.sellerLabel}</p>
                <p>{t.sellerName}</p>
                <p>{t.inn}</p>
                <p>{t.ogrn}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition"
              >
                {t.close}
              </button>
            </div>
          ) : (
            <>
          {/* 1. Товар */}
          <p className="text-sm text-gray-400 mb-4">{t.subtitle}</p>

          {/* 2. Цена */}
          <div className="mb-6">
            <p className="text-xl font-semibold text-white">{product ? formatPrice(product.price_rub) : t.priceMain}</p>
            <p className="text-sm text-gray-400">{product ? formatPriceAlt(product.price_rub) : '—'}</p>
            <p className="text-xs text-gray-500 mt-1">{t.priceNote}</p>
          </div>

          {/* 3. Доставка */}
          <p className="text-sm text-gray-400 mb-6">{t.delivery}</p>

          {/* 4. Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">{t.emailLabel}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              disabled={showOtpBlock || showPaymentBlock}
              className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-600 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition disabled:opacity-60"
            />
            {!showOtpBlock && !showPaymentBlock && (
              <button
                type="button"
                onClick={sendOtp}
                disabled={isBlocked || !email.trim() || cooldownSeconds > 0}
                className="mt-2 w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition"
              >
                {state === 'otp_sending' ? t.otpSending : cooldownSeconds > 0 ? t.resendCodeIn.replace('{n}', String(cooldownSeconds)) : t.getCode}
              </button>
            )}
          </div>

          {/* 5. OTP */}
          {showOtpBlock && (
            <div className="mb-6 p-4 rounded-lg bg-gray-900/50 border border-gray-700/50">
              <p className="text-sm text-green-400 mb-2">{t.codeSent}</p>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.otpLabel}</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder={t.otpPlaceholder}
                disabled={state === 'otp_verifying'}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-600 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition disabled:opacity-60"
              />
              <button
                type="button"
                onClick={verifyOtp}
                disabled={isBlocked || otpCode.length < 4}
                className="mt-2 w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition"
              >
                {state === 'otp_verifying' ? t.otpVerifying : t.confirmCode}
              </button>
              <button
                type="button"
                onClick={sendOtp}
                disabled={isBlocked || cooldownSeconds > 0}
                className="mt-2 w-full py-2 text-sm text-gray-400 hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {cooldownSeconds > 0 ? t.resendCodeIn.replace('{n}', String(cooldownSeconds)) : t.requestNewCode}
              </button>
            </div>
          )}

          {/* Checking payment */}
          {state === 'checking_payment' && (
            <p className="text-sm text-gray-400 mb-4">{t.checkingPayment}</p>
          )}

          {/* 6. Юридический чекбокс — только перед оплатой */}
          {showPaymentBlock && state === 'unpaid' && (
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={legalChecked}
                  onChange={(e) => setLegalChecked(e.target.checked)}
                  className="mt-1 rounded border-gray-600 bg-gray-900 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">
                  {t.legalCheckbox}{' '}
                  <Link to="/offer" className="text-purple-400 hover:underline">
                    Публичной оферты
                  </Link>{' '}
                  и{' '}
                  <Link to="/privacy" className="text-purple-400 hover:underline">
                    Политики конфиденциальности
                  </Link>
                </span>
              </label>
            </div>
          )}

          {/* 7. Блок оплаты / повторной отправки */}
          {showPaymentBlock && (
            <div className="mb-4">
              {state === 'unpaid' && (
                <>
                  <p className="text-sm text-amber-400 mb-3">{t.paymentNotComplete}</p>
                  <button
                  type="button"
                  onClick={startRobokassaPayment}
                  disabled={!legalChecked}
                  className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition"
                >
                  {t.payButton} — {product ? formatPrice(product.price_rub) : t.priceMain}
                </button>
                </>
              )}
              {state === 'paid' && (
                <>
                  {resendSuccessInfo ? (
                    <div className="mb-3 p-3 rounded-lg bg-green-900/30 border border-green-700/50">
                      <p className="text-sm text-green-400 font-medium">{t.resendSuccess}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {t.resendsLeft.replace('{n}', String(resendSuccessInfo.resendsLeft))}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-green-400 mb-3">{t.alreadyPaid}</p>
                  )}
                  <button
                    type="button"
                    onClick={requestResend}
                    disabled={isBlocked}
                    className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition"
                  >
                    {state === 'resending' ? t.resending : t.resendButton}
                  </button>
                </>
              )}
              {state === 'limit_reached' && (
                <div className="space-y-3">
                  {resendSuccessInfo && (
                    <p className="text-sm text-green-400">{t.resendSuccess}</p>
                  )}
                  <p className="text-sm text-amber-400">
                    {t.limitReached}{' '}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="text-purple-400 hover:underline">
                      {SUPPORT_EMAIL}
                    </a>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 8. Безопасность */}
          {showPaymentBlock && state === 'unpaid' && (
            <p className="text-xs text-gray-500 mb-4">{t.securityNote}</p>
          )}

          {/* 9. Результат покупки */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-300 mb-2">{t.resultTitle}</p>
            <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
              <li>{t.result1}</li>
              <li>{t.result2}</li>
            </ul>
            <p className="text-xs text-amber-400/90 mt-2">{t.spamWarning}</p>
          </div>

          {/* 10. Продавец */}
          <div className="pt-4 border-t border-gray-700/50 text-sm text-gray-500">
            <p className="font-medium text-gray-400">{t.sellerLabel}</p>
            <p>{t.sellerName}</p>
            <p>{t.inn}</p>
            <p>{t.ogrn}</p>
            <p>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-purple-400 hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>

          {/* Error */}
          {state === 'error' && errorMessage && (
            <p className="mt-4 text-sm text-red-400">{errorMessage}</p>
          )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
