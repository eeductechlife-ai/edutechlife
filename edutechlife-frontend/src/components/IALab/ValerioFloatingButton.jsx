import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';

const ValerioFloatingButton = ({ onClick, t }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.8 }}
          className="fixed bottom-6 right-6 landscape:bottom-3 landscape:right-3 lg:bottom-10 lg:right-10 z-50 flex flex-col items-end gap-3"
        >
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="hidden sm:block relative"
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-premium-lg border border-slate-200 dark:border-slate-700 p-4 max-w-[240px]">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-corporate flex items-center justify-center flex-shrink-0 shadow-lg shadow-corporate/20">
                      <Icon name="fa-sparkles" className="text-white text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {t('ialab.valerio_talk')}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                        {t('ialab.valerio_tooltip')}
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700 rotate-45" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={onClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            aria-label={t('ialab.valerio_aria')}
            data-tour="tour-valerio"
            className="relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 safe-area-bottom"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 to-corporate/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-700" />

            <div className="relative w-14 h-14 lg:w-20 lg:h-20 bg-gradient-to-br from-petroleum to-corporate rounded-2xl lg:rounded-3xl shadow-2xl shadow-corporate/25 dark:shadow-premium-lg hover:shadow-corporate/50 dark:hover:shadow-premium-xl group-hover:scale-110 active:scale-90 transition-all duration-300 flex items-center justify-center overflow-hidden">
              <Icon
                name="fa-sparkles"
                className="text-white text-2xl lg:text-4xl drop-shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
              />

              <span className="absolute -bottom-0.5 -right-0.5 lg:-bottom-1 lg:-right-1 w-3 h-3 lg:w-4 lg:h-4">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                <span className="absolute inset-0 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900" />
              </span>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ValerioFloatingButton;
