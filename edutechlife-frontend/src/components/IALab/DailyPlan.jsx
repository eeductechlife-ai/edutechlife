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

const DailyPlan = ({ onAction, isLoading, activeMod = 1 }) => {
  const { t } = useTranslation();
  const setActiveModAction = useIALabStore((s) => s.setActiveMod);
  const setVisitedModules = useIALabStore((s) => s.setVisitedModules);
  const addXp = useIALabStore((s) => s.addXp);
  const courseProgress = useIALabStore((s) => s.courseProgress);
  const streak = useIALabStore((s) => s.streak);
  const isStreakAtRisk = useIALabStore((s) => s.isStreakAtRisk);
  const personalizedRecs = usePersonalizedRecommendations();

  const atRisk = streak > 0 && isStreakAtRisk();
  const isNLM = activeMod === 4;
  const nlmFont = { fontFamily: "'Google Sans Text','Roboto','Inter',sans-serif" };

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
      {isNLM ? (
        <button
          onClick={toggleOpen}
          className="relative w-full overflow-hidden font-medium py-3 px-4 rounded-xl border transition-all duration-200 flex items-center gap-3 focus:outline-none"
          style={{
            background: isOpen ? "#f8f9ff" : "#ffffff",
            borderColor: atRisk ? "#f9ab00" : isOpen ? "#c5d0f0" : "#e0e0e6",
          }}
          aria-expanded={isOpen}
        >
          <div className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: atRisk ? "#fff8e1" : "#e8f0fe" }}>
            <Icon name={atRisk ? "fa-fire" : "fa-lightbulb"}
              style={{ color: atRisk ? "#f9ab00" : "#1a73e8", fontSize: 15 }} />
            {atRisk && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white animate-ping" />
            )}
          </div>
          <div className="flex-1 text-left min-w-0">
            <span style={{ ...nlmFont, fontSize: 15, fontWeight: 600, color: "#202124" }} className="block leading-tight">
              {t("ialab.daily_plan.title")}
            </span>
            {atRisk ? (
              <span style={{ ...nlmFont, fontSize: 11, fontWeight: 600, color: "#f9ab00" }} className="block leading-tight">
                {t("ialab.streak_risk_title") || "¡Tu racha está en riesgo! Actúa ahora"}
              </span>
            ) : !isOpen && pendingCount > 0 && firstItemTitle ? (
              <span style={{ ...nlmFont, fontSize: 11, color: "#5f6368" }} className="block leading-tight truncate">
                <span style={{ fontWeight: 600 }}>{pendingCount} {pendingCount === 1 ? "paso" : "pasos"}</span>
                {" · "}{firstItemTitle}
              </span>
            ) : isOpen ? (
              <span style={{ ...nlmFont, fontSize: 11, color: "#5f6368" }} className="block leading-tight">
                {pendingCount > 0
                  ? `${pendingCount} ${pendingCount === 1 ? "paso pendiente" : "pasos pendientes"}`
                  : "¡Todo al día!"}
              </span>
            ) : null}
          </div>
          <span className="flex items-center gap-2 flex-shrink-0">
            {pendingCount > 0 && (
              <span style={{ ...nlmFont, fontSize: 11, fontWeight: 700, background: atRisk ? "#fff8e1" : "#e8f0fe", color: atRisk ? "#f9ab00" : "#1a73e8" }}
                className="px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {pendingCount}
              </span>
            )}
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <Icon name="fa-chevron-down" style={{ color: "#9aa0a6", fontSize: 12 }} />
            </motion.div>
          </span>
        </button>
      ) : (
        <button
          onClick={toggleOpen}
          className={`relative w-full overflow-hidden theme-surface font-medium py-3 px-4 rounded-xl border transition-all duration-200 flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-current/30 ${
            atRisk
              ? "border-amber-300/60 dark:border-amber-500/40 bg-amber-50/60 dark:bg-amber-900/10"
              : "theme-border theme-rail-hover"
          }`}
          aria-expanded={isOpen}
        >
          {atRisk && (
            <div className="absolute inset-0 rounded-xl ring-1 ring-amber-400/50 pointer-events-none" />
          )}
          <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
            atRisk ? "bg-amber-100 dark:bg-amber-900/30" : "theme-chip"
          }`}>
            <Icon name={atRisk ? "fa-fire" : "fa-lightbulb"}
              className={`w-4 h-4 ${atRisk ? "text-amber-500" : "text-[var(--theme-emphasis)]"}`} />
            {atRisk && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white dark:border-slate-800 animate-ping" />
            )}
          </div>
          <div className="flex-1 text-left min-w-0">
            <span className="text-[15px] font-medium theme-text block leading-tight">
              {t("ialab.daily_plan.title")}
            </span>
            {atRisk ? (
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 leading-tight block">
                {t("ialab.streak_risk_title") || "¡Tu racha está en riesgo! Actúa ahora"}
              </span>
            ) : !isOpen && pendingCount > 0 && firstItemTitle ? (
              <span className="text-[11px] theme-text-muted leading-tight block truncate">
                <span className="font-semibold">{pendingCount} {pendingCount === 1 ? "paso" : "pasos"}</span>
                {" · "}{firstItemTitle}
              </span>
            ) : isOpen ? (
              <span className="text-[11px] theme-text-muted leading-tight block">
                {pendingCount > 0
                  ? `${pendingCount} ${pendingCount === 1 ? "paso pendiente" : "pasos pendientes"}`
                  : "¡Todo al día!"}
              </span>
            ) : null}
          </div>
          <span className="flex items-center gap-2 flex-shrink-0">
            {pendingCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold min-w-[20px] text-center ${
                atRisk
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                  : "theme-chip text-[var(--theme-emphasis)]"
              }`}>
                {pendingCount}
              </span>
            )}
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <Icon name="fa-chevron-down" className="w-3 h-3 theme-text-muted" />
            </motion.div>
          </span>
        </button>
      )}

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
              isNLM ? (
                <div className="flex flex-col items-center py-8 px-4 text-center rounded-xl border bg-white" style={{ borderColor: "#e0e0e6" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "#e6f4ea" }}>
                    <Icon name="fa-check-circle" style={{ color: "#188038", fontSize: 18 }} />
                  </div>
                  <p style={{ ...nlmFont, fontSize: 15, fontWeight: 600, color: "#202124" }}>
                    {t("ialab.daily_plan.empty_title")}
                  </p>
                  <p style={{ ...nlmFont, fontSize: 13, color: "#5f6368", marginTop: 4, maxWidth: 280 }}>
                    {t("ialab.daily_plan.empty_desc")}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 px-4 text-center theme-surface theme-border border rounded-xl">
                  <div className="w-10 h-10 rounded-xl theme-chip flex items-center justify-center mb-3">
                    <Icon name="fa-check-circle" className="text-emerald-500 text-lg" />
                  </div>
                  <p className="text-[15px] font-medium theme-text">
                    {t("ialab.daily_plan.empty_title")}
                  </p>
                  <p className="text-[13px] theme-text-muted mt-1 max-w-xs">
                    {t("ialab.daily_plan.empty_desc")}
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col gap-1.5">
                {/* Header: pasos + progreso */}
                {isNLM ? (
                  <div className="flex items-center justify-between px-1 py-1">
                    <span style={{ ...nlmFont, fontSize: 11, fontWeight: 600, color: "#5f6368", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      Completa hoy <span style={{ color: "#1a73e8" }}>({pendingCount})</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-[2px] rounded-full overflow-hidden" style={{ background: "#f1f3f4" }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(courseProgress || 0, 100)}%`, background: "#1a73e8" }} />
                      </div>
                      <span style={{ ...nlmFont, fontSize: 11, fontWeight: 700, color: "#1a73e8" }} className="tabular-nums">
                        {Math.round(courseProgress || 0)}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-1 py-1">
                    <span className="text-[11px] font-semibold theme-text-muted uppercase tracking-wider">
                      Completa hoy
                      <span className="ml-1 text-[var(--theme-emphasis)] font-bold">({pendingCount})</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-[2px] bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--theme-emphasis)] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(courseProgress || 0, 100)}%` }} />
                      </div>
                      <span className="text-[11px] font-semibold text-[var(--theme-emphasis)] tabular-nums">
                        {Math.round(courseProgress || 0)}%
                      </span>
                    </div>
                  </div>
                )}

                {topItems.map((item, i) => {
                  const stepNum = i + 1;

                  if (item.type === "challenge") {
                    const itemXp = item.xpReward ?? item.xp;
                    return isNLM ? (
                      <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.2 }}
                        className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: "#e0e0e6" }}>
                        <div className="p-4 flex items-start gap-3">
                          <div className="flex flex-col items-center gap-1.5 flex-shrink-0 pt-0.5">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#e8f0fe", color: "#1a73e8" }}>
                              {stepNum}
                            </span>
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#fff8e1" }}>
                              <Icon name={item.icon || "fa-star"} style={{ color: "#f9ab00", fontSize: 13 }} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 style={{ ...nlmFont, fontSize: 14, fontWeight: 600, color: "#202124" }} className="leading-snug">{t(item.titleKey)}</h4>
                              <button onClick={() => completeChallenge(item.id, itemXp)}
                                style={{ ...nlmFont, fontSize: 12, fontWeight: 600, background: "#e6f4ea", color: "#188038" }}
                                className="flex-shrink-0 px-2.5 py-1.5 rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-1">
                                <Icon name="fa-check" style={{ fontSize: 9 }} />
                                {t("ialab.daily_plan.done_btn") || "Hecho"}
                              </button>
                            </div>
                            <p style={{ ...nlmFont, fontSize: 12, color: "#5f6368", lineHeight: 1.6 }}>{t(item.descriptionKey)}</p>
                            {itemXp > 0 && (
                              <span style={{ ...nlmFont, fontSize: 11, fontWeight: 600, color: "#f9ab00", background: "#fff8e1" }} className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md">
                                <Icon name="fa-star" style={{ fontSize: 9, color: "#f9ab00" }} />+{itemXp} XP
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.2 }}
                        className="theme-surface theme-border border rounded-xl transition-all duration-200">
                        <div className="p-3.5 flex items-start gap-3">
                          <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                            <span className="w-5 h-5 rounded-full theme-bg-emphasis flex items-center justify-center text-white text-[10px] font-bold">{stepNum}</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                              <Icon name={item.icon || "fa-star"} className="text-amber-500 text-sm" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-[14px] font-medium theme-text leading-snug">{t(item.titleKey)}</h4>
                              <button onClick={() => completeChallenge(item.id, itemXp)}
                                className="flex-shrink-0 text-[12px] font-medium text-white theme-bg-emphasis px-2.5 py-1.5 rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-1">
                                <Icon name="fa-check" className="text-[9px]" />
                                {t("ialab.daily_plan.done_btn") || "Hecho"}
                              </button>
                            </div>
                            <p className="text-[12px] theme-text-muted leading-relaxed">{t(item.descriptionKey)}</p>
                            {itemXp > 0 && (
                              <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-400 theme-chip px-2 py-0.5 rounded-md">
                                <Icon name="fa-star" className="text-[9px] text-amber-500" />+{itemXp} XP
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  // Recomendación personalizada
                  const urgency = item.urgency || "low";
                  const urgencyIconColor =
                    urgency === "high"
                      ? "text-[var(--theme-emphasis)]"
                      : urgency === "medium"
                        ? "text-[var(--theme-primary)]"
                        : "theme-text-muted";

                  const NLM_URGENCY = {
                    high:   { bg: "#fce8e6", color: "#d93025", label: t("ialab.daily_plan.urgency_today") || "Prioritario hoy" },
                    medium: { bg: "#e8f0fe", color: "#1a73e8", label: t("ialab.daily_plan.urgency_soon") || "Recomendado" },
                    low:    { bg: "#f1f3f4", color: "#5f6368", label: t("ialab.daily_plan.urgency_optional") || "Cuando puedas" },
                  };
                  const nlmU = NLM_URGENCY[urgency];

                  return isNLM ? (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.2 }}
                      className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: "#e0e0e6" }}>
                      <div className="p-4 flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 pt-0.5">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#e8f0fe", color: "#1a73e8" }}>
                            {stepNum}
                          </span>
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: nlmU.bg }}>
                            <Icon name={item.icon || URGENCY_ICON[urgency]} style={{ color: nlmU.color, fontSize: 13 }} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 style={{ ...nlmFont, fontSize: 14, fontWeight: 600, color: "#202124" }} className="leading-snug">{item.title}</h4>
                            {item.action && (
                              <button onClick={() => handleAction(item.rec || item)}
                                style={{ ...nlmFont, fontSize: 12, fontWeight: 600, background: "#e8f0fe", color: "#1a73e8" }}
                                className="flex-shrink-0 px-2.5 py-1.5 rounded-lg hover:opacity-90 active:scale-95 transition-all whitespace-nowrap flex items-center gap-1">
                                {item.action.label}
                                <Icon name="fa-arrow-right" style={{ fontSize: 9 }} />
                              </button>
                            )}
                          </div>
                          <p style={{ ...nlmFont, fontSize: 12, color: "#5f6368", lineHeight: 1.6 }}>{item.description || item.text}</p>
                          <span style={{ ...nlmFont, fontSize: 10, fontWeight: 600, background: nlmU.bg, color: nlmU.color }} className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md">
                            <Icon name={URGENCY_ICON[urgency]} style={{ fontSize: 9 }} />
                            {nlmU.label}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.2 }}
                      className="theme-surface theme-border border rounded-xl transition-all duration-200">
                      <div className="p-3.5 flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                          <span className="w-5 h-5 rounded-full theme-bg-emphasis flex items-center justify-center text-white text-[10px] font-bold">{stepNum}</span>
                          <div className="w-8 h-8 rounded-lg theme-chip flex items-center justify-center">
                            <Icon name={item.icon || URGENCY_ICON[urgency]} className={`text-sm ${urgencyIconColor}`} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-[14px] font-medium theme-text leading-snug">{item.title}</h4>
                            {item.action && (
                              <button onClick={() => handleAction(item.rec || item)}
                                className="flex-shrink-0 text-[12px] font-medium text-white theme-bg-emphasis px-2.5 py-1.5 rounded-lg hover:opacity-90 active:scale-95 transition-all whitespace-nowrap flex items-center gap-1">
                                {item.action.label}
                                <Icon name="fa-arrow-right" className="text-[9px]" />
                              </button>
                            )}
                          </div>
                          <p className="text-[12px] theme-text-muted leading-relaxed">{item.description || item.text}</p>
                          <span className={`inline-flex items-center gap-1 mt-1.5 text-[10px] font-medium theme-chip px-2 py-0.5 rounded-md ${urgencyIconColor}`}>
                            <Icon name={URGENCY_ICON[urgency]} className="text-[9px]" />
                            {urgency === "high"
                              ? t("ialab.daily_plan.urgency_today") || "Prioritario hoy"
                              : urgency === "medium"
                                ? t("ialab.daily_plan.urgency_soon") || "Recomendado"
                                : t("ialab.daily_plan.urgency_optional") || "Cuando puedas"}
                          </span>
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
