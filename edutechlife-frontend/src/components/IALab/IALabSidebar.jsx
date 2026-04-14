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
    getCurrentModule
  } = useIALabContext();
  
  const curr = getCurrentModule();
  
  return (
    <aside className="w-[20%] h-[calc(100vh-5rem)] border-r border-[#004B63]/10 bg-gradient-to-b from-white via-white/98 to-[#F8FAFC]/95 backdrop-blur-xl shadow-[0_12px_48px_rgba(0,75,99,0.12)] z-30 overflow-y-auto">
      <div className="px-5 py-6 space-y-6">
        {/* Progress Circle */}
        <div className="flex flex-col items-center p-6 border border-slate-100/60 bg-white/90 shadow-[0_40px_80px_rgba(0,75,99,0.08)] rounded-3xl w-full backdrop-blur-sm">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="#E2E8F0" strokeWidth="10" fill="none" className="stroke-slate-100" />
              <circle cx="64" cy="64" r="56" stroke="#00BCD4" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="351.858" strokeDashoffset={351.858 - (351.858 * Math.min(completedModules.length * 20, 100)) / 100} className="transition-all duration-700 ease-out" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00374A]">{Math.min(completedModules.length * 20, 100)}%</div>
                <div className="text-xs text-slate-500 mt-1">Completado</div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-[#00374A] mb-1">Progreso del Curso</h3>
            <p className="text-sm text-slate-600">Avanza completando módulos</p>
          </div>
        </div>

        {/* Espaciado entre secciones */}
        <div className="mt-8"></div>

        {/* Sección: Módulos del Curso */}
        <div className="px-2 w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-[#004B63]">
              <Icon name="fa-layer-group" className="text-sm" />
            </div>
            <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-[#004B63] font-display">
              MÓDULOS DEL CURSO
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/30 to-transparent"></div>
          </div>
          <div className="space-y-2">
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => !isModuleLocked(mod.id) && setActiveMod(mod.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${activeMod === mod.id ? 'bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white' : 'hover:bg-[#004B63]/10'} focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-1`}
                disabled={isModuleLocked(mod.id)}
                aria-label={`${isModuleLocked(mod.id) ? 'Módulo bloqueado: ' : ''}${mod.title}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activeMod === mod.id ? 'bg-white/20' : 'bg-[#004B63]/10'}`}>
                  <Icon name={mod.icon} className={`${activeMod === mod.id ? 'text-white' : 'text-[#004B63]'} text-sm`} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-sm truncate font-body">{mod.title}</p>
                  <p className={`text-xs ${activeMod === mod.id ? 'text-white/80' : 'text-[#64748B]'} font-body`}>
                    {mod.duration}
                  </p>
                </div>
                {isModuleLocked(mod.id) && (
                  <Icon name="fa-lock" className="text-xs text-slate-400" />
                )}
                {!isModuleLocked(mod.id) && completedModules.includes(mod.id) && (
                  <Icon name="fa-check" className="text-xs text-emerald-500" />
                )}
              </button>
            ))}
          </div>
        </div>

         {/* Sección: Videos del Módulo - Integrada al Sidebar */}
         <div className="px-2 w-full">
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3">
               <div className="text-[#004B63]">
                 <Icon name="fa-video-camera" className="text-sm" />
               </div>
               <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-[#004B63] font-display">
                 VIDEOS DEL MÓDULO
               </h3>
               <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/30 to-transparent"></div>
             </div>
             <Icon 
               name={sidebarDropdowns.videos ? "fa-chevron-up" : "fa-chevron-down"} 
               className="text-[#004B63] text-sm transition-transform duration-300 cursor-pointer hover:text-[#00BCD4]"
               onClick={() => toggleSidebarDropdown('videos')}
             />
           </div>
       
           {sidebarDropdowns.videos && (
             <div className="space-y-3 animate-fadeIn">
               {/* Video 1: Mastery Framework */}
               <div className="flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 cursor-pointer group">
                 <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                   <Icon name="fa-play" className="text-[#004B63] text-sm" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-[#334155] truncate font-body">Mastery Framework</p>
                   <div className="flex items-center gap-3 mt-2">
                     <span className="text-xs font-medium px-3 py-1.5 bg-green-50 text-green-700 rounded-lg font-body">Principiante</span>
                     <span className="text-xs text-[#64748B] font-body">12:45</span>
                   </div>
                 </div>
               </div>
               
               {/* Video 2: Contexto Dinámico */}
               <div className="flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 cursor-pointer group">
                 <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                   <Icon name="fa-play" className="text-[#004B63] text-sm" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-[#334155] truncate font-body">Contexto Dinámico</p>
                   <div className="flex items-center gap-3 mt-2">
                     <span className="text-xs font-medium px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-body">Intermedio</span>
                     <span className="text-xs text-[#64748B] font-body">18:20</span>
                   </div>
                 </div>
               </div>
               
               {/* Video 3: Chain-of-Thought */}
               <div className="flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 cursor-pointer group">
                 <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                   <Icon name="fa-play" className="text-[#004B63] text-sm" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-[#334155] truncate font-body">Chain-of-Thought</p>
                   <div className="flex items-center gap-3 mt-2">
                     <span className="text-xs font-medium px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg font-body">Avanzado</span>
                     <span className="text-xs text-[#64748B] font-body">22:10</span>
                   </div>
                 </div>
               </div>
               
               {/* Video 4: Zero-Shot Prompting */}
               <div className="flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 cursor-pointer group">
                 <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                   <Icon name="fa-play" className="text-[#004B63] text-sm" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-[#334155] truncate font-body">Zero-Shot Prompting</p>
                   <div className="flex items-center gap-3 mt-2">
                     <span className="text-xs font-medium px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg font-body">Intermedio</span>
                     <span className="text-xs text-[#64748B] font-body">15:30</span>
                   </div>
                 </div>
               </div>
             </div>
           )}
         </div>

         {/* Sección: Recursos Adicionales */}
         <div className="px-2 w-full">
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3">
               <div className="text-[#004B63]">
                 <Icon name="fa-book" className="text-sm" />
               </div>
               <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-[#004B63] font-display">
                 RECURSOS ADICIONALES
               </h3>
               <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/30 to-transparent"></div>
             </div>
             <Icon 
               name={sidebarDropdowns.recursos ? "fa-chevron-up" : "fa-chevron-down"} 
               className="text-[#004B63] text-sm transition-transform duration-300 cursor-pointer hover:text-[#00BCD4]"
               onClick={() => toggleSidebarDropdown('recursos')}
             />
           </div>
           
           {sidebarDropdowns.recursos && (
             <div className="space-y-3 animate-fadeIn">
               {/* Recurso 1: Cheat Sheet */}
               <div className="flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 cursor-pointer group">
                 <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                   <Icon name="fa-file-alt" className="text-[#004B63] text-sm" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-[#334155] truncate font-body">Cheat Sheet RTF</p>
                   <div className="flex items-center gap-3 mt-2">
                     <span className="text-xs font-medium px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg font-body">PDF</span>
                     <span className="text-xs text-[#64748B] font-body">2 páginas</span>
                   </div>
                 </div>
               </div>
               
               {/* Recurso 2: Ejemplos Prácticos */}
               <div className="flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 cursor-pointer group">
                 <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                   <Icon name="fa-code" className="text-[#004B63] text-sm" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-[#334155] truncate font-body">Ejemplos Prácticos</p>
                   <div className="flex items-center gap-3 mt-2">
                     <span className="text-xs font-medium px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg font-body">JSON</span>
                     <span className="text-xs text-[#64748B] font-body">15 ejemplos</span>
                   </div>
                 </div>
               </div>
               
               {/* Recurso 3: Plantillas */}
               <div className="flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 cursor-pointer group">
                 <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                   <Icon name="fa-clipboard" className="text-[#004B63] text-sm" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-[#334155] truncate font-body">Plantillas Premium</p>
                   <div className="flex items-center gap-3 mt-2">
                     <span className="text-xs font-medium px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg font-body">Templates</span>
                     <span className="text-xs text-[#64748B] font-body">8 plantillas</span>
                   </div>
                 </div>
               </div>
               
               {/* Recurso 4: Casos de Estudio */}
               <div className="flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 cursor-pointer group">
                 <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                   <Icon name="fa-chart-line" className="text-[#004B63] text-sm" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-[#334155] truncate font-body">Casos de Estudio</p>
                   <div className="flex items-center gap-3 mt-2">
                     <span className="text-xs font-medium px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg font-body">Case Studies</span>
                     <span className="text-xs text-[#64748B] font-body">5 casos</span>
                   </div>
                 </div>
               </div>
             </div>
           )}
         </div>

        {/* Sección: Detalles del Curso */}
        <div className="px-2 w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-[#004B63]">
              <Icon name="fa-info-circle" className="text-sm" />
            </div>
            <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-[#004B63] font-display">
              DETALLES DEL CURSO
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/30 to-transparent"></div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 hover:bg-slate-50/50 rounded-xl transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00BCD4]/10 rounded-lg flex items-center justify-center">
                  <Icon name="fa-clock" className="text-[#00BCD4] text-sm" />
                </div>
                <span className="text-sm font-medium text-[#64748B] font-body">Duración</span>
              </div>
              <span className="text-sm font-bold text-[#004B63] font-display">{curr?.duration}</span>
            </div>
            <div className="flex justify-between items-center p-3 hover:bg-slate-50/50 rounded-xl transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00BCD4]/10 rounded-lg flex items-center justify-center">
                  <Icon name="fa-signal" className="text-[#00BCD4] text-sm" />
                </div>
                <span className="text-sm font-medium text-[#64748B] font-body">Nivel</span>
              </div>
              <span className="text-sm font-bold text-[#004B63] font-display">{curr?.level}</span>
            </div>
            <div className="flex justify-between items-center p-3 hover:bg-slate-50/50 rounded-xl transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00BCD4]/10 rounded-lg flex items-center justify-center">
                  <Icon name="fa-play" className="text-[#00BCD4] text-sm" />
                </div>
                <span className="text-sm font-medium text-[#64748B] font-body">Videos</span>
              </div>
              <span className="text-sm font-bold text-[#004B63] font-display">{curr?.videos}</span>
            </div>
            <div className="flex justify-between items-center p-3 hover:bg-slate-50/50 rounded-xl transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00BCD4]/10 rounded-lg flex items-center justify-center">
                  <Icon name="fa-briefcase" className="text-[#00BCD4] text-sm" />
                </div>
                <span className="text-sm font-medium text-[#64748B] font-body">Proyectos</span>
              </div>
              <span className="text-sm font-bold text-[#004B63] font-display">{curr?.projects}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default IALabSidebar;