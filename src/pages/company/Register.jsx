import React from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyRegisterForm from '../../components/CompanyRegisterForm';

export default function Register() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/'); // или navigate(-1), если хочешь просто "назад"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-white shadow-2xl">

        {/* ❌ Кнопка "Закрыть" */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white text-xl hover:text-red-400"
        >
          &times;
        </button>

        <h1 className="text-2xl font-bold text-center mb-6">
          Регистрация строительной компании
        </h1>

        {/* 📋 Форма регистрации */}
        <CompanyRegisterForm />

        {/* 🔘 Кнопки ОК и Отмена */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={handleClose}
            className="px-6 py-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            Отмена
          </button>
          <button
            form="company-register-form"
            type="submit"
            className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700"
          >
            ОК
          </button>
        </div>
      </div>
    </div>
  );
}
