import React from 'react'
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import TooltipIcon from './SidebarTooltipIcon';
import ModuleNavItem from './ModuleNavItem';

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
    className="relative flex flex-col items-center px-2 py-4 gap-2 ring-1 ring-inset ring-petroleum/10 dark:ring-petroleum/20"
  >
    <div className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-petroleum/30 via-corporate/30 to-transparent rounded-full pointer-events-none" />
    <div className="absolute -bottom-20 -left-8 w-28 h-28 bg-gradient-to-br from-petroleum/5 to-corporate/5 rounded-full blur-3xl pointer-events-none" />

    <div className="min-h-[64px] w-full flex-shrink-0 flex items-center justify-center">
      <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-petroleum/40 to-corporate/30 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
        <div className="w-2 h-2 rounded-full bg-gradient-to-br from-petroleum to-corporate shadow-sm" />
      </div>
    </div>

    <TooltipIcon decorative label={t('sidebar.completed_pct', { pct: Math.round(courseProgress) })} premium>
      <div className="w-full h-[60px] flex items-center justify-center flex-shrink-0 relative group" role="progressbar" aria-valuenow={Math.round(courseProgress)} aria-valuemin="0" aria-valuemax="100">
        <div className="relative w-12 h-12 transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 120 120">
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
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-extrabold text-petroleum dark:text-[#4DA8C4]">
              {Math.round(courseProgress)}%
            </span>
          </div>
        </div>
      </div>
    </TooltipIcon>

    <div className="flex flex-col items-center gap-1.5 w-full">

      <TooltipIcon decorative label={t('sidebar.level_label', { level: getLevel() })} premium>
        <div className="flex flex-col items-center gap-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm">
            <Icon name="fa-graduation-cap" className="text-white text-xs" aria-hidden="true" />
          </div>
          <span className="text-[10px] font-bold text-petroleum dark:text-[#4DA8C4] mt-0.5 leading-tight">{t('sidebar.level', { level: getLevel() })}</span>
        </div>
      </TooltipIcon>

      <TooltipIcon decorative label={`${t('sidebar.streak_days', { streak })}${isStreakAtRisk() && streak > 0 ? ` — ${t('sidebar.streak_study_today')}` : ''}`} premium>
        <div className="flex flex-col items-center gap-0">
          <motion.div
            animate={streak > 0 ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-sm">
              <Icon name="fa-fire" className="text-white text-xs" aria-hidden="true" />
            </div>
          </motion.div>
          <span className={`text-[10px] font-bold mt-0.5 leading-tight ${streak >= 3 ? 'text-orange-600' : 'text-slate-500'}`}>{streak}</span>
          {isStreakAtRisk() && streak > 0 && (
            <span className="absolute top-0.5 right-0 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </div>
      </TooltipIcon>

      <TooltipIcon decorative label={t('sidebar.points_accumulated', { points: formatPoints(getTotalPoints()) })} premium>
        <div className="flex flex-col items-center gap-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm">
            <Icon name="fa-award" className="text-white text-xs" aria-hidden="true" />
          </div>
          <span className="text-[10px] font-bold text-petroleum dark:text-[#4DA8C4] mt-0.5 leading-tight">{formatPoints(getTotalPoints())}</span>
        </div>
      </TooltipIcon>

    </div>

    <div className="relative w-full flex items-center justify-center py-1">
      <div className="w-8 h-px bg-gradient-to-r from-transparent via-petroleum/20 dark:via-petroleum/40 to-transparent" />
      <div className="absolute w-1 h-1 rounded-full bg-petroleum/30 dark:bg-petroleum/50" />
    </div>

    <TooltipIcon decorative label={t('sidebar.modules')}>
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm flex-shrink-0">
        <Icon name="fa-layer-group" className="text-white text-[11px]" aria-hidden="true" />
      </div>
    </TooltipIcon>

    <h2 className="sr-only">{t('sidebar.modules')}</h2>
    <div className="flex flex-col gap-1 w-full" role="list">
      {modules.map((mod) => {
        const locked = isModuleLocked(mod.id);
        const isActive = activeMod === mod.id;
        const modScore = calculateModuleScore(mod.id);
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
            <ModuleNavItem
              mod={mod}
              isActive={isActive}
              isLocked={locked}
              score={modScore}
              variant="compact"
              onClick={goToModule}
            />
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
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="w-full min-h-[44px] flex items-center justify-center cursor-pointer flex-shrink-0 group rounded-xl"
        onClick={() => window.dispatchEvent(new CustomEvent('ialab:openTopic'))}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.dispatchEvent(new CustomEvent('ialab:openTopic')); } }}
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm">
          <Icon name="fa-cubes" className="text-white text-sm" aria-hidden="true" />
        </div>
      </motion.div>
    </TooltipIcon>

    {storedCertificate && (
      <TooltipIcon label={t('sidebar.certificate_view')}>
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="w-full min-h-[44px] flex items-center justify-center gap-1 cursor-pointer flex-shrink-0 group rounded-xl"
          onClick={() => setShowCertificateModal(true)}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowCertificateModal(true); } }}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-sm">
            <Icon name="fa-certificate" className="text-white text-sm" aria-hidden="true" />
          </div>
        </motion.div>
      </TooltipIcon>
    )}
    <div className="absolute bottom-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-corporate/25 to-petroleum/30 rounded-full pointer-events-none" />
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
  storedCertificate: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  setShowCertificateModal: PropTypes.func,
  goToModule: PropTypes.func,
  fadeTransition: PropTypes.object,
  t: PropTypes.func,
};

export default React.memo(SidebarCollapsed);
