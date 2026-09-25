import { memo, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, GitBranch, Loader2 } from "lucide-react";
import { useIngenIAKids } from "../../context/IngenIAKidsContext";
import { useAdaptiveEngine } from "../../hooks/useAdaptiveEngine";
import { isFeatureEnabled } from "../../hooks/useFeatureFlag";
import { getLearningGraphRecommendation } from "./learningGraph";
import { SUBJECT_META as PRACTICE_META } from "./practicarHub/practicarConfig";
import {
  setHandoff,
  HANDOFF_CHALLENGE_SUBJECT,
  HANDOFF_CHALLENGE_DIFFICULTY,
  HANDOFF_CHALLENGE_AUTOSTART,
} from "./practicarHub/practicarHandoff";

// ── Subject palette ──────────────────────────────────────────────────────────

const SUBJECT_META = {
  matematicas: { emoji: "🔢", color: "#FB8500" },
  lenguaje: { emoji: "📖", color: "#9D4EDD" },
  ciencias_naturales: { emoji: "🔬", color: "#06D6A0" },
  ciencias_sociales: { emoji: "🌎", color: "#EF476F" },
  ingles: { emoji: "🌐", color: "#FFD166" },
  tecnologia: { emoji: "💻", color: "#118AB2" },
};

const DEFAULT_GRADIENT =
  "linear-gradient(135deg, #7B2FF7 0%, #9D4EDD 55%, #C77DFF 100%)";

function gradientForColor(color) {
  return `linear-gradient(135deg, ${color} 0%, ${color}AA 100%)`;
}

// ── Goal badges ───────────────────────────────────────────────────────────────

const GOAL_META = {
  recovery: { label: "Recuperación", emoji: "🆘", badge: "#EF4444" },
  practice: { label: "Práctica", emoji: "📖", badge: "#F59E0B" },
  mastery: { label: "Dominio", emoji: "⭐", badge: "#10B981" },
  transfer: { label: "Desafío", emoji: "🚀", badge: "#7C3AED" },
};

// ── Action → tab ──────────────────────────────────────────────────────────────

const ACTION_TAB = {
  practice: "flashcards",
  quick: "retos",
  challenge: "retos",
};

// ── Map backend action to display shape ───────────────────────────────────────

function backendToDisplay(action) {
  if (!action) return null;
  const meta = SUBJECT_META[action.subject] || {
    emoji: "📚",
    color: "#9D4EDD",
  };
  const goal = GOAL_META[action.smartboardPriority?.goal] || GOAL_META.practice;
  return {
    emoji: meta.emoji,
    label: action.label || action.subject,
    headline: action.reason,
    tab: ACTION_TAB[action.action] || "retos",
    xp:
      action.priority === "high" ? 80 : action.priority === "medium" ? 50 : 30,
    minutes: action.estimatedMinutes || 10,
    gradient: gradientForColor(meta.color),
    goal,
    fromBackend: true,
  };
}

// ── Local fallback NBA (no backend) ───────────────────────────────────────────

