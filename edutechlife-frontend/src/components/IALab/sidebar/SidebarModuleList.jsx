import React from 'react'
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import ModuleNavItem from './ModuleNavItem';

const SidebarModuleList = ({
  modules, activeMod, calculateModuleScore, isModuleLocked, goToModule,
  moduleListVariants, moduleItemVariants, t,
}) => (
  <div className="px-2 w-full" aria-labelledby="sidebar-modules-heading">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm flex-shrink-0">
        <Icon name="fa-layer-group" className="text-white text-[10px]" aria-hidden="true" />
      </div>
      <h3 id="sidebar-modules-heading" className="text-xs font-bold tracking-[0.12em] uppercase text-petroleum">
        {t('sidebar.modules')}
      </h3>
      <div className="flex-1 h-px bg-gradient-to-r from-petroleum/20 via-corporate/20 to-transparent"></div>
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
