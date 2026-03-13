import React, { useState } from 'react';

export default function CompanyRegisterForm({ onSuccess }) {
  const [form, setForm] = useState({
    companyName: '',
    companyId: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/company/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (result.success) {
        alert('Компания зарегистрирована!');
        onSuccess?.(); // вызвать onClose из родителя
      } else {
        alert('Ошибка: ' + result.error);
      }
    } catch (err) {
      alert('Ошибка соединения: ' + err.message);
    }
  };

  return (
    <form
      id="company-register-form"
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        className="w-full p-3 rounded bg-gray-800 text-white"
        name="companyName"
        placeholder="Название компании"
        value={form.companyName}
        onChange={handleChange}
        required
      />
      <input
        className="w-full p-3 rounded bg-gray-800 text-white"
        name="companyId"
        placeholder="ID (на латинице)"
        value={form.companyId}
        onChange={handleChange}
        required
      />
      <input
        className="w-full p-3 rounded bg-gray-800 text-white"
        name="email"
        type="email"
        placeholder="Email администратора"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        className="w-full p-3 rounded bg-gray-800 text-white"
        name="phone"
        placeholder="Телефон (необязательно)"
        value={form.phone}
        onChange={handleChange}
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
    </form>
  );
}
