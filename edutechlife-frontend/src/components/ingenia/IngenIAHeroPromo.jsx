import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useTranslation } from "../../i18n/I18nProvider";

const PROMO_VIDEO = "/videos/hero/ingenia-promo.mp4";
const PROMO_POSTER = "/images/hero/ingenia-promo-poster.jpg";

/**
 * Visual del hero de /conoce-ingenia: el reel de promoción (9:16) dentro de un
 * mockup de teléfono. El reel es vertical, así que un marco de teléfono es el
 * tratamiento correcto (en el escenario horizontal se recortaría).
 */
export default function IngenIAHeroPromo() {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = muted;
  }, [muted]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) v.play?.()?.catch?.(() => {});
    else v.pause?.();
  }, [inView]);

  return (
    <div className="relative mx-auto w-full max-w-[210px] [perspective:1600px] sm:max-w-[250px] lg:max-w-[290px]">
      {/* Halo de marca IngenIA detrás del teléfono */}
      <div
        aria-hidden="true"
        className="absolute -inset-10 -z-10 rounded-full opacity-80 blur-[80px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 45%, rgba(123,47,247,0.5), rgba(0,194,224,0.28) 58%, transparent 76%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 26, rotateY: -8 }}
        animate={{ opacity: 1, y: 0, rotateY: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="relative rounded-[2.6rem] border border-white/15 bg-[#0b0b12] p-2.5 shadow-[0_50px_90px_-40px_rgba(123,47,247,0.6)]"
      >
        {/* Notch */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-2.5 z-20 h-6 w-24 -translate-x-1/2 rounded-b-2xl bg-[#0b0b12]"
        />
        <video
          ref={videoRef}
          className="block aspect-[9/16] w-full rounded-[2rem] bg-black object-cover"
          poster={PROMO_POSTER}
          src={PROMO_VIDEO}
          playsInline
          muted
          loop
          preload="metadata"
          aria-label={t("hero.ingenia_video_label")}
        />
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-pressed={!muted}
          className="absolute bottom-4 right-4 flex min-h-[40px] items-center gap-2 rounded-full bg-white/90 px-3 text-xs font-bold text-[#1e1147] shadow-lg ring-1 ring-white backdrop-blur-md transition-colors hover:bg-white"
        >
          {muted ? (
            <VolumeX size={16} aria-hidden="true" />
          ) : (
            <Volume2 size={16} aria-hidden="true" />
          )}
          {t(muted ? "hero.ingenia_listen" : "hero.ingenia_mute")}
        </button>
      </motion.div>
    </div>
  );
}
