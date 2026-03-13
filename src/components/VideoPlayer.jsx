import React, { useEffect, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export default function VideoPlayer({ src, poster, lang = 'ru', className = '', autoplay = false, sources = null }) {
  const videoRef = useRef(null);
  const plyrRef = useRef(null);

  useEffect(() => {
    const hasSrc = src || (sources && sources.length > 0);
    if (!videoRef.current || !hasSrc) return;

    const hasMultipleQualities = sources && sources.length > 1;
    const plyrOptions = {
      controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'duration',
        'mute',
        'volume',
        'settings',
        'pip',
        'fullscreen',
      ],
      settings: hasMultipleQualities ? ['speed', 'quality'] : ['speed'],
      speed: { selected: 1, options: SPEED_OPTIONS },
      i18n: {
        speed: lang === 'ru' ? 'Скорость' : 'Speed',
        normal: lang === 'ru' ? 'Обычная' : 'Normal',
        quality: lang === 'ru' ? 'Качество' : 'Quality',
        fullscreen: lang === 'ru' ? 'Полный экран' : 'Fullscreen',
        exitFullscreen: lang === 'ru' ? 'Выйти из полноэкранного режима' : 'Exit fullscreen',
        pip: lang === 'ru' ? 'Картинка в картинке' : 'Picture in picture',
        exitPip: lang === 'ru' ? 'Выйти из PiP' : 'Exit PIP',
        mute: lang === 'ru' ? 'Выключить звук' : 'Mute',
        unmute: lang === 'ru' ? 'Включить звук' : 'Unmute',
        play: lang === 'ru' ? 'Воспроизвести' : 'Play',
        pause: lang === 'ru' ? 'Пауза' : 'Pause',
        restart: lang === 'ru' ? 'Перезапустить' : 'Restart',
        rewind: lang === 'ru' ? 'Перемотать {seektime} сек' : 'Rewind {seektime}s',
        fastForward: lang === 'ru' ? 'Вперёд {seektime} сек' : 'Forward {seektime}s',
        currentTime: lang === 'ru' ? 'Текущее время' : 'Current time',
        duration: lang === 'ru' ? 'Длительность' : 'Duration',
      },
      fullscreen: { enabled: true, fallback: true, iosNative: false },
    };

    if (hasMultipleQualities) {
      plyrOptions.quality = {
        default: sources[0].size,
        options: sources.map((s) => s.size),
        forced: true,
      };
      plyrOptions.i18n.qualityLabel = sources.reduce((acc, s) => {
        acc[s.size] = `${s.size}p`;
        return acc;
      }, {});
    }

    const plyr = new Plyr(videoRef.current, plyrOptions);

    plyrRef.current = plyr;

    return () => {
      plyr.destroy();
      plyrRef.current = null;
    };
  }, [src, lang, sources]);

  return (
    <div className={`video-player-plyr ${className}`}>
      <video
        ref={videoRef}
        crossOrigin="anonymous"
        playsInline
        data-poster={poster}
        autoPlay={autoplay}
        muted={autoplay}
      >
        {sources && sources.length > 0 ? (
          sources.map((s) => (
            <source key={s.size} src={s.url} type="video/mp4" size={s.size} />
          ))
        ) : (
          <source src={src} type="video/mp4" />
        )}
        {lang === 'ru' ? 'Ваш браузер не поддерживает видео.' : 'Your browser does not support video.'}
      </video>
      <style>{`
        .video-player-plyr {
          --plyr-color-main: rgb(168 85 247);
          --plyr-video-background: #1f2937;
          --plyr-menu-background: rgba(31, 41, 55, 0.95);
          --plyr-menu-color: #e5e7eb;
          --plyr-tooltip-background: #374151;
          --plyr-tooltip-color: #f9fafb;
        }
        .video-player-plyr .plyr--video {
          border-radius: 0.5rem;
        }
        .video-player-plyr .plyr__control[data-plyr="fullscreen"],
        .video-player-plyr .plyr__control[data-plyr="pip"] {
          display: flex !important;
        }
        .video-player-plyr .plyr--fullscreen-enabled .plyr__controls {
          background: linear-gradient(transparent, rgba(0,0,0,0.75));
        }
      `}</style>
    </div>
  );
}
