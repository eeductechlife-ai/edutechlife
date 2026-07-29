import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
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
  const { isCollapsed, toggleSidebar } = useSidebarState();
  const [showStreakModal, setShowStreakModal] = useState(false);

  const isInfographicCompleted = useInfographicCompletion();

  return (
    <motion.aside
      id="ialab-sidebar-panel"
      data-testid="ialab-sidebar"
      role="navigation"
      aria-label={t('sidebar.panel_aria')}
      style={{ width: isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      className="relative flex-shrink-0 border-r border-petroleum/15 dark:border-petroleum/25 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg shadow-[0_0_15px_rgba(0,75,99,0.06)] transition-[width] duration-300"
    >
      <div className="h-full overflow-y-auto overflow-x-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-petroleum/30 via-corporate/30 to-transparent pointer-events-none z-10" />
        <div className="absolute -bottom-20 -left-10 w-32 h-32 bg-gradient-to-br from-petroleum/5 to-corporate/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-6 top-2 z-50 group/toggle">
          <motion.button
            onClick={toggleSidebar}
            className="group relative flex items-center gap-3
              h-14 pl-4 pr-5 rounded-r-2xl rounded-l-none
              bg-white/95 dark:bg-slate-800/95
              backdrop-blur-lg
              border-2 border-petroleum/15 dark:border-petroleum/30 border-l-0
              shadow-xl hover:shadow-[0_0_25px_rgba(0,75,99,0.15)] dark:hover:shadow-[0_0_25px_rgba(0,188,212,0.1)]
              transition-all duration-200
              hover:bg-gradient-to-r hover:from-petroleum/15 hover:to-white/95
              dark:hover:from-petroleum/20 dark:hover:to-slate-800/95
              hover:border-petroleum/40 dark:hover:border-petroleum/50
              hover:w-auto hover:pr-6
              focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 focus-visible:ring-offset-2"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}
            aria-expanded={!isCollapsed}
            aria-controls="ialab-sidebar-panel"
          >
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-2 h-2 bg-petroleum/20 dark:bg-corporate/30 rotate-45" />
            </div>
            <ChevronLeft
              className={`w-5 h-5 text-petroleum dark:text-corporate transition-all duration-300 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
            />
            <span className="text-sm font-bold text-petroleum dark:text-corporate whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[100px] transition-all duration-300">
              {isCollapsed ? t('sidebar.expand_btn') : t('sidebar.collapse_btn')}
            </span>
          </motion.button>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] font-medium rounded-md opacity-0 invisible group-hover/toggle:opacity-100 group-hover/toggle:visible transition-all duration-200 whitespace-nowrap z-[70] shadow-lg pointer-events-none">
            {isCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}
          </div>
        </div>

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
              t={t}
            />
          ) : (
            <SidebarExpanded
              key="expanded"
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
