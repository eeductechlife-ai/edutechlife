import { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig, useMotionValue, useScroll } from "framer-motion";
import { useTranslation } from "../../i18n/I18nProvider";
import { HERO_SLIDES } from "./heroSlides";
import { HeroVideoStage } from "./HeroVideoStage";
import { useHeroVoice } from "./useHeroVoice";
import "./hero-stage.css";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Pantalla 3D de la plataforma (la misma del Hero del inicio) para usarla
 * fuera del carrusel, p. ej. en /conoce-ingenia. El video se repite en bucle,
 * se pausa fuera de pantalla y el tutor habla tras el primer gesto del usuario.
 */
export const PlatformShowcase = ({ slideId }) => {
  const { t } = useTranslation();
  const slide = HERO_SLIDES.find((s) => s.id === slideId);
  const rootRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const progress = useMotionValue(0);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end start"],
  });
  const [inView, setInView] = useState(true);
  const [reducedMotion] = useState(prefersReducedMotion);
  const { muted, waitingForGesture, toggleVoice, onAudioBlocked } =
    useHeroVoice(rootRef);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        threshold: 0.25,
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reportProgress = useCallback((p) => progress.set(p), [progress]);
  const loop = useCallback(() => false, []);

  if (!slide) return null;

  const handlePointerMove = (e) => {
    if (reducedMotion || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const resetPointer = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={rootRef}
        data-typo="intended"
        className="relative w-full"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 blur-2xl"
          style={{ background: slide.glow }}
        />
        <HeroVideoStage
          slide={slide}
          isActive
          isNear
          running={inView && !reducedMotion}
          muted={muted}
          onToggleMute={toggleVoice}
          waitingForGesture={waitingForGesture}
          onForceMute={onAudioBlocked}
          onProgress={reportProgress}
          onEnded={loop}
          progress={progress}
          stage={{ mx, my, scroll: scrollYProgress }}
          t={t}
        />
      </div>
    </MotionConfig>
  );
};
