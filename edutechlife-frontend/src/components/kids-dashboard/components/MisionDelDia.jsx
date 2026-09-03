import { useMemo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { useTranslation } from "../../../i18n/I18nProvider";

const TASK_COLORS = ["#0096C7", "#F59E0B", "#06D6A0"];

const VAK_PRACTICE = {
  visual: {
    icon: "🃏",
    titleKey: "kid.mision.vak_visual_title",
    subtitleKey: "kid.mision.vak_visual_subtitle",
    tab: "flashcards",
  },
  auditivo: {
    icon: "🎤",
    titleKey: "kid.mision.vak_audio_title",
    subtitleKey: "kid.mision.vak_audio_subtitle",
    tab: "retos",
  },
  auditory: {
    icon: "🎤",
    titleKey: "kid.mision.vak_audio_title",
    subtitleKey: "kid.mision.vak_audio_subtitle",
    tab: "retos",
  },
  kinestesico: {
    icon: "⚡",
    titleKey: "kid.mision.vak_kine_title",
    subtitleKey: "kid.mision.vak_kine_subtitle",
    tab: "retos",
  },
  kinesthetic: {
    icon: "⚡",
    titleKey: "kid.mision.vak_kine_title",
    subtitleKey: "kid.mision.vak_kine_subtitle",
    tab: "retos",
  },
};

const getPredominantStyle = (vakResult) => {
  if (!vakResult) return null;
  const raw =
    vakResult.predominantStyle ||
    vakResult.primary_style ||
    vakResult.primaryStyle;
  return raw ? String(raw).toLowerCase() : null;
};

const buildTasks = ({ vakResult, missions, subjects, t }) => {
  const tasks = [];

  if (!vakResult) {
    tasks.push({
      key: "vak",
      icon: "🧠",
      title: t("kid.mision.vak_title"),
      subtitle: t("kid.mision.vak_subtitle"),
      tab: "perfil",
      xp: 100,
    });
  }

  const pending = (missions || []).filter((m) => m && !m.completed);
  if (pending.length > 0) {
    const m = pending[0];
    tasks.push({
      key: `mission-${m.id}`,
      icon: m.icon || "🎯",
      title: m.title,
      subtitle: m.description || t("kid.mision.complete_mission"),
      tab: "misiones",
      xp: m.xp || 50,
    });
  }

  const style = getPredominantStyle(vakResult);
  if (style && VAK_PRACTICE[style]) {
    const p = VAK_PRACTICE[style];
    tasks.push({
      key: "vak-practice",
      icon: p.icon,
      title: t(p.titleKey),
      subtitle: t(p.subtitleKey),
      tab: p.tab,
      xp: 40,
    });
  }

  const withProgress = (subjects || [])
    .map((s) => ({ ...s, progress: Number(s.progress) || 0 }))
    .sort((a, b) => a.progress - b.progress);
  if (withProgress.length > 0) {
    const s = withProgress[0];
    tasks.push({
      key: `subject-${s.id}`,
      icon: s.icon || "📚",
      title: t("kid.mision.subject_progress", { name: s.name }),
      subtitle:
        s.progress > 0
          ? t("kid.mision.subject_percent", { progress: s.progress })
          : t("kid.mision.subject_start"),
      tab: "materias",
      xp: 30,
    });
  }

  return tasks.slice(0, 3);
};

const MisionDelDia = ({ onTabChange }) => {
  const { vakResult, missions, subjects, streak } = useSmartBoardKids();
  const { t } = useTranslation();

  const tasks = useMemo(
    () => buildTasks({ vakResult, missions, subjects, t }),
    [vakResult, missions, subjects, t],
  );

  if (tasks.length === 0) return null;

  const streakNum =
    typeof streak === "number" ? streak : Number(streak?.current) || 0;
  const totalXp = tasks.reduce((sum, task) => sum + (task.xp || 0), 0);
  const [primary, ...secondary] = tasks;
  const primaryColor = TASK_COLORS[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl bg-white border border-[#E2E8F0] shadow-sm overflow-hidden"
      aria-label={t("kid.mision.aria_label")}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-2">
          <span className="text-base">🎯</span>
          <span className="text-sm font-black text-[#004B63] uppercase tracking-wide">
            {t("kid.mision.title")}
          </span>
          {streakNum > 0 && (
            <span className="flex items-center gap-1 text-xs font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A]">
              🔥 {streakNum}d
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-[10px] text-[#64748B] font-semibold leading-none">
            Ganas hasta
          </div>
          <div className="text-lg font-black text-[#FB8500] leading-tight">
            +{totalXp} XP
          </div>
        </div>
      </div>

      {/* Tarea principal — tarjeta grande con color */}
      <motion.button
        type="button"
        onClick={() => onTabChange?.(primary.tab)}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center gap-4 px-4 py-4 text-left transition-colors"
        style={{ backgroundColor: `${primaryColor}0D` }}
      >
        <span
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{
            backgroundColor: `${primaryColor}20`,
            border: `1.5px solid ${primaryColor}40`,
          }}
          aria-hidden
        >
          {primary.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div
            className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
            style={{ color: primaryColor }}
          >
            Haz esto primero
          </div>
          <div className="text-base font-black text-[#004B63] leading-tight truncate">
            {primary.title}
          </div>
          <div className="text-xs text-[#64748B] mt-0.5 truncate">
            {primary.subtitle}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span
            className="text-sm font-black px-2.5 py-1 rounded-full text-white"
            style={{ backgroundColor: primaryColor }}
          >
            +{primary.xp} XP
          </span>
          <ChevronRight
            className="w-4 h-4"
            style={{ color: primaryColor }}
            strokeWidth={2.5}
          />
        </div>
      </motion.button>

      {/* Tareas secundarias */}
      {secondary.length > 0 && (
        <div className="border-t border-[#F1F5F9]">
          {secondary.map((task, i) => {
            const color = TASK_COLORS[i + 1] || "#64748B";
            return (
              <button
                key={task.key}
                type="button"
                onClick={() => onTabChange?.(task.tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F8FAFC] transition-colors active:scale-[0.99] ${
                  i < secondary.length - 1 ? "border-b border-[#F1F5F9]" : ""
                }`}
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    backgroundColor: `${color}15`,
                    border: `1px solid ${color}30`,
                  }}
                  aria-hidden
                >
                  {task.icon}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-bold text-[#004B63] truncate">
                    {task.title}
                  </span>
                  <span className="block text-xs text-[#94A3B8] truncate">
                    {task.subtitle}
                  </span>
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    color,
                    backgroundColor: `${color}15`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  +{task.xp}
                </span>
                <ChevronRight
                  className="w-3.5 h-3.5 text-[#CBD5E1] flex-shrink-0"
                  strokeWidth={2}
                />
              </button>
            );
          })}
        </div>
      )}
    </motion.section>
  );
};

MisionDelDia.propTypes = {
  onTabChange: PropTypes.func,
};

export default MisionDelDia;
