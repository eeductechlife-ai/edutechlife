import React from 'react'
import PropTypes from 'prop-types';
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

    <TooltipIcon label={t('sidebar.completed_pct', { pct: Math.round(courseProgress) })} premium>
      <div className="w-full h-12 flex items-center justify-center flex-shrink-0 relative group" role="progressbar" aria-valuenow={Math.round(courseProgress)} aria-valuemin="0" aria-valuemax="100">
        <div className="transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
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
      </div>
    </TooltipIcon>

    <TooltipIcon label={t('sidebar.level_label', { level: getLevel() })} premium>
      <div className="w-full h-12 flex flex-col items-center justify-center gap-0 flex-shrink-0 group">
        <div className="flex flex-col items-center justify-center gap-0 transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
          <Icon name="fa-graduation-cap" className="text-corporate text-lg" aria-hidden="true" />
          <span className="text-[10px] font-bold text-petroleum dark:text-[#4DA8C4] leading-tight">{t('sidebar.level', { level: getLevel() })}</span>
        </div>
      </div>
    </TooltipIcon>

    <TooltipIcon label={`${t('sidebar.streak_days', { streak })}${isStreakAtRisk() && streak > 0 ? ` — ${t('sidebar.streak_study_today')}` : ''}`} premium>
      <div className="w-full h-12 flex flex-col items-center justify-center gap-0 flex-shrink-0 relative group">
        <div className="flex flex-col items-center justify-center gap-0 transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
          <motion.div
            animate={streak > 0 ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon name="fa-fire" className={`text-lg ${streak >= 3 ? 'text-orange-500' : 'text-slate-300'}`} aria-hidden="true" />
          </motion.div>
          <span className={`text-[10px] font-semibold leading-tight ${streak >= 3 ? 'text-orange-600' : 'text-slate-500'}`}>{streak}</span>
        </div>
        {isStreakAtRisk() && streak > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        )}
      </div>
    </TooltipIcon>

    <TooltipIcon label={t('sidebar.points_accumulated', { points: formatPoints(getTotalPoints()) })} premium>
      <div className="w-full h-12 flex flex-col items-center justify-center gap-0 flex-shrink-0 group">
        <div className="flex flex-col items-center justify-center gap-0 transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
          <Icon name="fa-award" className="text-corporate text-xl" aria-hidden="true" />
          <span className="text-[10px] font-bold text-petroleum dark:text-[#4DA8C4] leading-tight">{formatPoints(getTotalPoints())}</span>
        </div>
      </div>
    </TooltipIcon>

    <div className="relative w-full flex items-center justify-center py-1">
      <div className="w-8 h-px bg-gradient-to-r from-transparent via-petroleum/20 dark:via-petroleum/40 to-transparent" />
      <div className="absolute w-1 h-1 rounded-full bg-petroleum/30 dark:bg-petroleum/50" />
    </div>

    <TooltipIcon label={t('sidebar.modules')}>
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm flex-shrink-0">
        <Icon name="fa-layer-group" className="text-white text-sm" aria-hidden="true" />
      </div>
    </TooltipIcon>

    <div className="flex flex-col gap-1.5 w-full" role="list">
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
                <p className="text-xs font-bold text-petroleum dark:text-corporate">{t('sidebar.module_tooltip', { id: mod.id, title: mod.title })}</p>
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
              className={`relative w-full min-h-[44px] rounded-lg flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 flex-shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-md shadow-petroleum/15 ring-1 ring-white/15'
                  : 'text-petroleum/60 dark:text-slate-400 hover:text-petroleum dark:hover:text-[#4DA8C4] hover:scale-110 active:scale-95'
              } ${locked ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer'}`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`${mod.title}${locked ? ` (${t('sidebar.locked')})` : ''}`}
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

    <TooltipIcon label={t('sidebar.resources_tooltip')}>
      <div className="w-full min-h-[44px] flex items-center justify-center cursor-pointer flex-shrink-0 transition-transform duration-200 hover:scale-110 active:scale-95 group"
        onClick={() => window.dispatchEvent(new CustomEvent('ialab:openTopic'))}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.dispatchEvent(new CustomEvent('ialab:openTopic')); } }}
      >
        <Icon name="fa-cubes" className="text-xl text-corporate/70 group-hover:text-corporate transition-colors duration-200" aria-hidden="true" />
      </div>
    </TooltipIcon>

    {storedCertificate && (
      <TooltipIcon label={t('sidebar.certificate_view')}>
        <div className="w-full min-h-[44px] flex items-center justify-center gap-1 cursor-pointer flex-shrink-0 transition-transform duration-200 hover:scale-110 active:scale-95 group"
          onClick={() => setShowCertificateModal(true)}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowCertificateModal(true); } }}
        >
          <Icon name="fa-certificate" className="text-lg text-amber-500/70 group-hover:text-amber-500 transition-colors duration-200" aria-hidden="true" />
          <span className="text-[10px] font-semibold text-amber-600/70 group-hover:text-amber-600 transition-colors duration-200">{t('sidebar.certificate')}</span>
        </div>
      </TooltipIcon>
    )}
  </motion.div>
);


SidebarCollapsed.propTypes = {
  courseProgress: PropTypes.number,
  modules: PropTypes.array,
  activeMod: PropTypes.number,
  isModuleLocked: PropTypes.func,
  calculateModuleScore: PropTypes.func,
  streak: PropTypes.number,
  isStreakAtRisk: PropTypes.func,
  getLevel: PropTypes.func,
  getTotalPoints: PropTypes.func,
  storedCertificate: PropTypes.bool,
  setShowCertificateModal: PropTypes.func,
  goToModule: PropTypes.func,
  fadeTransition: PropTypes.object,
  t: PropTypes.func,
};

export default React.memo(SidebarCollapsed);
