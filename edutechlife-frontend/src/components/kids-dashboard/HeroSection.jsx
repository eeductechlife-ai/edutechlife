import { memo, useEffect } from "react";
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
  ChevronRight,
  BarChart2,
  Layers,
  ClipboardCheck,
} from "lucide-react";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useAdaptiveEngine } from "../../hooks/useAdaptiveEngine";
import WhatDoIDoToday from "./WhatDoIDoToday";
import { useTranslation } from "../../i18n/I18nProvider";
import DaniAvatar3D from "./DaniAvatar3D";
import { SB_GRADIENTS, SB_COLORS } from "./smartboardTheme";
import {
  DAY_LABELS,
  subjectColor,
  subjectEmoji,
  formatHHMM,
} from "./schedule/timetableUtils";

const QUICK_ACTIONS = [
  {
    tab: "calificaciones",
    icon: BarChart2,
    emoji: "📊",
    labelKey: "kid.hero.action_grades_label",
    color: "#F59E0B",
  },
  {
    tab: "flashcards",
    icon: Layers,
    emoji: "🎴",
    labelKey: "kid.hero.action_flashcards_label",
    color: "#06B6D4",
  },
  {
    tab: "retos",
    icon: ClipboardCheck,
    emoji: "⚡",
    labelKey: "kid.hero.action_exams_label",
    color: "#9D4EDD",
  },
];

const HeroSection = memo(({ onTabChange, onDaniOpen }) => {
  const { vakResult, timetable, currentClass, nextClass, studentAge } =
    useSmartBoardKids();
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

  const getVAKIcon = () => {
    if (!vakResult) return Target;
    const style = vakResult.predominantStyle;
    if (style === "visual") return Eye;
    if (style === "auditivo") return Ear;
    if (style === "kinestésico") return Zap;
    return Target;
  };

  const greeting = getGreeting();
  const VAKIcon = getVAKIcon();
  const classColor = activeClass
    ? activeClass.color || subjectColor(activeClass.subject)
    : SB_COLORS?.cyan || "#4DA8C4";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[1.5rem]"
      style={{ background: SB_GRADIENTS.hero }}
    >
      {/* Top row: avatar + greeting */}
      <div className="p-5 flex items-center gap-4">
        <motion.div
          animate={reduce ? {} : { y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <DaniAvatar3D mood="happy" size="lg" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-white/65 text-xs mb-0.5">
            <greeting.Icon className="w-3.5 h-3.5" strokeWidth={2} />
            {greeting.text}
          </div>
          <div className="text-xl font-black text-white leading-tight">
            {firstName ? (
              <>
                ¡Hola,{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: SB_GRADIENTS.gold }}
                >
                  {firstName}
                </span>
                !
              </>
            ) : (
              "¡Bienvenido!"
            )}
          </div>
          {vakResult && (
            <div className="flex items-center gap-1 mt-0.5 text-white/60 text-xs">
              <VAKIcon className="w-3 h-3" strokeWidth={2} />
              <span>
                {vakResult.predominantStyle.charAt(0).toUpperCase() +
                  vakResult.predominantStyle.slice(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Clase actual — pieza central */}
      {timetable && activeClass ? (
        <motion.button
          type="button"
          onClick={() => onTabChange?.("horario")}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.98 }}
          className="mx-5 mb-4 flex items-center gap-4 w-[calc(100%-2.5rem)] p-4 rounded-2xl text-left border transition-colors"
          style={{
            backgroundColor: `${classColor}22`,
            borderColor: `${classColor}55`,
          }}
        >
          <span className="text-4xl leading-none flex-shrink-0">
            {subjectEmoji(activeClass.subject_label || activeClass.subject)}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-0.5">
              {isNow ? "Ahora mismo" : "Próxima clase"}
            </div>
            <div className="text-lg font-black text-white truncate leading-tight">
              {activeClass.subject_label || activeClass.subject}
            </div>
            <div className="text-xs text-white/70 mt-0.5">
              {isNow
                ? `Hasta las ${formatHHMM(activeClass.end_time)}`
                : `${DAY_LABELS.es[activeClass.day_of_week]} · ${formatHHMM(activeClass.start_time)}`}
              {activeClass.room ? ` · Aula ${activeClass.room}` : ""}
            </div>
          </div>
          <ChevronRight
            className="w-4 h-4 text-white/40 flex-shrink-0"
            strokeWidth={2}
          />
        </motion.button>
      ) : (
        <div className="mx-5 mb-4 px-4 py-3 rounded-2xl bg-white/8 border border-white/15">
          <div className="text-xs text-white/60">Sin clase en este momento</div>
          <div className="text-sm font-semibold text-white mt-0.5">
            Aprovecha para repasar con Dani
          </div>
        </div>
      )}

      {/* CTA principal: Hablar con Dani */}
      <div className="px-5 pb-4">
        <motion.button
          type="button"
          onClick={() => onDaniOpen?.()}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-bold text-[#00303F] transition-all"
          style={{ background: SB_GRADIENTS.gold }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span
            animate={reduce ? {} : { rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 3 }}
          >
            <Bot className="w-5 h-5" strokeWidth={2.3} />
          </motion.span>
          <span className="text-base">{t("kid.hero.talk_with_dani")}</span>
          <span className="text-xs opacity-60">
            {t("kid.hero.here_for_you")}
          </span>
        </motion.button>
      </div>

      {/* Acciones rápidas — 3 compactas */}
      <motion.div
        className="px-5 pb-5 grid grid-cols-3 gap-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.tab}
            type="button"
            onClick={() => onTabChange?.(action.tab)}
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/18 active:scale-95 transition-all"
          >
            <span className="text-2xl leading-none">{action.emoji}</span>
            <span className="text-[11px] text-white/80 font-semibold text-center leading-tight">
              {t(action.labelKey)}
            </span>
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
