import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground({ isHomePage, audioLevel }) {
  const canvasRef = useRef(null);
  const blobRef = useRef(null);
  const animationFrameRef = useRef(null);
  const currentLineIndex = useRef(0);
  const currentCharIndex = useRef(0);
  const lastTimeRef = useRef(0);
  const displayedLines = useRef([]);
  const isCompleteRef = useRef(false);

  const codeLines = [
    'the Olalá effect powers this project',
    'special thanks to Miko Brelitz for composing',
    'and providing the music',
    'for effect powers:',
    'implicit none',
    'integer :: i',
    'real :: flow(5), lift(5), drag(5),',
    'pressure(3), velocity(3),',
    'energy(7), thrust(7), temp(7)',
    '',
    'do i=1,5',
    '  flow(i)=mod(i**2+7*i,33)+1',
    'end do',
    'flow(1)=16; flow(2)=13; flow(3)=29; flow(4)=12; flow(5)=1',
    'do i=1,5',
    '  lift(i)=sqrt(flow(i)*100+i)/10.0',
    'end do',
    'do i=1,5',
    '  drag(i)=(lift(i)**2)/(flow(i)+1)',
    'end do',
    'do i=1,3',
    '  pressure(i)=mod(i**3+5*i,33)+1',
    'end do',
    'pressure(1)=3; pressure(2)=19; pressure(3)=6',
    'do i=1,3',
    '  velocity(i)=log(pressure(i)*10+i)',
    'end do',
    'energy(1)=26; energy(2)=20; energy(3)=16; energy(4)=33; energy(5)=19; energy(6)=16; energy(7)=9',
    'thrust(1)=5; thrust(2)=1; thrust(3)=13; thrust(4)=31; thrust(5)=20; thrust(6)=16; thrust(7)=2',
    'temp(1)=13; temp(2)=1; temp(3)=4; temp(4)=16; temp(5)=5; temp(6)=1; temp(7)=18',
    'do i=1,7',
    '  temp(i)=sin(temp(i)*3.14/33)*100',
    'end do',
    '',
    "print *, 'Simulation complete.'",
    'end program aero_simulation'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const lineHeight = 20;
    const paddingBottom = 40;

    const updateCanvasSize = () => {
      canvas.width = 500;
      canvas.height = window.innerHeight - 10;
    };
    updateCanvasSize();

    const animate = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time - 100;

      const level = typeof audioLevel === 'number' ? audioLevel : 0;
      const normalizedLevel = Math.min(level / 2000, 1);
      const baseSpeed = 300 - normalizedLevel * 270;
      const speed = Math.max(30, baseSpeed);

      // обновляем blob
      if (blobRef.current) {
        blobRef.current.style.opacity = (normalizedLevel * 0.3).toFixed(2);
        blobRef.current.style.transform = `scale(${1 + normalizedLevel * 0.2})`;
      }

      // печать текста
      if (!isCompleteRef.current && normalizedLevel > 0 && time - lastTimeRef.current > speed) {
        const line = codeLines[currentLineIndex.current] || '';
        if (!displayedLines.current[currentLineIndex.current]) {
          displayedLines.current[currentLineIndex.current] = '';
        }
        if (currentCharIndex.current < line.length) {
          displayedLines.current[currentLineIndex.current] += line[currentCharIndex.current];
          currentCharIndex.current++;
        } else if (currentLineIndex.current < codeLines.length - 1) {
          currentLineIndex.current++;
          currentCharIndex.current = 0;
        } else {
          isCompleteRef.current = true;
        }
        lastTimeRef.current = time;
      }

      // затухание
      if (normalizedLevel === 0 && displayedLines.current.length > 0 && time - lastTimeRef.current > 100) {
        displayedLines.current.shift();
        lastTimeRef.current = time;
      }

      // отрисовка
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px monospace';
      ctx.fillStyle = 'rgba(0,255,0,0.7)';
      ctx.shadowColor = 'rgba(0,255,0,0.5)';
      ctx.shadowBlur = 5;

      let allLines = [];
      displayedLines.current.forEach((line) => {
        let currentPart = '';
        for (let char of line) {
          if (ctx.measureText(currentPart + char).width > canvas.width - 20) {
            allLines.push(currentPart);
            currentPart = char;
          } else {
            currentPart += char;
          }
        }
        if (currentPart) allLines.push(currentPart);
      });

      const maxLines = Math.floor((canvas.height - paddingBottom) / lineHeight);
      const startIndex = Math.max(0, allLines.length - maxLines);
      const visibleLines = allLines.slice(startIndex);

      let y = canvas.height - paddingBottom;
      for (let i = visibleLines.length - 1; i >= 0; i--) {
        ctx.fillText(visibleLines[i], 10, y);
        y -= lineHeight;
      }

      const lastLine = visibleLines.length > 0 ? visibleLines[visibleLines.length - 1] : '';
      const cursor = Math.floor(time / 300) % 2 === 0 ? '▌' : '';
      const x = 10 + ctx.measureText(lastLine).width;
      ctx.fillText(cursor, x, canvas.height - paddingBottom);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [isHomePage, audioLevel]);

  return (
    <div className="fixed inset-0 pointer-events-none flex justify-end pr-6" style={{ zIndex: 0 }}>
      {/* Световое пятно в углу */}
      <div
        ref={blobRef}
        className="absolute top-0 left-0 w-[400px] h-[400px] z-0 pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, #23a6d5, #e73c7e, #23d5ab)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          opacity: 0,
          transition: 'opacity 0.2s, transform 0.2s',
        }}
      />
      {/* Канвас с кодом */}
      <canvas ref={canvasRef} className="absolute top-0" />
    </div>
  );
}
