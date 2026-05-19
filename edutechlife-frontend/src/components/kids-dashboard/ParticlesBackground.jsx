import { memo, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// ==========================================
// Floating Particles System - Premium Background (CSS-based)
// ==========================================
const ParticlesBackground = memo(({ count = 30, colors = ['#4DA8C4', '#66CCCC', '#FFD166', '#FF6B9D', '#B2D8E5'] }) => {
  const prefersReducedMotion = useReducedMotion();

  const particles = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      color: colors[i % colors.length],
      size: Math.random() * 3 + 1,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
    })),
    [count, colors]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: `${p.startX}%`,
            top: `${p.startY}%`,
            opacity: prefersReducedMotion ? 0.4 : 0.3,
          }}
          animate={prefersReducedMotion ? {} : {
            y: [0, -30, 0, 30, 0],
            x: [0, 20, 0, -20, 0],
            opacity: [0.3, 0.6, 0.3, 0.6, 0.3],
            scale: [1, 1.2, 1, 0.8, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
});

ParticlesBackground.displayName = 'ParticlesBackground';

export default ParticlesBackground;
