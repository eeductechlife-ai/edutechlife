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
  courseProgress: PropTypes.number,
  t: PropTypes.func,
  streak: PropTypes.number,
  getTotalPoints: PropTypes.func,
  isStreakAtRisk: PropTypes.func,
  getLevel: PropTypes.func,
  setShowStreakModal: PropTypes.func,
  setShowCertificateModal: PropTypes.func,
  modules: PropTypes.array,
  activeMod: PropTypes.number,
  calculateModuleScore: PropTypes.func,
  isModuleLocked: PropTypes.func,
  goToModule: PropTypes.func,
  moduleListVariants: PropTypes.object,
  moduleItemVariants: PropTypes.object,
  sidebarDropdowns: PropTypes.object,
  toggleSidebarDropdown: PropTypes.func,
  isInfographicCompleted: PropTypes.func,
  fadeTransition: PropTypes.object,
  storedCertificate: PropTypes.bool,
  courseCompleted: PropTypes.bool,
  completedModules: PropTypes.array,
  certificateGenerating: PropTypes.bool,
};

export default React.memo(SidebarExpanded);
