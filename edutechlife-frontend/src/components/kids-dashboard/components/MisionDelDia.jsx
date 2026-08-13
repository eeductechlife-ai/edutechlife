import { useMemo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { ChevronRight, Target } from "lucide-react";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { useTranslation } from "../../../i18n/I18nProvider";

/**
 * MisionDelDia
 * Turns the dashboard's 17 tabs into ONE clear focus for today.
 * Picks 2-3 concrete tasks from the child's real state (VAK, missions,
 * subject progress). Deterministic within a day so it doesn't reshuffle
 * on every render. Additive: reads context, never mutates it.
 */

const VAK_PRACTICE = {
  visual: {
    icon: "🃏",
    titleKey: "kid.mision.vak_visual_title",
    subtitleKey: "kid.mision.vak_visual_subtitle",
    tab: "flashcards",
  },
  auditivo: {
    icon: "🎧",
    titleKey: "kid.mision.vak_audio_title",
    subtitleKey: "kid.mision.vak_audio_subtitle",
    tab: "podcast",
  },
  auditory: {
    icon: "🎧",
    titleKey: "kid.mision.vak_audio_title",
    subtitleKey: "kid.mision.vak_audio_subtitle",
    tab: "podcast",
  },
  kinestesico: {
    icon: "📷",
    titleKey: "kid.mision.vak_kine_title",
    subtitleKey: "kid.mision.vak_kine_subtitle",
    tab: "escaner",
  },
  kinesthetic: {
    icon: "📷",
    titleKey: "kid.mision.vak_kine_title",
    subtitleKey: "kid.mision.vak_kine_subtitle",
    tab: "escaner",
  },
};

// Simple day-stable index so the "extra" pick rotates daily but not per render.
const dayIndex = (len) => {
  if (len <= 0) return 0;
  const d = new Date();
  const seed = d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate();
  return seed % len;
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

  // 1. If no VAK yet, that is always the first task — it powers everything else.
  if (!vakResult) {
    tasks.push({
      key: "vak",
      icon: "🧠",
      title: t("kid.mision.vak_title"),
      subtitle: t("kid.mision.vak_subtitle"),
      tab: "vak",
      xp: 100,
    });
  }

  // 2. Next incomplete mission.
  const pending = (missions || []).filter((m) => m && !m.completed);
  if (pending.length > 0) {
    const m = pending[dayIndex(pending.length)];
    tasks.push({
      key: `mission-${m.id}`,
      icon: m.icon || "🎯",
      title: m.title,
      subtitle: m.description || t("kid.mision.complete_mission"),
      tab: "misiones",
      xp: m.xp || 50,
    });
  }

  // 3. A VAK-tailored practice (only once VAK is known).
  const style = getPredominantStyle(vakResult);
  if (style && VAK_PRACTICE[style]) {
    const p = VAK_PRACTICE[style];
    tasks.push({
      key: `vak-practice`,
      icon: p.icon,
      title: t(p.titleKey),
      subtitle: t(p.subtitleKey),
      tab: p.tab,
      xp: 40,
    });
  }

  // 4. Subject that needs the most love (lowest progress).
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

  // Keep it focused: at most 3 tasks.
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
  const totalXp = tasks.reduce((sum, t) => sum + (t.xp || 0), 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl p-5 bg-white/70 backdrop-blur-xl border border-[#E2E8F0]/50 text-[#00303F] shadow-xl"
      aria-label={t("kid.mision.aria_label")}
    >
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <h3 className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#FFE29A] via-[#FFD166] to-[#FB8500] text-[#4A2C00] px-3 py-1 rounded-full font-black text-xs tracking-wide">
          <Target className="w-4 h-4" strokeWidth={2.6} />
          {t("kid.mision.title")}
        </h3>
        <div className="text-right rounded-xl bg-[#FFD166]/15 border border-[#FFD166]/40 px-3 py-1.5">
          <div className="text-xs text-[#64748B] font-semibold">
            {t("kid.mision.earn_up_to")}
          </div>
          <div className="font-black text-lg text-[#FB8500]">+{totalXp} XP</div>
        </div>
      </div>

      {streakNum > 0 && (
        <p className="text-xs text-[#B45309] font-semibold mb-3">
          {streakNum === 1
            ? t("kid.mision.streak_one", { days: streakNum })
            : t("kid.mision.streak_many", { days: streakNum })}
        </p>
      )}

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.key}>
            <button
              onClick={() => onTabChange?.(task.tab)}
              className="w-full flex items-center gap-3 bg-[#F8FAFC] hover:bg-[#EAF6FA] rounded-xl px-4 py-3 text-left border border-[#E2E8F0]/60 transition-all active:scale-[0.98]"
            >
              <span
                className="w-11 h-11 rounded-xl bg-white border border-[#E2E8F0]/70 flex items-center justify-center text-2xl shrink-0"
                aria-hidden="true"
              >
                {task.icon}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[#00303F] font-bold text-sm truncate">
                  {task.title}
                </span>
                <span className="block text-[#64748B] text-xs truncate">
                  {task.subtitle}
                </span>
              </span>
              <span className="text-xs font-bold text-[#FB8500] bg-[#FFD166]/15 border border-[#FFD166]/40 rounded-full px-2 py-0.5 shrink-0">
                +{task.xp}
              </span>
              <ChevronRight className="w-4 h-4 text-[#4DA8C4] shrink-0" />
            </button>
          </li>
        ))}
      </ul>
    </motion.section>
  );
};

MisionDelDia.propTypes = {
  onTabChange: PropTypes.func,
};

export default MisionDelDia;
