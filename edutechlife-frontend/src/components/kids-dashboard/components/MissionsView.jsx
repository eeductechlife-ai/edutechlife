import { memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Gem, ChevronRight } from "lucide-react";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";
import { SB_GRADIENTS } from "../ingenIATheme";
import { track } from "../../../lib/analytics";
import { EVENTS } from "../../../lib/analyticsEvents";
import { readPracticeLog } from "../practicarHub/practicarProgress";
import {
  setHandoff,
  HANDOFF_CHALLENGE_SUBJECT,
  HANDOFF_PRACTICAR_SUBJECT,
} from "../practicarHub/practicarHandoff";
import { SUBJECT_META } from "../practicarHub/practicarConfig";
import { daysUntilWeeklyReset } from "../../../context/ingenIAData";

const EXPLORE_GRADIENT = SB_GRADIENTS.explore;
const openDani = () =>
  window.dispatchEvent(new CustomEvent("smartboard:open-dani"));

// A mission can only be claimed once its condition is really met; otherwise the
// button takes the student to where the mission is done.
const MISSION_RULES = {
  1: { done: (c) => !!c.vakResult, go: { tab: "vak", label: "Hacer mi ADN" } },
  2: {
    done: (c) =>
      (c.uploadedActivities?.length || 0) +
        (c.analyzedActivities?.length || 0) >
      0,
    go: { action: openDani, label: "Abrir Dani" },
  },
  3: {
    done: (c) => c.userMessages >= 5,
    go: { action: openDani, label: "Hablar con Dani" },
    progress: (c) => [c.userMessages, 5],
  },
  4: {
    done: (c) => (c.calendarEvents?.length || 0) + (c.exams?.length || 0) >= 3,
    go: { tab: "horario", label: "Ir a mi horario" },
    progress: (c) => [
      (c.calendarEvents?.length || 0) + (c.exams?.length || 0),
      3,
    ],
  },
  5: {
    done: (c) => c.totalPoints >= 500,
    go: { tab: "practicar", label: "Ganar puntos" },
    progress: (c) => [c.totalPoints, 500],
  },
  // Was a second "talk to Dani" mission (with a 10-message goal under a
  // "5 minutes" title). Practice is what moves grades, so it rewards retos.
  // `copy` overrides the title saved in students' existing mission lists.
  6: {
    copy: {
      title: "Haz 3 retos",
      description: "Practica con preguntas de tus materias",
      icon: "🎮",
    },
    done: (c) => c.retosDone >= 3,
    go: { tab: "retos", label: "Hacer un reto" },
    progress: (c) => [c.retosDone, 3],
  },
};

function weekStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

function weakestSubject(subjects) {
  return (subjects || [])
    .filter((s) => s.gradeScore != null)
    .sort((a, b) => Number(a.gradeScore) - Number(b.gradeScore))[0];
}

const practiceWeakest = (c) => {
  const weak = weakestSubject(c.subjectsWithGrades);
  if (weak) {
    setHandoff(HANDOFF_PRACTICAR_SUBJECT, weak.id);
    const challengeId = SUBJECT_META[weak.id]?.challengeId;
    if (challengeId) setHandoff(HANDOFF_CHALLENGE_SUBJECT, challengeId);
  }
};

// Weekly missions only count what happened since Monday.
const WEEKLY_RULES = {
  w_reto3: {
    done: (c) => c.week.retoSubjects >= 3,
    go: { tab: "retos", label: "Hacer un reto" },
    progress: (c) => [c.week.retoSubjects, 3],
  },
  w_streak5: {
    done: (c) => (c.streak?.current || 0) >= 5,
    go: { tab: "practicar", label: "Practicar hoy" },
    progress: (c) => [c.streak?.current || 0, 5],
  },
  w_flashcard20: {
    done: (c) => c.week.educards >= 4,
    go: { tab: "flashcards", label: "Ir a EduCards" },
    progress: (c) => [c.week.educards, 4],
    unit: "sesiones",
  },
  w_dani3: {
    done: (c) => c.userMessages >= 3,
    go: { action: openDani, label: "Preguntar a Dani" },
    progress: (c) => [c.userMessages, 3],
  },
  w_scan: {
    done: (c) => c.week.scans > 0 || (c.studentGrades?.length || 0) > 0,
    go: { tab: "calificaciones", label: "Subir mis notas" },
  },
  w_perfect: {
    done: (c) => c.week.perfect > 0,
    go: { tab: "retos", label: "Intentarlo" },
  },
  w_schedule: {
    done: (c) => (c.slots?.length || 0) + (c.calendarEvents?.length || 0) > 0,
    go: { tab: "horario", label: "Ir a mi horario" },
  },
  w_oral: {
    done: (c) => c.week.oral > 0,
    go: { tab: "oral", label: "Hablar con Dani" },
  },
  w_points300: {
    done: (c) => c.week.points >= 300,
    go: { tab: "practicar", label: "Ganar puntos" },
    progress: (c) => [c.week.points, 300],
  },
  w_vak: {
    done: (c) => !!c.vakResult,
    go: { tab: "vak", label: "Ver mi ADN" },
  },
  w_weak: {
    done: (c) => {
      const weak = weakestSubject(c.subjectsWithGrades);
      const challengeId = weak && SUBJECT_META[weak.id]?.challengeId;
      return challengeId
        ? c.week.retoChallenges.includes(challengeId)
        : c.week.retos > 0;
    },
    go: {
      tab: "retos",
      label: "Reforzar",
      before: practiceWeakest,
    },
  },
  w_mission: {
    done: (c) =>
      (c.missions || []).some((m) => m.completed && m.id !== "w_mission"),
    go: {
      action: () =>
        document
          .getElementById("main-missions")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      label: "Ver pendientes",
    },
  },
};

