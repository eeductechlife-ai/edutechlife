import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { LiveCard, SpeakerCard } from "./HeroLiveCards";

const SPRING = { stiffness: 90, damping: 20, mass: 0.8 };

const safePlay = (video, onBlockedWithSound) => {
  try {
    const p = video.play?.();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        if (!video.muted) {
          video.muted = true;
          onBlockedWithSound();
          video.play?.()?.catch?.(() => {});
        }
      });
    }
  } catch {
    /* jsdom / navegadores sin media */
  }
};

/**
 * Pantalla 3D que reproduce el video del producto. Capas en profundidad:
 * brillo de piso < pantalla < tarjetas vivas < avatar del tutor.
 * `stage.mx/my` = puntero (-0.5..0.5); `stage.scroll` = progreso de scroll del Hero.
 */
export const HeroVideoStage = ({
  slide,
  isActive,
  isNear,
  running,
  muted,
  onToggleMute,
  waitingForGesture,
  onForceMute,
  onProgress,
  onEnded,
  progress,
  stage,
  t,
}) => {
  const videoRef = useRef(null);
  const { mx, my, scroll } = stage;

  // Al hacer scroll la pantalla se endereza hacia el usuario.
  const flatten = useTransform(scroll, [0, 0.45], [1, 0], { clamp: true });
  const rotateY = useSpring(
    useTransform([mx, flatten], ([x, f]) => (-12 + x * 14) * f),
    SPRING,
  );
  const rotateX = useSpring(
    useTransform([my, flatten], ([y, f]) => (6 - y * 10) * f),
    SPRING,
  );
  const scale = useTransform(scroll, [0, 0.45], [1, 1.06], { clamp: true });
  const nearX = useSpring(
    useTransform(mx, (x) => x * -34),
    SPRING,
  );
  const nearY = useSpring(
    useTransform(my, (y) => y * -22),
    SPRING,
  );
  const midX = useSpring(
    useTransform(mx, (x) => x * -18),
    SPRING,
  );
  const midY = useSpring(
    useTransform(my, (y) => y * -12),
    SPRING,
  );

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!isActive) {
      v.pause?.();
      return;
    }
    try {
      v.currentTime = 0;
    } catch {
      /* metadata aún no cargada */
    }
  }, [isActive]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !isActive) return;
    if (running) safePlay(v, onForceMute);
    else v.pause?.();
  }, [isActive, running, onForceMute]);

  useEffect(() => {
    if (!isActive || !running) return undefined;
    let raf;
    const tick = () => {
      const v = videoRef.current;
      if (v && v.duration) onProgress(v.currentTime / v.duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isActive, running, onProgress]);

  const handleEnded = () => {
    const advanced = onEnded();
    if (!advanced && videoRef.current) {
      videoRef.current.currentTime = 0;
      safePlay(videoRef.current, onForceMute);
    }
  };

  const speaking = isActive && running;

  return (
    <div className="relative mx-auto w-full px-3 pb-10 pt-6 [perspective:1600px] sm:px-8 lg:max-w-[calc((100dvh-17rem)*1.7)]">
      <div
        aria-hidden="true"
        className="absolute inset-x-[10%] bottom-3 h-12 rounded-[50%] opacity-50 blur-2xl"
        style={{ background: slide.accent }}
      />
      <motion.div
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <div
          className="relative overflow-hidden rounded-[22px] p-1.5 shadow-[0_60px_100px_-40px_rgba(0,40,60,0.65)] ring-1 ring-white/60"
          style={{ background: slide.screenBg }}
        >
          <div
            aria-hidden="true"
            className="flex items-center gap-1.5 px-3 py-2"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/80" />
            <span className="ml-3 truncate rounded-full bg-white/10 px-3 py-0.5 text-[11px] text-white/70">
              {slide.url}
            </span>
          </div>
          <video
            ref={videoRef}
            className="block aspect-video w-full rounded-2xl bg-black object-cover"
            poster={slide.poster}
            src={isNear ? slide.video : undefined}
            preload={isNear ? "auto" : "none"}
            playsInline
            muted
            onEnded={handleEnded}
            aria-label={t(slide.videoLabelKey)}
          />
          {/* Destello especular al entrar el slide */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/25 to-transparent"
            initial={false}
            animate={isActive ? { x: ["0%", "420%"] } : { x: "0%" }}
            transition={{ duration: 1.4, delay: 0.5, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          className="absolute -right-3 -top-6 hidden sm:block lg:-right-10"
          style={{ x: midX, y: midY, z: 60 }}
        >
          <SpeakerCard slide={slide} speaking={speaking} t={t} />
        </motion.div>

        <motion.div
          className="absolute -left-6 top-[18%] hidden md:block lg:-left-14"
          style={{ x: midX, y: midY, z: 80 }}
        >
          <LiveCard
            slide={slide}
            isActive={isActive}
            progress={progress}
            t={t}
          />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute -bottom-8 left-1 w-[22%] max-w-[150px] lg:-left-10"
          style={{ x: nearX, y: nearY, z: 110 }}
        >
          <div
            className="hero-motion"
            style={{ animation: "hero-float 5s ease-in-out infinite" }}
          >
            {speaking && (
              <span
                aria-hidden="true"
                className="hero-motion absolute inset-[12%] animate-ping rounded-full border-2 opacity-40"
                style={{ borderColor: slide.accent, animationDuration: "2.4s" }}
              />
            )}
            <img
              src={slide.avatar}
              alt=""
              loading="lazy"
              decoding="async"
              className="relative w-full drop-shadow-[0_28px_30px_rgba(0,40,60,0.45)]"
            />
          </div>
        </motion.div>

        <button
          type="button"
          onClick={onToggleMute}
          data-waiting={waitingForGesture || undefined}
          tabIndex={isActive ? 0 : -1}
          aria-pressed={!muted}
          className="absolute bottom-2 right-2 flex min-h-[44px] items-center gap-2 rounded-full bg-white/90 px-3 text-xs font-bold sm:bottom-4 sm:right-4 sm:px-4 sm:text-sm text-petroleum-dark shadow-lg ring-1 ring-white backdrop-blur-md transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          style={{ transform: "translateZ(50px)" }}
        >
          {waitingForGesture && isActive && (
            <span
              aria-hidden="true"
              className="hero-motion absolute inset-0 animate-ping rounded-full ring-2"
              style={{
                "--tw-ring-color": slide.accent,
                animationDuration: "1.8s",
              }}
            />
          )}
          {muted ? (
            <VolumeX size={18} aria-hidden="true" />
          ) : (
            <Volume2 size={18} aria-hidden="true" />
          )}
          {t(muted ? slide.listenKey : slide.muteKey)}
        </button>
      </motion.div>
    </div>
  );
};
