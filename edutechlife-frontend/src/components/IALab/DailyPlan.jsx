import { useState, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIALabStore } from "../../store/ialabStore";
import { Icon } from "../../utils/iconMapping.jsx";
import usePersonalizedRecommendations from "../../hooks/IALab/usePersonalizedRecommendations";
import { useTranslation } from "../../i18n/I18nProvider";
import {
  DAILY_CHALLENGES,
  CHALLENGES_STORAGE_KEY,
} from "./constants/dailyChallenges";
import { buildDailyPlan } from "./dailyPlan/buildDailyPlan";
import DailyPlanHeader from "./dailyPlan/DailyPlanHeader";
import DailyPlanStep from "./dailyPlan/DailyPlanStep";

const getTodayKey = () => new Date().toISOString().split("T")[0];

const loadCompletion = () => {
  try {
    const raw = localStorage.getItem(CHALLENGES_STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    if (data.date === getTodayKey()) return data.completed || {};
  } catch {}
  return {};
};

/**
 * Sección ÚNICA "Siguiente paso + Plan del día" (opción C).
 * Un solo botón ejecuta el paso actual; el plan se muestra abajo en modo
 * lectura (colapsado por defecto).
 */
const DailyPlan = ({
  onAction,
  onGoContent,
  isLoading,
  activeMod,
  currentLessonTitle,
}) => {
  const { t } = useTranslation();
  const setActiveModAction = useIALabStore((s) => s.setActiveMod);
  const setVisitedModules = useIALabStore((s) => s.setVisitedModules);
  const addXp = useIALabStore((s) => s.addXp);
  const streak = useIALabStore((s) => s.streak);
  const isStreakAtRisk = useIALabStore((s) => s.isStreakAtRisk);
  const moduleProgress = useIALabStore((s) => s.moduleProgress);
  const personalizedRecs = usePersonalizedRecommendations();

  const atRisk = streak > 0 && isStreakAtRisk();
  const [completed, setCompleted] = useState(loadCompletion);
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => setIsOpen((v) => !v), []);

  const completeChallenge = useCallback(
    (id, xp) => {
      if (completed[id]) return;
      const next = { ...completed, [id]: true };
      setCompleted(next);
      if (xp) addXp(xp);
      try {
        localStorage.setItem(
          CHALLENGES_STORAGE_KEY,
          JSON.stringify({ date: getTodayKey(), completed: next }),
        );
      } catch {}
    },
    [completed, addXp],
  );

  const plan = useMemo(
    () =>
      buildDailyPlan({
        activeMod,
        moduleProgress,
        recs: personalizedRecs,
        atRisk,
        currentLessonTitle,
        completedChallenges: completed,
        dailyChallenges: DAILY_CHALLENGES,
      }),
    [
      activeMod,
      moduleProgress,
      personalizedRecs,
      atRisk,
      currentLessonTitle,
      completed,
    ],
  );

  const { steps, current, currentIndex, total } = plan;

  const goToModule = useCallback(
    (moduleId) => {
      if (!moduleId || moduleId === activeMod) {
        onGoContent?.();
        return;
      }
      setActiveModAction(moduleId);
      setVisitedModules((prev) => [...new Set([...prev, moduleId])]);
      onGoContent?.();
    },
    [activeMod, onGoContent, setActiveModAction, setVisitedModules],
  );

  const runCurrent = useCallback(() => {
    if (!current) return;
    switch (current.type) {
      case "challenge":
        completeChallenge(current.id, current.xp);
        break;
      case "exam":
        onAction?.("OPEN_EVALUATION");
        break;
      case "recommendation":
        if (
          current.recType === "exams" ||
          current.recType === "exam" ||
          current.recType === "challenges" ||
          current.recType === "challenge"
        ) {
          onAction?.(
            current.recType.startsWith("exam")
              ? "OPEN_EVALUATION"
              : "OPEN_CHALLENGE",
          );
        } else {
          goToModule(current.moduleId);
        }
        break;
      case "streak":
      case "content":
      default:
        onGoContent?.();
    }
  }, [current, completeChallenge, onAction, goToModule, onGoContent]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!current) return null;

  return (
    <div
      data-testid="daily-plan"
      className={`flex flex-col rounded-2xl border overflow-hidden ${
        atRisk ? "border-amber-300/60 dark:border-amber-500/40" : "theme-border"
      }`}
    >
      <DailyPlanHeader
        t={t}
        step={current}
        currentIndex={currentIndex}
        total={total}
        atRisk={atRisk}
        onRun={runCurrent}
      />

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={toggleOpen}
            aria-expanded={isOpen}
            data-testid="daily-plan-toggle"
            className="w-full px-4 py-2 flex items-center justify-between border-t theme-border text-[11px] font-semibold uppercase tracking-wider theme-text-muted hover:theme-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-emphasis)]/30"
          >
            <span>
              {t("ialab.daily_plan.view_plan", { count: total }) ||
                `Ver plan (${total})`}
            </span>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Icon name="fa-chevron-down" className="w-3 h-3" />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden bg-white/40 dark:bg-slate-800/40"
              >
                <div className="flex flex-col gap-1.5 p-3">
                  {steps.map((step, i) => (
                    <DailyPlanStep
                      key={step.id}
                      t={t}
                      step={step}
                      index={i + 1}
                      isCurrent={i === currentIndex}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default memo(DailyPlan);
