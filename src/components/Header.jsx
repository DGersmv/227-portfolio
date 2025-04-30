import React from 'react';

export default function Header({ name, role }) {
  return (
    <header className="mb-12">
      <h1 className="text-4xl font-bold">{name}</h1>
      <p className="text-gray-400 mt-2">{role}</p>
    </header>
  );
}