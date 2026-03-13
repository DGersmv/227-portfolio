import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateClient() {
  const [form, setForm] = useState({ name: '', email: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const slug = form.name.toLowerCase().replace(/\s+/g, '-');

    // Пока делаем имитацию создания клиента
    console.log("Создан клиент:", form);
    navigate(`/admin/${slug}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 text-white rounded-xl shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Создание Личного кабинета заказчика</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Название компании"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded text-white"
        />
        <input
          type="email"
          placeholder="Email для связи"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded text-white"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-blue-600 hover:to-purple-600 px-6 py-2 rounded-xl font-semibold transition-all"
        >
          Создать кабинет
        </button>
      </form>
    </div>
  );
}
