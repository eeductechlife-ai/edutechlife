import { memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Gem, ChevronRight } from "lucide-react";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";
import { SB_GRADIENTS } from "../ingenIATheme";
import { track } from "../../../lib/analytics";
import { EVENTS } from "../../../lib/analyticsEvents";

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
  6: {
    done: (c) => c.userMessages >= 10,
    go: { action: openDani, label: "Hablar con Dani" },
    progress: (c) => [c.userMessages, 10],
  },
};

const MissionsView = memo(function MissionsView({
  missions,
  onCompleteMission,
  onTabChange,
}) {
  const ctx = useIngenIAKids();
  const state = {
    ...ctx,
    userMessages: (ctx.daniChatHistory || []).filter((m) => m?.role === "user")
      .length,
  };

  const completedCount = missions.filter((m) => m.completed).length;
  const total = missions.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const readyCount = missions.filter(
    (m) => !m.completed && MISSION_RULES[m.id]?.done(state),
  ).length;

  return (
    <div className="space-y-3">
      {total > 0 && (
        <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-black text-[#1E293B]">
              {completedCount} de {total} misiones logradas
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
              🎁 Tienes {readyCount}{" "}
              {readyCount === 1 ? "premio listo" : "premios listos"} para
              reclamar
            </p>
          )}
        </div>
      )}

      {missions.map((mission, index) => {
        const rule = MISSION_RULES[mission.id];
        const ready = !mission.completed && !!rule?.done(state);
        const [cur, goal] = rule?.progress?.(state) || [];
        const go = () => {
          track(EVENTS.MISSION_STARTED, {
            mission_id: mission.id,
            title: mission.title || "",
          });
          if (rule.go.tab) onTabChange?.(rule.go.tab);
          else rule.go.action?.();
        };
        return (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className={`p-4 rounded-2xl border-2 ${
              mission.completed
                ? "bg-green-50 border-green-200"
                : ready
                  ? "bg-white border-green-400"
                  : "bg-white border-[#E2E8F0]"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                  mission.completed
                    ? "bg-green-100 text-green-600"
                    : "bg-[#F5F0FF]"
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
                <h4
                  className={`font-bold leading-snug ${mission.completed ? "text-green-700" : "text-[#1E293B]"}`}
                >
                  {mission.title}
                </h4>
                <p className="text-sm text-[#64748B] leading-snug">
                  {mission.description}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 text-sm font-black tabular-nums shrink-0 ${
                  mission.completed ? "text-green-600" : "text-[#9D4EDD]"
                }`}
              >
                <Gem
                  className="w-3.5 h-3.5"
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
                +{mission.xp}
              </span>
            </div>

            {!mission.completed && goal ? (
              <div className="mt-3">
                <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (cur / goal) * 100)}%`,
                      background: ready ? "#22C55E" : "#9D4EDD",
                    }}
                  />
                </div>
                <p className="mt-1 text-[11px] font-semibold text-[#64748B] tabular-nums">
                  {Math.min(cur, goal)} de {goal}
                </p>
              </div>
            ) : null}

            {mission.completed ? (
              <p className="mt-3 text-xs font-bold text-green-700">
                ✓ ¡Lograda! Ganaste {mission.xp} puntos
              </p>
            ) : ready ? (
              <motion.button
                type="button"
                onClick={() => onCompleteMission(mission.id)}
                whileTap={{ scale: 0.97 }}
                className="mt-3 w-full py-3 rounded-xl text-sm font-black text-white bg-green-500 shadow-md"
              >
                🎁 Reclamar +{mission.xp} puntos
              </motion.button>
            ) : rule ? (
              <button
                type="button"
                onClick={go}
                className="mt-3 w-full flex items-center justify-center gap-1 py-3 rounded-xl text-sm font-bold text-white"
                style={{ background: EXPLORE_GRADIENT }}
              >
                {rule.go.label}
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : null}
          </motion.div>
        );
      })}

      {total === 0 && (
        <p className="text-center py-10 text-sm text-[#64748B]">
          Aún no hay misiones. ¡Vuelve pronto! 🚀
        </p>
      )}
    </div>
  );
});

export default MissionsView;
