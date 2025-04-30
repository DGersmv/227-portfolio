import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground({ audioRef, isPlaying, isHomePage }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const tweensRef = useRef(new Map());
    const pointsRef = useRef([]);
    const audioInitialized = useRef(false);
    const analyserRef = useRef(null);
    const audioContextRef = useRef(null);
    const smoothedVolumeRef = useRef(0);
    const smoothedBassRef = useRef(0);
    const animationFrameRef = useRef(null);

    const getDistance = (p1, p2) => (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;

    const getVolume = () => {
        if (!analyserRef.current) return 0;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        const avg = dataArray.reduce((sum, v) => sum + v, 0) / dataArray.length;
        const volume = Math.min(avg / 128, 1);
        smoothedVolumeRef.current = smoothedVolumeRef.current * 0.7 + volume * 0.3;

        const bassBins = dataArray.slice(10, 15);
        const bassNorm = Math.pow(Math.max(...bassBins) / 250, 10);
        smoothedBassRef.current = smoothedBassRef.current * 0.6 + bassNorm * 0.4;

        return smoothedVolumeRef.current;
    };

    const initializeAudio = () => {
        if (audioRef.current && !audioInitialized.current) {
            try {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 256;
                const source = audioContextRef.current.createMediaElementSource(audioRef.current);
                source.connect(analyserRef.current);
                analyserRef.current.connect(audioContextRef.current.destination);
                audioInitialized.current = true;
            } catch (e) {
                console.error('AudioContext error:', e);
            }
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;

        const goldenRatio = 1.618;
        const playerWidth = 300;
        const playerHeight = 80;
        const spacing = Math.max(Math.min(width, height) / 25, 12);
        const centerX = width - playerWidth / 2 - 32;
        const centerY = height - playerHeight / 2 - 32;
        const areaWidth = playerWidth * goldenRatio;
        const areaHeight = playerHeight * goldenRatio;

        canvas.width = width;
        canvas.height = height;
        containerRef.current.style.height = `${height}px`;

        const points = [];
        let index = 0;
        for (let x = centerX - areaWidth / 2; x < centerX + areaWidth / 2; x += spacing) {
            for (let y = centerY - areaHeight / 2; y < centerY + areaHeight / 2; y += spacing) {
                const px = x + Math.random() * spacing;
                const py = y + Math.random() * spacing;
                points.push({ x: px, y: py, originX: px, originY: py, active: 0, index: index++, revealDelay: index * (2000 / ((areaWidth * areaHeight) / (spacing * spacing))), direction: Math.random() < 0.5 ? 1 : -1 });
            }
        }

        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            p1.closest = points
                .filter(p2 => p1 !== p2)
                .sort((a, b) => getDistance(p1, a) - getDistance(p1, b))
                .slice(0, 5)
                .map((p2, j) => ({ ...p2, lineRevealDelay: 2000 + j * 200 }));
            p1.circle = {
                radius: 1 + Math.random() * 2,
                draw() {
                    if (!p1.active) return;
                    ctx.beginPath();
                    ctx.arc(p1.x, p1.y, this.radius, 0, 2 * Math.PI);
                    ctx.fillStyle = `rgba(156,217,249,${p1.active})`;
                    ctx.fill();
                }
            };
        }

        pointsRef.current = points;

        let startTime = performance.now();

        const drawLines = (p) => {
            if (!p.active) return;
            const now = performance.now();
            for (const c of p.closest) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                const lineAlpha = isHomePage ? Math.min(1, (now - startTime - (c.lineRevealDelay || 0)) / 1000) : 0;
                const t = Math.min(1, lineAlpha);
                const x = p.x + (c.x - p.x) * t;
                const y = p.y + (c.y - p.y) * t;
                ctx.lineTo(x, y);
                ctx.strokeStyle = `rgba(156,217,249,${Math.min(p.active, lineAlpha)})`;
                ctx.stroke();
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            getVolume();
            const now = performance.now();

            for (const p of pointsRef.current) {
                const revealed = isHomePage ? Math.min(1, (now - startTime - (p.revealDelay || 0)) / 1000) : 0;
                const targetAlpha = revealed * (0.2 + smoothedBassRef.current * 1.5);
                p.active += (targetAlpha - p.active) * 0.1;
                drawLines(p);
                p.circle.draw();
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();
        window.addEventListener('resize', resize);

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            containerRef.current.style.height = `${height}px`;
        }

        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener('resize', resize);
            tweensRef.current.forEach((t) => t.kill());
            tweensRef.current.clear();
        };
    }, [isHomePage]);

    useEffect(() => {
        if (isPlaying) {
            initializeAudio();
            for (const p of pointsRef.current) {
            const shift = () => {
                if (!isPlaying) return;
                const moveRange = smoothedVolumeRef.current * 50;
                p.x = p.originX + Math.sin(performance.now() / 500 + p.index) * moveRange * p.direction;
                p.y = p.originY + Math.cos(performance.now() / 500 + p.index) * moveRange * p.direction;
                // Сдвигаем также ближайшие точки (точки-источники линий)
                if (p.closest) {
                    for (const c of p.closest) {
                        const now = performance.now();
                        const speed = 2000 + c.index * 13;
                        const amplitude = smoothedVolumeRef.current * 5;
                        const baseOffset = Math.sin(now / speed + c.index);
                        c.x = c.originX + baseOffset * amplitude;
                        c.y = c.originY + baseOffset * amplitude;
                    }
                }
                
            

                requestAnimationFrame(shift);
            };
            shift();
        }
        }
    }, [isPlaying]);

    return (
        <div ref={containerRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
            <canvas
                ref={canvasRef}
                style={{ position: 'absolute', top: 0, left: 0 }}
            ></canvas>
        </div>
    );
}
