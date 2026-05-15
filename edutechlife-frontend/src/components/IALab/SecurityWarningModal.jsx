import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';

const WARNING_LEVELS = {
  1: {
    title: 'Advertencia de seguridad',
    variant: 'warning',
    icon: 'fa-shield-halved',
  },
  2: {
    title: 'Segunda advertencia',
    variant: 'warning',
    icon: 'fa-shield-halved',
  },
  3: {
    title: 'Última advertencia',
    variant: 'danger',
    icon: 'fa-shield-alt',
  },
  penalty: {
    title: 'Penalización aplicada',
    variant: 'danger',
    icon: 'fa-exclamation-triangle',
  },
};

const SecurityWarningModal = ({ isOpen, message, level = 1, onClose }) => {
  const config = WARNING_LEVELS[level] || WARNING_LEVELS[1];
  const isDanger = config.variant === 'danger';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          role="alertdialog"
          aria-modal="true"
          aria-label={config.title}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md mx-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate rounded-t-2xl" />

            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                    isDanger
                      ? 'bg-gradient-to-br from-red-500 to-red-400 shadow-lg shadow-red-500/20'
                      : 'bg-gradient-to-br from-amber-500 to-amber-400 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  <Icon
                    name={config.icon}
                    className="text-white text-2xl"
                  />
                </div>

                <h3
                  className={`text-lg font-bold mb-2 font-montserrat ${
                    isDanger ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {config.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-sm">
                  {message}
                </p>

                <div className="w-full flex flex-col gap-3">
                  {level < 3 && (
                    <div className="flex items-center gap-2 justify-center text-xs text-slate-400 dark:text-slate-500">
                      <Icon name="fa-info-circle" className="text-slate-400" />
                      <span>
                        {level === 1
                          ? 'Si cambias de ventana 2 veces más, el examen se cerrará automáticamente.'
                          : level === 2
                          ? 'Si cambias de ventana 1 vez más, el examen se cerrará automáticamente.'
                          : ''}
                      </span>
                    </div>
                  )}

                  {isDanger && level === 3 && (
                    <div className="flex items-center gap-2 justify-center text-xs text-red-500 dark:text-red-400">
                      <Icon name="fa-exclamation-circle" className="text-red-500" />
                      <span>El examen se cerrará al cambiar de ventana nuevamente.</span>
                    </div>
                  )}

                  {level === 3 && (
                    <div className="flex items-center gap-2 justify-center text-xs text-red-400">
                      <Icon name="fa-clock" className="text-red-400" />
                      <span>Has perdido 1 intento por infracción de seguridad.</span>
                    </div>
                  )}

                  <button
                    onClick={onClose}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                      isDanger
                        ? 'bg-gradient-to-r from-red-500 to-red-400 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                        : 'bg-gradient-to-r from-petroleum to-corporate text-white hover:shadow-[0_0_20px_rgba(0,188,212,0.3)]'
                    }`}
                  >
                    <Icon name="fa-check" className="text-sm" />
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SecurityWarningModal;
