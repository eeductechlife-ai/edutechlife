import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Zap, TrendingDown, X } from 'lucide-react';

const PredictiveAlertBanner = memo(({
  alerts = [],
  onDismiss = () => {},
  onAction = () => {},
  className = '',
}) => {
  const [dismissed, setDismissed] = useState(new Set());
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!alerts || alerts.length === 0) return null;

  const visibleAlerts = alerts.filter((_, idx) => !dismissed.has(idx));

  const getSeverityIcon = (severity) => {
    if (severity === 'high') return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (severity === 'medium') return <AlertCircle className="w-5 h-5 text-orange-500" />;
    return <Zap className="w-5 h-5 text-yellow-500" />;
  };

  const getSeverityColor = (severity) => {
    if (severity === 'high') return 'from-red-100 to-red-50 border-red-300 border-l-4 border-l-red-500';
    if (severity === 'medium') return 'from-orange-100 to-orange-50 border-orange-300 border-l-4 border-l-orange-500';
    return 'from-yellow-100 to-yellow-50 border-yellow-300 border-l-4 border-l-yellow-500';
  };

  const getAlertIcon = (type) => {
    if (type === 'disengagement') return <TrendingDown className="w-5 h-5" />;
    if (type === 'performance_drop') return <TrendingDown className="w-5 h-5" />;
    if (type === 'streak_risk') return <Zap className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  const handleDismiss = (index) => {
    const newDismissed = new Set(dismissed);
    newDismissed.add(index);
    setDismissed(newDismissed);
    onDismiss(alerts[index]);
  };

  return (
    <AnimatePresence>
      <div className={`${className} space-y-3`}>
        {visibleAlerts.map((alert, index) => (
          <motion.div
            key={`${alert.id || index}`}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`
              p-4 rounded-xl bg-gradient-to-r ${getSeverityColor(alert.severity)}
              flex items-start gap-3 backdrop-blur-sm
            `}
          >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {getSeverityIcon(alert.severity)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm leading-tight">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-gray-700 mt-1 line-clamp-2">
                    {alert.message}
                  </p>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedIndex === index && alert.recommendation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 pt-2 border-t border-gray-300/50"
                      >
                        <p className="text-xs text-gray-700 font-medium">
                          Recomendación:
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {alert.recommendation}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Close Button */}
                <motion.button
                  onClick={() => handleDismiss(index)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Descartar alerta"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-3">
                {alert.recommendation && expandedIndex !== index && (
                  <motion.button
                    onClick={() => setExpandedIndex(index)}
                    className="text-xs font-semibold text-gray-700 hover:text-gray-900 underline"
                    whileHover={{ x: 2 }}
                  >
                    Ver recomendación →
                  </motion.button>
                )}

                {expandedIndex === index && alert.recommendation && (
                  <>
                    <motion.button
                      onClick={() => {
                        onAction(alert, 'acknowledged');
                        handleDismiss(index);
                      }}
                      className="px-3 py-1 text-xs font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Entendido
                    </motion.button>

                    <motion.button
                      onClick={() => {
                        onAction(alert, 'help_requested');
                        handleDismiss(index);
                      }}
                      className="px-3 py-1 text-xs font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Necesito ayuda
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
});

PredictiveAlertBanner.displayName = 'PredictiveAlertBanner';

export default PredictiveAlertBanner;
