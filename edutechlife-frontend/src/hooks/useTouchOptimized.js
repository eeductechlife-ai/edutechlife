import { useEffect, useState } from "react";

export function useTouchOptimized() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const detectTouch = () => {
      const touchCapable =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;
      setIsTouch(touchCapable);
    };

    detectTouch();
    const mql = window.matchMedia("(pointer: coarse)");
    mql.addEventListener?.("change", detectTouch);
    return () => mql.removeEventListener?.("change", detectTouch);
  }, []);

  return isTouch;
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    if (w < 640) return "mobile";
    if (w < 1024) return "tablet";
    return "desktop";
  });

  useEffect(() => {
    const updateBreakpoint = () => {
      const w = window.innerWidth;
      if (w < 640) setBreakpoint("mobile");
      else if (w < 1024) setBreakpoint("tablet");
      else setBreakpoint("desktop");
    };

    window.addEventListener("resize", updateBreakpoint, { passive: true });
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === "mobile",
    isTablet: breakpoint === "tablet",
    isDesktop: breakpoint === "desktop",
    isTouchDevice: breakpoint !== "desktop",
  };
}

export function useSwipeGesture({ onSwipeLeft, onSwipeRight, threshold = 50 } = {}) {
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleStart = (e) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
    };

    const handleEnd = (e) => {
      const t = e.changedTouches[0];
      const diffX = t.clientX - startX;
      const diffY = t.clientY - startY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
        if (diffX > 0 && onSwipeRight) onSwipeRight();
        if (diffX < 0 && onSwipeLeft) onSwipeLeft();
      }
    };

    document.addEventListener("touchstart", handleStart, { passive: true });
    document.addEventListener("touchend", handleEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleStart);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [onSwipeLeft, onSwipeRight, threshold]);
}
