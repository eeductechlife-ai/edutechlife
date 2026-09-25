import { memo, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";
import { usePracticeLog } from "../practicarHub/practicarProgress";
import { WEEKLY_GOAL } from "../practicarHub/WeekProgress";
import { getMasteryState } from "../components/SubjectsView";
import { REWARDS } from "../ingenIAProgress/gamificationData";
import SkillPassport from "../SkillPassport";
import GradeGoalCard from "./GradeGoalCard";

const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

function Tile({ title, onClick, children, dm, accent }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`text-left rounded-2xl border p-3 flex flex-col gap-2 min-h-[132px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FB8500] ${
        dm
          ? "bg-[#1A2744] border-[#243152] text-white"
          : "bg-white border-[#EEF2F6] text-[#1E293B]"
      }`}
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
    >
      <span className="flex items-center justify-between gap-1">
        <span
          className="text-[11px] font-black uppercase tracking-wide"
          style={{ color: accent }}
        >
          {title}
        </span>
        <ChevronRight
          className="w-4 h-4 opacity-40 shrink-0"
          aria-hidden="true"
        />
      </span>
      {children}
    </motion.button>
  );
}

const ProgressSummary = memo(function ProgressSummary({
  onTabChange,
  onShowRewards,
}) {
  const {
    subjectsWithGrades,
    subjects,
    totalPoints,
    darkMode: dm,
  } = useIngenIAKids();
  const practice = usePracticeLog();
  const [showSkills, setShowSkills] = useState(false);
  const todayIdx = (new Date().getDay() + 6) % 7;
  const sub = dm ? "text-[#94A3B8]" : "text-[#64748B]";

  const toReinforce = useMemo(() => {
    const list =
      (subjectsWithGrades?.length ? subjectsWithGrades : subjects) || [];
    return list
      .filter((s) => s.gradeScore != null)
      .filter((s) =>
        ["recovery", "practice"].includes(
          getMasteryState(s.progress, s.gradeScore).key,
        ),
      )
      .sort((a, b) => a.gradeScore - b.gradeScore);
  }, [subjectsWithGrades, subjects]);

  const nextReward = REWARDS.find((r) => r.cost > (totalPoints ?? 0));
  const prevCost =
    [...REWARDS].reverse().find((r) => r.cost <= (totalPoints ?? 0))?.cost ?? 0;
  const rewardPct = nextReward
    ? Math.round(
        (((totalPoints ?? 0) - prevCost) / (nextReward.cost - prevCost)) * 100,
      )
    : 100;

  return (
    <div className="space-y-2.5">
      <GradeGoalCard onTabChange={onTabChange} />
      <div className="grid grid-cols-2 gap-2.5">
        <Tile
          title="Días practicando"
          accent="#EF476F"
          dm={dm}
          onClick={() => onTabChange?.("practicar")}
        >
          <span
            className="grid grid-cols-7 gap-1 w-full"
            aria-label={`Practicaste ${practice.daysPracticed} de 7 días`}
          >
            {practice.days.map((done, i) => (
              <span key={i} className="flex flex-col items-center gap-0.5">
                <span
                  className={`block w-full h-4 rounded ${
                    done ? "" : dm ? "bg-[#243152]" : "bg-[#F1F5F9]"
                  } ${i === todayIdx && !done ? "ring-1 ring-[#EF476F]" : ""}`}
                  style={done ? { background: "#EF476F" } : {}}
                />
                <span
                  className={`text-[8px] font-bold ${i === todayIdx ? "text-[#EF476F]" : sub}`}
                >
                  {DAY_LABELS[i]}
                </span>
              </span>
            ))}
          </span>
          <span className="mt-auto">
            <span className="block text-xl font-black leading-none">
              {practice.daysPracticed}
            </span>
            <span className={`block text-[11px] ${sub}`}>
              días esta semana (meta {WEEKLY_GOAL})
            </span>
          </span>
        </Tile>

        <Tile
          title="Materias"
          accent="#118AB2"
          dm={dm}
          onClick={() => onTabChange?.("materias")}
        >
          {toReinforce.length ? (
            <>
              <span className={`text-[11px] ${sub}`}>Para reforzar:</span>
              <span className="flex flex-col gap-1">
                {toReinforce.slice(0, 2).map((s) => (
                  <span
                    key={s.id}
                    className="flex items-center justify-between gap-1 text-sm font-bold"
                  >
                    <span className="truncate">
                      {s.icon} {s.name}
                    </span>
                    <span
                      className="tabular-nums"
                      style={{
                        color: getMasteryState(s.progress, s.gradeScore).color,
                      }}
                    >
                      {Number(s.gradeScore).toFixed(1)}
                    </span>
                  </span>
                ))}
              </span>
              {toReinforce.length > 2 && (
                <span className={`mt-auto text-[11px] ${sub}`}>
                  y {toReinforce.length - 2} más
                </span>
              )}
            </>
          ) : (
            <span className="mt-auto">
              <span className="block text-2xl" aria-hidden="true">
                🌟
              </span>
              <span className="block text-sm font-bold">¡Todas van bien!</span>
            </span>
          )}
        </Tile>

        <Tile
          title="Retos"
          accent="#9D4EDD"
          dm={dm}
          onClick={() => onTabChange?.("retos")}
        >
          <span className="mt-auto">
            <span className="block text-xl font-black leading-none">
              {practice.retosThisWeek}
            </span>
            <span className={`block text-[11px] ${sub}`}>
              {practice.retosThisWeek === 1
                ? "reto esta semana"
                : "retos esta semana"}
            </span>
            {practice.avgScore != null ? (
              <span className="block mt-1 text-xs font-bold text-[#9D4EDD]">
                Promedio {practice.avgScore}%
              </span>
            ) : (
              <span className="block mt-1 text-xs font-bold text-[#9D4EDD]">
                ¡Haz el primero! ▶
              </span>
            )}
          </span>
        </Tile>

        <Tile
          title="Próximo premio"
          accent="#FB8500"
          dm={dm}
          onClick={onShowRewards}
        >
          {nextReward ? (
            <span className="mt-auto">
              <span className="block text-2xl leading-none" aria-hidden="true">
                {nextReward.icon}
              </span>
              <span className="block text-sm font-bold truncate mt-1">
                {nextReward.name}
              </span>
              <span
                className={`block h-1.5 mt-1.5 rounded-full overflow-hidden ${dm ? "bg-[#243152]" : "bg-[#F1F5F9]"}`}
              >
                <span
                  className="block h-full rounded-full bg-[#FB8500]"
                  style={{ width: `${Math.max(4, rewardPct)}%` }}
                />
              </span>
              <span className={`block text-[11px] mt-1 ${sub}`}>
                Te faltan {nextReward.cost - (totalPoints ?? 0)} pts
              </span>
            </span>
          ) : (
            <span className="mt-auto text-sm font-bold">
              ¡Tienes todos los premios! 🏆
            </span>
          )}
        </Tile>
      </div>

      <button
        type="button"
        onClick={() => setShowSkills((v) => !v)}
        aria-expanded={showSkills}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-bold ${
          dm
            ? "bg-[#1A2744] border-[#243152] text-white"
            : "bg-white border-[#EEF2F6] text-[#1E293B]"
        }`}
      >
        <span>⭐ Mis habilidades del grado</span>
        <ChevronDown
          className={`w-4 h-4 opacity-50 transition-transform ${showSkills ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {showSkills && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <SkillPassport />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default ProgressSummary;
