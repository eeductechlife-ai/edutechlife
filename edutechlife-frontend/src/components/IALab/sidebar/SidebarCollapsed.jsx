import React from 'react'
import PropTypes from 'prop-types';;
import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import TooltipIcon from './SidebarTooltipIcon';

const formatPoints = (pts) => {
  if (pts >= 1000) return `${(pts / 1000).toFixed(1).replace('.0', '')}k`;
  return pts.toString();
};

const SidebarCollapsed = ({
  courseProgress, modules, activeMod, isModuleLocked, calculateModuleScore,
  streak, isStreakAtRisk, getLevel, getTotalPoints,
  storedCertificate, setShowCertificateModal, goToModule,
  fadeTransition, t,
}) => (
  <motion.div
    key="collapsed"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={fadeTransition}
    className="flex flex-col items-center px-2 py-4 gap-2"
  >
    <div className="min-h-[64px] w-full flex-shrink-0" />

    <TooltipIcon label={`${Math.round(courseProgress)}% completado`} premium>
      <div className="w-full h-12 rounded-xl bg-gradient-to-br from-petroleum/8 to-corporate/8 border border-petroleum/10 flex items-center justify-center flex-shrink-0 shadow-sm relative" role="progressbar" aria-valuenow={Math.round(courseProgress)} aria-valuemin="0" aria-valuemax="100">
        <svg className="w-[38px] h-[38px] -rotate-90" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="sidebar-progress-grad-collapsed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#004B63" />
              <stop offset="100%" stopColor="#00BCD4" />
            </linearGradient>
            <filter id="progress-glow">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <circle cx="60" cy="60" r="50" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="12" fill="none" />
          <motion.circle cx="60" cy="60" r="50" stroke="url(#sidebar-progress-grad-collapsed)" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray="314.159" strokeDashoffset={314.159 - (314.159 * Math.min(courseProgress, 100)) / 100} className="transition-all duration-700 ease-out" filter="url(#progress-glow)"
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </div>
    </TooltipIcon>

    <TooltipIcon label={`Nivel ${getLevel()}`} premium>
      <div className="w-full h-12 rounded-xl bg-gradient-to-br from-petroleum/8 to-corporate/8 border border-petroleum/10 flex flex-col items-center justify-center gap-0 flex-shrink-0 shadow-sm">
        <Icon name="fa-graduation-cap" className="text-corporate text-xl" aria-hidden="true" />
        <span className="text-sm font-bold text-petroleum dark:text-[#4DA8C4]">Nv.{getLevel()}</span>
      </div>
    </TooltipIcon>

    <TooltipIcon label={`${streak} días racha${isStreakAtRisk() && streak > 0 ? ' — ¡Estudia hoy para mantenerla!' : ''}`} premium>
      <div className="w-full h-12 rounded-xl bg-gradient-to-br from-petroleum/8 to-corporate/8 border border-petroleum/10 flex flex-col items-center justify-center gap-0 flex-shrink-0 shadow-sm relative">
        <motion.div
          animate={streak > 0 ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon name="fa-fire" className={`text-xl ${streak >= 3 ? 'text-orange-500' : 'text-slate-300'}`} aria-hidden="true" />
        </motion.div>
        <span className={`text-sm font-semibold ${streak >= 3 ? 'text-orange-600' : 'text-slate-500'}`}>{streak} días</span>
        {isStreakAtRisk() && streak > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        )}
      </div>
    </TooltipIcon>

    <TooltipIcon label={`${getTotalPoints()} puntos acumulados`} premium>
      <div className="w-full h-12 rounded-xl bg-gradient-to-br from-petroleum/8 to-corporate/8 border border-petroleum/10 flex flex-col items-center justify-center gap-0 flex-shrink-0 shadow-sm">
        <Icon name="fa-award" className="text-corporate text-2xl" aria-hidden="true" />
        <span className="text-sm font-bold text-petroleum dark:text-[#4DA8C4]">{formatPoints(getTotalPoints())}</span>
      </div>
    </TooltipIcon>

    <div className="relative w-full flex items-center justify-center py-1">
      <div className="w-8 h-px bg-gradient-to-r from-transparent via-petroleum/20 dark:via-petroleum/40 to-transparent" />
      <div className="absolute w-1 h-1 rounded-full bg-petroleum/30 dark:bg-petroleum/50" />
    </div>

    <TooltipIcon label="Módulos del curso">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm flex-shrink-0">
        <Icon name="fa-layer-group" className="text-white text-sm" aria-hidden="true" />
      </div>
    </TooltipIcon>

    <div className="flex flex-col gap-1.5 w-full" role="list" aria-live="polite">
      {modules.map((mod) => {
        const locked = isModuleLocked(mod.id);
        const isActive = activeMod === mod.id;
        const modScore = calculateModuleScore(mod.id);
        const completed = modScore >= 80 && !locked;
        return (
          <div key={mod.id} role="listitem">
            <TooltipIcon
            premium
            label={
              <div>
                <p className="text-xs font-bold text-petroleum dark:text-corporate">Módulo {mod.id}: {mod.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-corporate font-semibold">{modScore}%</span>
                  <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full" style={{ width: `${modScore}%` }} />
                  </div>
                </div>
              </div>
            }
          >
            <button
              onClick={() => !locked && goToModule(mod.id)}
              disabled={locked}
              className={`relative w-full min-h-[44px] rounded-lg flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-petroleum/40 flex-shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-md shadow-petroleum/15 ring-1 ring-white/15'
                  : 'bg-petroleum/8 dark:bg-petroleum/20 text-petroleum dark:text-[#4DA8C4] hover:bg-petroleum/15 dark:hover:bg-petroleum/30 hover:shadow-sm hover:scale-[1.03]'
              } ${locked ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer'}`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`${mod.title}${locked ? ' (bloqueado)' : ''}`}
            >
              {isActive && (
                <motion.div layoutId="activeModuleBar" className="absolute -left-1.5 w-[3px] h-5 rounded-full bg-gradient-to-b from-petroleum-dark to-corporate shadow-sm" />
              )}
              <span className="text-base font-extrabold">{mod.id}</span>
              {locked && <Icon name="fa-lock" className="text-xs text-petroleum/40 dark:text-slate-500" aria-hidden="true" />}
              {completed && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm ring-1 ring-white dark:ring-slate-800">
                  <Icon name="fa-check" className="text-[6px] text-white" aria-hidden="true" />
                </div>
              )}
            </button>
          </TooltipIcon>
          </div>
        );
      })}
    </div>

    <div className="relative w-full flex items-center justify-center py-1">
      <div className="w-8 h-px bg-gradient-to-r from-transparent via-petroleum/20 dark:via-petroleum/40 to-transparent" />
      <div className="absolute w-1 h-1 rounded-full bg-petroleum/30 dark:bg-petroleum/50" />
    </div>

    <TooltipIcon label="Recursos adicionales del módulo">
      <div className="w-full min-h-[44px] rounded-lg bg-gradient-to-br from-petroleum/8 to-corporate/5 border border-petroleum/10 flex items-center justify-center gap-2.5 hover:bg-petroleum/10 dark:hover:bg-petroleum/20 transition-colors cursor-pointer flex-shrink-0 shadow-sm"
        onClick={() => window.dispatchEvent(new CustomEvent('ialab:openTopic'))}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.dispatchEvent(new CustomEvent('ialab:openTopic')); } }}
      >
        <Icon name="fa-cubes" className="text-corporate text-lg" aria-hidden="true" />
      </div>
    </TooltipIcon>

    {storedCertificate && (
      <TooltipIcon label={t('sidebar.certificate_view')}>
        <div className="w-full min-h-[44px] rounded-lg bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 border border-amber-200/50 dark:border-amber-700/30 flex items-center justify-center gap-2.5 cursor-pointer hover:from-amber-100 hover:to-amber-200/50 dark:hover:from-amber-900/30 dark:hover:to-amber-800/20 transition-all flex-shrink-0"
          onClick={() => setShowCertificateModal(true)}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowCertificateModal(true); } }}
        >
          <Icon name="fa-certificate" className="text-amber-500 text-lg" aria-hidden="true" />
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">{t('sidebar.certificate')}</span>
        </div>
      </TooltipIcon>
    )}
  </motion.div>
);


SidebarCollapsed.propTypes = {
  courseProgress: PropTypes.any,
  modules: PropTypes.any,
  activeMod: PropTypes.any,
  isModuleLocked: PropTypes.any,
  calculateModuleScore: PropTypes.any,
  streak: PropTypes.any,
  isStreakAtRisk: PropTypes.any,
  getLevel: PropTypes.any,
  getTotalPoints: PropTypes.any,
  storedCertificate: PropTypes.any,
  setShowCertificateModal: PropTypes.any,
  goToModule: PropTypes.any,
  fadeTransition: PropTypes.any,
  t: PropTypes.any,
};

export default React.memo(SidebarCollapsed);
