import { useEffect, useRef, useCallback, memo } from 'react';
import { motion } from 'framer-motion';

// ==========================================
// Floating Particles System - Premium Background (CSS-based)
// ==========================================
const ParticlesBackground = memo(({ count = 30, colors = ['#4DA8C4', '#66CCCC', '#FFD166', '#FF6B9D', '#B2D8E5'] }) => {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: count }).map((_, i) => {
        const color = colors[i % colors.length];
        const size = Math.random() * 3 + 1;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * 10;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              left: `${startX}%`,
              top: `${startY}%`,
              opacity: 0.3,
            }}
            animate={{
              y: [0, -30, 0, 30, 0],
              x: [0, 20, 0, -20, 0],
              opacity: [0.3, 0.6, 0.3, 0.6, 0.3],
              scale: [1, 1.2, 1, 0.8, 1],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: 'linear',
            }}
          />
        );
      })}
    </div>
  );
});

ParticlesBackground.displayName = 'ParticlesBackground';

export default ParticlesBackground;
