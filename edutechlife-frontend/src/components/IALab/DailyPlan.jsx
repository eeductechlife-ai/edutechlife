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

function selectTopItems(activeChallenges, recsHigh, recsMedium, max = 3) {
  const items = [];
  const sortedDCs = [...activeChallenges].sort((a, b) =>
    a.id === "dc-1" ? -1 : b.id === "dc-1" ? 1 : 0,
  );
  if (sortedDCs.length > 0) items.push({ ...sortedDCs[0], type: "challenge" });
  if (items.length < max && recsHigh.length > 0)
    items.push({ ...recsHigh[0], type: "recommendation" });
  if (items.length < max && recsHigh.length > 1)
    items.push({ ...recsHigh[1], type: "recommendation" });
  else if (items.length < max && recsMedium.length > 0)
    items.push({ ...recsMedium[0], type: "recommendation" });
  return items;
}

const DailyPlan = ({ onAction, isLoading, activeMod }) => {
  const { t } = useTranslation();
  const setActiveModAction = useIALabStore((s) => s.setActiveMod);
  const setVisitedModules = useIALabStore((s) => s.setVisitedModules);
  const addXp = useIALabStore((s) => s.addXp);
  const streak = useIALabStore((s) => s.streak);
  const isStreakAtRisk = useIALabStore((s) => s.isStreakAtRisk);
  const moduleProgress = useIALabStore((s) => s.moduleProgress);
  const personalizedRecs = usePersonalizedRecommendations();

  // El módulo activo ya muestra su propio banner "¡Contenido completado! /
  // Ya puedes tomar tu reto" cuando solo falta el examen o desafío — evita
  // repetir ese mismo mensaje aquí como recomendación.
  const activeModuleBannerShown =
    !!moduleProgress[activeMod]?.resourcesCompleted &&
    !moduleProgress[activeMod]?.exam;

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
    // Suprime recomendaciones de examen cuando el CTA de reto ocupa el paso #1
    const dropsDuplicateBanner = (r) =>
      !(
        activeModuleBannerShown &&
        (
          (r.moduleId === activeMod && (r.type === "module_score" || r.type === "exam")) ||
          r.type === "exams"
        )
      );
    // CTA de reto ocupa el slot #1 → solo 2 pasos regulares para llegar a 3 en total
    const max = activeModuleBannerShown ? 2 : 3;
    return selectTopItems(
      activeChallenges,
      personalizedRecs.high.filter(dropsDuplicateBanner),
      personalizedRecs.medium.filter(dropsDuplicateBanner),
      max,
    );
  }, [completed, personalizedRecs, activeModuleBannerShown, activeMod]);

  const pendingCount = (activeModuleBannerShown ? 1 : 0) + topItems.length;
  const firstItemTitle = activeModuleBannerShown
    ? t("ialab.exam_ready_title") || "¡Reto del módulo listo!"
    : topItems[0]?.type === "challenge"
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

                {activeModuleBannerShown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border border-amber-200/60 dark:border-amber-700/30 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl"
                    data-testid="daily-plan-step"
                  >
                    <div className="p-3.5 flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-[10px] font-bold">
                          1
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <Icon name="fa-star" className="text-sm text-amber-500" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-[14px] font-semibold theme-text leading-snug">
                            {t("ialab.exam_ready_title") || "¡Reto del módulo listo!"}
                          </h4>
                          <button
                            type="button"
                            onClick={() => onAction?.("OPEN_EVALUATION")}
                            className="flex-shrink-0 text-[12px] font-medium text-white bg-amber-500 px-2.5 py-1.5 min-h-[36px] rounded-lg hover:opacity-90 active:scale-95 transition-all whitespace-nowrap flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40"
                          >
                            <Icon name="fa-arrow-right" className="text-[9px]" />
                            {t("ialab.exam_ready_cta") || "Ir al reto →"}
                          </button>
                        </div>
                        <p className="text-[12px] theme-text-muted leading-relaxed">
                          {t("ialab.exam_ready_desc") || "Ya puedes tomar tu reto del módulo"}
                        </p>
                        <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">
                          <Icon name="fa-bolt" className="text-[9px]" />
                          {t("ialab.daily_plan.urgency_today") || "Prioritario hoy"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {topItems.map((item, i) => (
                  <DailyPlanStep
                    key={item.id}
                    t={t}
                    item={item}
                    index={activeModuleBannerShown ? i + 1 : i}
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
