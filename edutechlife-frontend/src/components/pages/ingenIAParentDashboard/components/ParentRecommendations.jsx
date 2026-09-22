import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";

const CATEGORY_META = {
  connection: {
    emoji: "💙",
    color: "#3B82F6",
    bg: "#EFF6FF",
    border: "#BFDBFE",
  },
  academic: { emoji: "📚", color: "#059669", bg: "#F0FDF4", border: "#A7F3D0" },
  habit: { emoji: "📅", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  emotional: {
    emoji: "🌟",
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
  },
  motivation: {
    emoji: "🎯",
    color: "#DC2626",
    bg: "#FFF1F2",
    border: "#FECDD3",
  },
  learning: { emoji: "🧠", color: "#0EA5E9", bg: "#F0F9FF", border: "#BAE6FD" },
};

const VAK_TIPS = {
  visual: { study: "rec.vak_visual_study", connect: "rec.vak_visual_connect" },
  auditivo: {
    study: "rec.vak_auditivo_study",
    connect: "rec.vak_auditivo_connect",
  },
  kinestésico: {
    study: "rec.vak_kinestesico_study",
    connect: "rec.vak_kinestesico_connect",
  },
  kinestesico: {
    study: "rec.vak_kinestesico_study",
    connect: "rec.vak_kinestesico_connect",
  },
};

// Conversation kit: 3 questions per tier, varied by day-of-week (0-6)
const CONV_KIT = {
  excelente: [
    ["conv.kit_exc_q1a", "conv.kit_exc_q2a", "conv.kit_exc_q3a"],
    ["conv.kit_exc_q1b", "conv.kit_exc_q2b", "conv.kit_exc_q3b"],
  ],
  bien: [
    ["conv.kit_bien_q1a", "conv.kit_bien_q2a", "conv.kit_bien_q3a"],
    ["conv.kit_bien_q1b", "conv.kit_bien_q2b", "conv.kit_bien_q3b"],
  ],
  regular: [
    ["conv.kit_reg_q1a", "conv.kit_reg_q2a", "conv.kit_reg_q3a"],
    ["conv.kit_reg_q1b", "conv.kit_reg_q2b", "conv.kit_reg_q3b"],
  ],
  sin_actividad: [
    ["conv.kit_inact_q1a", "conv.kit_inact_q2a", "conv.kit_inact_q3a"],
    ["conv.kit_inact_q1b", "conv.kit_inact_q2b", "conv.kit_inact_q3b"],
  ],
};

function getConversationKit({
  wellnessTier,
  streak,
  subjects,
  studentFirst,
  t,
}) {
  const tier = wellnessTier || "sin_actividad";
  const sets = CONV_KIT[tier] || CONV_KIT.sin_actividad;
  const dayIdx = new Date().getDay() % 2; // alternates day by day
  const keys = sets[dayIdx];
  const bestSubject = [...subjects]
    .sort((a, b) => b.progress - a.progress)
    .find((s) => s.progress > 0);
  const vars = { name: studentFirst, subject: bestSubject?.name || "", streak };
  return keys.map((key) => t(key, vars));
}

function buildRecommendations({
  streak,
  completionRate,
  avgProgress,
  wellness,
  vakResult,
  subjects,
  studyHours,
  minutes,
  studentFirst,
  t,
}) {
  const recs = [];
  const style = vakResult?.predominantStyle?.toLowerCase();

  // 1. Estilo de aprendizaje VAK — siempre presente si hay resultado
  if (style && VAK_TIPS[style]) {
    recs.push({
      id: "vak-study",
      category: "learning",
      priority: 1,
      title: t("rec.vak_title", { style: vakResult.predominantStyle }),
      body: t(VAK_TIPS[style].study, { name: studentFirst }),
      action: null,
    });
    recs.push({
      id: "vak-connect",
      category: "connection",
      priority: 2,
      title: t("rec.vak_connect_title"),
      body: t(VAK_TIPS[style].connect, { name: studentFirst }),
      action: null,
    });
  }

  // 2. Estado emocional / bienestar
  if (wellness === "sin_actividad" || minutes === 0) {
    recs.push({
      id: "emotional-inactive",
      category: "emotional",
      priority: 1,
      title: t("rec.emotional_inactive_title"),
      body: t("rec.emotional_inactive_body", { name: studentFirst }),
      action: t("rec.action_ask_today"),
    });
  } else if (wellness === "excelente") {
    recs.push({
      id: "emotional-great",
      category: "emotional",
      priority: 3,
      title: t("rec.emotional_great_title"),
      body: t("rec.emotional_great_body", { name: studentFirst }),
      action: t("rec.action_celebrate"),
    });
  } else if (wellness === "regular") {
    recs.push({
      id: "emotional-regular",
      category: "emotional",
      priority: 1,
      title: t("rec.emotional_regular_title"),
      body: t("rec.emotional_regular_body", { name: studentFirst }),
      action: t("rec.action_check_in"),
    });
  }

  // 3. Racha (hábito)
  if (!streak || streak === 0) {
    recs.push({
      id: "habit-start",
      category: "habit",
      priority: 1,
      title: t("rec.habit_nostreak_title"),
      body: t("rec.habit_nostreak_body", { name: studentFirst }),
      action: t("rec.action_10min"),
    });
  } else if (streak >= 7) {
    recs.push({
      id: "habit-strong",
      category: "habit",
      priority: 3,
      title: t("rec.habit_strong_title", { days: streak }),
      body: t("rec.habit_strong_body", { name: studentFirst, days: streak }),
      action: t("rec.action_celebrate"),
    });
  } else if (streak >= 3) {
    recs.push({
      id: "habit-growing",
      category: "habit",
      priority: 2,
      title: t("rec.habit_growing_title", { days: streak }),
      body: t("rec.habit_growing_body", { name: studentFirst }),
      action: null,
    });
  }

  // 4. Rendimiento académico — tareas
  if (completionRate === 0 && subjects.length > 0) {
    recs.push({
      id: "academic-nomissions",
      category: "academic",
      priority: 1,
      title: t("rec.academic_nomissions_title"),
      body: t("rec.academic_nomissions_body", { name: studentFirst }),
      action: t("rec.action_sit_together"),
    });
  } else if (completionRate < 0.5 && completionRate > 0) {
    recs.push({
      id: "academic-low",
      category: "academic",
      priority: 2,
      title: t("rec.academic_low_title"),
      body: t("rec.academic_low_body", {
        name: studentFirst,
        pct: Math.round(completionRate * 100),
      }),
      action: t("rec.action_review_missions"),
    });
  } else if (completionRate >= 0.8) {
    recs.push({
      id: "academic-high",
      category: "motivation",
      priority: 3,
      title: t("rec.academic_high_title"),
      body: t("rec.academic_high_body", { name: studentFirst }),
      action: t("rec.action_new_challenge"),
    });
  }

  // 5. Materias sin explorar
  const unexplored = subjects.filter((s) => s.progress === 0);
  if (unexplored.length >= 2) {
    recs.push({
      id: "academic-unexplored",
      category: "connection",
      priority: 2,
      title: t("rec.unexplored_title"),
      body: t("rec.unexplored_body", {
        name: studentFirst,
        count: unexplored.length,
      }),
      action: t("rec.action_explore_together"),
    });
  }

  // 6. Tiempo de estudio
  if (studyHours >= 5) {
    recs.push({
      id: "habit-time",
      category: "habit",
      priority: 2,
      title: t("rec.time_good_title"),
      body: t("rec.time_good_body", { name: studentFirst, hours: studyHours }),
      action: t("rec.action_balance"),
    });
  } else if (minutes < 30 && minutes > 0) {
    recs.push({
      id: "habit-moretime",
      category: "motivation",
      priority: 2,
      title: t("rec.time_low_title"),
      body: t("rec.time_low_body", { name: studentFirst }),
      action: t("rec.action_schedule"),
    });
  }

  // Max 3 — ordenadas por prioridad
  return recs.sort((a, b) => a.priority - b.priority).slice(0, 3);
}

const RecommendationCard = ({ rec, index }) => {
  const meta = CATEGORY_META[rec.category] || CATEGORY_META.connection;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06 }}
      className="rounded-xl border p-4"
      style={{ background: meta.bg, borderColor: meta.border }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
          style={{ backgroundColor: `${meta.color}20` }}
        >
          {meta.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-bold leading-tight"
            style={{ color: meta.color }}
          >
            {rec.title}
          </p>
          <p className="text-xs text-[#475569] mt-1 leading-relaxed">
            {rec.body}
          </p>
          {rec.action && (
            <div
              className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
            >
              <span>→</span> {rec.action}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ParentRecommendations = ({
  streak,
  completionRate,
  avgProgress,
  wellness,
  vakResult,
  subjects,
  studyHours,
  minutes,
  studentFirst,
}) => {
  const { t } = useTranslation();

  const wellnessTier = wellness?.tier || "sin_actividad";

  const conversationKit = useMemo(
    () =>
      getConversationKit({ wellnessTier, streak, subjects, studentFirst, t }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wellnessTier, streak, subjects, studentFirst],
  );

  const recommendations = useMemo(
    () =>
      buildRecommendations({
        streak,
        completionRate,
        avgProgress,
        wellness: wellness?.label || "",
        vakResult,
        subjects,
        studyHours,
        minutes,
        studentFirst,
        t,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      streak,
      completionRate,
      avgProgress,
      vakResult,
      subjects,
      studyHours,
      minutes,
      studentFirst,
    ],
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004B63]/8 to-[#4DA8C4]/5 rounded-xl p-4 border border-[#4DA8C4]/20">
        <h2 className="font-black text-[#004B63] text-base mb-0.5">
          {t("rec.section_title", { name: studentFirst })}
        </h2>
        <p className="text-xs text-[#64748B]">{t("rec.section_subtitle")}</p>
        {vakResult && (
          <div className="mt-2 inline-flex items-center gap-1.5 bg-[#4DA8C4]/10 px-2.5 py-1 rounded-lg">
            <span className="text-sm">🧠</span>
            <span className="text-xs font-semibold text-[#004B63]">
              {t("rec.vak_badge", { style: vakResult.predominantStyle })}
            </span>
          </div>
        )}
      </div>

      {/* Kit de conversación para la cena — 3 preguntas del día */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-[#004B63]/15 bg-[#004B63]/[0.03] p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🍽️</span>
          <div>
            <p className="text-[10px] font-bold text-[#004B63] uppercase tracking-widest leading-none">
              {t("conv.kit_title")}
            </p>
            <p className="text-[10px] text-[#94A3B8] mt-0.5">
              {t("conv.kit_subtitle")}
            </p>
          </div>
        </div>
        <div className="space-y-2.5">
          {conversationKit.map((question, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#004B63]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-black text-[#004B63]">
                  {i + 1}
                </span>
              </div>
              <p className="text-sm text-[#1E3A4A] leading-relaxed flex-1">
                {question}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#94A3B8] mt-3 border-t border-[#004B63]/8 pt-2.5">
          {t("conv.kit_hint")}
        </p>
      </motion.div>

      {/* Recomendaciones — máximo 3 */}
      {recommendations.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-[#E2E8F0] text-center">
          <p className="text-3xl mb-2">🎉</p>
          <p className="text-sm font-bold text-[#004B63]">
            {t("rec.no_recs_title")}
          </p>
          <p className="text-xs text-[#94A3B8] mt-1">
            {t("rec.no_recs_body", { name: studentFirst })}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <RecommendationCard key={rec.id} rec={rec} index={i} />
          ))}
        </div>
      )}

      {/* Footer note */}
      <p className="text-[10px] text-[#CBD5E1] text-center px-4">
        {t("rec.footer_note")}
      </p>
    </div>
  );
};

export default ParentRecommendations;
