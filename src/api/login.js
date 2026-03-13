import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, token }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Ошибка входа');
      onSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        className="w-full p-3 rounded bg-gray-800 text-white"
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        className="w-full p-3 rounded bg-gray-800 text-white"
        name="password"
        type="password"
        placeholder="Пароль"
        value={form.password}
        onChange={handleChange}
        required
      />
      <ReCAPTCHA
        sitekey="6Ld_7UYrAAAAADQ3EkIyrCJu108GltCMte8qqXbM"
        ref={recaptchaRef}
        size="invisible"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
      >
        {loading ? 'Вход...' : 'Войти'}
      </button>
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
    </form>
  );
}
