import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ChevronRight, BookOpen, Target, TrendingUp } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const SmartRecommendationCard = memo(({
  recommendation = {},
  onAccept = () => {},
  onDismiss = () => {},
  loading = false,
  className = '',
}) => {
  const {
    subject = '',
    type = 'resource',
    title = '',
    description = '',
    resource = '',
    confidence = 80,
    priority = 'medium',
    estimatedTime = '15 min',
  } = recommendation;

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'from-red-400 to-red-600';
    if (priority === 'medium') return 'from-orange-400 to-orange-600';
    return 'from-blue-400 to-blue-600';
  };

  const getPriorityLabel = (priority) => {
    if (priority === 'high') return 'Urgente';
    if (priority === 'medium') return 'Recomendado';
    return 'Sugerencia';
  };

  const getTypeIcon = (type) => {
    if (type === 'practice') return <Target className="w-5 h-5" />;
    if (type === 'video') return <BookOpen className="w-5 h-5" />;
    if (type === 'lesson') return <BookOpen className="w-5 h-5" />;
    return <Lightbulb className="w-5 h-5" />;
  };

  return (
    <GlassCard className={`${className}`} animate>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`
              w-12 h-12 rounded-xl bg-gradient-to-br ${getPriorityColor(priority)}
              flex items-center justify-center text-white shadow-lg
            `}
          >
            {getTypeIcon(type)}
          </div>

          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              {subject}
            </p>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
        </div>

        {/* Priority Badge */}
        <motion.div
          className={`
            px-3 py-1 rounded-full text-xs font-bold text-white
            bg-gradient-to-r ${getPriorityColor(priority)}
            shadow-lg
          `}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {getPriorityLabel(priority)}
        </motion.div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4 leading-relaxed">
        {description}
      </p>

      {/* Confidence & Time */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Confidence Score */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-gray-600">Confianza</label>
            <span className="text-sm font-bold text-gray-900">{confidence}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Estimated Time */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-gray-600">Tiempo Est.</label>
            <span className="text-sm font-bold text-gray-900">{estimatedTime}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-200 flex items-center">
            <div className="flex-1 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" />
          </div>
        </div>
      </div>

      {/* Recommendation Details */}
      {resource && (
        <motion.div
          className="mb-4 p-3 bg-blue-50 rounded-lg border-2 border-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-xs text-gray-600 font-semibold mb-1">Recurso recomendado:</p>
          <p className="text-sm text-gray-900 font-semibold">{resource}</p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          onClick={onAccept}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
        >
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>{loading ? 'Cargando...' : 'Empezar'}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </motion.button>

        <motion.button
          onClick={onDismiss}
          disabled={loading}
          className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50"
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
        >
          Ahora no
        </motion.button>
      </div>

      {/* Trust Indicator */}
      <motion.div
        className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-center gap-1 text-xs text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Lightbulb className="w-3 h-3 text-yellow-500" />
        <span>
          Generado por análisis de tu progreso y estilo de aprendizaje
        </span>
      </motion.div>
    </GlassCard>
  );
});

SmartRecommendationCard.displayName = 'SmartRecommendationCard';

export default SmartRecommendationCard;