const ALL_RULES = { ...MISSION_RULES, ...WEEKLY_RULES };

function weekStats(pointsHistory) {
  const since = weekStart();
  const log = readPracticeLog().filter((e) => new Date(e.at) >= since);
  const retos = log.filter((e) => e.type === "reto");
  const points = (pointsHistory || [])
    .filter((e) => new Date(e.timestamp || e.created_at || 0) >= since)
    .reduce((sum, e) => sum + (Number(e.points ?? e.amount) || 0), 0);
  return {
    since: since.toISOString(),
    retos: retos.length,
    retoSubjects: new Set(retos.map((e) => e.challengeId || e.subject)).size,
    retoChallenges: retos.map((e) => e.challengeId),
    perfect: retos.filter(
      (e) => e.score === 100 && e.difficulty && e.difficulty !== "easy",
    ).length,
    educards: log.filter((e) => e.type === "educards").length,
    scans: log.filter((e) => e.type === "escaneo").length,
    oral: log.filter((e) => e.type === "oral").length,
    points,
  };
}

const AGE_COPY = {
  early: {
    ready: (n) =>
      `¡Tienes ${n} ${n === 1 ? "sorpresa lista" : "sorpresas listas"}! 🎁`,
    claim: (xp) => `🌟 ¡Reclamar ${xp} estrellas!`,
    done: (xp) => `✓ ¡Super! Ganaste ${xp} ⭐`,
    header: `{c} de {t} aventuras`,
    weekly: "⏳ Aventuras de esta semana",
    permanent: "🏅 Mis logros",
    empty: "¡Vuelve pronto para nuevas aventuras! 🚀",
    pctLabel: (c, t) => `${c} de ${t} aventuras`,
  },
  other: {
    ready: (n) =>
      `🎁 Tienes ${n} ${n === 1 ? "premio listo" : "premios listos"} para reclamar`,
    claim: (xp) => `🎁 Reclamar +${xp} puntos`,
    done: (xp) => `✓ ¡Lograda! Ganaste ${xp} puntos`,
    weekly: "⏳ Misiones de la semana",
    permanent: "🏅 Misiones de siempre",
    empty: "Aún no hay misiones. ¡Vuelve pronto! 🚀",
    pctLabel: (c, t) => `${c} de ${t} misiones logradas`,
  },
};

