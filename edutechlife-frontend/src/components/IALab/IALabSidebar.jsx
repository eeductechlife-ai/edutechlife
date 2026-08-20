import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIALabProgressContext, useIALabUIContext } from '../../context/IALabContext';
import { useIALabStore } from '../../store/ialabStore';
import { useSidebarState } from '../../hooks/IALab/useSidebarState';
import { useTranslation } from '../../i18n/I18nProvider';
import useInfographicCompletion from '../../hooks/IALab/useInfographicCompletion';
import StreakDetailsModal from './StreakDetailsModal';
import SidebarCollapsed from './sidebar/SidebarCollapsed';
import SidebarExpanded from './sidebar/SidebarExpanded';

const COLLAPSED_WIDTH = 72;
const EXPANDED_WIDTH = 256;

/**
 * IALabSidebar — Navegación lateral principal del IA Lab.
 * Muestra el árbol de módulos del curso, progreso, puntos del usuario,
 * racha (streak) y enlaces a recursos (cheat sheets, ejemplos, etc.).
 * Soporta colapso/expansión y enrutamiento a módulos vía react-router.
 */
const IALabSidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goToModule = (id) => navigate(`/ialab/${id}`);
  const {
    activeMod, courseProgress, modules,
    isModuleLocked, calculateModuleScore, completedModules,
  } = useIALabProgressContext();

  const {
    sidebarDropdowns, toggleSidebarDropdown,
    courseCompleted, setShowCertificateModal,
    storedCertificate, certificateGenerating,
  } = useIALabUIContext();

  const streak = useIALabStore(s => s.streak);
  const getLevel = useIALabStore(s => s.getLevel);
  const getTotalPoints = useIALabStore(s => s.getTotalPoints);
  const isStreakAtRisk = useIALabStore(s => s.isStreakAtRisk);
  const setShowLeaderboard = useIALabStore(s => s.setShowLeaderboard);
  const setShowStudyPlannerModal = useIALabStore(s => s.setShowStudyPlannerModal);
  const setShowHistoryModal = useIALabStore(s => s.setShowHistoryModal);
  const { isCollapsed, toggleSidebar } = useSidebarState();
  // Mi Progreso abre el mismo modal que el usermenu (ActivityHistory)
  const goToProgress = useCallback(() => setShowHistoryModal(true), [setShowHistoryModal]);
  const [showStreakModal, setShowStreakModal] = useState(false);

  const isInfographicCompleted = useInfographicCompletion();

  return (
    <motion.aside
      id="ialab-sidebar-panel"
      data-testid="ialab-sidebar"
      role="navigation"
      aria-label={t('sidebar.panel_aria')}
      style={{ width: isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      className="relative flex-shrink-0 border-r theme-border-primary-20 backdrop-blur-lg shadow-sm transition-[width] duration-300"
      style={{ background: 'color-mix(in srgb, var(--theme-surface-2) 95%, transparent)' }}
    >
      <div className="h-full overflow-y-auto overflow-x-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] theme-bg-primary-20 pointer-events-none z-10" />
        <div className="absolute -bottom-20 -left-10 w-32 h-32 theme-bg-primary-5 rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {isCollapsed ? (
            <SidebarCollapsed
              key="collapsed"
              courseProgress={courseProgress}
              modules={modules}
              activeMod={activeMod}
              isModuleLocked={isModuleLocked}
              calculateModuleScore={calculateModuleScore}
              streak={streak}
              isStreakAtRisk={isStreakAtRisk}
              getLevel={getLevel}
              getTotalPoints={getTotalPoints}
              storedCertificate={storedCertificate}
              setShowCertificateModal={setShowCertificateModal}
              goToModule={goToModule}
              goToProgress={goToProgress}
              setShowLeaderboard={setShowLeaderboard}
              setShowStudyPlannerModal={setShowStudyPlannerModal}
              onToggleSidebar={toggleSidebar}
              t={t}
            />
          ) : (
            <SidebarExpanded
              key="expanded"
              onOpenStreak={() => setShowStreakModal(true)}
            />
          )}
        </AnimatePresence>
      </div>
      <StreakDetailsModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
      />
    </motion.aside>
  );
};

export default React.memo(IALabSidebar);
