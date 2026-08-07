import React from 'react'
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ModuleNavItem from './ModuleNavItem';
import ZoneHeading from './ZoneHeading';

const SidebarModuleList = ({
  modules, activeMod, calculateModuleScore, isModuleLocked, goToModule,
  moduleListVariants, moduleItemVariants, t,
}) => (
  <div className="px-2 w-full" aria-labelledby="sidebar-modules-heading">
    <div className="mb-2">
      <ZoneHeading icon="fa-layer-group" label={t('sidebar.modules')} id="sidebar-modules-heading" />
    </div>
    <motion.div
      variants={moduleListVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
      role="list"
    >
      {modules.map((mod) => {
        const modScore = calculateModuleScore(mod.id);
        const locked = isModuleLocked(mod.id);
        const isActive = activeMod === mod.id;

        return (
          <motion.div key={mod.id} role="listitem" variants={moduleItemVariants}>
            <ModuleNavItem
              mod={mod}
              isActive={isActive}
              isLocked={locked}
              score={modScore}
              variant="expanded"
              onClick={goToModule}
            />
          </motion.div>
        );
      })}
    </motion.div>
  </div>
);


SidebarModuleList.propTypes = {
  modules: PropTypes.array,
  activeMod: PropTypes.number,
  calculateModuleScore: PropTypes.func,
  isModuleLocked: PropTypes.func,
  goToModule: PropTypes.func,
  moduleListVariants: PropTypes.object,
  moduleItemVariants: PropTypes.object,
  t: PropTypes.func,
};

export default React.memo(SidebarModuleList);
