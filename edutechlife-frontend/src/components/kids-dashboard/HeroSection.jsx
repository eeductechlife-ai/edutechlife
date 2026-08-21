import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sun,
  CloudSun,
  Moon,
  Eye,
  Ear,
  Zap,
  Target,
  Bot,
  BarChart2,
  Layers,
  MessageCircle,
  ClipboardCheck,
  ChevronRight,
} from "lucide-react";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";
import DaniAvatar3D from "./DaniAvatar3D";
import { SB_GRADIENTS, SB_COLORS, glow } from "./smartboardTheme";
import {
  DAY_LABELS,
  subjectEmoji,
  formatHHMM,
} from "./schedule/timetableUtils";

const QUICK_ACTIONS = [
  {
    tab: "calificaciones",
    icon: BarChart2,
    emoji: "📊",
    labelKey: "kid.hero.action_grades_label",
    hintKey: "kid.hero.action_grades_hint",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.25)",
  },
  {
    tab: "flashcards",
    icon: Layers,
    emoji: "🎴",
    labelKey: "kid.hero.action_flashcards_label",
    hintKey: "kid.hero.action_flashcards_hint",
    color: "#06B6D4",
    bg: "rgba(6,182,212,0.12)",
    border: "rgba(6,182,212,0.25)",
  },
  {
    tab: "oral",
    icon: MessageCircle,
    emoji: "🗣️",
    labelKey: "kid.hero.action_oral_label",
    hintKey: "kid.hero.action_oral_hint",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.25)",
  },
  {
    tab: "examenes",
    icon: ClipboardCheck,
    emoji: "📝",
    labelKey: "kid.hero.action_exams_label",
    hintKey: "kid.hero.action_exams_hint",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.25)",
  },
];

const LEARNING_PATH = ["calificaciones", "flashcards", "oral", "examenes"];

