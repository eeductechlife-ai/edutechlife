import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabContext } from '../../context/IALabContext';
import { useProgressContext } from '../../context/ProgressContext';
import { useIALabStore } from '../../store/ialabStore';
import CourseCompletionSection from './CourseCompletionSection';

/**
 * COMPONENTE: IALabSidebar
 * 
 * Responsabilidad: Sidebar de navegación izquierdo
 * - Progress Circle animado
 * - Lista de módulos del curso con estados (locked/completed)
 * - Acordeón de Videos del Módulo
 * - Acordeón de Recursos Adicionales
 * - Detalles del Curso (duración, nivel, videos, proyectos)
 * - Estructura idéntica al original
 */

const IALabSidebar = () => {
  const {
    activeMod,
    setActiveMod,
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
  const { xp, streak, badges, getLevel, getXpForNextLevel, getLevelProgress, calculateModulePoints, getTotalPoints } = useIALabStore();
  
  const isInfographicCompleted = (infographicId) => completedInfographics.includes(`${infographicId}`);
  
   return (
        <aside className="w-56 xl:w-64 flex-shrink-0 border-r border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 shadow-sm overflow-y-auto">
        <div className="px-4 py-4 space-y-4">
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

         {/* Sección: Módulos del Curso */}
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
                const isLocked = isModuleLocked(mod.id);
                const isActive = activeMod === mod.id;
                
                return (
                  <button
                    key={mod.id}
                    onClick={() => !isLocked && setActiveMod(mod.id)}
                    className={`w-full group flex items-center gap-2 p-2.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-md shadow-petroleum/15 dark:shadow-petroleum/30' : 'hover:bg-petroleum/10 dark:hover:bg-petroleum/20 text-slate-700 dark:text-slate-300'} focus:outline-none focus:ring-2 focus:ring-petroleum/30 dark:focus:ring-petroleum/50 focus:ring-offset-1`}
                    disabled={isLocked}
                    aria-label={`${isLocked ? 'Módulo bloqueado: ' : ''}${mod.title}`}
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
                    {isLocked && (
                      <Icon name="fa-lock" className="text-xs text-petroleum/40 dark:text-slate-500" />
                    )}
                    {!isLocked && modScore >= 80 && (
                      <Icon name="fa-check" className="text-xs text-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sección: Recursos Adicionales */}
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
                {/* Recurso 1: Cheat Sheet RTF */}
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
                
                {/* Recurso 2: Ejemplos Prácticos */}
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
                
                {/* Recurso 3: Plantillas Premium */}
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
                
                {/* Recurso 4: Casos de Estudio */}
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



          {/* Sección: Insignias - Solo visible para usuarios certificados */}
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
                    <span className="text-[10px] text-slate-500">
                      {badgesSummary.earned}/{badgesSummary.total} ganadas
                    </span>
                    <span className="text-[10px] font-semibold text-corporate">
                      {Math.round((badgesSummary.earned / badgesSummary.total) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={badgesSummary.earned} aria-valuemin="0" aria-valuemax={badgesSummary.total} aria-label="Progreso de insignias">
                    <div
                      className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full transition-all duration-700"
                      style={{ width: `${(badgesSummary.earned / badgesSummary.total) * 100}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-1 mt-2">
                    {badgesSummary.recent.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex flex-col items-center p-1.5 rounded-lg bg-petroleum/5 hover:bg-petroleum/10 transition-colors group relative"
                        aria-label={`${badge.label}: ${badge.desc}`}
                      >
                        <Icon name={badge.icon} className="text-sm text-corporate" />
                        <span className="text-[7px] text-slate-500 mt-0.5 text-center leading-tight group-hover:text-petroleum transition-colors">
                          {badge.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

        {/* Sección: Certificación del Curso - Solo visible cuando tiene certificado */}
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
    </aside>
  );
};

export default IALabSidebar;