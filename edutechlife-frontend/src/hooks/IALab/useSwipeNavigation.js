import { useCallback, useRef } from 'react';

export function useSwipeNavigation({ onSwipeLeft, onSwipeRight, threshold = 80 }) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(dx) > Math.abs(dy) * 1.5 && Math.abs(dx) > threshold) {
      if (dx > 0) onSwipeRight?.();
      else onSwipeLeft?.();
    }

    touchStartX.current = 0;
    touchStartY.current = 0;
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return { handleTouchStart, handleTouchEnd };
}
