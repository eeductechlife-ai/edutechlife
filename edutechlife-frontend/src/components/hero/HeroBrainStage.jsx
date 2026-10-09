import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { NeuralBrain } from "./NeuralBrain";

// Render realista (Canva, menta/cian) sin fondo
const BRAIN_SRC = "/images/hero/brain-real.webp";

// Video del cerebro (Veo vía Gemini, recortado y con el fondo llevado a
// blanco con ffmpeg; loop de 10 s, sin audio). Mientras no exista en
// public/videos/hero/, se muestra NeuralBrain (imagen animada).
const BRAIN_FILM = {
  mp4: "/videos/hero/brain-film.mp4",
  poster: "/images/hero/brain-film-poster.webp",
  // Veo lo entrega muy pausado: a 1,6× el balanceo y la actividad se ven vivos
  playbackRate: 1.6,
};

/**
 * ¿Está publicado el video? Se mira el content-type: en desarrollo Vite
 * responde index.html (200) a cualquier ruta inexistente.
 */
const useFilmAvailable = () => {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(BRAIN_FILM.mp4, { method: "HEAD", signal: ctrl.signal })
      .then((r) => {
        const type = r.headers.get("content-type") || "";
        if (r.ok && type.startsWith("video/")) setAvailable(true);
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);
  return available;
};

/**
 * Slide principal: solo el cerebro con sus conexiones neuronales vivas, sin
 * anillos ni fondo. Si existe el video real lo reproduce (mismo tamaño y
 * reacción al cursor); si no, anima la imagen. Al hacer scroll se queda atrás.
 */
export const HeroBrainStage = ({ isActive, running, reducedMotion, stage }) => {
  const playing = isActive && running && !reducedMotion;
  const filmAvailable = useFilmAvailable();
  const videoRef = useRef(null);

  const progress = useSpring(stage.scroll, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.0005,
  });
  const y = useTransform(progress, (p) => (reducedMotion ? 0 : p * 60));
  const follow = { stiffness: 55, damping: 18, mass: 1.1 };
  const tiltY = useSpring(
    useTransform(stage.mx, (v) => v * 10),
    follow,
  );
  const tiltX = useSpring(
    useTransform(stage.my, (v) => v * -7),
    follow,
  );

  // Autoplay solo se permite en silencio: se fija en el elemento (React no
  // siempre refleja `muted` como atributo) y se reintenta al tener datos.
  const syncPlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.playbackRate = BRAIN_FILM.playbackRate;
    if (playing) void video.play().catch(() => undefined);
    else video.pause();
  };
  useEffect(syncPlayback, [playing, filmAvailable]);

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[min(280px,72vw)] [perspective:1000px] sm:max-w-[340px] lg:max-w-[min(420px,calc(100dvh-26rem))]"
      style={{ y }}
    >
      {filmAvailable ? (
        <motion.div style={{ rotateX: tiltX, rotateY: tiltY }}>
          <video
            ref={videoRef}
            // multiply: el fondo blanco del video desaparece sobre la página
            className="block aspect-[816/720] w-full object-cover mix-blend-multiply"
            poster={BRAIN_FILM.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={syncPlayback}
            aria-hidden="true"
          >
            <source src={BRAIN_FILM.mp4} type="video/mp4" />
          </video>
        </motion.div>
      ) : (
        <NeuralBrain src={BRAIN_SRC} playing={playing} pointer={stage} />
      )}
    </motion.div>
  );
};
