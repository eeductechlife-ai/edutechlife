import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabContext } from '../../context/IALabContext';

const IALabModuleRoadmap = () => {
  const prefersReducedMotion = useReducedMotion();
  const { activeMod, modules, setActiveMod, isModuleLocked, calculateModuleScore } = useIALabContext();

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-4 md:p-5">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate rounded-t-2xl" />

      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm flex-shrink-0">
          <Icon name="fa-map-signs" className="text-white text-sm" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-petroleum dark:text-[#4DA8C4] leading-tight">Tu ruta de aprendizaje</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">5 módulos hacia tu certificación</p>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2 overflow-x-auto pb-1 scrollbar-thin-ialab">
        {modules.map((mod, idx) => {
          const locked = isModuleLocked(mod.id);
          const score = calculateModuleScore(mod.id);
          const completed = score >= 80;
          const isActive = activeMod === mod.id;
          const isLast = idx === modules.length - 1;

          return (
            <React.Fragment key={mod.id}>
              <motion.button
                onClick={() => !locked && setActiveMod(mod.id)}
                whileHover={prefersReducedMotion || locked ? {} : { scale: 1.05, y: -2 }}
                whileTap={prefersReducedMotion || locked ? {} : { scale: 0.97 }}
                disabled={locked}
                className={`relative flex flex-col items-center gap-1.5 min-w-[56px] md:min-w-[72px] p-2.5 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 ${
                  locked
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:shadow-md'
                } ${
                  isActive
                    ? 'bg-gradient-to-b from-petroleum/10 to-corporate/5 border border-petroleum/20 shadow-sm'
                    : completed
                    ? 'bg-emerald-50/50 border border-emerald-200/60'
                    : 'bg-slate-50 dark:bg-slate-700/50 border border-slate-200/60 dark:border-slate-600/60 hover:border-petroleum/30'
                }`}
                aria-label={`${locked ? 'Bloqueado: ' : ''}Módulo ${mod.id}: ${mod.title}${completed ? ' - Completado' : score > 0 ? ` - ${Math.round(score)}%` : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-br from-petroleum to-corporate text-white shadow-sm'
                    : completed
                    ? 'bg-emerald-500 text-white'
                    : locked
                    ? 'bg-slate-200 dark:bg-slate-600 text-slate-400'
                    : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-petroleum dark:text-[#4DA8C4]'
                }`}>
                  {completed ? (
                    <Icon name="fa-check" className="text-xs" />
                  ) : locked ? (
                    <Icon name="fa-lock" className="text-xs" />
                  ) : (
                    <span className="text-xs font-bold">{mod.id}</span>
                  )}
                </div>
                <span className={`text-[9px] md:text-xs font-semibold text-center leading-tight max-w-[48px] md:max-w-[64px] truncate ${
                  isActive
                    ? 'text-petroleum dark:text-[#4DA8C4]'
                    : completed
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {mod.title}
                </span>
                {score > 0 && !completed && (
                  <div className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full transition-all duration-500" style={{ width: `${score}%` }} />
                  </div>
                )}
              </motion.button>

              {!isLast && (
                <div className="flex-shrink-0 w-3 md:w-4 flex items-center">
                  <div className={`h-px w-full ${completed || isActive ? 'bg-corporate/40' : 'bg-slate-200 dark:bg-slate-600'}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default IALabModuleRoadmap;
