import React from "react";
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
    courseProgress = 0,
    modules = [],
    activeMod = 1,
    isModuleLocked = () => false,
    calculateModuleScore = () => 0,
    completedModules = [],
  } = useIALabProgressContext() ?? {};

  const {
    courseCompleted,
    setShowCertificateModal,
    storedCertificate,
    certificateGenerating,
  } = useIALabUIContext() ?? {};

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

  // Mi Progreso abre el mismo modal que el usermenu (ActivityHistory)
  const goToProgress = () => setShowHistoryModal(true);
  const goToModule = (id) => navigate(`/ialab/${id}`);

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


      {/* ── ZONA 2: PROGRESO + HERRAMIENTAS (tarjeta unificada) ── */}
      <div className="flex flex-col rounded-xl border border-[var(--theme-emphasis)]/12 dark:border-[var(--theme-emphasis)]/22 bg-[var(--theme-emphasis)]/[0.03] dark:bg-[var(--theme-emphasis)]/[0.08] overflow-hidden">
        {/* Header: Ring de progreso grande e independiente */}
        <div className="flex flex-col items-center gap-2 pt-5 pb-4 px-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-emphasis)]/60 dark:text-[#4DA8C4]/60 leading-none">
            Tu avance
          </p>
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={`${Math.round(courseProgress || 0)}% ${t("sidebar.completed")}`}
            className="relative w-24 h-24 flex-shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--theme-emphasis)]/30 hover:scale-105 transition-transform duration-150"
          >
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="16"
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="url(#prog-grad-exp)"
                strokeWidth="3"
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
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-[var(--theme-emphasis)] dark:text-[#4DA8C4] leading-none">
                {Math.round(courseProgress || 0)}%
              </span>
              <span className="text-[9px] font-semibold text-[var(--theme-emphasis)]/60 dark:text-[#4DA8C4]/60 mt-0.5">
                completado
              </span>
            </div>
          </button>

          {/* Stats en fila debajo del ring */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center mt-1">
            {levelNum > 0 && (
              <span className="inline-flex items-center gap-0.5 rounded-md bg-[var(--theme-emphasis)]/10 dark:bg-[var(--theme-emphasis)]/25 px-1.5 py-0.5 text-[10px] font-bold text-[var(--theme-emphasis)] dark:text-[#4DA8C4]">
                <Icon name="fa-graduation-cap" className="text-[8px]" aria-hidden="true" />
                Nv.{levelNum}
              </span>
            )}
            {streak > 0 && (
              <button
                type="button"
                onClick={onOpenStreak}
                className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-transform hover:scale-105 focus:outline-none ${atRisk ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" : "bg-[var(--theme-emphasis)]/10 dark:bg-[var(--theme-emphasis)]/25 text-[var(--theme-emphasis)] dark:text-[#4DA8C4]"}`}
              >
                <Icon name="fa-fire" className={`text-[8px] ${atRisk ? "text-amber-500" : "text-orange-500"}`} aria-hidden="true" />
                {streak}d
              </button>
            )}
            <span className="inline-flex items-center gap-0.5 rounded-md bg-[var(--theme-emphasis)]/10 dark:bg-[var(--theme-emphasis)]/25 px-1.5 py-0.5 text-[10px] font-bold text-[var(--theme-emphasis)] dark:text-[#4DA8C4]">
              <Icon name="fa-star" className="text-[8px] text-amber-400" aria-hidden="true" />
              {xp}
            </span>
          </div>
        </div>

        {/* Divisor */}
        <div className="h-px bg-[var(--theme-emphasis)]/10 dark:bg-[var(--theme-emphasis)]/20 mx-3" />

        {/* Accesos rápidos: lista uniforme */}
        <div className="flex flex-col p-2 gap-1">
          <button
            onClick={goToProgress}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[var(--theme-emphasis)]/10 dark:hover:bg-[var(--theme-emphasis)]/20 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--theme-emphasis)]/30 group"
          >
            <div className="w-7 h-7 rounded-lg bg-[var(--theme-emphasis)]/10 dark:bg-[var(--theme-emphasis)]/20 flex items-center justify-center flex-shrink-0">
              <Icon name="fa-chart-bar" className="text-[var(--theme-primary)] text-xs" aria-hidden="true" />
            </div>
            <span className="flex-1 text-left text-[12px] font-semibold text-[var(--theme-emphasis)] dark:text-[#4DA8C4]">
              {t("ialab.tab_progress") || "Mi Progreso"}
            </span>
            <Icon name="fa-chevron-right" className="text-[9px] text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => setShowStudyPlannerModal(true)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[var(--theme-emphasis)]/10 dark:hover:bg-[var(--theme-emphasis)]/20 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--theme-emphasis)]/30 group"
          >
            <div className="w-7 h-7 rounded-lg bg-[var(--theme-emphasis)]/10 dark:bg-[var(--theme-emphasis)]/20 flex items-center justify-center flex-shrink-0">
              <Icon name="fa-calendar" className="text-[var(--theme-primary)] text-xs" aria-hidden="true" />
            </div>
            <span className="flex-1 text-left text-[12px] font-semibold text-[var(--theme-emphasis)] dark:text-[#4DA8C4]">
              {t("ialab.sidebar_plan_short") || "Plan"}
            </span>
            <Icon name="fa-chevron-right" className="text-[9px] text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => setShowLeaderboard(true)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-amber-100/60 dark:hover:bg-amber-900/25 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400/30 group"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
              <Icon name="fa-trophy" className="text-amber-500 text-xs" aria-hidden="true" />
            </div>
            <span className="flex-1 text-left text-[12px] font-semibold text-amber-700 dark:text-amber-400">
              {t("ialab.sidebar_leaderboard") || "Ranking"}
            </span>
            <Icon name="fa-chevron-right" className="text-[9px] text-slate-400 group-hover:translate-x-0.5 transition-transform" />
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
