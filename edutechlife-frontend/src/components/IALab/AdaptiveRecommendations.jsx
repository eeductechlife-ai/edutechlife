/**
 * AdaptiveRecommendations — Recomendaciones personalizadas basadas en el progreso
 *
 * ADITIVO: Componente independiente. Solo LEE del adaptiveSlice y otros slices.
 * No modifica lógica existente. Se puede montar en cualquier lugar.
 *
 * Uso:
 *   <AdaptiveRecommendations maxItems={3} onItemClick={(rec) => ...} />
 *
 * Renders:
 *   1. Reviews vencidas (spaced repetition)
 *   2. Conceptos con dificultad (struggle patterns)
 *   3. Items no visitados hace tiempo (stale)
 *
 * @see adaptiveSlice.js
 */
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useIALabStore } from '../../store/ialabStore';
import { Icon } from '../../utils/iconMapping.jsx';

const RECOMMENDATION_TYPES = {
  review: {
    icon: 'fa-clock-rotate-left',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-700',
    text: 'text-amber-700 dark:text-amber-300',
    label: 'Repasar',
  },
  struggle: {
    icon: 'fa-lightbulb',
    color: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    border: 'border-rose-200 dark:border-rose-700',
    text: 'text-rose-700 dark:text-rose-300',
    label: 'Refuerzo',
  },
  stale: {
    icon: 'fa-arrow-rotate-right',
    color: 'from-sky-500 to-cyan-500',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    border: 'border-sky-200 dark:border-sky-700',
    text: 'text-sky-700 dark:text-sky-300',
    label: 'Retomar',
  },
};

const daysAgo = (ts) => {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days === 0) return 'hoy';
  if (days === 1) return 'hace 1 día';
  if (days < 30) return `hace ${days} días`;
  const months = Math.floor(days / 30);
  return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
};

const AdaptiveRecommendations = ({ maxItems = 3, onItemClick, className = '' }) => {
  // Selectores granulares (no re-renderizan por otros cambios del store)
  const getDueReviews = useIALabStore((s) => s.getDueReviews);
  const getStruggleConcepts = useIALabStore((s) => s.getStruggleConcepts);
  const getStaleItems = useIALabStore((s) => s.getStaleItems);
  const viewHistoryLen = useIALabStore((s) => s.viewHistory?.length || 0);
  const errorPatternsLen = useIALabStore((s) => s.errorPatterns?.length || 0);
  const reviewScheduleLen = useIALabStore((s) => s.reviewSchedule?.length || 0);

  // Recalcular cuando cambian los datos subyacentes
  const recommendations = useMemo(() => {
    const items = [];

    // 1. Reviews vencidas (prioridad alta)
    const dueReviews = getDueReviews ? getDueReviews() : [];
    dueReviews.forEach((r) => {
      items.push({
        type: 'review',
        itemId: r.itemId,
        reason: `Programado para repaso (Box ${r.box})`,
        priority: 3,
      });
    });

    // 2. Conceptos con struggle
    const struggles = getStruggleConcepts ? getStruggleConcepts() : [];
    struggles.forEach((s) => {
      items.push({
        type: 'struggle',
        itemId: s.conceptId,
        reason: `${s.incorrectAttempts} intentos fallidos`,
        priority: 2,
      });
    });

    // 3. Stale items
    const stale = getStaleItems ? getStaleItems(7) : [];
    stale.slice(0, 2).forEach((s) => {
      items.push({
        type: 'stale',
        itemId: s.itemId,
        reason: `Visto ${daysAgo(s.lastViewed)}`,
        priority: 1,
      });
    });

    // Ordenar por prioridad y limitar
    return items
      .sort((a, b) => b.priority - a.priority)
      .slice(0, maxItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxItems, viewHistoryLen, errorPatternsLen, reviewScheduleLen]);

  if (recommendations.length === 0) {
    return null; // No mostrar sección si no hay recomendaciones
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-corporate to-petroleum flex items-center justify-center">
          <Icon name="fa-wand-magic-sparkles" className="text-white text-sm" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-petroleum dark:text-white">
            Recomendado para ti
          </h3>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            Basado en tu progreso y patrones de aprendizaje
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {recommendations.map((rec, i) => {
            const config = RECOMMENDATION_TYPES[rec.type];
            return (
              <motion.button
                key={`${rec.type}-${rec.itemId}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onItemClick && onItemClick(rec)}
                type="button"
                className={`w-full flex items-center gap-3 p-3 rounded-xl border ${config.bg} ${config.border} hover:shadow-md transition-all text-left group`}
              >
                <div
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                >
                  <Icon name={config.icon} className="text-white text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${config.text} mb-0.5`}>
                    {config.label}
                  </div>
                  <div className="text-xs font-semibold text-petroleum dark:text-white truncate">
                    {rec.itemId}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                    {rec.reason}
                  </div>
                </div>
                <Icon
                  name="fa-chevron-right"
                  className={`text-xs ${config.text} opacity-60 group-hover:opacity-100 transition-opacity`}
                />
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

AdaptiveRecommendations.propTypes = {
  maxItems: PropTypes.number,
  onItemClick: PropTypes.func,
  className: PropTypes.string,
};

export default AdaptiveRecommendations;
