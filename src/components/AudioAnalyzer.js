import { useEffect, useRef } from 'react';

export default function AudioAnalyzer({ analyserRef, onLevelChange }) {
  const rafIdRef = useRef(null);
  const dataArrayRef = useRef(null);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    dataArrayRef.current = dataArray;

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      const scaledAvg = avg * 10;

      const now = performance.now();
      if (now - lastUpdateRef.current > 100) { // максимум 10 раз в секунду
        lastUpdateRef.current = now;
        if (typeof onLevelChange === 'function') {
          onLevelChange(scaledAvg);
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [analyserRef, onLevelChange]);

  return null;
}
