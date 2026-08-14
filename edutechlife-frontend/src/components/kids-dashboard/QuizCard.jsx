import { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../utils/iconMapping";
import useFlashcardSpeech from "../../hooks/useFlashcardSpeech";
import { useTranslation } from "../../i18n/I18nProvider";

const CONFIDENCE_LEVELS = [
  {
    emoji: "😖",
    labelKey: "kid.flashcards.confidence_1",
    points: 0,
    color: "#EF4444",
    containerBg: "bg-gradient-to-b from-red-50 to-red-100/80",
    borderColor: "border-red-200",
    shadowColor: "rgba(239,68,68,0.15)",
    hoverShadow: "rgba(239,68,68,0.25)",
    iconVariants: {
      hover: { rotate: [0, -12, 8, -6, 0], scale: 1.1 },
    },
  },
  {
    emoji: "😕",
    labelKey: "kid.flashcards.confidence_2",
    points: 1,
    color: "#F59E0B",
    containerBg: "bg-gradient-to-b from-amber-50 to-amber-100/80",
    borderColor: "border-amber-200",
    shadowColor: "rgba(245,158,11,0.15)",
    hoverShadow: "rgba(245,158,11,0.25)",
    iconVariants: {
      hover: { rotate: [0, -8, 5, 0], scale: 1.08, y: -2 },
    },
  },
  {
    emoji: "😊",
    labelKey: "kid.flashcards.confidence_3",
    points: 2,
    color: "#4DA8C4",
    containerBg: "bg-gradient-to-b from-cyan-50 to-cyan-100/80",
    borderColor: "border-cyan-200",
    shadowColor: "rgba(77,168,196,0.15)",
    hoverShadow: "rgba(77,168,196,0.25)",
    iconVariants: {
      hover: { scale: [1, 1.2, 1], y: [0, -3, 0] },
    },
  },
  {
    emoji: "🤩",
    labelKey: "kid.flashcards.confidence_4",
    points: 3,
    color: "#10B981",
    containerBg: "bg-gradient-to-b from-emerald-50 to-emerald-100/80",
    borderColor: "border-emerald-200",
    shadowColor: "rgba(16,185,129,0.15)",
    hoverShadow: "rgba(16,185,129,0.25)",
    iconVariants: {
      hover: { scale: [1, 1.15, 1.05], rotate: [0, -5, 5, 0], y: [0, -2, 0] },
    },
  },
];

const pickIcon = (icons, seed) => {
  const hash =
    typeof seed === "string"
      ? seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
      : seed;
  return icons[Math.abs(hash) % icons.length];
};

const glassBorder = (color) =>
  `0 0 0 1px ${color}20 inset, 0 0 0 1px rgba(255,255,255,0.6) inset`;
const glassShadow = (color) => `0 8px 32px ${color}15, 0 1px 4px ${color}08`;

const QuizCard = memo(
  ({
    card,
    flipped,
    onFlip,
    onResult,
    idx,
    total,
    categoryColor,
    topicIcons = [
      "fa-brain",
      "fa-lightbulb",
      "fa-graduation-cap",
      "fa-star",
      "fa-sparkles",
    ],
  }) => {
    const { t } = useTranslation();
    const [swiped, setSwiped] = useState(false);
    const { speak, stop, speaking, supported } = useFlashcardSpeech();

    useEffect(() => {
      stop();
    }, [idx, stop]);

    const iconFront = useMemo(() => topicIcons[0], [topicIcons]);
    const iconBack = useMemo(
      () => pickIcon(topicIcons, card.front.length + card.back.length + 3),
      [topicIcons, card.front, card.back],
    );
    const decorIcons = useMemo(() => {
      if (topicIcons.length < 3) return [];
      return [topicIcons[1], topicIcons[2]];
    }, [topicIcons]);

    const handleSpeak = () => {
      if (speaking) {
        stop();
        return;
      }
      const text = flipped ? card.back : card.front;
      speak(text);
    };

    const handleSwipe = (_, info) => {
      if (info.offset.x > 80) {
        setSwiped(true);
        onFlip();
      }
    };

    return (
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Header */}
        <div className="flex items-center w-full max-w-xl px-1">
          <div className="flex items-center gap-2.5 text-sm">
            <span
              className="font-black text-lg tracking-tight"
              style={{ color: categoryColor }}
            >
              {idx + 1}
            </span>
            <span className="text-[#94A3B8] font-bold">/</span>
            <span className="font-bold text-[#64748B]">{total}</span>
          </div>
          <div className="flex-1 mx-4 h-1.5 bg-[#E2E8F0]/60 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor: categoryColor,
                boxShadow: `0 0 6px ${categoryColor}55`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${((idx + 1) / total) * 100}%` }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
            />
          </div>
          <div className="flex items-center gap-1.5">
            {supported && (
              <motion.button
                onClick={handleSpeak}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm transition-all hover:bg-white/80"
                title={
                  speaking
                    ? t("kid.flashcards.stop")
                    : t("kid.flashcards.dani_reads_card")
                }
              >
                {speaking ? (
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1], scale: [1, 0.9, 1] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex items-center gap-1"
                  >
                    <span className="text-sm">🎙️</span>
                  </motion.div>
                ) : (
                  <svg
                    className="w-4 h-4 text-[#64748B]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                  </svg>
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Card */}
        <div
          className="w-full max-w-xl h-64 sm:h-80 cursor-grab active:cursor-grabbing"
          style={{ perspective: "1400px" }}
          onClick={() => {
            onFlip();
            setSwiped(true);
          }}
        >
          <motion.div
            className="relative w-full h-full"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            style={{ transformStyle: "preserve-3d" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleSwipe}
            whileDrag={{ scale: 1.03, rotateY: 8 }}
          >
            {/* ===== FRONT ===== */}
            <div
              className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                background: `linear-gradient(160deg, ${categoryColor}12 0%, ${categoryColor}04 40%, rgba(255,255,255,0.7) 100%)`,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: `1px solid ${categoryColor}20`,
                boxShadow: `${glassShadow(categoryColor)}, ${glassBorder(categoryColor)}`,
              }}
            >
              {/* Ambient glow */}
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${categoryColor}18, transparent 70%)`,
                }}
              />
              <div
                className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${categoryColor}10, transparent 70%)`,
                }}
              />

              {/* Dot grid */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{
                  backgroundImage: `radial-gradient(${categoryColor} 1.5px, transparent 1.5px)`,
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Glass shine */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 50%, rgba(255,255,255,0.08) 100%)",
                }}
              />

              {/* Top accent */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-[3px] rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}66, transparent)`,
                }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />

              {/* Icon cluster */}
              <div
                className="relative z-10 flex items-center justify-center mb-3"
                style={{ width: 80, height: 80 }}
              >
                {/* Primary icon */}
                <motion.div
                  key={iconFront}
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 240, damping: 15 }}
                  style={{
                    filter: `drop-shadow(0 4px 12px ${categoryColor}30)`,
                  }}
                >
                  <Icon
                    name={iconFront}
                    className="w-14 h-14 sm:w-16 sm:h-16"
                    style={{ color: categoryColor }}
                  />
                </motion.div>

                {/* Decorative icons */}
                {decorIcons.map((iconName, i) => {
                  const posX = i === 0 ? -24 : 24;
                  const posY = i === 0 ? -18 : 18;
                  return (
                    <motion.div
                      key={iconName}
                      className="absolute pointer-events-none"
                      style={{
                        top: `calc(50% + ${posY}px)`,
                        left: `calc(50% + ${posX}px)`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.3 }}
                      transition={{
                        delay: 0.15 + i * 0.1,
                        type: "spring",
                        stiffness: 200,
                        damping: 16,
                      }}
                    >
                      <Icon
                        name={iconName}
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        style={{ color: categoryColor }}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Badge */}
              <span
                className="relative z-10 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.18em] mb-3"
                style={{
                  backgroundColor: `${categoryColor}12`,
                  color: categoryColor,
                  backdropFilter: "blur(4px)",
                  border: `1px solid ${categoryColor}20`,
                }}
              >
                {t("kid.flashcards.term_label")}
              </span>

              {/* Term */}
              <p
                className="relative z-10 text-xl sm:text-2xl font-black text-center leading-snug max-w-xs px-4"
                style={{ color: "#004B63" }}
              >
                {card.front}
              </p>

              {/* Tap hint */}
              {!flipped && (
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: [1, 0.25, 1], y: [0, -3, 0] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10 mt-5 flex items-center gap-1.5 text-xs font-bold"
                  style={{ color: categoryColor }}
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  {t("kid.flashcards.tap_or_swipe")}
                </motion.div>
              )}
            </div>

            {/* ===== BACK ===== */}
            <div
              className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background: `linear-gradient(160deg, ${categoryColor}18 0%, ${categoryColor}08 50%, rgba(255,255,255,0.75) 100%)`,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: `1px solid ${categoryColor}22`,
                boxShadow: `${glassShadow(categoryColor)}, ${glassBorder(categoryColor)}`,
              }}
            >
              {/* Ambient glow */}
              <div
                className="absolute -top-12 -left-12 w-36 h-36 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${categoryColor}12, transparent 70%)`,
                }}
              />

              {/* Dot grid */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                  backgroundImage: `radial-gradient(${categoryColor} 1.5px, transparent 1.5px)`,
                  backgroundSize: "18px 18px",
                }}
              />

              {/* Glass shine */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
                }}
              />

              {/* Icon */}
              <motion.div
                key={iconBack}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 14,
                  delay: 0.08,
                }}
                className="mb-3 relative z-10"
                style={{ filter: `drop-shadow(0 2px 8px ${categoryColor}25)` }}
              >
                <Icon
                  name={iconBack}
                  className="w-10 h-10 sm:w-12 sm:h-12"
                  style={{ color: categoryColor }}
                />
              </motion.div>

              {/* Badge */}
              <span
                className="relative z-10 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.18em] mb-3"
                style={{
                  backgroundColor: `${categoryColor}15`,
                  color: categoryColor,
                  backdropFilter: "blur(4px)",
                  border: `1px solid ${categoryColor}20`,
                }}
              >
                {t("kid.flashcards.definition_short")}
              </span>

              {/* Definition */}
              <p
                className="relative z-10 text-base sm:text-lg font-bold text-center leading-relaxed max-w-sm px-5"
                style={{ color: "#004B63" }}
              >
                {card.back}
              </p>
            </div>
          </motion.div>
        </div>

        {/* ===== CONFIDENCE BUTTONS ===== */}
        <AnimatePresence mode="wait">
          {flipped && (
            <motion.div
              key="confidence"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex gap-3 sm:gap-4"
            >
              {CONFIDENCE_LEVELS.map((level) => (
                <motion.button
                  key={level.points}
                  onClick={() => onResult(level.points)}
                  whileHover={{
                    scale: 1.08,
                    y: -4,
                    boxShadow: `0 12px 32px ${level.hoverShadow}`,
                  }}
                  whileTap={{
                    scale: 0.92,
                    y: 0,
                    boxShadow: `0 2px 6px ${level.shadowColor}`,
                  }}
                  className={`flex flex-col items-center gap-1.5 px-3.5 py-3 sm:px-5 sm:py-3.5 rounded-2xl border-2 transition-shadow ${level.containerBg} ${level.borderColor}`}
                  style={{
                    boxShadow: `0 4px 14px ${level.shadowColor}, 0 1px 3px rgba(0,0,0,0.04)`,
                  }}
                  title={t(level.labelKey)}
                >
                  <motion.span
                    className="text-2xl sm:text-3xl"
                    variants={level.iconVariants}
                    whileHover="hover"
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {level.emoji}
                  </motion.span>
                  <span
                    className="text-[11px] font-black whitespace-nowrap tracking-tight"
                    style={{ color: level.color }}
                  >
                    {t(level.labelKey)}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

QuizCard.displayName = "QuizCard";

export { CONFIDENCE_LEVELS };
export default QuizCard;
