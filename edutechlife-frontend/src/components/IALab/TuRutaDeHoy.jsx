import React, { useRef, useCallback, useMemo } from 'react';
import { modules } from '../../data/ialab';
import { useIALabStore } from '../../store/ialabStore';
import { motion, useReducedMotion } from 'framer-motion';
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

const calculateUnviewedMinutes = (modules, moduleId, viewedIds) => {
  const modData = modules?.[moduleId - 1];
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

const PrimaryActionCard = ({ route, onContinue, mod }) => {
  const action = route.primaryAction;
  const prefersReducedMotion = useReducedMotion();
  const courseProgress = useIALabStore(s => s.courseProgress);
  const getWeeklyXP = useIALabStore(s => s.getWeeklyXP);
  const getViewedResources = useIALabStore(s => s.getViewedResources);
  const viewedIds = getViewedResources();
  const remainingMin = useMemo(() => calculateUnviewedMinutes(modules, mod?.id, viewedIds), [modules, mod?.id, viewedIds]);
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
            ) : action.actionType === 'take_exam' || action.actionType === 'take_challenge' || action.actionType === 'review_weak_topics' ? (
              <>
                <h4 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                  {action.actionType === 'review_weak_topics' ? (
                    <><Icon name="fa-book-open" className="w-4 h-4 text-amber-300" /> Repasa temas débiles</>
                  ) : (
                    <>Continúa tu aprendizaje</>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-corporate/20 text-corporate text-[10px] font-bold uppercase tracking-wider border border-corporate/20">
                    Pendiente
                  </span>
                </h4>
                <p className="text-xs text-white/60 mb-1">Módulo {mod.id} · {mod.title}</p>
                {action.actionType === 'review_weak_topics' ? (
                  <p className="text-white/80 text-sm font-medium">{action.description}</p>
                ) : (
                  <p className="text-white/80 text-sm font-medium">{action.title}</p>
                )}
              </>
            ) : (
              <>
                <h4 className="text-white font-bold text-base mb-1">
                  Continúa tu aprendizaje
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
            ) : action.actionType === 'review_weak_topics' ? (
              <><Icon name="fa-book-open" className="w-4 h-4" /> Revisar temas</>
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
              Curso: {Math.round(courseProgress)}% · ~{Math.max(1, Math.ceil((100 - courseProgress) / 20))} días · {getWeeklyXP().weekly}/{getWeeklyXP().weeklyTarget} XP esta semana
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
  const getDailyRoute = useIALabStore(s => s.getDailyRoute);
  const setActiveModAction = useIALabStore(s => s.setActiveMod);
  const setVisitedModules = useIALabStore(s => s.setVisitedModules);
  const route = useMemo(() => getDailyRoute(), [getDailyRoute]);
  const topRef = useRef(null);

  const handleContinue = useCallback(() => {
    const action = route.primaryAction;
    const mod = route.currentModule;
    const isLesson = action.actionType === 'resume_lesson' || action.actionType === 'next_lesson';

    if (isLesson) {
      window.dispatchEvent(new CustomEvent('ialab:openTopic'));
    } else {
      switch (action.actionType) {
        case 'take_exam': onAction?.('OPEN_EVALUATION'); break;
        case 'review_weak_topics':
          window.dispatchEvent(new CustomEvent('ialab:switchTab', { detail: 'contenido' }));
          break;
        case 'take_challenge': onAction?.('OPEN_CHALLENGE'); break;
        case 'community': onAction?.('OPEN_COMMUNITY'); break;
        case 'next_module':
          setActiveModAction(action.nextModuleId);
          setVisitedModules(prev => [...new Set([...prev, action.nextModuleId])]);
          break;
        case 'course_complete': onAction?.('SHOW_CERTIFICATE'); break;
        default: break;
      }
    }
  }, [route, setActiveModAction, setVisitedModules, onAction]);



  if (!route || !route.primaryAction) return <LoadingSkeleton />;

  const mod = route.currentModule;

  return (
    <div ref={topRef} className="space-y-3">
      <PrimaryActionCard
        route={route}
        mod={mod}
        onContinue={handleContinue}
      />


    </div>
  );
};

export default TuRutaDeHoy;
