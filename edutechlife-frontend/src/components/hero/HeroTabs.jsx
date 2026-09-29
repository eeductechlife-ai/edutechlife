import { useRef } from "react";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";

const RING = 26; // radio del anillo de progreso (viewBox 60)

/** Avatar del slide con anillo de progreso, al estilo de "historias". */
const StoryAvatar = ({ slide, selected, progress }) => (
  <span className="relative grid h-14 w-14 shrink-0 place-items-center">
    <svg
      viewBox="0 0 60 60"
      className="absolute inset-0 h-full w-full -rotate-90"
      aria-hidden="true"
    >
      <circle
        cx="30"
        cy="30"
        r={RING}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="text-petroleum/10"
      />
      {selected && (
        <motion.circle
          cx="30"
          cy="30"
          r={RING}
          fill="none"
          stroke={slide.accent}
          strokeWidth="3"
          strokeLinecap="round"
          style={{ pathLength: progress }}
        />
      )}
    </svg>
    <span
      className={`relative h-11 w-11 overflow-hidden rounded-full bg-white shadow-[0_8px_18px_-8px_rgba(0,55,74,0.55)] ring-1 ring-white transition-transform duration-300 ${
        selected
          ? "scale-100"
          : "scale-90 opacity-80 group-hover:scale-95 group-hover:opacity-100"
      }`}
    >
      <img
        src={slide.tabImage}
        alt=""
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover ${slide.tabImageClass || ""}`}
      />
    </span>
  </span>
);

/**
 * Selector de slides del Hero: avatares (Edutechlife, MAX, Dani) con anillo
 * de progreso y botón de pausa (WCAG 2.2.2). Va debajo del contenido.
 */
export const HeroTabs = ({
  slides,
  active,
  onSelect,
  progress,
  playing,
  onTogglePlay,
  idPrefix,
  controlsPrefix = idPrefix,
  t,
}) => {
  const tabRefs = useRef([]);

  const handleKeyDown = (e) => {
    const last = slides.length - 1;
    let target = null;
    if (e.key === "ArrowRight") target = active === last ? 0 : active + 1;
    if (e.key === "ArrowLeft") target = active === 0 ? last : active - 1;
    if (e.key === "Home") target = 0;
    if (e.key === "End") target = last;
    if (target === null) return;
    e.preventDefault();
    onSelect(target);
    tabRefs.current[target]?.focus();
  };

  return (
    <div className="flex items-center gap-3 sm:gap-6">
      <div
        role="tablist"
        aria-label={t("hero.tabs_label")}
        onKeyDown={handleKeyDown}
        className="grid flex-1 grid-cols-3 gap-2 sm:gap-6"
      >
        {slides.map((slide, i) => {
          const selected = i === active;
          return (
            <button
              key={slide.id}
              ref={(el) => (tabRefs.current[i] = el)}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${controlsPrefix}-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(i)}
              className="group flex flex-col items-center gap-1.5 rounded-2xl p-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-petroleum sm:flex-row sm:gap-3 sm:text-left"
            >
              <StoryAvatar
                slide={slide}
                selected={selected}
                progress={progress}
              />
              <span className="min-w-0">
                <span
                  className={`block text-[13px] font-bold leading-tight transition-colors sm:text-sm ${
                    selected
                      ? "text-petroleum-dark"
                      : "text-slate-500 group-hover:text-petroleum"
                  }`}
                >
                  <span className="text-inherit sm:hidden">
                    {slide.tabShort}
                  </span>
                  <span className="hidden text-inherit sm:inline">
                    {t(slide.tabKey)}
                  </span>
                </span>
                <span className="hidden truncate text-xs text-slate-500 lg:block">
                  {t(slide.tabCaptionKey)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={t(playing ? "hero.pause" : "hero.play")}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/80 text-petroleum-dark shadow-[0_8px_18px_-10px_rgba(0,55,74,0.5)] ring-1 ring-petroleum/10 backdrop-blur transition-colors hover:bg-petroleum hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-petroleum"
      >
        {playing ? (
          <Pause size={16} aria-hidden="true" />
        ) : (
          <Play size={16} aria-hidden="true" />
        )}
      </button>
    </div>
  );
};
