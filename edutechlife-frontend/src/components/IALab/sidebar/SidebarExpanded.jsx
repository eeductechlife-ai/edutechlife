import React from 'react'
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIALabProgressContext, useIALabUIContext } from '../../../context/IALabContext';
import { useProgressContext } from '../../../context/ProgressContext';
import { useIALabStore } from '../../../store/ialabStore';
import { useTranslation } from '../../../i18n/I18nProvider';
import SidebarProgressCircle from './SidebarProgressCircle';
import SidebarModuleList from './SidebarModuleList';
import SidebarResources from './SidebarResources';
import StreakBadge from '../StreakBadge';
import CourseCompletionSection from '../CourseCompletionSection';

const SidebarExpanded = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goToModule = (id) => navigate(`/ialab/${id}`);
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
    sidebarDropdowns, toggleSidebarDropdown,
    courseCompleted, setShowCertificateModal,
    storedCertificate, certificateGenerating,
    setShowStreakModal,
  } = useIALabUIContext();

  const { completedInfographics } = useProgressContext();
  const streak = useIALabStore(s => s.streak);
  const getLevel = useIALabStore(s => s.getLevel);
  const getTotalPoints = useIALabStore(s => s.getTotalPoints);
  const isStreakAtRisk = useIALabStore(s => s.isStreakAtRisk);

  const isInfographicCompleted = React.useCallback(
    (infographicId) => completedInfographics.includes(`${infographicId}`),
    [completedInfographics]
  );

  return (
    <motion.div
      key="expanded"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={fadeTransition}
      className="px-4 py-4 space-y-4"
    >
      <SidebarProgressCircle courseProgress={courseProgress} t={t} />

      <StreakBadge
        streak={streak}
        xp={getTotalPoints()}
        isAtRisk={isStreakAtRisk()}
        level={getLevel()}
        onClick={() => setShowStreakModal(true)}
      />

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

      <SidebarResources
        activeMod={activeMod}
        sidebarDropdowns={sidebarDropdowns}
        toggleSidebarDropdown={toggleSidebarDropdown}
        isInfographicCompleted={isInfographicCompleted}
        fadeTransition={fadeTransition}
        t={t}
      />

      {storedCertificate && (
        <div className="px-1 w-full mt-4">
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

export default React.memo(SidebarExpanded);
