import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useIALabStore } from '../../store/ialabStore';
import { Icon } from '../../utils/iconMapping.jsx';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const TYPE_META = {
  weak_topic: { icon: 'fa-book-open', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300', label: 'Repasar' },
  resources: { icon: 'fa-play-circle', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300', label: 'Ver recursos' },
  exam: { icon: 'fa-file-text', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300', label: 'Ir al examen' },
  challenge: { icon: 'fa-trophy', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300', label: 'Ir al desafío' },
};

const RecommendationsPanel = ({ onAction, isLoading }) => {
  const getDetailedRecommendations = useIALabStore(s => s.getDetailedRecommendations);
  const setActiveModAction = useIALabStore(s => s.setActiveMod);
  const setVisitedModules = useIALabStore(s => s.setVisitedModules);
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => setIsOpen(v => !v), []);
  const recommendations = useMemo(() => getDetailedRecommendations(), [getDetailedRecommendations]);
  const topRef = useRef(null);

  const handleAction = useCallback((rec) => {
    if (rec.type === 'exam') {
      onAction?.('OPEN_EVALUATION');
    } else if (rec.type === 'challenge') {
      onAction?.('OPEN_CHALLENGE');
    } else {
      setActiveModAction(rec.moduleId);
      setVisitedModules(prev => [...new Set([...prev, rec.moduleId])]);
      if (rec.type === 'weak_topic') {
        window.dispatchEvent(new CustomEvent('ialab:switchTab', { detail: 'contenido' }));
      }
    }
  }, [onAction]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 pt-2">
          <div className="w-3.5 h-3.5 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 bg-slate-200 rounded w-24 animate-pulse" />
        </div>
        <div className="space-y-1.5">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-100 animate-pulse">
              <div className="w-7 h-7 rounded-lg bg-slate-200 flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-slate-200 rounded w-3/4" />
                <div className="h-2 bg-slate-200 rounded w-1/2" />
              </div>
              <div className="w-14 h-5 bg-slate-200 rounded-lg flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  const visibleRecs = recommendations.slice(0, 5);

  return (
    <div ref={topRef} className="space-y-2">
      <button
        onClick={toggleOpen}
        className="w-full flex items-center gap-1.5 pt-2 text-left cursor-pointer group"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Ocultar recomendaciones' : 'Mostrar recomendaciones'}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <Icon name="fa-lightbulb" className="w-3.5 h-3.5 text-corporate group-hover:text-corporate/80 transition-colors" />
        </motion.div>
        <h4 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
          Recomendaciones
        </h4>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">
          {recommendations.length} pendientes
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-1.5">
              {visibleRecs.map((rec, idx) => {
                const meta = TYPE_META[rec.type] || TYPE_META.resources;
                return (
                  <motion.button
                    key={`${rec.moduleId}-${rec.type}-${rec.topic || ''}-${idx}`}
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.2 }}
                    onClick={() => handleAction(rec)}
                    className={`w-full flex items-start gap-2 p-2.5 rounded-xl border transition-all duration-200 text-left
                      ${meta.bg} ${meta.border}
                      hover:shadow-sm hover:brightness-95 dark:hover:brightness-110
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40`}
                  >
                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${meta.bg} ${meta.text}`}>
                      <Icon name={meta.icon} className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-tight line-clamp-2">
                        {rec.text}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {rec.moduleName}
                        {rec.urgency === 'high' && (
                          <span className="ml-1.5 text-amber-600 dark:text-amber-400 font-medium">Prioritario</span>
                        )}
                      </p>
                    </div>
                    <div className={`flex-shrink-0 text-[10px] font-semibold px-2 py-1 rounded-lg ${meta.text} ${meta.bg}`}>
                      {meta.label}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(RecommendationsPanel);
