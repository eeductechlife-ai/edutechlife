import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabProgressContext, useIALabUIContext } from '../../context/IALabContext';
import { useProgressContext } from '../../context/ProgressContext';
import { useIALabStore } from '../../store/ialabStore';
import { useSidebarState } from '../../hooks/IALab/useSidebarState';
import { useTranslation } from '../../i18n/I18nProvider';
import CourseCompletionSection from './CourseCompletionSection';
import StreakBadge from './StreakBadge';
import StreakDetailsModal from './StreakDetailsModal';

const COLLAPSED_WIDTH = 72;
const EXPANDED_WIDTH = 256;

const RESOURCE_ITEMS = [
  { idSuffix: '', label: 'Cheat Sheet RTF', icon: 'fa-file-alt', meta: '2 páginas' },
  { idSuffix: '_2', label: 'Ejemplos Prácticos', icon: 'fa-code', meta: '15 ejemplos' },
  { idSuffix: '_3', label: 'Plantillas Premium', icon: 'fa-clipboard', meta: '8 plantillas' },
  { idSuffix: '_4', label: 'Casos de Estudio', icon: 'fa-chart-line', meta: '5 casos' },
];

const TooltipIcon = ({ label, children }) => (
  <div className="relative group/tip flex items-center justify-center">
    {children}
    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible group-focus-within/tip:opacity-100 group-focus-within/tip:visible transition-all duration-200 whitespace-nowrap z-[60] shadow-xl shadow-slate-900/20 pointer-events-none">
      {label}
    </div>
  </div>
);

const IALabSidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goToModule = (id) => navigate(`/ialab/${id}`);
  const {
    activeMod, courseProgress, modules,
    isModuleLocked, calculateModuleScore, completedModules,
  } = useIALabProgressContext();

  const {
    sidebarDropdowns, toggleSidebarDropdown,
    courseCompleted, setShowCertificateModal,
    storedCertificate, generateCertificate, certificateGenerating,
  } = useIALabUIContext();

  const { completedInfographics } = useProgressContext();
  const xp = useIALabStore(s => s.xp);
  const streak = useIALabStore(s => s.streak);
  const getLevel = useIALabStore(s => s.getLevel);
  const getXpForNextLevel = useIALabStore(s => s.getXpForNextLevel);
  const getLevelProgress = useIALabStore(s => s.getLevelProgress);
  const getTotalPoints = useIALabStore(s => s.getTotalPoints);
  const isStreakAtRisk = useIALabStore(s => s.isStreakAtRisk);
  const { isCollapsed, toggleSidebar } = useSidebarState();
  const shouldReduceMotion = useReducedMotion();
  const [showStreakModal, setShowStreakModal] = useState(false);
  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 300, damping: 25 };
  const fadeTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.15 };
  const moduleListVariants = shouldReduceMotion ? {} : {
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } }
  };
  const moduleItemVariants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const isInfographicCompleted = (infographicId) => completedInfographics.includes(`${infographicId}`);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={springTransition}
      className="relative flex-shrink-0 border-r border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 shadow-sm"
    >
      <div className="h-full overflow-y-auto overflow-x-hidden">
        <div className="absolute -right-6 top-2 z-50">
          <motion.button
            onClick={toggleSidebar}
            className="group relative flex items-center gap-3
              h-14 pl-4 pr-5 rounded-r-2xl rounded-l-none
              bg-white/95 dark:bg-slate-800/95
              backdrop-blur-lg
              border-2 border-slate-200/60 dark:border-slate-700/60 border-l-0
              shadow-xl hover:shadow-2xl
              transition-all duration-200
              hover:bg-gradient-to-r hover:from-petroleum/15 hover:to-white/95
              dark:hover:from-petroleum/20 dark:hover:to-slate-800/95
              hover:border-petroleum/40 dark:hover:border-petroleum/50
              hover:w-auto hover:pr-6
              focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 focus-visible:ring-offset-2"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            aria-expanded={!isCollapsed}
          >
            <ChevronLeft
              className={`w-5 h-5 text-petroleum dark:text-corporate transition-all duration-300 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
            />
            <span className="text-sm font-bold text-petroleum dark:text-corporate whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[100px] transition-all duration-300">
              {isCollapsed ? 'Expandir' : 'Colapsar'}
            </span>
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {isCollapsed ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
              className="flex flex-col items-center px-2 py-4 gap-2"
            >
              <div className="min-h-[64px] w-full flex-shrink-0" />

              <TooltipIcon label={`${Math.round(courseProgress)}% completado`}>
                <div className="w-full h-12 rounded-xl bg-gradient-to-br from-petroleum/8 to-corporate/8 border border-petroleum/10 flex items-center justify-center flex-shrink-0 shadow-sm" role="progressbar" aria-valuenow={Math.round(courseProgress)} aria-valuemin="0" aria-valuemax="100">
                  <svg className="w-[38px] h-[38px] -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="12" fill="none" />
                    <circle cx="60" cy="60" r="50" stroke="url(#sidebar-progress-grad-collapsed)" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray="314.159" strokeDashoffset={314.159 - (314.159 * Math.min(courseProgress, 100)) / 100} className="transition-all duration-700 ease-out" />
                    <defs>
                      <linearGradient id="sidebar-progress-grad-collapsed" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#004B63" />
                        <stop offset="100%" stopColor="#00BCD4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </TooltipIcon>

              <TooltipIcon label={`Nivel ${getLevel()}`}>
                <div className="w-full h-12 rounded-xl bg-gradient-to-br from-petroleum/8 to-corporate/8 border border-petroleum/10 flex flex-col items-center justify-center gap-0 flex-shrink-0 shadow-sm">
                  <Icon name="fa-graduation-cap" className="text-corporate text-xl" />
                  <span className="text-sm font-bold text-petroleum dark:text-[#4DA8C4]">Nv.{getLevel()}</span>
                </div>
              </TooltipIcon>

              <TooltipIcon label={`${streak} días racha${isStreakAtRisk() && streak > 0 ? ' — ¡Estudia hoy para mantenerla!' : ''}`}>
                <div className="w-full h-12 rounded-xl bg-gradient-to-br from-petroleum/8 to-corporate/8 border border-petroleum/10 flex flex-col items-center justify-center gap-0 flex-shrink-0 shadow-sm relative">
                  <Icon name="fa-fire" className={`text-xl ${streak >= 3 ? 'text-corporate' : 'text-slate-300'}`} />
                  <span className={`text-sm font-semibold ${streak >= 3 ? 'text-corporate' : 'text-slate-500'}`}>{streak} días</span>
                  {isStreakAtRisk() && streak > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>
              </TooltipIcon>

              <TooltipIcon label={`${getTotalPoints()} puntos acumulados`}>
                <div className="w-full h-12 rounded-xl bg-gradient-to-br from-petroleum/8 to-corporate/8 border border-petroleum/10 flex flex-col items-center justify-center gap-0 flex-shrink-0 shadow-sm">
                  <Icon name="fa-award" className="text-corporate text-2xl" />
                  <span className="text-sm font-bold text-petroleum dark:text-[#4DA8C4]">{getTotalPoints()}</span>
                </div>
              </TooltipIcon>

              <div className="w-10 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent flex-shrink-0"></div>

              <TooltipIcon label="Módulos del curso">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm flex-shrink-0">
                  <Icon name="fa-layer-group" className="text-white text-sm" />
                </div>
              </TooltipIcon>

              <div className="flex flex-col gap-1.5 w-full">
                {modules.map((mod) => {
                  const locked = isModuleLocked(mod.id);
                  const isActive = activeMod === mod.id;
                  const modScore = calculateModuleScore(mod.id);
                  return (
                    <TooltipIcon key={mod.id} label={`${mod.title}${locked ? ' (bloqueado)' : ''}${modScore >= 80 ? ' ✓' : ''}`}>
                      <button
                        onClick={() => !locked && goToModule(mod.id)}
                        disabled={locked}
                        className={`w-full min-h-[44px] rounded-lg flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-petroleum/40 flex-shrink-0 ${
                          isActive
                            ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-md shadow-petroleum/15 ring-1 ring-white/15'
                            : 'bg-petroleum/8 dark:bg-petroleum/20 text-petroleum dark:text-[#4DA8C4] hover:bg-petroleum/15 dark:hover:bg-petroleum/30 hover:shadow-sm'
                        } ${locked ? 'opacity-35' : ''}`}
                        aria-label={`${mod.title}${locked ? ' (bloqueado)' : ''}`}
                      >
                        <span className="text-base font-extrabold">{mod.id}</span>
                        {locked && <Icon name="fa-lock" className="text-xs text-petroleum/40 dark:text-slate-500" />}
                        {modScore >= 80 && !locked && <Icon name="fa-check" className="text-xs text-emerald-400" />}
                      </button>
                    </TooltipIcon>
                  );
                })}
              </div>

              <div className="w-10 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent flex-shrink-0"></div>

              <TooltipIcon label="Recursos adicionales del módulo">
                <div className="w-full min-h-[44px] rounded-lg bg-gradient-to-br from-petroleum/8 to-corporate/5 border border-petroleum/10 flex items-center justify-center gap-2.5 hover:bg-petroleum/10 dark:hover:bg-petroleum/20 transition-colors cursor-pointer flex-shrink-0 shadow-sm"
                  onClick={() => window.dispatchEvent(new CustomEvent('ialab:openTopic'))}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.dispatchEvent(new CustomEvent('ialab:openTopic')); } }}
                >
                  <Icon name="fa-cubes" className="text-corporate text-lg" />
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
                    <Icon name="fa-certificate" className="text-amber-500 text-lg" />
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">{t('sidebar.certificate')}</span>
                  </div>
                </TooltipIcon>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
              className="px-4 py-4 space-y-4"
            >
              <div className="flex flex-col items-center">
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center" role="progressbar" aria-valuenow={Math.round(courseProgress)} aria-valuemin="0" aria-valuemax="100" aria-label="Progreso del curso">
                  <svg className="w-full h-full transform -rotate-90 p-1" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="7" fill="none" />
                    <circle cx="60" cy="60" r="50" stroke="url(#sidebar-progress-grad)" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="314.159" strokeDashoffset={314.159 - (314.159 * Math.min(courseProgress, 100)) / 100} className="transition-all duration-700 ease-out" />
                    <defs>
                      <linearGradient id="sidebar-progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-petroleum)" />
                        <stop offset="100%" stopColor="var(--color-corporate)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-petroleum dark:text-[#4DA8C4]">{Math.round(courseProgress)}%</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{t('sidebar.completed')}</div>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-petroleum dark:text-[#4DA8C4] mt-3">{t('sidebar.progress')}</h3>
              </div>

              <StreakBadge
                streak={streak}
                xp={getTotalPoints()}
                isAtRisk={isStreakAtRisk()}
                level={getLevel()}
                onClick={() => setShowStreakModal(true)}
              />

              <div className="px-2 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm flex-shrink-0">
                    <Icon name="fa-layer-group" className="text-white text-[10px]" />
                  </div>
                  <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-petroleum">
                    {t('sidebar.modules')}
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-petroleum/20 via-corporate/20 to-transparent"></div>
                </div>
                <motion.div
                  variants={moduleListVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  {modules.map((mod) => {
                    const modScore = calculateModuleScore(mod.id);
                    const locked = isModuleLocked(mod.id);
                    const isActive = activeMod === mod.id;

                    return (
                      <motion.button
                        key={mod.id}
                        variants={moduleItemVariants}
                        onClick={() => !locked && goToModule(mod.id)}
                        className={`w-full group flex items-center gap-2 p-2.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-md shadow-petroleum/15 dark:shadow-petroleum/30' : 'hover:bg-petroleum/10 dark:hover:bg-petroleum/20 text-slate-700 dark:text-slate-300'} focus:outline-none focus:ring-2 focus:ring-petroleum/30 dark:focus:ring-petroleum/50 focus:ring-offset-1`}
                        disabled={locked}
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
                          <Icon name="fa-lock" className="text-xs text-petroleum/40 dark:text-slate-500" />
                        )}
                        {!locked && modScore >= 80 && (
                          <Icon name="fa-check" className="text-xs text-emerald-500" />
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>

              <div className="px-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm flex-shrink-0">
                      <Icon name="fa-cubes" className="text-white text-[10px]" />
                    </div>
                    <h3 className="text-xs font-bold tracking-[0.08em] uppercase text-petroleum">
                      {t('sidebar.resources')}
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-petroleum/20 via-corporate/20 to-transparent"></div>
                  </div>
                  <Icon
                    name={sidebarDropdowns.recursos ? "fa-chevron-up" : "fa-chevron-down"}
                    className="text-petroleum text-xs transition-transform duration-300 cursor-pointer hover:text-petroleum-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/30 rounded"
                    onClick={() => toggleSidebarDropdown('recursos')}
                    tabIndex={0}
                    role="button"
                    aria-label={sidebarDropdowns.recursos ? "Colapsar recursos" : "Expandir recursos"}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSidebarDropdown('recursos'); } }}
                  />
                </div>

                <AnimatePresence>
                  {sidebarDropdowns.recursos && (
                    <motion.div
                      key="recursos-content"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={fadeTransition}
                      className="space-y-2"
                    >
                      {RESOURCE_ITEMS.map((item) => {
                        const resourceId = 'i' + activeMod + item.idSuffix;
                        const completed = isInfographicCompleted(resourceId);
                        return (
                          <div
                            key={resourceId}
                            className="flex items-center gap-2.5 p-2.5 hover:bg-petroleum/5 dark:hover:bg-petroleum/10 rounded-lg transition-all duration-200 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/30"
                            onClick={() => window.dispatchEvent(new CustomEvent('ialab:openTopic'))}
                            tabIndex={0}
                            role="button"
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.dispatchEvent(new CustomEvent('ialab:openTopic')); } }}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                              completed ? 'bg-emerald-50' : 'bg-petroleum/8 dark:bg-petroleum/20 group-hover:bg-petroleum/15 dark:group-hover:bg-petroleum/30'
                            }`}>
                              <Icon name={completed ? 'fa-check-circle' : item.icon} className={`text-xs ${completed ? 'text-emerald-500' : 'text-petroleum'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{item.label}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {completed ? (
                                  <span className="text-xs font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md flex items-center gap-1">
                                    <Icon name="fa-check" className="text-[9px]" /> {t('sidebar.completed')}
                                  </span>
                                ) : (
                                  <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">{t('sidebar.pending')}</span>
                                )}
                                <span className="text-xs text-slate-500">{item.meta}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
          )}
        </AnimatePresence>
      </div>
      <StreakDetailsModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
      />
    </motion.aside>
  );
};

export default React.memo(IALabSidebar);
