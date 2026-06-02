import React from 'react'
import PropTypes from 'prop-types';;
import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';

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
      aria-live="polite"
    >
      {modules.map((mod) => {
        const modScore = calculateModuleScore(mod.id);
        const locked = isModuleLocked(mod.id);
        const isActive = activeMod === mod.id;

        return (
          <motion.button
            key={mod.id}
            role="listitem"
            variants={moduleItemVariants}
            onClick={() => !locked && goToModule(mod.id)}
            className={`w-full group flex items-center gap-2 min-h-[44px] p-2.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-md shadow-petroleum/15 dark:shadow-petroleum/30' : 'hover:bg-petroleum/10 dark:hover:bg-petroleum/20 text-slate-700 dark:text-slate-300'} focus:outline-none focus:ring-2 focus:ring-petroleum/30 dark:focus:ring-petroleum/50 focus:ring-offset-1`}
            disabled={locked}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`${locked ? 'Módulo bloqueado: ' : ''}${mod.title}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${isActive ? 'bg-white/20' : 'bg-petroleum/8 dark:bg-petroleum/20 group-hover:bg-petroleum/15'}`}>
              <span className={`${isActive ? 'text-white' : 'text-petroleum dark:text-[#4DA8C4]'} text-sm font-bold`}>{mod.id}</span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="font-semibold text-sm truncate group-hover:text-petroleum dark:group-hover:text-[#4DA8C4] transition-colors">{mod.title}</p>
              {modScore > 0 && (
                <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isActive ? 'bg-white/60' : 'bg-corporate'}`}
                    style={{ width: `${modScore}%` }}
                  />
                </div>
              )}
            </div>
            {locked && (
              <Icon name="fa-lock" className="text-xs text-petroleum/40 dark:text-slate-500" aria-hidden="true" />
            )}
            {!locked && modScore >= 80 && (
              <Icon name="fa-check" className="text-xs text-emerald-500" aria-hidden="true" />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  </div>
);


SidebarModuleList.propTypes = {
  modules: PropTypes.any,
  activeMod: PropTypes.any,
  calculateModuleScore: PropTypes.any,
  isModuleLocked: PropTypes.any,
  goToModule: PropTypes.any,
  moduleListVariants: PropTypes.any,
  moduleItemVariants: PropTypes.any,
  t: PropTypes.any,
};

export default React.memo(SidebarModuleList);
