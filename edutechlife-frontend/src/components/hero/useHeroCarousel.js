import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue } from "framer-motion";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Estado del carrusel del Hero: slide activo, autoplay, progreso y pausa.
 * - Slides con `duration` avanzan por temporizador.
 * - Slides de video reportan su progreso y avanzan al terminar (onVideoEnded).
 * - Se detiene fuera de pantalla, con la pestaña oculta y con reduced motion.
 * - `held` (foco dentro del carrusel) congela el avance sin pausar los medios.
 */
export const useHeroCarousel = ({ slides, rootRef }) => {
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [reducedMotion] = useState(prefersReducedMotion);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [held, setHeld] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const heldRef = useRef(false);

  useEffect(() => {
    heldRef.current = held;
  }, [held]);

  const running = playing && inView && pageVisible;

  const goTo = useCallback(
    (index) => setActive(((index % count) + count) % count),
    [count],
  );
  const next = useCallback(() => setActive((a) => (a + 1) % count), [count]);
  const prev = useCallback(
    () => setActive((a) => (a - 1 + count) % count),
    [count],
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootRef]);

  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    elapsedRef.current = 0;
    progress.set(0);
  }, [active, progress]);

  const duration = slides[active].duration;

  useEffect(() => {
    if (!duration || !running) return undefined;
    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = now - last;
      last = now;
      if (!heldRef.current) {
        elapsedRef.current += dt;
        const p = Math.min(elapsedRef.current / duration, 1);
        progress.set(p);
        if (p >= 1) {
          next();
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, duration, running, next, progress]);

  const reportProgress = useCallback((p) => progress.set(p), [progress]);

  // Devuelve true si el carrusel avanzó; false si el video debe repetirse.
  const onVideoEnded = useCallback(() => {
    if (heldRef.current) return false;
    next();
    return true;
  }, [next]);

  const togglePlaying = useCallback(() => setPlaying((p) => !p), []);

  return {
    active,
    goTo,
    next,
    prev,
    playing,
    running,
    togglePlaying,
    setHeld,
    progress,
    reportProgress,
    onVideoEnded,
    reducedMotion,
  };
};
