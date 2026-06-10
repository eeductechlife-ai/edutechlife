import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import styles from './ValerioFloatingButton.module.css';

const ORBITAL_PARTICLES = [
  { size: 2, orbit: 42, duration: 3, delay: 0 },
  { size: 3, orbit: 48, duration: 4, delay: 0.5 },
  { size: 2, orbit: 36, duration: 3.5, delay: 1 },
  { size: 2, orbit: 50, duration: 5, delay: 1.5 },
  { size: 3, orbit: 40, duration: 3.8, delay: 2 },
  { size: 2, orbit: 44, duration: 4.2, delay: 2.5 },
  { size: 2, orbit: 52, duration: 3.2, delay: 3 },
];

const ValerioFloatingButton = ({ onClick, t }) => {
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tiltRef = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 250, damping: 25 });
  const springY = useSpring(rotateY, { stiffness: 250, damping: 25 });

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePointerMove = (e) => {
    const rect = tiltRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateX.set((e.clientY - cy) / 10);
    rotateY.set((e.clientX - cx) / 10);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setShowTooltip(false);
  };

  return (
    <>
      <AnimatePresence>
        {mounted && (
          <div className="fixed bottom-6 right-6 landscape:bottom-3 landscape:right-3 lg:bottom-10 lg:right-10 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.3, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.3, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="relative"
            >
              {/* Tooltip */}
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, x: 10, scale: 0.92 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.92 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute bottom-full right-0 mb-4 hidden sm:block pointer-events-none"
                    style={{ transformStyle: 'flat' }}
                  >
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-premium-lg border border-white/30 dark:border-slate-700/50 p-4 max-w-[220px]">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-corporate flex items-center justify-center flex-shrink-0 shadow-lg shadow-corporate/20">
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

              {/* Tilt + Float wrapper */}
              <motion.div
                ref={tiltRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onMouseEnter={() => setShowTooltip(true)}
                style={{
                  rotateX: springX,
                  rotateY: springY,
                  transformStyle: 'preserve-3d',
                  perspective: 800,
                }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-16 h-16 lg:w-20 lg:h-20"
              >
                {/* Orbital particles */}
                <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                  {ORBITAL_PARTICLES.map((p, i) => (
                    <span
                      key={i}
                      className={`${styles.particle} absolute left-1/2 top-1/2 rounded-full`}
                      style={{
                        width: p.size,
                        height: p.size,
                        background: i % 2 === 0 ? '#00BCD4' : '#004B63',
                        boxShadow: `0 0 ${p.size * 3}px ${i % 2 === 0 ? '#00BCD4' : '#004B63'}`,
                        '--orbit': `${p.orbit}px`,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Energy ring */}
                <span
                  className={`${styles.energyRing} absolute left-1/2 top-1/2 w-[68px] h-[68px] lg:w-[84px] lg:h-[84px] rounded-full pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0,188,212,0.35) 60deg, transparent 120deg, rgba(0,75,99,0.35) 200deg, transparent 280deg, rgba(0,188,212,0.35) 320deg, transparent 360deg)',
                  }}
                />

                {/* Button */}
                <button
                  onClick={onClick}
                  aria-label={t('ialab.valerio_aria')}
                  data-tour="tour-valerio"
                  className="absolute inset-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 group/btn cursor-pointer"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Hover glow aura */}
                  <span className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-400/10 to-corporate/20 blur-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />

                  {/* Orb body — 3D sphere illusion */}
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 32% 28%, rgba(0,188,212,0.95) 0%, #004B63 55%, #002633 92%)',
                    }}
                  />

                  {/* Inner glow layer */}
                  <span
                    className="absolute inset-[2px] rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 40% 35%, rgba(0,188,212,0.15) 0%, transparent 60%)',
                    }}
                  />

                  {/* Specular highlight */}
                  <span
                    className="absolute top-[10%] left-[16%] w-[38%] h-[32%] rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.5), transparent 70%)',
                      filter: 'blur(1px)',
                    }}
                  />

                  {/* Bottom rim light */}
                  <span
                    className="absolute bottom-[6%] left-[18%] w-[64%] h-[18%] rounded-full"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(0,188,212,0.35), transparent)',
                      filter: 'blur(3px)',
                    }}
                  />

                  {/* Ambient shadow */}
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      boxShadow: 'inset 0 -6px 12px rgba(0,0,0,0.35), inset 0 4px 8px rgba(0,188,212,0.15), 0 8px 32px rgba(0,188,212,0.2)',
                    }}
                  />

                  {/* Chat icon */}
                  <span className="absolute inset-0 flex items-center justify-center z-10" style={{ transform: 'translateZ(8px)' }}>
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ display: 'flex' }}
                    >
                      <Icon
                        name="fa-comment-dots"
                        className="text-white/95 text-xl lg:text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                      />
                    </motion.span>
                  </span>

                  {/* Online indicator */}
                  <span className="absolute -bottom-[1px] -right-[1px] lg:-bottom-[2px] lg:-right-[2px] z-20">
                    <span className="relative flex w-3 h-3 lg:w-4 lg:h-4">
                      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
                      <span className="relative inline-flex rounded-full w-3 h-3 lg:w-4 lg:h-4 bg-emerald-400 ring-2 ring-white dark:ring-slate-900 shadow-lg shadow-emerald-500/30" />
                    </span>
                  </span>
                </button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

ValerioFloatingButton.propTypes = {
  onClick: PropTypes.func,
  t: PropTypes.func,
};

export default ValerioFloatingButton;
