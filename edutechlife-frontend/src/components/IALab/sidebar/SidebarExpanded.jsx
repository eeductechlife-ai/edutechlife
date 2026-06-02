import React from 'react'
import PropTypes from 'prop-types';;
import { motion } from 'framer-motion';
import SidebarProgressCircle from './SidebarProgressCircle';
import SidebarModuleList from './SidebarModuleList';
import SidebarResources from './SidebarResources';
import StreakBadge from '../StreakBadge';
import CourseCompletionSection from '../CourseCompletionSection';

const SidebarExpanded = ({
  courseProgress, t, streak, getTotalPoints, isStreakAtRisk, getLevel,
  setShowStreakModal, setShowCertificateModal,
  modules, activeMod, calculateModuleScore, isModuleLocked, goToModule,
  moduleListVariants, moduleItemVariants,
  sidebarDropdowns, toggleSidebarDropdown, isInfographicCompleted,
  fadeTransition, storedCertificate, courseCompleted, completedModules,
  certificateGenerating,
}) => (
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
          onViewCertificate={() => {
            setShowCertificateModal(true);
          }}
          isGenerating={certificateGenerating}
        />
      </div>
    )}
  </motion.div>
);


SidebarExpanded.propTypes = {
  courseProgress: PropTypes.any,
  t: PropTypes.any,
  streak: PropTypes.any,
  getTotalPoints: PropTypes.any,
  isStreakAtRisk: PropTypes.any,
  getLevel: PropTypes.any,
  setShowStreakModal: PropTypes.any,
  setShowCertificateModal: PropTypes.any,
  modules: PropTypes.any,
  activeMod: PropTypes.any,
  calculateModuleScore: PropTypes.any,
  isModuleLocked: PropTypes.any,
  goToModule: PropTypes.any,
  moduleListVariants: PropTypes.any,
  moduleItemVariants: PropTypes.any,
  sidebarDropdowns: PropTypes.any,
  toggleSidebarDropdown: PropTypes.any,
  isInfographicCompleted: PropTypes.any,
  fadeTransition: PropTypes.any,
  storedCertificate: PropTypes.any,
  courseCompleted: PropTypes.any,
  completedModules: PropTypes.any,
  certificateGenerating: PropTypes.any,
};

export default React.memo(SidebarExpanded);
