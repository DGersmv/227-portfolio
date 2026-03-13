import React, { useEffect, useRef } from 'react';
import './FancyBackground.css';

const SYMBOLS = ['2', '2', '7', '.', 'i', 'n', 'f', 'o'];

export default function FancyBackground() {
  const backgroundRef = useRef(null);

  useEffect(() => {
    const background = backgroundRef.current;
    let position = 0;
    const speed = 0.15; // Регулируемая скорость (изменяйте это значение)

    const animate = () => {
      position += speed; // Увеличиваем позицию с заданной скоростью
      if (position >= background.offsetHeight) position = 0; // Сброс для бесшовности
      background.style.backgroundPositionY = `${position}px`;
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId); // Очистка
  }, []);

  return (
    <>
      <div className="background-layer" ref={backgroundRef} />
      <div className="brand-assembly">
        {SYMBOLS.map((char, i) => (
          <span
            key={i}
            className="symbol"
            style={{
              animationDelay: `${i * 0.2}s`,
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </>
  );
}