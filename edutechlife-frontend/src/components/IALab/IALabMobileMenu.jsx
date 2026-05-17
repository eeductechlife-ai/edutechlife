import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabContext } from '../../context/IALabContext';
import { useProgressContext } from '../../context/ProgressContext';
import { useIALabStore } from '../../store/ialabStore';

const IALabMobileMenu = ({ closeMobileMenu, toggleDarkMode, isDarkMode, onOpenProfile, onOpenHistory, onOpenHelp }) => {
  const {
    user, activeMod, setActiveMod, courseProgress, modules,
    isModuleLocked, calculateModuleScore, sidebarDropdowns,
    toggleSidebarDropdown, storedCertificate, getBadgesSummary,
    setShowCertificateModal, courseCompleted, signOut
  } = useIALabContext();

  const { completedInfographics } = useProgressContext();
  const { streak, getLevel } = useIALabStore();

  const isInfographicCompleted = (infographicId) => completedInfographics.includes(`${infographicId}`);

  const handleLogout = async () => {
    closeMobileMenu();
    await signOut();
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Perfil compacto */}
      <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-petroleum to-petroleum-dark flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user?.full_name || 'Usuario'}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Nv.{getLevel()}</span>
              <span>🔥 {streak}</span>
            </div>
          </div>
        </div>
        <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full transition-all duration-700"
               style={{ width: `${Math.min(courseProgress, 100)}%` }} />
        </div>
      </div>

      {/* UNDERMENU - Acciones de usuario */}
      <div className="px-3 py-3">
        <h3 className="text-[10px] font-bold tracking-[0.12em] uppercase text-corporate mb-2 flex items-center gap-1.5">
          <Icon name="fa-user" className="text-corporate text-xs" />
          UNDRMENU
        </h3>
        <div className="space-y-0.5">
          <button onClick={onOpenProfile}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-petroleum/5 dark:hover:bg-petroleum/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40">
            <div className="w-7 h-7 rounded-lg bg-petroleum/8 dark:bg-petroleum/20 flex items-center justify-center flex-shrink-0">
              <Icon name="fa-user" className="text-xs text-petroleum dark:text-[#4DA8C4]" />
            </div>
            Mi Perfil
          </button>

          <button onClick={onOpenHistory}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-petroleum/5 dark:hover:bg-petroleum/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40">
            <div className="w-7 h-7 rounded-lg bg-petroleum/8 dark:bg-petroleum/20 flex items-center justify-center flex-shrink-0">
              <Icon name="fa-chart-line" className="text-xs text-petroleum dark:text-[#4DA8C4]" />
            </div>
            Mi Historial de Aprendizaje
          </button>

          <button onClick={() => { closeMobileMenu(); setShowCertificateModal(true); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-petroleum/5 dark:hover:bg-petroleum/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40">
            <div className="w-7 h-7 rounded-lg bg-petroleum/8 dark:bg-petroleum/20 flex items-center justify-center flex-shrink-0">
              <Icon name="fa-certificate" className="text-xs text-petroleum dark:text-[#4DA8C4]" />
            </div>
            Certificados
          </button>

          <button onClick={onOpenHelp}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-petroleum/5 dark:hover:bg-petroleum/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40">
            <div className="w-7 h-7 rounded-lg bg-petroleum/8 dark:bg-petroleum/20 flex items-center justify-center flex-shrink-0">
              <Icon name="fa-question-circle" className="text-xs text-petroleum dark:text-[#4DA8C4]" />
            </div>
            Ayuda
          </button>

        </div>
      </div>

      <div className="mx-3 border-t border-slate-100 dark:border-slate-700" />

      {/* MODULOS DEL CURSO */}
      <div className="px-3 py-3">
        <h3 className="text-[10px] font-bold tracking-[0.12em] uppercase text-corporate mb-2 flex items-center gap-1.5">
          <Icon name="fa-layer-group" className="text-corporate text-xs" />
          MODULOS DEL CURSO
        </h3>
        <div className="space-y-0.5">
          {modules.map((mod) => {
            const modScore = calculateModuleScore(mod.id);
            const isLocked = isModuleLocked(mod.id);
            const isActive = activeMod === mod.id;
            return (
              <button key={mod.id}
                onClick={() => { if (!isLocked) { setActiveMod(mod.id); closeMobileMenu(); } }}
                disabled={isLocked}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 ${
                  isActive ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-petroleum/5 dark:hover:bg-petroleum/10'
                }`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isActive ? 'bg-white/20 text-white'
                  : isLocked ? 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  : modScore >= 80 ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-petroleum/8 dark:bg-petroleum/20 text-petroleum dark:text-[#4DA8C4]'
                }`}>{mod.id}</div>
                <div className="flex-1 min-w-0 text-left">
                  <p className={`truncate ${isActive ? 'text-white' : ''}`}>{mod.title}</p>
                  {modScore > 0 && (
                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                      <div className={`h-full rounded-full transition-all duration-500 ${isActive ? 'bg-white/60' : 'bg-corporate'}`}
                           style={{ width: `${modScore}%` }} />
                    </div>
                  )}
                </div>
                {isLocked && <Icon name="fa-lock" className="text-xs text-slate-400" />}
                {!isLocked && modScore >= 80 && <Icon name="fa-check" className="text-xs text-emerald-500" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-3 border-t border-slate-100 dark:border-slate-700" />

      {/* RECURSOS ADICIONALES */}
      <div className="px-3 py-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] font-bold tracking-[0.08em] uppercase text-corporate flex items-center gap-1.5">
            <Icon name="fa-cubes" className="text-corporate text-xs" /> RECURSOS ADICIONALES
          </h3>
          <button onClick={() => toggleSidebarDropdown('recursos')}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/30">
            <Icon name={sidebarDropdowns.recursos ? 'fa-chevron-up' : 'fa-chevron-down'} className="text-xs" />
          </button>
        </div>
        {sidebarDropdowns.recursos && (
          <div className="space-y-0.5">
            {[
              { id: 'i' + activeMod, label: 'Cheat Sheet RTF', icon: 'fa-file-alt', meta: '2 paginas' },
              { id: 'i' + activeMod + '_2', label: 'Ejemplos Practicos', icon: 'fa-code', meta: '15 ejemplos' },
              { id: 'i' + activeMod + '_3', label: 'Plantillas Premium', icon: 'fa-clipboard', meta: '8 plantillas' },
              { id: 'i' + activeMod + '_4', label: 'Casos de Estudio', icon: 'fa-chart-line', meta: '5 casos' },
            ].map((r) => {
              const completed = isInfographicCompleted(r.id);
              return (
                <button key={r.id} onClick={() => window.dispatchEvent(new CustomEvent('ialab:openTopic'))}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-petroleum/5 dark:hover:bg-petroleum/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/30">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    completed ? 'bg-emerald-50 text-emerald-500' : 'bg-petroleum/8 dark:bg-petroleum/20 text-petroleum dark:text-[#4DA8C4]'
                  }`}>
                    <Icon name={completed ? 'fa-check-circle' : r.icon} className="text-xs" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm truncate">{r.label}</p>
                    <p className="text-[10px] text-slate-400">{completed ? 'Completado' : r.meta}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* INSIGNIAS + CERTIFICADO */}
      {storedCertificate && (() => {
        const badgesSummary = getBadgesSummary();
        if (badgesSummary.earned === 0 && !courseCompleted) return null;
        return (
          <>
            <div className="mx-3 border-t border-slate-100 dark:border-slate-700" />
            <div className="px-3 py-3 space-y-2">
              {badgesSummary.earned > 0 && (
                <>
                  <h3 className="text-[10px] font-bold tracking-[0.08em] uppercase text-corporate flex items-center gap-1.5">
                    <Icon name="fa-award" className="text-corporate text-xs" /> INSIGNIAS
                  </h3>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-slate-500">{badgesSummary.earned}/{badgesSummary.total} ganadas</span>
                    <span className="text-xs font-semibold text-corporate">{Math.round((badgesSummary.earned / badgesSummary.total) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full transition-all duration-700"
                         style={{ width: `${(badgesSummary.earned / badgesSummary.total) * 100}%` }} />
                  </div>
                </>
              )}
              {courseCompleted && (
                <button onClick={() => { setShowCertificateModal(true); closeMobileMenu(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-petroleum dark:text-[#4DA8C4] bg-petroleum/5 hover:bg-petroleum/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/30">
                  <Icon name="fa-certificate" className="text-corporate text-sm" /> Ver Certificado
                </button>
              )}
            </div>
          </>
        );
      })()}

      {/* DARK MODE */}
      <div className="mx-3 border-t border-slate-100 dark:border-slate-700" />
      <div className="px-3 py-3">
        <button onClick={toggleDarkMode}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-petroleum/5 dark:hover:bg-petroleum/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/30">
          <span className="flex items-center gap-2.5">
            <Icon name={isDarkMode ? 'fa-sun' : 'fa-moon'} className={`text-sm ${isDarkMode ? 'text-amber-400' : 'text-slate-500'}`} />
            Modo {isDarkMode ? 'Claro' : 'Oscuro'}
          </span>
          <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-petroleum' : 'bg-slate-300'} relative`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${isDarkMode ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
          </div>
        </button>
      </div>

      {/* CERRAR SESION */}
      <div className="mx-3 border-t border-slate-100 dark:border-slate-700" />
      <div className="px-3 py-3">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40">
          <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
            <Icon name="fa-sign-out-alt" className="text-xs text-red-500" />
          </div>
          Cerrar Sesion
        </button>
      </div>

    </div>
  );
};

export default IALabMobileMenu;
