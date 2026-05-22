import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabContext } from '../../context/IALabContext';
import { useProgressContext } from '../../context/ProgressContext';
import { useIALabStore } from '../../store/ialabStore';
import { useSidebarState } from '../../hooks/IALab/useSidebarState';
import CourseCompletionSection from './CourseCompletionSection';

const COLLAPSED_WIDTH = 72;
const EXPANDED_WIDTH = 256;

const TooltipIcon = ({ label, children }) => (
  <div className="relative group flex items-center justify-center">
    {children}
    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[60] shadow-xl shadow-slate-900/20 pointer-events-none">
      {label}
    </div>
  </div>
);

const IALabSidebar = () => {
  const navigate = useNavigate();
  const goToModule = (id) => navigate(`/ialab/${id}`);
  const {
    activeMod,
    courseProgress,
    sidebarDropdowns,
    toggleSidebarDropdown,
    modules,
    isModuleLocked,
    calculateModuleScore,
    courseCompleted,
    setShowCertificateModal,
    storedCertificate,
    generateCertificate,
    certificateGenerating,
    completedModules,
    getBadgesSummary,
    getUserBadges,
  } = useIALabContext();

  const { completedInfographics } = useProgressContext();
  const { xp, streak, badges, getLevel, getXpForNextLevel, getLevelProgress, calculateModulePoints, getTotalPoints, isStreakAtRisk } = useIALabStore();
  const { isCollapsed, toggleSidebar } = useSidebarState();

  const isInfographicCompleted = (infographicId) => completedInfographics.includes(`${infographicId}`);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative flex-shrink-0 border-r border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 shadow-sm overflow-hidden"
    >
      <div className="h-full overflow-y-auto overflow-x-hidden">
        {/* Toggle Button — Top-right, extra grande */}
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

        {/* Expanded Content */}
        <div className={`px-4 py-4 space-y-4 transition-opacity duration-200 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {/* Progress Circle */}
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
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 mt-0.5">Completado</div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-petroleum dark:text-[#4DA8C4] mt-3">Progreso del Curso</h3>
          </div>

          {/* Nivel - Puntos acumulados */}
          <div className="w-full p-3 bg-gradient-to-br from-petroleum/5 to-corporate/5 rounded-xl border border-petroleum/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="fa-graduation-cap" className="text-corporate text-base" />
                <span className="text-sm font-bold text-petroleum dark:text-[#4DA8C4]">Nv.{getLevel()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="fa-fire" className={`text-sm ${streak >= 3 ? 'text-corporate' : 'text-slate-300'}`} />
                <span className={`text-sm font-semibold ${streak >= 3 ? 'text-corporate' : 'text-slate-400'}`}>{streak} días</span>
                {isStreakAtRisk() && streak > 0 && (
                  <span className="text-[9px] text-amber-500 font-medium ml-1 animate-pulse">⚠️</span>
                )}
              </div>
            </div>

            <div className="border-t border-petroleum/10"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Icon name="fa-award" className="text-corporate text-xs" />
                <span className="text-sm font-semibold text-petroleum dark:text-[#4DA8C4]">Puntos acumulados</span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-sm font-bold text-corporate dark:text-[#66CCCC]">{getTotalPoints()}</span>
                <span className="text-[9px] text-slate-400">/ 1000</span>
              </div>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={getTotalPoints()} aria-valuemin="0" aria-valuemax="1000" aria-label="Puntos acumulados">
              <div className="h-full rounded-full bg-petroleum transition-all duration-700"
                   style={{ width: `${(getTotalPoints() / 1000) * 100}%` }} />
            </div>
          </div>

          {/* Módulos del Curso */}
          <div className="px-2 w-full">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm flex-shrink-0">
                <Icon name="fa-layer-group" className="text-white text-[10px]" />
              </div>
              <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-petroleum">
                MÓDULOS DEL CURSO
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-petroleum/20 via-corporate/20 to-transparent"></div>
            </div>
            <div className="space-y-2">
              {modules.map((mod) => {
                const modScore = calculateModuleScore(mod.id);
                const locked = isModuleLocked(mod.id);
                const isActive = activeMod === mod.id;

                return (
                  <button
                    key={mod.id}
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
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recursos Adicionales */}
          <div className="px-1 w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm flex-shrink-0">
                  <Icon name="fa-cubes" className="text-white text-[10px]" />
                </div>
                <h3 className="text-xs font-bold tracking-[0.08em] uppercase text-petroleum">
                  RECURSOS ADICIONALES
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

            {sidebarDropdowns.recursos && (
              <div className="space-y-2 animate-fadeIn">
                <div
                  className="flex items-center gap-2.5 p-2.5 hover:bg-petroleum/5 dark:hover:bg-petroleum/10 rounded-lg transition-all duration-200 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/30"
                  onClick={() => window.dispatchEvent(new CustomEvent('ialab:openTopic'))}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.dispatchEvent(new CustomEvent('ialab:openTopic')); } }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isInfographicCompleted('i' + activeMod) ? 'bg-emerald-50' : 'bg-petroleum/8 dark:bg-petroleum/20 group-hover:bg-petroleum/15 dark:group-hover:bg-petroleum/30'
                  }`}>
                    <Icon name={isInfographicCompleted('i' + activeMod) ? 'fa-check-circle' : 'fa-file-alt'} className={`text-xs ${isInfographicCompleted('i' + activeMod) ? 'text-emerald-500' : 'text-petroleum'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">Cheat Sheet RTF</p>
                    <div className="flex items-center gap-2 mt-1">
                      {isInfographicCompleted('i' + activeMod) ? (
                        <span className="text-xs font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md flex items-center gap-1">
                          <Icon name="fa-check" className="text-[9px]" /> Completado
                        </span>
                      ) : (
                        <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">Pendiente</span>
                      )}
                      <span className="text-xs text-slate-400">2 páginas</span>
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-2.5 p-2.5 hover:bg-petroleum/5 dark:hover:bg-petroleum/10 rounded-lg transition-all duration-200 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/30"
                  onClick={() => window.dispatchEvent(new CustomEvent('ialab:openTopic'))}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.dispatchEvent(new CustomEvent('ialab:openTopic')); } }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isInfographicCompleted('i' + activeMod + '_2') ? 'bg-emerald-50' : 'bg-petroleum/8 dark:bg-petroleum/20 group-hover:bg-petroleum/15 dark:group-hover:bg-petroleum/30'
                  }`}>
                    <Icon name={isInfographicCompleted('i' + activeMod + '_2') ? 'fa-check-circle' : 'fa-code'} className={`text-xs ${isInfographicCompleted('i' + activeMod + '_2') ? 'text-emerald-500' : 'text-petroleum'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">Ejemplos Prácticos</p>
                    <div className="flex items-center gap-2 mt-1">
                      {isInfographicCompleted('i' + activeMod + '_2') ? (
                        <span className="text-xs font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md flex items-center gap-1">
                          <Icon name="fa-check" className="text-[9px]" /> Completado
                        </span>
                      ) : (
                        <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">Pendiente</span>
                      )}
                      <span className="text-xs text-slate-400">15 ejemplos</span>
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-2.5 p-2.5 hover:bg-petroleum/5 dark:hover:bg-petroleum/10 rounded-lg transition-all duration-200 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/30"
                  onClick={() => window.dispatchEvent(new CustomEvent('ialab:openTopic'))}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.dispatchEvent(new CustomEvent('ialab:openTopic')); } }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isInfographicCompleted('i' + activeMod + '_3') ? 'bg-emerald-50' : 'bg-petroleum/8 dark:bg-petroleum/20 group-hover:bg-petroleum/15 dark:group-hover:bg-petroleum/30'
                  }`}>
                    <Icon name={isInfographicCompleted('i' + activeMod + '_3') ? 'fa-check-circle' : 'fa-clipboard'} className={`text-xs ${isInfographicCompleted('i' + activeMod + '_3') ? 'text-emerald-500' : 'text-petroleum'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">Plantillas Premium</p>
                    <div className="flex items-center gap-2 mt-1">
                      {isInfographicCompleted('i' + activeMod + '_3') ? (
                        <span className="text-xs font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md flex items-center gap-1">
                          <Icon name="fa-check" className="text-[9px]" /> Completado
                        </span>
                      ) : (
                        <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">Pendiente</span>
                      )}
                      <span className="text-xs text-slate-400">8 plantillas</span>
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-2.5 p-2.5 hover:bg-petroleum/5 dark:hover:bg-petroleum/10 rounded-lg transition-all duration-200 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/30"
                  onClick={() => window.dispatchEvent(new CustomEvent('ialab:openTopic'))}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.dispatchEvent(new CustomEvent('ialab:openTopic')); } }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isInfographicCompleted('i' + activeMod + '_4') ? 'bg-emerald-50' : 'bg-petroleum/8 dark:bg-petroleum/20 group-hover:bg-petroleum/15 dark:group-hover:bg-petroleum/30'
                  }`}>
                    <Icon name={isInfographicCompleted('i' + activeMod + '_4') ? 'fa-check-circle' : 'fa-chart-line'} className={`text-xs ${isInfographicCompleted('i' + activeMod + '_4') ? 'text-emerald-500' : 'text-petroleum'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">Casos de Estudio</p>
                    <div className="flex items-center gap-2 mt-1">
                      {isInfographicCompleted('i' + activeMod + '_4') ? (
                        <span className="text-xs font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md flex items-center gap-1">
                          <Icon name="fa-check" className="text-[9px]" /> Completado
                        </span>
                      ) : (
                        <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">Pendiente</span>
                      )}
                      <span className="text-xs text-slate-400">5 casos</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Insignias - Solo visible para usuarios certificados */}
          {storedCertificate && (() => {
            const badgesSummary = getBadgesSummary();
            if (badgesSummary.earned === 0) return null;
            return (
              <div className="px-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm flex-shrink-0">
                      <Icon name="fa-award" className="text-white text-[10px]" />
                    </div>
                    <h3 className="text-[10px] font-bold tracking-[0.08em] uppercase text-petroleum">
                      INSIGNIAS
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-petroleum/20 via-corporate/20 to-transparent"></div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] md:text-xs text-slate-500">
                      {badgesSummary.earned}/{badgesSummary.total} ganadas
                    </span>
                    <span className="text-[10px] md:text-xs font-semibold text-corporate">
                      {Math.round((badgesSummary.earned / badgesSummary.total) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={badgesSummary.earned} aria-valuemin="0" aria-valuemax={badgesSummary.total} aria-label="Progreso de insignias">
                    <div
                      className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full transition-all duration-700"
                      style={{ width: `${(badgesSummary.earned / badgesSummary.total) * 100}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 mt-2">
                    {badgesSummary.recent.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex flex-col items-center p-2 rounded-lg bg-petroleum/5 hover:bg-petroleum/10 transition-colors group relative min-h-[52px]"
                        aria-label={`${badge.label}: ${badge.desc}`}
                      >
                        <Icon name={badge.icon} className="text-sm text-corporate" />
                        <span className="text-[9px] md:text-[10px] text-slate-500 mt-0.5 text-center leading-tight group-hover:text-petroleum transition-colors">
                          {badge.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Certificación del Curso */}
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
        </div>

        {/* Collapsed Content — Micro Dashboard Strip */}
        <div className={`absolute inset-0 flex flex-col items-center px-2 pb-0 overflow-y-auto justify-between gap-2 transition-opacity duration-200 ${isCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          
          {/* Top spacer — empuja contenido debajo del toggle button (h-14 + top-2 = 64px) */}
          <div className="min-h-[64px] w-full flex-shrink-0" />

          {/* Progress — círculo independiente */}
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

          {/* Porcentaje — número debajo */}
          <TooltipIcon label={`${Math.round(courseProgress)}% completado`}>
            <div className="w-full h-10 rounded-xl bg-gradient-to-br from-petroleum/6 to-corporate/6 border border-petroleum/10 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-sm font-bold text-petroleum dark:text-[#4DA8C4]">{Math.round(courseProgress)}%</span>
            </div>
          </TooltipIcon>

          {/* Nivel — stacked vertical */}
          <TooltipIcon label={`Nivel ${getLevel()}`}>
            <div className="w-full h-12 rounded-xl bg-gradient-to-br from-petroleum/8 to-corporate/8 border border-petroleum/10 flex flex-col items-center justify-center gap-0 flex-shrink-0 shadow-sm">
              <Icon name="fa-graduation-cap" className="text-corporate text-xl" />
              <span className="text-sm font-bold text-petroleum dark:text-[#4DA8C4]">Nv.{getLevel()}</span>
            </div>
          </TooltipIcon>

          {/* Racha — stacked vertical */}
          <TooltipIcon label={`${streak} días racha${isStreakAtRisk() && streak > 0 ? ' — ¡Estudia hoy para mantenerla!' : ''}`}>
            <div className="w-full h-12 rounded-xl bg-gradient-to-br from-petroleum/8 to-corporate/8 border border-petroleum/10 flex flex-col items-center justify-center gap-0 flex-shrink-0 shadow-sm relative">
              <Icon name="fa-fire" className={`text-xl ${streak >= 3 ? 'text-corporate' : 'text-slate-300'}`} />
              <span className={`text-sm font-semibold ${streak >= 3 ? 'text-corporate' : 'text-slate-400'}`}>{streak} días</span>
              {isStreakAtRisk() && streak > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
          </TooltipIcon>

          {/* Puntos — stacked vertical */}
          <TooltipIcon label={`${getTotalPoints()} puntos acumulados`}>
            <div className="w-full h-12 rounded-xl bg-gradient-to-br from-petroleum/8 to-corporate/8 border border-petroleum/10 flex flex-col items-center justify-center gap-0 flex-shrink-0 shadow-sm">
              <Icon name="fa-award" className="text-corporate text-2xl" />
              <span className="text-sm font-bold text-petroleum dark:text-[#4DA8C4]">{getTotalPoints()}</span>
            </div>
          </TooltipIcon>

          <div className="w-10 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent flex-shrink-0"></div>

          {/* Módulos — icono de sección */}
          <TooltipIcon label="Módulos del curso">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm flex-shrink-0">
              <Icon name="fa-layer-group" className="text-white text-sm" />
            </div>
          </TooltipIcon>

          {/* Módulos — pills full-width (MISMO ESTILO, VERTICAL) */}
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
                    className={`w-full h-9 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-petroleum/40 flex-shrink-0 ${
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

          {/* Recursos Adicionales — full-width pill */}
          <TooltipIcon label="Recursos adicionales del módulo">
            <div className="w-full h-10 rounded-lg bg-gradient-to-br from-petroleum/8 to-corporate/5 border border-petroleum/10 flex items-center justify-center gap-2.5 hover:bg-petroleum/10 dark:hover:bg-petroleum/20 transition-colors cursor-pointer flex-shrink-0 shadow-sm"
              onClick={() => window.dispatchEvent(new CustomEvent('ialab:openTopic'))}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.dispatchEvent(new CustomEvent('ialab:openTopic')); } }}
            >
              <Icon name="fa-cubes" className="text-corporate text-lg" />
            </div>
          </TooltipIcon>

          {/* Insignias — full-width pill (solo si hay certificado) */}
          {storedCertificate && (() => {
            const badgesSummary = getBadgesSummary();
            if (badgesSummary.earned === 0) return null;
            return (
              <TooltipIcon label={`${badgesSummary.earned}/${badgesSummary.total} insignias ganadas`}>
                <div className="w-full h-9 rounded-lg bg-petroleum/5 dark:bg-petroleum/[0.12] border border-petroleum/10 dark:border-petroleum/20 flex items-center justify-center gap-2.5 flex-shrink-0">
                  <Icon name="fa-award" className="text-corporate text-lg" />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{badgesSummary.earned}/{badgesSummary.total}</span>
                </div>
              </TooltipIcon>
            );
          })()}

          {/* Certificación — full-width pill (solo si hay certificado) */}
          {storedCertificate && (
            <TooltipIcon label="Ver certificado del curso">
              <div className="w-full h-9 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 border border-amber-200/50 dark:border-amber-700/30 flex items-center justify-center gap-2.5 cursor-pointer hover:from-amber-100 hover:to-amber-200/50 dark:hover:from-amber-900/30 dark:hover:to-amber-800/20 transition-all flex-shrink-0"
                onClick={() => setShowCertificateModal(true)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowCertificateModal(true); } }}
              >
                <Icon name="fa-certificate" className="text-amber-500 text-lg" />
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Certificado</span>
              </div>
            </TooltipIcon>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default IALabSidebar;
