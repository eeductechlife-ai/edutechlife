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

const URGENCY_ICON = {
  high: "fa-bolt",
  medium: "fa-star",
  low: "fa-circle-info",
};

const DailyPlan = ({ onAction, isLoading }) => {
  const { t } = useTranslation();
  const setActiveModAction = useIALabStore((s) => s.setActiveMod);
  const setVisitedModules = useIALabStore((s) => s.setVisitedModules);
  const addXp = useIALabStore((s) => s.addXp);
  const courseProgress = useIALabStore((s) => s.courseProgress);
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
      {/* Header-botón */}
      <button
        onClick={toggleOpen}
        className="relative w-full overflow-hidden theme-bg-emphasis text-white font-bold py-3 px-4 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-center gap-3 group"
        aria-expanded={isOpen}
      >
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/8 transition-colors duration-300 pointer-events-none" />
        {atRisk && (
          <div className="absolute inset-0 rounded-2xl ring-2 ring-amber-400/70 animate-pulse pointer-events-none" />
        )}

        {/* Ícono */}
        <div className="relative w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
          <Icon
            name={atRisk ? "fa-fire" : "fa-lightbulb"}
            className="w-4 h-4 text-white"
          />
          {atRisk && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 theme-border-emphasis animate-ping" />
          )}
        </div>

        {/* Texto */}
        <div className="flex-1 text-left min-w-0">
          <span className="text-sm font-bold text-white drop-shadow-sm block leading-tight">
            {t("ialab.daily_plan.title")}
          </span>
          {atRisk ? (
            <span className="text-[10px] font-semibold text-amber-300 leading-tight block">
              {t("ialab.streak_risk_title") ||
                "¡Tu racha está en riesgo! Actúa ahora"}
            </span>
          ) : !isOpen && pendingCount > 0 && firstItemTitle ? (
            <span className="text-[10px] text-white/70 leading-tight block truncate">
              {t("ialab.daily_plan.start_with") || "Empieza con:"}{" "}
              <span className="font-semibold text-white/90">
                {firstItemTitle}
              </span>
              {pendingCount > 1 && (
                <span className="text-white/60">
                  {" "}
                  · +{pendingCount - 1} más
                </span>
              )}
            </span>
          ) : isOpen ? (
            <span className="text-[10px] text-white/60 leading-tight block">
              {pendingCount > 0
                ? t("ialab.daily_plan.n_tasks", { n: pendingCount }) ||
                  `${pendingCount} ${pendingCount === 1 ? "tarea pendiente" : "tareas pendientes"}`
                : t("ialab.daily_plan.all_done_short") || "¡Todo al día!"}
            </span>
          ) : null}
        </div>

        {/* Badge + chevron */}
        <span className="flex items-center gap-2 flex-shrink-0">
          {pendingCount > 0 && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${atRisk ? "bg-amber-400/30 text-amber-200" : "bg-white/20 text-white"}`}
            >
              {pendingCount}
            </span>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon name="fa-chevron-down" className="w-3 h-3 text-white/70" />
          </motion.div>
        </span>
      </button>

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
              <div className="flex flex-col items-center py-8 px-4 text-center bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/10 flex items-center justify-center mb-3 shadow-inner">
                  <Icon
                    name="fa-check-circle"
                    className="text-emerald-500 text-2xl"
                  />
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {t("ialab.daily_plan.empty_title")}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
                  {t("ialab.daily_plan.empty_desc")}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {/* Barra de progreso del curso */}
                <div className="flex items-center justify-between px-1 py-0.5">
                  <div className="flex items-center gap-1.5">
                    <Icon
                      name="fa-list-check"
                      className="text-[10px] text-[var(--theme-emphasis)]"
                    />
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      {t("ialab.daily_plan.steps_label") || "Completa hoy"}
                      <span className="ml-1 text-[var(--theme-emphasis)] font-black">
                        ({pendingCount})
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(courseProgress || 0, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-[var(--theme-emphasis)] dark:text-[#4DA8C4]">
                      {Math.round(courseProgress || 0)}%
                    </span>
                  </div>
                </div>

                {topItems.map((item, i) => {
                  const stepNum = i + 1;

                  if (item.type === "challenge") {
                    const itemXp = item.xpReward ?? item.xp;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.2 }}
                        className="group relative bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/40 hover:shadow-md transition-all duration-200 overflow-hidden"
                      >
                        {/* Barra lateral de color */}
                        <div className="absolute top-0 left-0 w-1 h-full theme-bg-emphasis" />
                        <div className="p-3.5 pl-4">
                          <div className="flex items-start gap-3">
                            {/* Ícono con número de paso */}
                            <div className="relative flex-shrink-0">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-sm">
                                <Icon
                                  name={item.icon || "fa-star"}
                                  className="text-white text-base"
                                />
                              </div>
                              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-[9px] font-bold text-slate-500 flex items-center justify-center">
                                {stepNum}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
                                  {t(item.titleKey)}
                                </h4>
                                <button
                                  onClick={() =>
                                    completeChallenge(item.id, itemXp)
                                  }
                                  className="flex-shrink-0 text-[11px] font-bold text-white theme-bg-emphasis px-2.5 py-1.5 rounded-lg hover:shadow-md active:scale-95 transition-all flex items-center gap-1"
                                >
                                  <Icon
                                    name="fa-check"
                                    className="text-[9px]"
                                  />
                                  {t("ialab.daily_plan.done_btn") || "Hecho"}
                                </button>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {t(item.descriptionKey)}
                              </p>
                              {itemXp > 0 && (
                                <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md">
                                  <Icon
                                    name="fa-star"
                                    className="text-[10px] text-amber-500"
                                  />
                                  +{itemXp} XP
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  // Recomendación personalizada
                  const urgency = item.urgency || "low";
                  const urgencyColor =
                    urgency === "high"
                      ? "bg-[var(--theme-emphasis)]/10 text-[var(--theme-emphasis)]"
                      : urgency === "medium"
                        ? "bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-500";

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.2 }}
                      className="group relative bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/40 hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      <div
                        className={`absolute top-0 left-0 w-1 h-full ${
                          urgency === "high"
                            ? "theme-bg-emphasis"
                            : urgency === "medium"
                              ? "bg-[var(--theme-primary)]"
                              : "bg-slate-300 dark:bg-slate-600"
                        }`}
                      />
                      <div className="p-3.5 pl-4">
                        <div className="flex items-start gap-3">
                          {/* Ícono con número de paso */}
                          <div className="relative flex-shrink-0">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${urgencyColor}`}
                            >
                              <Icon
                                name={item.icon || URGENCY_ICON[urgency]}
                                className="text-base"
                              />
                            </div>
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-[9px] font-bold text-slate-500 flex items-center justify-center">
                              {stepNum}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
                                {item.title}
                              </h4>
                              {item.action && (
                                <button
                                  onClick={() => handleAction(item.rec || item)}
                                  className="flex-shrink-0 text-[11px] font-bold text-white theme-bg-emphasis px-2.5 py-1.5 rounded-lg hover:shadow-md active:scale-95 transition-all whitespace-nowrap flex items-center gap-1"
                                >
                                  {item.action.label}
                                  <Icon
                                    name="fa-arrow-right"
                                    className="text-[9px]"
                                  />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              {item.description || item.text}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-md ${urgencyColor}`}
                            >
                              <Icon
                                name={URGENCY_ICON[urgency]}
                                className="text-[9px]"
                              />
                              {urgency === "high"
                                ? t("ialab.daily_plan.urgency_today") ||
                                  "Prioritario hoy"
                                : urgency === "medium"
                                  ? t("ialab.daily_plan.urgency_soon") ||
                                    "Recomendado"
                                  : t("ialab.daily_plan.urgency_optional") ||
                                    "Cuando puedas"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(DailyPlan);
