import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useIALabProgressContext,
  useIALabUIContext,
} from "../../../context/IALabContext";
import { useIALabStore } from "../../../store/ialabStore";
import { useTranslation } from "../../../i18n/I18nProvider";
import { Icon } from "../../../utils/iconMapping.jsx";
import SidebarModuleList from "./SidebarModuleList";
import CourseCompletionSection from "../CourseCompletionSection";

const SidebarExpanded = ({ onOpenStreak }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const fadeTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.15 };
  const moduleListVariants = shouldReduceMotion
    ? {}
    : {
        visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
      };
  const moduleItemVariants = shouldReduceMotion
    ? {}
    : {
        hidden: { opacity: 0, x: -8 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { type: "spring", stiffness: 300, damping: 24 },
        },
      };

  const {
    courseProgress,
    modules,
    activeMod,
    isModuleLocked,
    calculateModuleScore,
    completedModules,
  } = useIALabProgressContext();

  const {
    courseCompleted,
    setShowCertificateModal,
    storedCertificate,
    certificateGenerating,
  } = useIALabUIContext();

  const streak = useIALabStore((s) => s.streak);
  const getLevel = useIALabStore((s) => s.getLevel);
  const getTotalPoints = useIALabStore((s) => s.getTotalPoints);
  const isStreakAtRisk = useIALabStore((s) => s.isStreakAtRisk);
  const toggleSidebar = useIALabStore((s) => s.toggleSidebarCollapsed);
  const setShowLeaderboard = useIALabStore((s) => s.setShowLeaderboard);
  const setShowStudyPlannerModal = useIALabStore(
    (s) => s.setShowStudyPlannerModal,
  );
  const setShowHistoryModal = useIALabStore((s) => s.setShowHistoryModal);

  const levelNum = getLevel();
  const xp = getTotalPoints();
  const atRisk = isStreakAtRisk();

  const nextStepLabel = useMemo(() => {
    if (!activeMod || !modules) return null;
    const mod = modules.find((m) => m.id === activeMod);
    return mod?.title || null;
  }, [activeMod, modules]);

  // Mi Progreso abre el mismo modal que el usermenu (ActivityHistory)
  const goToProgress = () => setShowHistoryModal(true);
  const goToModule = (id) => navigate(`/ialab/${id}`);
  const continueModule = () => navigate(`/ialab/${activeMod || 1}`);

  return (
    <motion.div
      key="expanded"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={fadeTransition}
      className="h-full flex flex-col px-3 py-4 gap-3"
    >
      {/* ── ZONA 1: MÓDULOS (navegación primero) ── */}
      <SidebarModuleList
        modules={modules}
        activeMod={activeMod}
        calculateModuleScore={calculateModuleScore}
        isModuleLocked={isModuleLocked}
        goToModule={goToModule}
        moduleListVariants={moduleListVariants}
        moduleItemVariants={moduleItemVariants}
        t={t}
      />

      {/* Continúa aquí — CTA inmediato después de los módulos */}
      {nextStepLabel && (
        <button
          onClick={continueModule}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[var(--theme-emphasis)]/[0.08] to-[var(--theme-primary)]/[0.06] dark:from-[var(--theme-emphasis)]/15 dark:to-[var(--theme-primary)]/10 border border-[var(--theme-emphasis)]/15 dark:border-[var(--theme-emphasis)]/25 hover:from-[var(--theme-emphasis)]/12 hover:to-[var(--theme-primary)]/10 dark:hover:from-[var(--theme-emphasis)]/22 dark:hover:to-[var(--theme-primary)]/18 transition-all duration-200 group text-left focus:outline-none focus:ring-2 focus:ring-[var(--theme-emphasis)]/30"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] flex items-center justify-center flex-shrink-0 shadow-sm">
            <Icon name="fa-play" className="text-white text-[9px]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide leading-none mb-0.5">
              {t("sidebar.continue_where") || "Continúa aquí"}
            </p>
            <p className="text-[13px] font-bold font-display text-[var(--theme-emphasis)] dark:text-[#4DA8C4] truncate">
              {nextStepLabel}
            </p>
          </div>
          <Icon
            name="fa-chevron-right"
            className="text-slate-400 text-[9px] group-hover:translate-x-0.5 transition-transform duration-150 flex-shrink-0"
          />
        </button>
      )}

      {/* ── ZONA 2: PROGRESO + HERRAMIENTAS (tarjeta unificada, crece para llenar) ── */}
      <div className="flex-1 flex flex-col rounded-xl border border-[var(--theme-emphasis)]/12 dark:border-[var(--theme-emphasis)]/22 bg-[var(--theme-emphasis)]/[0.03] dark:bg-[var(--theme-emphasis)]/[0.08] p-4 gap-3">
        {/* Fila: Círculo + Stats */}
        <div className="flex items-center gap-3">
          {/* Círculo compacto de progreso */}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={`${Math.round(courseProgress || 0)}% ${t("sidebar.completed")}`}
            className="flex-shrink-0 relative w-12 h-12 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--theme-emphasis)]/30 hover:scale-105 transition-transform duration-150"
          >
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="16"
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="url(#prog-grad-exp)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="100.53"
                strokeDashoffset={
                  100.53 - (100.53 * Math.min(courseProgress || 0, 100)) / 100
                }
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient
                  id="prog-grad-exp"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="var(--theme-emphasis)" />
                  <stop offset="100%" stopColor="var(--theme-primary)" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[13px] font-black text-[var(--theme-emphasis)] dark:text-[#4DA8C4]">
              {Math.round(courseProgress || 0)}%
            </span>
          </button>

          {/* Stats + Mi Progreso */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 flex-nowrap mb-1.5 overflow-hidden">
              {levelNum > 0 && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[var(--theme-emphasis)]/10 dark:bg-[var(--theme-emphasis)]/25 px-1.5 py-0.5 text-[9px] font-bold text-[var(--theme-emphasis)] dark:text-[#4DA8C4] shrink-0">
                  <Icon
                    name="fa-graduation-cap"
                    className="text-[7px]"
                    aria-hidden="true"
                  />
                  Nv.{levelNum}
                </span>
              )}
              {streak > 0 && (
                <button
                  type="button"
                  onClick={onOpenStreak}
                  className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold transition-transform hover:scale-105 focus:outline-none shrink-0 ${atRisk ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" : "bg-[var(--theme-emphasis)]/10 dark:bg-[var(--theme-emphasis)]/25 text-[var(--theme-emphasis)] dark:text-[#4DA8C4]"}`}
                >
                  <Icon
                    name="fa-fire"
                    className={`text-[7px] ${atRisk ? "text-amber-500" : "text-orange-500"}`}
                    aria-hidden="true"
                  />
                  {streak}d
                </button>
              )}
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[var(--theme-emphasis)]/10 dark:bg-[var(--theme-emphasis)]/25 px-1.5 py-0.5 text-[9px] font-bold text-[var(--theme-emphasis)] dark:text-[#4DA8C4] shrink-0">
                <Icon
                  name="fa-star"
                  className="text-[7px] text-[var(--theme-primary)]"
                  aria-hidden="true"
                />
                {xp}
              </span>
            </div>
            <button
              onClick={goToProgress}
              className="text-[10px] font-semibold text-[var(--theme-emphasis)]/70 dark:text-[#4DA8C4]/70 hover:text-[var(--theme-emphasis)] dark:hover:text-[#4DA8C4] transition-colors duration-150 focus:outline-none"
            >
              {t("ialab.tab_progress") || "Mi Progreso"} →
            </button>
          </div>
        </div>

        {/* Separador interno */}
        <div className="h-px bg-[var(--theme-emphasis)]/10 dark:bg-[var(--theme-emphasis)]/20" />

        {/* Herramientas — flex-1 + flex para que los botones llenen toda la altura */}
        <div className="flex-1 flex gap-2 min-h-0">
          <button
            onClick={() => setShowStudyPlannerModal(true)}
            className="flex-1 flex flex-col items-center justify-center gap-2 rounded-lg bg-[var(--theme-emphasis)]/8 dark:bg-[var(--theme-emphasis)]/15 hover:bg-[var(--theme-emphasis)]/15 dark:hover:bg-[var(--theme-emphasis)]/25 text-[var(--theme-emphasis)] dark:text-[#4DA8C4] transition-all duration-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[var(--theme-emphasis)]/30"
          >
            <Icon
              name="fa-calendar"
              className="text-[var(--theme-primary)] text-xl"
            />
            <span>{t("ialab.sidebar_plan_short") || "Plan"}</span>
          </button>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="flex-1 flex flex-col items-center justify-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/15 hover:bg-amber-100 dark:hover:bg-amber-900/25 text-amber-700 dark:text-amber-400 transition-all duration-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400/30"
          >
            <Icon name="fa-trophy" className="text-amber-500 text-xl" />
            <span>{t("ialab.sidebar_leaderboard") || "Ranking"}</span>
          </button>
        </div>
      </div>

      {storedCertificate && (
        <div className="px-0.5 pt-1">
          <CourseCompletionSection
            hasCertificate={!!storedCertificate}
            courseCompleted={courseCompleted}
            courseProgress={courseProgress}
            completedModulesCount={completedModules.length}
            onViewCertificate={() => setShowCertificateModal(true)}
            isGenerating={certificateGenerating}
          />
        </div>
      )}
    </motion.div>
  );
};

SidebarExpanded.propTypes = {
  onOpenStreak: PropTypes.func,
};

export default React.memo(SidebarExpanded);
