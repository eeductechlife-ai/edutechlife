import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabContext } from '../../context/IALabContext';

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
    completedModules,
    visitedModules,
    courseProgress,
    sidebarDropdowns,
    toggleSidebarDropdown,
    modules,
    isModuleLocked,
    getCurrentModule,
    calculateGlobalProgress,
    calculateModuleScore
  } = useIALabContext();
  
  const curr = getCurrentModule();
  
   return (
       <aside className="w-56 xl:w-64 flex-shrink-0 border-r border-slate-200/60 bg-white shadow-sm overflow-y-auto">
       <div className="px-4 py-5 space-y-5">
          {/* Progress Circle */}
            <div className="relative overflow-hidden flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm border border-slate-200/60 w-full">
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#00BCD4]" />
             <div className="relative w-24 h-24 mb-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#E2E8F0" strokeWidth="6" fill="none" />
                 <circle cx="48" cy="48" r="40" stroke="url(#sidebar-progress-grad)" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="251.327" strokeDashoffset={251.327 - (251.327 * Math.min(calculateGlobalProgress(), 100)) / 100} className="transition-all duration-700 ease-out" />
                <defs>
                  <linearGradient id="sidebar-progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#004B63" />
                    <stop offset="100%" stopColor="#00BCD4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                   <div className="text-lg font-bold text-[#004B63]">{calculateGlobalProgress()}%</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Completado</div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xs font-bold text-[#004B63] mb-0.5">Progreso del Curso</h3>
              <p className="text-[10px] text-slate-500">Avanza completando módulos</p>
            </div>
         </div>

        {/* Espaciado entre secciones */}
        <div className="mt-8"></div>

         {/* Sección: Módulos del Curso */}
         <div className="px-1 w-full">
           <div className="flex items-center gap-2 mb-3">
             <div className="text-[#004B63]">
               <Icon name="fa-layer-group" className="text-sm" />
             </div>
              <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-[#004B63]">
                MÓDULOS DEL CURSO
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/20 to-transparent"></div>
            </div>
            <div className="space-y-1.5">
              {modules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => !isModuleLocked(mod.id) && setActiveMod(mod.id)}
                  className={`w-full flex items-center gap-2.5 p-3 rounded-xl transition-all duration-300 ${activeMod === mod.id ? 'bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white shadow-md shadow-[#004B63]/15' : 'hover:bg-[#004B63]/5 text-slate-700'} focus:outline-none focus:ring-2 focus:ring-[#004B63]/30 focus:ring-offset-1`}
                  disabled={isModuleLocked(mod.id)}
                  aria-label={`${isModuleLocked(mod.id) ? 'Módulo bloqueado: ' : ''}${mod.title}`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${activeMod === mod.id ? 'bg-white/20' : 'bg-[#004B63]/8'}`}>
                    <Icon name={mod.icon} className={`${activeMod === mod.id ? 'text-white' : 'text-[#004B63]'} text-sm`} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-semibold text-sm truncate">{mod.title}</p>
                    <p className={`text-xs ${activeMod === mod.id ? 'text-white/80' : 'text-slate-500'}`}>
                      {mod.duration}
                    </p>
                  </div>
                  {isModuleLocked(mod.id) && (
                    <Icon name="fa-lock" className="text-xs text-[#004B63]/40" />
                  )}
                  {!isModuleLocked(mod.id) && calculateModuleScore(mod.id) >= 80 && (
                    <Icon name="fa-check" className="text-xs text-emerald-500" />
                  )}
                </button>
              ))}
            </div>
         </div>

          {/* Sección: Videos del Módulo - Integrada al Sidebar */}
          <div className="px-1 w-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="text-[#004B63]">
                  <Icon name="fa-video-camera" className="text-sm" />
                </div>
                <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-[#004B63]">
                  VIDEOS EXTRAS
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/20 to-transparent"></div>
              </div>
              <Icon 
                name={sidebarDropdowns.videos ? "fa-chevron-up" : "fa-chevron-down"} 
                className="text-[#004B63] text-xs transition-transform duration-300 cursor-pointer hover:text-[#0A3550]"
                onClick={() => toggleSidebarDropdown('videos')}
              />
            </div>
        
            {sidebarDropdowns.videos && (
              <div className="space-y-2 animate-fadeIn">
                {/* Video 1: Mastery Framework */}
                <div className="flex items-center gap-2.5 p-2.5 hover:bg-[#004B63]/5 rounded-lg transition-all duration-200 cursor-pointer group">
                  <div className="w-8 h-8 bg-[#004B63]/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/15 transition-colors">
                    <Icon name="fa-play" className="text-[#004B63] text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">Mastery Framework</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">Principiante</span>
                      <span className="text-xs text-slate-400">12:45</span>
                    </div>
                  </div>
                </div>
                
                {/* Video 2: Contexto Dinámico */}
                <div className="flex items-center gap-2.5 p-2.5 hover:bg-[#004B63]/5 rounded-lg transition-all duration-200 cursor-pointer group">
                  <div className="w-8 h-8 bg-[#004B63]/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/15 transition-colors">
                    <Icon name="fa-play" className="text-[#004B63] text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">Contexto Dinámico</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">Intermedio</span>
                      <span className="text-xs text-slate-400">18:20</span>
                    </div>
                  </div>
                </div>
                
                {/* Video 3: Chain-of-Thought */}
                <div className="flex items-center gap-2.5 p-2.5 hover:bg-[#004B63]/5 rounded-lg transition-all duration-200 cursor-pointer group">
                  <div className="w-8 h-8 bg-[#004B63]/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/15 transition-colors">
                    <Icon name="fa-play" className="text-[#004B63] text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">Chain-of-Thought</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 bg-[#004B63]/10 text-[#004B63] rounded-md">Avanzado</span>
                      <span className="text-xs text-slate-400">22:10</span>
                    </div>
                  </div>
                </div>
                
                {/* Video 4: Zero-Shot Prompting */}
                <div className="flex items-center gap-2.5 p-2.5 hover:bg-[#004B63]/5 rounded-lg transition-all duration-200 cursor-pointer group">
                  <div className="w-8 h-8 bg-[#004B63]/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/15 transition-colors">
                    <Icon name="fa-play" className="text-[#004B63] text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">Zero-Shot Prompting</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">Intermedio</span>
                      <span className="text-xs text-slate-400">15:30</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sección: Recursos Adicionales */}
          <div className="px-1 w-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="text-[#004B63]">
                  <Icon name="fa-book" className="text-sm" />
                </div>
                <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-[#004B63]">
                  RECURSOS ADICIONALES
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/20 to-transparent"></div>
              </div>
              <Icon 
                name={sidebarDropdowns.recursos ? "fa-chevron-up" : "fa-chevron-down"} 
                className="text-[#004B63] text-xs transition-transform duration-300 cursor-pointer hover:text-[#0A3550]"
                onClick={() => toggleSidebarDropdown('recursos')}
              />
            </div>
            
            {sidebarDropdowns.recursos && (
              <div className="space-y-2 animate-fadeIn">
                {/* Recurso 1: Cheat Sheet */}
                <div className="flex items-center gap-2.5 p-2.5 hover:bg-[#004B63]/5 rounded-lg transition-all duration-200 cursor-pointer group">
                  <div className="w-8 h-8 bg-[#004B63]/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/15 transition-colors">
                    <Icon name="fa-file-alt" className="text-[#004B63] text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">Cheat Sheet RTF</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md">PDF</span>
                      <span className="text-xs text-slate-400">2 páginas</span>
                    </div>
                  </div>
                </div>
                
                {/* Recurso 2: Ejemplos Prácticos */}
                <div className="flex items-center gap-2.5 p-2.5 hover:bg-[#004B63]/5 rounded-lg transition-all duration-200 cursor-pointer group">
                  <div className="w-8 h-8 bg-[#004B63]/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/15 transition-colors">
                    <Icon name="fa-code" className="text-[#004B63] text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">Ejemplos Prácticos</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md">JSON</span>
                      <span className="text-xs text-slate-400">15 ejemplos</span>
                    </div>
                  </div>
                </div>
                
                {/* Recurso 3: Plantillas */}
                <div className="flex items-center gap-2.5 p-2.5 hover:bg-[#004B63]/5 rounded-lg transition-all duration-200 cursor-pointer group">
                  <div className="w-8 h-8 bg-[#004B63]/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/15 transition-colors">
                    <Icon name="fa-clipboard" className="text-[#004B63] text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">Plantillas Premium</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md">Templates</span>
                      <span className="text-xs text-slate-400">8 plantillas</span>
                    </div>
                  </div>
                </div>
                
                {/* Recurso 4: Casos de Estudio */}
                <div className="flex items-center gap-2.5 p-2.5 hover:bg-[#004B63]/5 rounded-lg transition-all duration-200 cursor-pointer group">
                  <div className="w-8 h-8 bg-[#004B63]/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/15 transition-colors">
                    <Icon name="fa-chart-line" className="text-[#004B63] text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">Casos de Estudio</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md">Case Studies</span>
                      <span className="text-xs text-slate-400">5 casos</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sección: Detalles del Curso */}
          <div className="px-1 w-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-[#004B63]">
                <Icon name="fa-info-circle" className="text-sm" />
              </div>
              <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-[#004B63]">
                DETALLES DEL CURSO
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/20 to-transparent"></div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center p-2.5 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#004B63]/8 rounded-lg flex items-center justify-center">
                    <Icon name="fa-clock" className="text-[#004B63] text-xs" />
                  </div>
                  <span className="text-xs font-medium text-slate-600">Duración</span>
                </div>
                <span className="text-xs font-bold text-[#004B63]">{curr?.duration}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#004B63]/8 rounded-lg flex items-center justify-center">
                    <Icon name="fa-signal" className="text-[#004B63] text-xs" />
                  </div>
                  <span className="text-xs font-medium text-slate-600">Nivel</span>
                </div>
                <span className="text-xs font-bold text-[#004B63]">{curr?.level}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#004B63]/8 rounded-lg flex items-center justify-center">
                    <Icon name="fa-play" className="text-[#004B63] text-xs" />
                  </div>
                  <span className="text-xs font-medium text-slate-600">Videos</span>
                </div>
                <span className="text-xs font-bold text-[#004B63]">{curr?.videos}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#004B63]/8 rounded-lg flex items-center justify-center">
                    <Icon name="fa-briefcase" className="text-[#004B63] text-xs" />
                  </div>
                  <span className="text-xs font-medium text-slate-600">Proyectos</span>
                </div>
                <span className="text-xs font-bold text-[#004B63]">{curr?.projects}</span>
              </div>
            </div>
          </div>
       </div>
     </aside>
  );
};

export default IALabSidebar;