const HeroSection = memo(({ onTabChange }) => {
  const { vakResult, activeStudyDeck, studentGrades, timetable, currentClass, nextClass } = useSmartBoardKids();
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const activeClass = currentClass || nextClass;
  const isNow = !!currentClass;

  const firstName = (() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("student_name") || ""
          : "";
      return raw.split(" ")[0] || "";
    } catch {
      return "";
    }
  })();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: t("kid.hero.greeting_morning"), Icon: Sun };
    if (hour < 18)
      return { text: t("kid.hero.greeting_afternoon"), Icon: CloudSun };
    return { text: t("kid.hero.greeting_evening"), Icon: Moon };
  };

  const getVAKMessage = () => {
    if (!vakResult)
      return { label: t("kid.hero.discover_style"), Icon: Target };
    const style = vakResult.predominantStyle;
    if (style === "visual")
      return { label: t("kid.hero.power_visual"), Icon: Eye };
    if (style === "auditivo")
      return { label: t("kid.hero.power_auditory"), Icon: Ear };
    if (style === "kinestésico")
      return { label: t("kid.hero.power_kinesthetic"), Icon: Zap };
    return { label: t("kid.hero.unique_style"), Icon: Target };
  };

  const greeting = getGreeting();
  const vak = getVAKMessage();

  const floatAnim = reduce
    ? {}
    : {
        y: [0, -10, 0],
        transition: { duration: 4, repeat: Infinity, ease: "easeOut" },
      };

  // Determine learning path progress
  const pathProgress = (() => {
    if (!activeStudyDeck && !studentGrades?.length) return -1;
    if (activeStudyDeck) {
      // Find which step the deck corresponds to (flashcards = step 1)
      return 1;
    }
    if (studentGrades?.length) return 0;
    return -1;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem]"
      style={{
        background: SB_GRADIENTS.hero,
        boxShadow: `${glow(SB_COLORS.primary, 0.28)}, 0 24px 60px -20px rgba(0,48,63,0.55)`,
      }}
    >
      {/* Soft floating orbs */}
      <motion.div
        aria-hidden="true"
        className="absolute -top-20 -right-16 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,209,102,0.35), transparent 70%)",
        }}
        animate={
          reduce ? {} : { scale: [1, 1.12, 1], opacity: [0.6, 0.7, 0.6] }
        }
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-24 -left-10 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(72,202,228,0.4), transparent 70%)",
        }}
        animate={
          reduce ? {} : { scale: [1, 1.15, 1], opacity: [0.5, 0.65, 0.5] }
        }
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Dotted grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #FFFFFF 1.2px, transparent 1.2px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Floating sparkles */}
      {!reduce &&
        ["✨"].map((s, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="absolute text-xl md:text-2xl select-none pointer-events-none"
            style={{ top: `${18 + i * 22}%`, right: `${8 + i * 5}%` }}
            animate={{
              y: [0, -10, 0],
              rotate: [0, 12, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.6,
            }}
          >
            {s}
          </motion.span>
        ))}

      {/* Main content */}
      <div className="relative z-10 p-6 md:p-10">
        {/* Top row: Dani + Welcome + CTA */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Dani Avatar */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              damping: 15,
              stiffness: 200,
              delay: 0.3,
            }}
            whileHover={{ scale: 1.05 }}
            className="relative flex-shrink-0"
          >
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,209,102,0.55), transparent 65%)",
              }}
              animate={
                reduce ? {} : { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }
              }
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div className="relative" animate={floatAnim}>
              <DaniAvatar3D mood="happy" size="xl" />
            </motion.div>
          </motion.div>

          {/* Welcome text */}
          <div className="flex-1 text-center md:text-left">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white/90 text-xs md:text-sm font-semibold mb-2"
            >
              <greeting.Icon className="w-4 h-4" strokeWidth={2.4} />
              {greeting.text}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-3 leading-[1.1] tracking-tight"
            >
              {firstName ? (
                <>
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: SB_GRADIENTS.gold }}
                  >
                    {firstName}
                  </span>
                  , ¿en qué puedo ayudarte?
                </>
              ) : (
                <>
                  {t("kid.hero.title_before")}{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: SB_GRADIENTS.gold }}
                  >
                    Dani
                  </span>
                  {t("kid.hero.title_after")}
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center md:justify-start gap-2.5 text-white/90 text-sm md:text-lg font-medium mb-3"
            >
              <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/18 text-white flex-shrink-0">
                <vak.Icon className="w-5 h-5" strokeWidth={2.4} />
              </span>
              {vak.label}
            </motion.p>

            {/* Stat chip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="w-full flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center md:justify-start"
            >
              {vakResult && (
                <div
                  className="flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25"
                  style={{ boxShadow: glow(SB_COLORS.cyan, 0.35) }}
                >
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                    style={{
                      background: "linear-gradient(135deg, #9D4EDD, #C77DFF)",
                    }}
                  >
                    <vak.Icon className="w-5 h-5" strokeWidth={2.4} />
                  </span>
                  <span className="leading-tight text-left">
                    <span className="block text-white font-black text-base">
                      {vakResult.predominantStyle.toUpperCase()}
                    </span>
                    <span className="block text-white/70 text-[10px] font-bold uppercase tracking-wider -mt-0.5">
                      {t("kid.hero.your_style")}
                    </span>
                  </span>
                </div>
              )}
              {timetable && activeClass && (
                <button
                  type="button"
                  onClick={() => onTabChange?.("horario")}
                  className="flex items-center gap-2 sm:gap-2.5 pl-2 pr-3 sm:pr-4 py-1.5 sm:py-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white/25 transition-colors text-left flex-shrink-0"
                  style={{ boxShadow: glow(SB_COLORS.cyan, 0.35) }}
                  aria-label="Ir a mi horario"
                  title="Ver mi horario"
                >
                  <span
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #06D6A0, #118AB2)",
                    }}
                    aria-hidden
                  >
                    {subjectEmoji(
                      activeClass.subject_label || activeClass.subject,
                    )}
                  </span>
                  <span className="leading-tight min-w-0">
                    <span className="block text-white font-black text-sm sm:text-base truncate max-w-[7rem] sm:max-w-[9rem]">
                      {activeClass.subject_label || activeClass.subject}
                    </span>
                    <span className="block text-white/80 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider -mt-0.5">
                      {isNow
                        ? `Ahora · hasta ${formatHHMM(activeClass.end_time)}`
                        : `Sigue · ${DAY_LABELS.es[activeClass.day_of_week]} ${formatHHMM(activeClass.start_time)}`}
                    </span>
                  </span>
                </button>
              )}
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="flex-shrink-0"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTabChange?.("oral")}
              className="group px-5 py-3 rounded-2xl font-bold text-[#00303F] flex items-center gap-3 transition-shadow"
              style={{
                background: SB_GRADIENTS.gold,
                boxShadow: glow(SB_COLORS.amber, 0.5),
              }}
            >
              <motion.span
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(1,26,36,0.12)" }}
                animate={reduce ? {} : { rotate: [0, -12, 12, -12, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  repeatDelay: 2.5,
                }}
              >
                <Bot className="w-6 h-6" strokeWidth={2.3} />
              </motion.span>
              <span className="text-left">
                <span className="block font-black">
                  {t("kid.hero.talk_with_dani")}
                </span>
                <span className="block text-xs opacity-70 -mt-0.5">
                  {t("kid.hero.here_for_you")}
                </span>
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Active deck banner */}
        {activeStudyDeck && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-5 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
          >
            <span className="text-xl">🎴</span>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">
                {t("kid.hero.active_deck")}
              </p>
              <p className="text-white font-bold text-sm truncate">
                {activeStudyDeck.title}
              </p>
            </div>
            {/* Mini path indicator */}
            <div className="hidden sm:flex items-center gap-1.5">
              {LEARNING_PATH.map((tab, i) => {
                const action = QUICK_ACTIONS.find((a) => a.tab === tab);
                const isDone = i < pathProgress;
                const isCurrent = i === pathProgress;
                return (
                  <div key={tab} className="flex items-center gap-1">
                    <button
                      onClick={() => onTabChange?.(tab)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                      style={{
                        background: isCurrent
                          ? action?.color
                          : isDone
                            ? `${action?.color}55`
                            : "rgba(255,255,255,0.1)",
                        color:
                          isCurrent || isDone
                            ? "white"
                            : "rgba(255,255,255,0.4)",
                      }}
                      title={action?.labelKey ? t(action.labelKey) : ""}
                    >
                      {action?.emoji}
                    </button>
                    {i < LEARNING_PATH.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-white/30" />
                    )}
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => onTabChange?.("flashcards")}
              className="text-white text-xs font-semibold flex items-center gap-1 px-3 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 transition-all active:scale-95"
            >
              {t("kid.hero.continue")} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* Quick Actions grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05 }}
          className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {QUICK_ACTIONS.map((action, i) => (
            <motion.button
              key={action.tab}
              onClick={() => onTabChange?.(action.tab)}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.07 }}
              className="flex items-center gap-3 px-3.5 py-3.5 min-h-[88px] rounded-2xl text-left backdrop-blur-md border transition-all hover:shadow-lg"
              style={{
                background: "rgba(255,255,255,0.08)",
                borderColor: "rgba(255,255,255,0.30)",
              }}
            >
              <span
                className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{
                  background: action.bg,
                  border: `1.5px solid ${action.border}`,
                }}
              >
                {action.emoji}
              </span>
              <span className="leading-tight min-w-0">
                <span className="block text-white font-bold text-sm truncate">
                  {t(action.labelKey)}
                </span>
                <span className="block text-white/70 text-[10px] mt-0.5 truncate">
                  {t(action.hintKey)}
                </span>
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
