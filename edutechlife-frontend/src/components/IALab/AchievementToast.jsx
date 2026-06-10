import PropTypes from 'prop-types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping';

const TYPE_STYLES = {
  badge: { gradient: 'from-amber-400 to-amber-500', icon: 'fa-trophy' },
  level_up: { gradient: 'from-corporate to-cyan-400', icon: 'fa-arrow-up' },
  streak: { gradient: 'from-rose-400 to-rose-500', icon: 'fa-fire' },
};

const AchievementToast = ({ toasts, removeToast }) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none" aria-live="polite" role="alert">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const style = TYPE_STYLES[toast.type] || TYPE_STYLES.badge;
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 24 }}
              className="pointer-events-auto flex items-center gap-3 bg-white rounded-xl shadow-xl shadow-slate-900/10 border border-slate-100 p-3.5 pr-4 max-w-xs hover:shadow-lg transition-shadow"
            >
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-md shrink-0`}>
                <Icon name={toast.icon || style.icon} className="text-white text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{toast.title}</p>
                <p className="text-xs text-slate-500 truncate">{toast.description}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}
                aria-label="Cerrar notificación"
                className="w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};


AchievementToast.propTypes = {
  toasts: PropTypes.array,
  removeToast: PropTypes.func,
};

export default AchievementToast;
