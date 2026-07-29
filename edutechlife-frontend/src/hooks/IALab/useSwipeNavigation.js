import { useCallback, useRef } from "react";

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  threshold = 80,
  isScrollingRef,
}) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = useCallback(
    (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      if (isScrollingRef) isScrollingRef.current = false;
    },
    [isScrollingRef],
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isScrollingRef) return;
      const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
      const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
      if (dy > dx && dy > 10) {
        isScrollingRef.current = true;
      }
    },
    [isScrollingRef],
  );

  const handleTouchEnd = useCallback(
    (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;

      if (
        !isScrollingRef?.current &&
        Math.abs(dx) > Math.abs(dy) * 1.5 &&
        Math.abs(dx) > threshold
      ) {
        if (dx > 0) onSwipeRight?.();
        else onSwipeLeft?.();
      }

      touchStartX.current = 0;
      touchStartY.current = 0;
      if (isScrollingRef) isScrollingRef.current = false;
    },
    [onSwipeLeft, onSwipeRight, threshold, isScrollingRef],
  );

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
}
