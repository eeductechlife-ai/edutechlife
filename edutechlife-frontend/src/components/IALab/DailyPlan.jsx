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
import DailyPlanHeader from "./dailyPlan/DailyPlanHeader";
import DailyPlanStep from "./dailyPlan/DailyPlanStep";

const getTodayKey = () => new Date().toISOString().split("T")[0];

const PLAN_SEEN_KEY = "ialab_daily_plan_seen";
const hadSeenPlanToday = () => {
  try {
    return localStorage.getItem(PLAN_SEEN_KEY) === getTodayKey();
  } catch {
    return false;
  }
};
const markPlanSeenToday = () => {
  try {
    localStorage.setItem(PLAN_SEEN_KEY, getTodayKey());
  } catch {}
};

const loadCompletion = () => {
  try {
    const raw = localStorage.getItem(CHALLENGES_STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    if (data.date === getTodayKey()) return data.completed || {};
  } catch {}
  return {};
};

function selectTopItems(activeChallenges, recsHigh, recsMedium) {
  const items = [];
  const sortedDCs = [...activeChallenges].sort((a, b) =>
    a.id === "dc-1" ? -1 : b.id === "dc-1" ? 1 : 0,
  );
  if (sortedDCs.length > 0) items.push({ ...sortedDCs[0], type: "challenge" });
  if (items.length < 3 && recsHigh.length > 0)
    items.push({ ...recsHigh[0], type: "recommendation" });
  if (items.length < 3 && recsHigh.length > 1)
    items.push({ ...recsHigh[1], type: "recommendation" });
  else if (items.length < 3 && recsMedium.length > 0)
    items.push({ ...recsMedium[0], type: "recommendation" });
  return items;
}

const DailyPlan = ({ onAction, isLoading }) => {
  const { t } = useTranslation();
  const setActiveModAction = useIALabStore((s) => s.setActiveMod);
  const setVisitedModules = useIALabStore((s) => s.setVisitedModules);
  const addXp = useIALabStore((s) => s.addXp);
  const streak = useIALabStore((s) => s.streak);
  const isStreakAtRisk = useIALabStore((s) => s.isStreakAtRisk);
  const personalizedRecs = usePersonalizedRecommendations();

  const atRisk = streak > 0 && isStreakAtRisk();

  const [completed, setCompleted] = useState(loadCompletion);
  const [isOpen, setIsOpen] = useState(() => {
    const seen = hadSeenPlanToday();
    if (!seen) markPlanSeenToday();
    return !seen;
  });
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

  const handleAction = useCallback(
    (rec) => {
      if (rec.type === "exams" || rec.type === "exam") {
        onAction?.("OPEN_EVALUATION");
      } else if (rec.type === "challenges" || rec.type === "challenge") {
        onAction?.("OPEN_CHALLENGE");
      } else if (rec.action?.moduleId) {
        setActiveModAction(rec.action.moduleId);
        setVisitedModules((prev) => [
          ...new Set([...prev, rec.action.moduleId]),
        ]);
        window.dispatchEvent(
          new CustomEvent("ialab:switchTab", { detail: "contenido" }),
        );
      }
    },
    [onAction, setActiveModAction, setVisitedModules],
  );

  const topItems = useMemo(() => {
    const activeChallenges = DAILY_CHALLENGES.filter((c) => !completed[c.id]);
    return selectTopItems(
      activeChallenges,
      personalizedRecs.high,
      personalizedRecs.medium,
    );
  }, [completed, personalizedRecs]);

  const pendingCount = topItems.length;
  const firstItemTitle =
    topItems[0]?.type === "challenge"
      ? t(topItems[0]?.titleKey)
      : topItems[0]?.title;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div data-testid="daily-plan" className="flex flex-col gap-2">
      <DailyPlanHeader
        t={t}
        isOpen={isOpen}
        onToggle={toggleOpen}
        atRisk={atRisk}
        pendingCount={pendingCount}
        firstItemTitle={firstItemTitle}
      />

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {topItems.length === 0 ? (
              <div className="flex flex-col items-center py-6 px-4 text-center theme-surface theme-border border rounded-xl">
                <div className="w-10 h-10 rounded-xl theme-chip flex items-center justify-center mb-3">
                  <Icon
                    name="fa-check-circle"
                    className="text-emerald-500 text-lg"
                  />
                </div>
                <p className="text-[15px] font-medium theme-text">
                  {t("ialab.daily_plan.empty_title")}
                </p>
                <p className="text-[13px] theme-text-muted mt-1 max-w-xs">
                  {t("ialab.daily_plan.empty_desc")}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between px-1 py-1">
                  <span className="text-[11px] font-semibold theme-text-muted uppercase tracking-wider">
                    {t("ialab.daily_plan.complete_today")}
                    <span className="ml-1 text-[var(--theme-emphasis)] font-bold">
                      ({pendingCount})
                    </span>
                  </span>
                </div>

                {topItems.map((item, i) => (
                  <DailyPlanStep
                    key={item.id}
                    t={t}
                    item={item}
                    index={i}
                    onComplete={completeChallenge}
                    onAction={handleAction}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(DailyPlan);