const MissionsView = memo(function MissionsView({
  missions,
  onCompleteMission,
  onTabChange,
}) {
  const ctx = useIngenIAKids();
  const copy =
    ctx.studentAge != null && ctx.studentAge <= 9
      ? AGE_COPY.early
      : AGE_COPY.other;
  const state = {
    ...ctx,
    userMessages: (ctx.daniChatHistory || []).filter((m) => m?.role === "user")
      .length,
    retosDone: readPracticeLog().filter((e) => e.type === "reto").length,
    week: weekStats(ctx.pointsHistory),
  };

  const completedCount = missions.filter((m) => m.completed).length;
  const total = missions.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const readyCount = missions.filter(
    (m) => !m.completed && ALL_RULES[m.id]?.done(state),
  ).length;

  // Ready-to-claim first, then pending, then completed.
  const rank = (m) => (m.completed ? 2 : ALL_RULES[m.id]?.done(state) ? 0 : 1);
  const byRank = (a, b) => rank(a) - rank(b);
  const weekly = missions.filter((m) => WEEKLY_RULES[m.id]).sort(byRank);
  const permanent = missions.filter((m) => !WEEKLY_RULES[m.id]).sort(byRank);
  const weeklyDone = weekly.filter((m) => m.completed).length;
  const resetDays = daysUntilWeeklyReset();

  const renderMission = (stored, index) => {
    const rule = ALL_RULES[stored.id];
    const mission = { ...stored, ...rule?.copy };
    const ready = !mission.completed && !!rule?.done(state);
    const [cur, goal] = rule?.progress?.(state) || [];
    const go = () => {
      track(EVENTS.MISSION_STARTED, {
        mission_id: mission.id,
        title: mission.title || "",
      });
      rule.go.before?.(state);
      if (rule.go.tab) onTabChange?.(rule.go.tab);
      else rule.go.action?.();
    };
    return (
      <motion.div
        key={mission.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
        className={`p-3 sm:p-4 rounded-2xl border-2 ${
          mission.completed
            ? "bg-green-50 border-green-200"
            : ready
              ? "bg-white border-green-400 shadow-[0_8px_24px_-14px_rgba(34,197,94,0.6)]"
              : "bg-white border-[#E2E8F0]"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
              mission.completed ? "bg-green-100 text-green-600" : "bg-[#F5F0FF]"
            }`}
            aria-hidden="true"
          >
            {mission.completed ? (
              <CheckCircle2 className="w-6 h-6" strokeWidth={2.4} />
            ) : (
              mission.icon
            )}
          </div>
          <div className="flex-1 min-w-0">
            {/* `!m-0`: global typography adds heading/paragraph margins. */}
            <h4
              className={`!m-0 text-base font-bold leading-snug ${mission.completed ? "text-green-700" : "text-[#1E293B]"}`}
            >
              {mission.title}
            </h4>
            <p className="!m-0 mt-0.5 text-xs sm:text-sm text-[#64748B] leading-snug">
              {mission.description}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1 text-sm font-black tabular-nums shrink-0 ${
              mission.completed ? "text-green-600" : "text-[#9D4EDD]"
            }`}
          >
            <Gem className="w-3.5 h-3.5" strokeWidth={2.4} aria-hidden="true" />
            +{mission.xp}
          </span>
        </div>

        {mission.completed ? (
          <p className="!m-0 mt-2.5 text-xs font-bold text-green-700">
            {copy.done(mission.xp)}
          </p>
        ) : ready ? (
          <motion.button
            type="button"
            onClick={() => onCompleteMission(mission.id)}
            whileTap={{ scale: 0.97 }}
            className="mt-3 w-full py-3 rounded-xl text-sm font-black text-white bg-green-500 shadow-md"
          >
            {copy.claim(mission.xp)}
          </motion.button>
        ) : rule ? (
          <div className="mt-2.5 flex items-center gap-3">
            {goal ? (
              <div className="flex-1 min-w-0">
                <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (cur / goal) * 100)}%`,
                      background: "#9D4EDD",
                    }}
                  />
                </div>
                <p className="!m-0 mt-1 text-[11px] font-semibold text-[#64748B] tabular-nums">
                  {Math.min(cur, goal)} de {goal}
                  {rule.unit ? ` ${rule.unit}` : ""}
                </p>
              </div>
            ) : (
              <div className="flex-1" />
            )}
            <button
              type="button"
              onClick={go}
              className="shrink-0 min-h-[40px] inline-flex items-center justify-center gap-1 px-3.5 rounded-xl text-xs font-black text-white"
              style={{ background: EXPLORE_GRADIENT }}
            >
              {rule.go.label}
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </motion.div>
    );
  };

  return (
    <div className="space-y-3">
      {total > 0 && (
        <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-black text-[#1E293B]">
              {copy.pctLabel(completedCount, total)}
            </p>
            <span className="text-sm font-black text-[#7B2FF7] tabular-nums">
              {pct}%
            </span>
          </div>
          <div className="mt-2 w-full h-2.5 rounded-full bg-[#F1F5F9] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: EXPLORE_GRADIENT }}
            />
          </div>
          {readyCount > 0 && (
            <p className="mt-2 text-xs font-bold text-green-600">
              {copy.ready(readyCount)}
            </p>
          )}
        </div>
      )}

      {weekly.length > 0 && (
        <section className="space-y-2.5" aria-labelledby="weekly-missions">
          <div className="flex items-end justify-between gap-2 px-1 pt-1">
            <h3
              id="weekly-missions"
              className="!m-0 text-sm font-black text-[#1E293B]"
            >
              {copy.weekly}{" "}
              <span className="text-[#7B2FF7] tabular-nums">
                {weeklyDone}/{weekly.length}
              </span>
            </h3>
            <span className="text-[11px] font-bold text-[#64748B] whitespace-nowrap">
              {resetDays === 1
                ? "Cambian mañana"
                : `Cambian en ${resetDays} días`}
            </span>
          </div>
          {weekly.map(renderMission)}
        </section>
      )}

      {permanent.length > 0 && (
        <section className="space-y-2.5" aria-labelledby="main-missions">
          {weekly.length > 0 && (
            <h3
              id="main-missions"
              className="!m-0 px-1 pt-2 text-sm font-black text-[#1E293B]"
            >
              {copy.permanent}
            </h3>
          )}
          {permanent.map(renderMission)}
        </section>
      )}

      {total === 0 && (
        <p className="text-center py-10 text-sm text-[#64748B]">{copy.empty}</p>
      )}
    </div>
  );
});

export default MissionsView;
