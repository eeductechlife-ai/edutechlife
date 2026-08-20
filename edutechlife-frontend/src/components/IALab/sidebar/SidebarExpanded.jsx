import React, { useMemo } from 'react'
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIALabProgressContext, useIALabUIContext } from '../../../context/IALabContext';
import { useIALabStore } from '../../../store/ialabStore';
import { useTranslation } from '../../../i18n/I18nProvider';
import { Icon } from '../../../utils/iconMapping.jsx';
import SidebarModuleList from './SidebarModuleList';
import SidebarProgressCircle from './SidebarProgressCircle';
import ZoneHeading from './ZoneHeading';
import CourseCompletionSection from '../CourseCompletionSection';

const SidebarExpanded = ({ onOpenStreak }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const fadeTransition = shouldReduceMotion ? { duration: 0 } : { duration: 0.15 };
  const moduleListVariants = shouldReduceMotion ? {} : {
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } }
  };
  const moduleItemVariants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const {
    courseProgress, modules, activeMod,
    isModuleLocked, calculateModuleScore, completedModules,
  } = useIALabProgressContext();

  const {
    courseCompleted, setShowCertificateModal,
    storedCertificate, certificateGenerating,
  } = useIALabUIContext();

  const streak = useIALabStore(s => s.streak);
  const getLevel = useIALabStore(s => s.getLevel);
  const getTotalPoints = useIALabStore(s => s.getTotalPoints);
  const isStreakAtRisk = useIALabStore(s => s.isStreakAtRisk);
  const toggleSidebar = useIALabStore(s => s.toggleSidebarCollapsed);
  const setShowLeaderboard = useIALabStore(s => s.setShowLeaderboard);
  const setShowStudyPlannerModal = useIALabStore(s => s.setShowStudyPlannerModal);
  const setShowHistoryModal = useIALabStore(s => s.setShowHistoryModal);

  const level = getLevel();
  const xp = getTotalPoints();
  const atRisk = isStreakAtRisk();

  const nextStepLabel = useMemo(() => {
    if (!activeMod || !modules) return null;
    const mod = modules.find(m => m.id === activeMod);
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
      className="px-3 py-4 space-y-3"
    >
      {/* ── ZONA 1: TU AVANCE ── */}
      <ZoneHeading icon="fa-gauge-high" label={t('sidebar.zone_avance') || 'Tu Avance'} />

      <SidebarProgressCircle
        courseProgress={courseProgress}
        t={t}
        levelName={level?.name}
        streak={streak}
        xp={xp}
        atRisk={atRisk}
        onCircleClick={toggleSidebar}
        onStreakClick={onOpenStreak}
      />

      {/* Mi Progreso — acción primaria, justo bajo el círculo de avance */}
      <button
        onClick={goToProgress}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[var(--theme-emphasis)]/10 dark:bg-[var(--theme-emphasis)]/20 border border-[var(--theme-emphasis)]/15 dark:border-[var(--theme-emphasis)]/30 hover:bg-[var(--theme-emphasis)]/15 dark:hover:bg-[var(--theme-emphasis)]/30 text-[var(--theme-emphasis)] dark:text-[#4DA8C4] transition-all duration-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[var(--theme-emphasis)]/30"
      >
        <Icon name="fa-chart-line" className="text-[var(--theme-primary)] text-sm flex-shrink-0" />
        <span>{t('ialab.tab_progress') || 'Mi Progreso'}</span>
      </button>

      {/* ── ZONA 2: MÓDULOS ── */}
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

      {nextStepLabel && (
        <button
          onClick={continueModule}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[var(--theme-emphasis)]/[0.06] to-[var(--theme-primary)]/[0.06] dark:from-[var(--theme-emphasis)]/15 dark:to-[var(--theme-primary)]/10 border border-[var(--theme-emphasis)]/10 dark:border-[var(--theme-emphasis)]/20 hover:from-[var(--theme-emphasis)]/10 hover:to-[var(--theme-primary)]/10 dark:hover:from-[var(--theme-emphasis)]/20 dark:hover:to-[var(--theme-primary)]/15 transition-all duration-200 group text-left focus:outline-none focus:ring-2 focus:ring-[var(--theme-emphasis)]/30"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] flex items-center justify-center flex-shrink-0 shadow-sm">
            <Icon name="fa-play" className="text-white text-[9px]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide leading-none mb-0.5">
              {t('sidebar.continue_where') || 'Continúa aquí'}
            </p>
            <p className="text-[13px] font-bold font-display text-[var(--theme-emphasis)] dark:text-[#4DA8C4] truncate">{nextStepLabel}</p>
          </div>
          <Icon name="fa-chevron-right" className="text-slate-400 text-[9px] group-hover:translate-x-0.5 transition-transform duration-150 flex-shrink-0" />
        </button>
      )}

      {/* ── ZONA 3: HERRAMIENTAS ── */}
      <ZoneHeading icon="fa-sliders" label={t('sidebar.zone_tools') || 'Herramientas'} />

      <div className="space-y-1.5 px-0.5">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setShowStudyPlannerModal(true)}
            className="flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl bg-[var(--theme-emphasis)]/8 dark:bg-[var(--theme-emphasis)]/15 hover:bg-[var(--theme-emphasis)]/15 dark:hover:bg-[var(--theme-emphasis)]/25 text-[var(--theme-emphasis)] dark:text-[#4DA8C4] transition-all duration-200 text-[11px] font-bold leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--theme-emphasis)]/30"
          >
            <Icon name="fa-calendar" className="text-[var(--theme-primary)] text-sm" />
            <span className="text-center">{t('ialab.sidebar_study_plan') || 'Plan'}</span>
          </button>

          <button
            onClick={() => setShowLeaderboard(true)}
            className="flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl bg-[var(--theme-emphasis)]/8 dark:bg-[var(--theme-emphasis)]/15 hover:bg-[var(--theme-emphasis)]/15 dark:hover:bg-[var(--theme-emphasis)]/25 text-[var(--theme-emphasis)] dark:text-[#4DA8C4] transition-all duration-200 text-[11px] font-bold leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--theme-emphasis)]/30"
          >
            <Icon name="fa-trophy" className="text-amber-500 text-sm" />
            <span className="text-center">{t('ialab.sidebar_leaderboard') || 'Ranking'}</span>
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