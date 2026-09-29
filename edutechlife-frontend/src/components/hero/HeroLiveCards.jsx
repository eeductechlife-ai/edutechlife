import { motion, useTransform } from "framer-motion";

const GLASS =
  "rounded-2xl bg-white/90 shadow-[0_22px_45px_-20px_rgba(0,55,74,0.55)] ring-1 ring-white backdrop-blur-xl";

/** Barras de voz: se mueven solo mientras el tutor está hablando. */
export const VoiceWave = ({ speaking, color }) => (
  <span aria-hidden="true" className="flex h-5 items-center gap-[3px]">
    {[0, 0.15, 0.3, 0.1, 0.25].map((delay, i) => (
      <span
        key={i}
        className="hero-wave-bar h-full w-[3px] rounded-full"
        style={{
          background: color,
          animationDelay: `${delay}s`,
          animationPlayState: speaking ? "running" : "paused",
        }}
      />
    ))}
  </span>
);

export const SpeakerCard = ({ slide, speaking, t }) => (
  <div className={`${GLASS} max-w-[240px] px-4 py-3`}>
    <div className="flex items-center gap-2">
      <span className="text-xs font-extrabold text-petroleum-dark">
        {slide.speaker}
      </span>
      <VoiceWave speaking={speaking} color={slide.accent} />
    </div>
    <p className="mt-1 text-[13px] font-semibold leading-snug text-petroleum-dark">
      {t(slide.chipKey)}
    </p>
  </div>
);

/** Ruta del curso: la barra avanza con el progreso del video. */
const RouteCard = ({ card, accent, progress, t }) => {
  const width = useTransform(progress, (p) => `${Math.max(6, p * 100)}%`);
  return (
    <div className={`${GLASS} w-[220px] px-4 py-3`}>
      <p className="text-xs font-bold text-slate-500">{t(card.titleKey)}</p>
      <div className="mt-2 flex justify-between text-[12px] font-bold text-petroleum-dark">
        <span>{t(card.fromKey)}</span>
        <span>{t(card.toKey)}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-petroleum/10">
        <motion.div
          className="h-full rounded-full"
          style={{ width, background: accent }}
        />
      </div>
    </div>
  );
};

/** Plan de mejora: barras que crecen al entrar el slide. */
const PlanCard = ({ card, accent, isActive, t }) => (
  <div className={`${GLASS} w-[210px] px-4 py-3`}>
    <p className="text-xs font-bold text-slate-500">{t(card.titleKey)}</p>
    <ul className="mt-2 space-y-1.5">
      {card.items.map((item, i) => (
        <li
          key={item.key}
          className="grid grid-cols-[72px_1fr] items-center gap-2"
        >
          <span className="truncate text-[12px] font-semibold text-petroleum-dark">
            {t(item.key)}
          </span>
          <span className="h-2 overflow-hidden rounded-full bg-petroleum/10">
            <motion.span
              className="block h-full origin-left rounded-full"
              style={{ background: i === 1 ? "#00C2E0" : accent }}
              initial={false}
              animate={{ scaleX: isActive ? item.value : 0.08 }}
              transition={{
                duration: 1.2,
                delay: isActive ? 0.6 + i * 0.15 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export const LiveCard = ({ slide, isActive, progress, t }) =>
  slide.liveCard.type === "route" ? (
    <RouteCard
      card={slide.liveCard}
      accent={slide.accent}
      progress={progress}
      t={t}
    />
  ) : (
    <PlanCard
      card={slide.liveCard}
      accent={slide.accent}
      isActive={isActive}
      t={t}
    />
  );
