import React from 'react';
import { Link } from 'react-router-dom';
import HeroIntro3D from '../components/HeroIntro3D'; // ✅



export default function ClientOffice() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Личный кабинет заказчика</h1>
      <p className="text-lg mb-10 text-center text-gray-300">
        Удобный инструмент для управления проектами, документами и коммуникацией с вашей командой.
      </p>
      
      
     <HeroIntro3D />

      {/* Секция преимуществ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { title: "Прозрачность", desc: "Клиент видит этапы, дедлайны и материалы." },
          { title: "Документы", desc: "Акты, чертежи и договоры — в одном месте." },
          { title: "Чат и комментарии", desc: "Переписка и правки без WhatsApp-хаоса." },
        ].map((item, idx) => (
          <div key={idx} className="bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Видео или превью */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
        <img src="/demo-preview.jpg" alt="Демо интерфейс" className="w-full" />
      </div>

      {/* Кнопки */}
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <Link
          to="/admin/demo"
          className="bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-3 rounded-xl text-white text-lg font-semibold text-center hover:from-blue-600 hover:to-purple-600 transition-all"
        >
          Посмотреть демо
        </Link>
        <Link
          to="/create"
          className="bg-white text-black px-6 py-3 rounded-xl text-lg font-semibold text-center hover:bg-gray-200 transition-all"
        >
          Создать свой кабинет
        </Link>
      </div>
    </div>
  );
}
