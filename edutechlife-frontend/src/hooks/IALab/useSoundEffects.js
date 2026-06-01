import { useCallback, useRef } from 'react';

const SOUNDS = {
  achievement: { src: '/sounds/achievement.mp3', volume: 0.3 },
  streak: { src: '/sounds/streak.mp3', volume: 0.3 },
  levelUp: { src: '/sounds/level-up.mp3', volume: 0.4 },
  quizCorrect: { src: '/sounds/correct.mp3', volume: 0.2 },
  quizWrong: { src: '/sounds/wrong.mp3', volume: 0.2 },
};

export function useSoundEffects() {
  const audioRef = useRef(null);

  const playSound = useCallback((soundName) => {
    const config = SOUNDS[soundName];
    if (!config) return;
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio(config.src);
      audio.volume = config.volume;
      audioRef.current = audio;
      audio.play().catch(() => {});
    } catch {}
  }, []);

  return { playSound };
}
