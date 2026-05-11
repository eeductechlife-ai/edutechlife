import React, { useRef, useCallback, useMemo, useState } from 'react';
import { useIALabStore } from '../../store/ialabStore';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { getResourcesForTopic } from './constants/moduleResources';

const parseResourceDuration = (resource) => {
  if (resource.type === 'video' && resource.duration) {
    const parts = resource.duration.split(':');
    if (parts.length === 2) return parseInt(parts[0]) + (parseInt(parts[1]) > 0 ? 1 : 0);
    if (parts.length === 3) return parseInt(parts[0]) * 60 + parseInt(parts[1]) + (parseInt(parts[2]) > 0 ? 1 : 0);
    return parseInt(resource.duration) || 0;
  }
  if (resource.estimatedTime) {
    const match = resource.estimatedTime.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
  return 0;
};

const calculateUnviewedMinutes = (moduleId, viewedIds) => {
  const store = useIALabStore.getState();
  const modData = store.modules[moduleId - 1];
  if (!modData?.topics) return null;
  let total = 0;
  modData.topics.forEach((topicTitle) => {
    const tr = getResourcesForTopic(topicTitle);
    if (!tr?.resources) return;
    tr.resources.forEach((resource) => {
      if (!viewedIds.includes(resource.id)) {
        total += parseResourceDuration(resource);
      }
    });
  });
  return total;
};

const ModuleRoadmap = ({ store, onModuleClick }) => {
  const modules = store.modules || [];

  return (
    <div className="px-4 pb-4 space-y-0">
      {modules.map((modItem, idx) => {
        const locked = store.isModuleLocked(modItem.id);
        const score = store.calculateModuleScore(modItem.id);
        const completed = score >= 80;
        const isActive = store.activeMod === modItem.id;
        const isLast = idx === modules.length - 1;

        return (
          <React.Fragment key={modItem.id}>
            <button
              onClick={() => !locked && onModuleClick(modItem.id)}
              disabled={locked}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 ${
                isActive
                  ? 'bg-gradient-to-r from-petroleum/10 to-corporate/5 border border-petroleum/20 dark:border-petroleum/30'
                  : completed
                  ? 'bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-700/30'
                  : locked
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent'
              }`}
              aria-label={`${locked ? 'Bloqueado: ' : ''}Módulo ${modItem.id}: ${modItem.title}${completed ? ' - Completado' : score > 0 ? ` - ${Math.round(score)}%` : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors duration-200 ${
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
                  <span className="text-xs font-bold">{modItem.id}</span>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className={`text-sm font-medium truncate leading-tight ${
                  isActive
                    ? 'text-petroleum dark:text-[#4DA8C4]'
                    : completed
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : locked
                    ? 'text-slate-400 dark:text-slate-500'
                    : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {modItem.title}
                </p>
                {score > 0 && !completed && (
                  <div className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full transition-all duration-500" style={{ width: `${score}%` }} />
                  </div>
                )}
              </div>
              {completed && (
                <Icon name="fa-check-circle" className="text-emerald-500 text-sm flex-shrink-0" />
              )}
              {locked && (
                <Icon name="fa-lock" className="text-slate-300 dark:text-slate-600 text-sm flex-shrink-0" />
              )}
            </button>
            {!isLast && (
              <div className="flex justify-center py-1">
                <div className="w-px h-3 bg-slate-200 dark:bg-slate-600/60" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const PrimaryActionCard = ({ route, onContinue, mod, mostrandoRuta, onToggleRuta }) => {
  const action = route.primaryAction;
  const prefersReducedMotion = useReducedMotion();
  const store = useIALabStore();
  const viewedIds = store.getViewedResources();
  const remainingMin = useMemo(() => calculateUnviewedMinutes(mod?.id, viewedIds), [mod?.id, viewedIds]);
  if (!action) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-petroleum via-petroleum-dark to-corporate/90 p-5 shadow-lg">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-white/[0.03] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {action.actionType === 'course_complete' ? (
              <>
                <h4 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                  <Icon name="fa-trophy" className="w-5 h-5 text-corporate" />
                  ¡Curso Completado!
                </h4>
              </>
            ) : action.actionType === 'next_module' ? (
              <>
                <h4 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                  <Icon name="fa-check-circle" className="w-5 h-5 text-emerald-300" />
                  ¡Módulo completado!
                </h4>
                <p className="text-white/80 text-sm font-medium">{action.title}</p>
              </>
            ) : action.actionType === 'take_exam' || action.actionType === 'take_challenge' ? (
              <>
                <h4 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                  Continúa tu aprendizaje
                  <span className="px-2 py-0.5 rounded-md bg-corporate/20 text-corporate text-[10px] font-bold uppercase tracking-wider border border-corporate/20">
                    Pendiente
                  </span>
                </h4>
                <p className="text-xs text-white/60 mb-1">Módulo {mod.id} · {mod.title}</p>
                <p className="text-white/80 text-sm font-medium">{action.title}</p>
              </>
            ) : (
              <>
                <h4 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                  Continúa tu aprendizaje
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleRuta(); }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                      mostrandoRuta
                        ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                        : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/20 hover:bg-emerald-400/30'
                    }`}
                    aria-label={mostrandoRuta ? 'Ocultar ruta de aprendizaje' : 'Mostrar ruta de aprendizaje'}
                  >
                    <Icon name={mostrandoRuta ? 'fa-arrow-left' : 'fa-route'} className="mr-1 text-[9px]" />
                    {mostrandoRuta ? 'Volver' : 'Siguiente lección'}
                  </button>
                </h4>
                <p className="text-xs text-white/60 mb-1">Módulo {mod.id} · {mod.title}</p>
                <p className="text-white/80 text-sm font-medium truncate">{action.title}</p>
              </>
            )}
          </div>

          <motion.button
            onClick={onContinue}
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            className="flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 bg-white text-petroleum hover:bg-white/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-petroleum"
          >
            {action.actionType === 'course_complete' ? (
              <><Icon name="fa-award" className="w-4 h-4" /> Ver mi certificado</>
            ) : action.actionType === 'next_module' ? (
              <><Icon name="fa-play-circle" className="w-4 h-4" /> Comenzar</>
            ) : action.actionType === 'take_exam' ? (
              <><Icon name="fa-file-text" className="w-4 h-4" /> Empezar examen</>
            ) : action.actionType === 'take_challenge' ? (
              <><Icon name="fa-trophy" className="w-4 h-4" /> Aceptar desafío</>
            ) : (
              <><Icon name="fa-play-circle" className="w-4 h-4" /> Continuar</>
            )}
          </motion.button>
        </div>

        {remainingMin != null && remainingMin > 0 && (
          <div className="mt-2 space-y-0.5">
            <p className="text-xs text-white/60">
              ⏱️ ~{remainingMin} min restantes en este módulo
            </p>
            <p className="text-[10px] text-white/40">
              Curso: {Math.round(store.courseProgress)}% completado · ~{Math.max(1, Math.ceil((100 - store.courseProgress) / 20))} días estimados
            </p>
          </div>
        )}

        {route.currentModule?.progressPct > 0 && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-white/60">Progreso del módulo</span>
              <span className="text-[10px] font-semibold text-white/80">{route.currentModule.progressPct}%</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden" role="progressbar" aria-valuenow={route.currentModule.progressPct} aria-valuemin="0" aria-valuemax="100">
              <div className="h-full bg-white/60 rounded-full transition-all duration-500" style={{ width: `${route.currentModule.progressPct}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="rounded-2xl bg-gradient-to-br from-petroleum/30 via-petroleum-dark/30 to-corporate/20 p-5 shadow-lg animate-pulse">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-white/20 rounded w-48" />
        <div className="h-3 bg-white/10 rounded w-32" />
      </div>
      <div className="w-28 h-10 bg-white/20 rounded-xl" />
    </div>
  </div>
);

const TuRutaDeHoy = ({ onAction }) => {
  const store = useIALabStore();
  const route = useMemo(() => store.getDailyRoute(), [store]);
  const topRef = useRef(null);
  const [mostrandoRuta, setMostrandoRuta] = useState(false);

  const handleContinue = useCallback(() => {
    const action = route.primaryAction;
    const mod = route.currentModule;
    const isLesson = action.actionType === 'resume_lesson' || action.actionType === 'next_lesson';

    if (isLesson) {
      window.dispatchEvent(new CustomEvent('ialab:openTopic'));
    } else {
      switch (action.actionType) {
        case 'take_exam': onAction?.('OPEN_EVALUATION'); break;
        case 'take_challenge': onAction?.('OPEN_CHALLENGE'); break;
        case 'community': onAction?.('OPEN_COMMUNITY'); break;
        case 'next_module':
          store.setActiveMod(action.nextModuleId);
          store.setVisitedModules(prev => [...new Set([...prev, action.nextModuleId])]);
          break;
        case 'course_complete': onAction?.('SHOW_CERTIFICATE'); break;
        default: break;
      }
    }
  }, [route, store, onAction]);

  const handleModuleClick = useCallback((moduleId) => {
    store.setActiveMod(moduleId);
    setMostrandoRuta(false);
  }, [store]);

  if (!route || !route.primaryAction) return <LoadingSkeleton />;

  const mod = route.currentModule;

  return (
    <div ref={topRef} className="space-y-3">
      <PrimaryActionCard
        route={route}
        mod={mod}
        onContinue={handleContinue}
        mostrandoRuta={mostrandoRuta}
        onToggleRuta={() => setMostrandoRuta(prev => !prev)}
      />

      <AnimatePresence>
        {mostrandoRuta && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 pt-4 pb-1">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm flex-shrink-0">
                <Icon name="fa-map-signs" className="text-white text-[10px]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-petroleum dark:text-[#4DA8C4] leading-tight">Tu ruta de aprendizaje</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">5 módulos hacia tu certificación</p>
              </div>
            </div>
            <ModuleRoadmap store={store} onModuleClick={handleModuleClick} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TuRutaDeHoy;
