import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import ValerioAvatar from '../ValerioAvatar';

const ValerioFloatingButton = ({ onClick, t }) => {
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [valerioState, setValerioState] = useState('idle');
  const tooltipTimer = useRef(null);
  const greetingSpokenRef = useRef(false);

  const [showNudge, setShowNudge] = useState(() => {
    try { return !localStorage.getItem('ialab_valerio_seen'); } catch { return false; }
  });

  useEffect(() => {
    if (!showNudge) return;
    const id = setTimeout(() => {
      setShowNudge(false);
      try { localStorage.setItem('ialab_valerio_seen', '1'); } catch {}
    }, 15000);
    return () => clearTimeout(id);
  }, [showNudge]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const ref = window.__valerioStateRef;
      if (ref && ref.current && ref.current !== valerioState) {
        setValerioState(ref.current);
      }
    }, 300);
    return () => clearInterval(id);
  }, [valerioState]);

  const handleEnter = () => {
    tooltipTimer.current = setTimeout(() => setShowTooltip(true), 800);
  };

  const handleLeave = () => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setShowTooltip(false);
  };

  const handleClick = () => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setShowTooltip(false);
    if (showNudge) {
      setShowNudge(false);
      try { localStorage.setItem('ialab_valerio_seen', '1'); } catch {}
    }
    if (onClick) onClick();
  };

  return (
    <AnimatePresence>
      {mounted && (
        <div className="fixed bottom-6 right-6 landscape:bottom-3 landscape:right-3 lg:bottom-10 lg:right-10 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.3, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.3, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="relative flex items-center justify-center"
          >
            <AnimatePresence>
              {showNudge && !showTooltip && (
                <motion.div
                  initial={{ opacity: 0, x: 16, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 16, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  className="absolute right-full mr-4 top-1/2 -translate-y-1/2 hidden sm:block pointer-events-none"
                >
                  <div className="bg-white dark:bg-slate-900 shadow-2xl rounded-2xl px-4 py-3 border border-slate-100 dark:border-slate-700 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-[var(--theme-primary)] flex items-center justify-center flex-shrink-0">
                        <Icon name="fa-comment-dots" className="text-white text-xs" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--theme-emphasis)] dark:text-[#4DA8C4]">{t('ialab.valerio_nudge')}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{t('ialab.valerio_nudge_sub')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white dark:bg-slate-900 border-r border-b border-slate-100 dark:border-slate-700 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.92 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute bottom-full right-0 mb-4 hidden sm:block pointer-events-none"
                >
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-premium-lg border border-white/30 dark:border-slate-700/50 p-4 max-w-[220px]">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-[var(--theme-primary)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[var(--theme-primary)]/20">
                        <Icon name="fa-comment-dots" className="text-white text-base" />
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.span
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 100,
                height: 100,
                background: 'radial-gradient(circle, rgba(0,188,212,0.15) 0%, rgba(0,75,99,0.08) 40%, transparent 70%)',
              }}
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.button
              onClick={handleClick}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              aria-label={t('ialab.valerio_aria')}
              data-tour="tour-valerio"
              className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 cursor-pointer"
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: [0, -3, 0] }}
              transition={{
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <ValerioAvatar state={valerioState} size={80} enable3DTilt={true} />

              <span className="absolute -bottom-0 -right-0 lg:-bottom-[1px] lg:-right-[1px] z-20">
                <span className="relative flex w-3 h-3 lg:w-4 lg:h-4">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
                  <span className="relative inline-flex rounded-full w-3 h-3 lg:w-4 lg:h-4 bg-emerald-400 ring-2 ring-white dark:ring-slate-900 shadow-lg shadow-emerald-500/30" />
                </span>
              </span>
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

ValerioFloatingButton.propTypes = {
  onClick: PropTypes.func,
  t: PropTypes.func,
};

export default ValerioFloatingButton;