function buildLocalNBA({ vakResult, onboardingComplete, subjects, missions }) {
  if (!onboardingComplete && !vakResult) {
    return {
      emoji: "🧠",
      label: "Descúbrete primero",
      headline: "Descubre tu estilo VAK y personaliza tu experiencia con Dani",
      tab: "perfil",
      xp: 100,
      minutes: 5,
      gradient: DEFAULT_GRADIENT,
      goal: GOAL_META.practice,
      fromBackend: false,
    };
  }

  // 1. Subject declining AND at risk (grade dropping below 3.5) — highest priority
  const declining = (subjects || [])
    .filter(
      (s) =>
        s.trend?.dir === "down" &&
        s.gradeScore != null &&
        Number(s.gradeScore) < 3.5,
    )
    .sort((a, b) => Number(a.gradeScore) - Number(b.gradeScore))[0];

  if (declining) {
    return {
      challengeId: PRACTICE_META[declining.id]?.challengeId || null,
      emoji: "🚨",
      label: declining.name,
      headline: `${declining.name} bajó a ${Number(declining.gradeScore).toFixed(1)} y sigue cayendo. Un reto de 10 min hoy puede cambiar eso.`,
      tab: "retos",
      xp: 80,
      minutes: 10,
      gradient: "linear-gradient(135deg, #EF4444 0%, #FB8500 100%)",
      goal: { label: "Recuperación urgente", emoji: "🆘" },
      fromBackend: false,
    };
  }

  // 2. Subject with low progress (original logic)
  const worst = (subjects || [])
    .map((s) => ({ ...s, progress: Number(s.progress) || 0 }))
    .filter((s) => s.progress < 30)
    .sort((a, b) => a.progress - b.progress)[0];

  if (worst) {
    const meta = SUBJECT_META[worst.id] || {
      emoji: worst.icon || "📚",
      color: "#FB8500",
    };
    return {
      emoji: meta.emoji,
      label: worst.name,
      headline: `Tu progreso en ${worst.name} está en ${worst.progress}%. Practicar hoy tiene el mayor impacto.`,
      tab: "retos",
      xp: 60,
      minutes: 10,
      gradient: gradientForColor(meta.color),
      goal: GOAL_META.recovery,
      fromBackend: false,
    };
  }

  const firstMission = (missions || []).find((m) => m && !m.completed);
  if (firstMission) {
    return {
      emoji: firstMission.icon || "🎯",
      label: firstMission.title,
      headline: firstMission.description || "Completa esta misión y gana XP",
      tab: "misiones",
      xp: firstMission.xp || 50,
      minutes: 10,
      gradient:
        "linear-gradient(135deg, #EF476F 0%, #FF6B9D 55%, #FF8FA3 100%)",
      goal: GOAL_META.practice,
      fromBackend: false,
    };
  }

  return {
    emoji: "⚡",
    label: "Practica hoy",
    headline: "Gira la ruleta de Retos y pon a prueba lo que sabes.",
    tab: "retos",
    xp: 30,
    minutes: 5,
    gradient: DEFAULT_GRADIENT,
    goal: GOAL_META.practice,
    fromBackend: false,
  };
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

const NBALoading = () => (
  <div className="w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#7B2FF7] to-[#C77DFF] p-6 animate-pulse">
    <div className="h-3 w-28 bg-white/20 rounded-full mb-4" />
    <div className="h-8 w-48 bg-white/25 rounded-xl mb-3" />
    <div className="h-4 w-72 bg-white/15 rounded-full mb-2" />
    <div className="h-4 w-56 bg-white/15 rounded-full mb-6" />
    <div className="h-12 w-full bg-white/20 rounded-2xl" />
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────

const NextBestAction = memo(({ onTabChange }) => {
  const {
    vakResult,
    onboardingComplete,
    subjects,
    subjectsWithGrades,
    missions,
    supabaseQueries,
  } = useIngenIAKids();
  const { nextAction, loading, fetchNextAction } = useAdaptiveEngine();
  const graphActive = isFeatureEnabled("learning_graph");

  // Auto-fetch from backend when learning_graph is enabled and studentId available
  const studentDbId = supabaseQueries?.studentData?.data?.id ?? null;
  useEffect(() => {
    if (graphActive && studentDbId) {
      fetchNextAction(studentDbId);
    }
  }, [graphActive, studentDbId, fetchNextAction]);

  const list = subjectsWithGrades?.length ? subjectsWithGrades : subjects;

  const display = useMemo(() => {
    // 1. Backend data (preferred when learning_graph is active)
    if (graphActive && nextAction) return backendToDisplay(nextAction);

    // 2. Local learning graph
    const opts = { subjects: list, missions, vakResult, onboardingComplete };
    if (graphActive) {
      const rec = getLearningGraphRecommendation(opts);
      if (rec) {
        return {
          emoji: rec.emoji,
          label: rec.label,
          headline: rec.sub,
          tab: rec.tab,
          xp: rec.xp,
          minutes: 10,
          gradient: rec.gradient,
          goal: rec.eyebrow
            ? { label: rec.eyebrow, emoji: "" }
            : GOAL_META.practice,
          fromBackend: false,
          pedagogicReason: rec.pedagogicReason,
        };
      }
    }

    // 3. Simple local fallback
    return buildLocalNBA(opts);
  }, [graphActive, nextAction, list, missions, vakResult, onboardingComplete]);

  // Show skeleton while fetching backend for the first time
  if (graphActive && studentDbId && loading && !nextAction)
    return <NBALoading />;

  const {
    emoji,
    label,
    headline,
    tab,
    xp,
    minutes,
    gradient,
    goal,
    fromBackend,
    pedagogicReason,
    challengeId,
  } = display;

  const start = () => {
    if (challengeId) {
      setHandoff(HANDOFF_CHALLENGE_SUBJECT, challengeId);
      setHandoff(HANDOFF_CHALLENGE_DIFFICULTY, "medium");
      setHandoff(HANDOFF_CHALLENGE_AUTOSTART, "1");
    }
    onTabChange?.(tab);
  };

  // Extract the dominant color from the gradient for accents
  const accentColor = gradient.match(/#[0-9A-Fa-f]{6}/)?.[0] || "#7B2FF7";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100"
    >
      {/* Color strip — subject identity at a glance */}
      <div className="h-1.5 w-full" style={{ background: gradient }} />

      <div className="p-4 sm:p-5">
        {/* Header: icon + title + badge */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
            style={{ background: `${accentColor}22` }}
          >
            {emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                Tu siguiente actividad
              </span>
              {fromBackend && (
                <span
                  className="flex items-center gap-0.5 text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full"
                  style={{ background: accentColor }}
                >
                  <GitBranch className="w-2 h-2" />
                  Adaptado
                </span>
              )}
              {loading && (
                <Loader2 className="w-3 h-3 text-gray-300 animate-spin" />
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-base font-black text-gray-900 leading-tight">
                {label}
              </span>
              <span
                className="text-[9px] font-black px-2 py-0.5 rounded-full text-white flex-shrink-0"
                style={{ background: accentColor }}
              >
                {goal.emoji ? `${goal.emoji} ` : ""}
                {goal.label}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-snug line-clamp-2 mb-1">
          {headline}
        </p>
        {pedagogicReason && (
          <div
            className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full mb-3"
            style={{ background: `${accentColor}18`, color: accentColor }}
          >
            <GitBranch className="w-2.5 h-2.5" />
            {pedagogicReason}
          </div>
        )}

        {/* CTA */}
        <button
          type="button"
          onClick={start}
          className="mt-2 w-full flex items-center justify-between text-white rounded-xl px-4 py-3 transition-all active:scale-[0.98] shadow-sm"
          style={{ background: gradient }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-black">¡Empezar ahora!</span>
            <span className="text-[10px] text-white/70">⏱ ~{minutes} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-black bg-white/25 px-2 py-0.5 rounded-full">
              +{xp} XP
            </span>
            <ChevronRight className="w-4 h-4 text-white/80" strokeWidth={2.5} />
          </div>
        </button>
      </div>
    </motion.div>
  );
});

NextBestAction.displayName = "NextBestAction";
export default NextBestAction;
