import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#FF6B9D', '#4DA8C4', '#FFD166', '#66CCCC', '#A855F7', '#F59E0B', '#10B981', '#EF4444'];

const ICONS = [
  { viewBox: '0 0 24 24', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { viewBox: '0 0 24 24', path: 'M12 2l2.4 7.2H22l-6.4 4.8 2.4 7.2L12 16l-6.4 4.8 2.4-7.2L2 9.2h7.6z' },
  { viewBox: '0 0 24 24', path: 'M12 2l2.4 7.2H22l-6.4 4.8 2.4 7.2L12 16l-6.4 4.8 2.4-7.2L2 9.2h7.6z' },
  { viewBox: '0 0 24 24', path: 'M22 12h-4l-3 9L9 3l-3 9H2' },
  { viewBox: '0 0 24 24', path: 'M6 9H4.5a2.5 2.5 0 010-5C7 4 7 7 7 7m-3 5v6m4-11V4a2 2 0 012-2h4a2 2 0 012 2v1' },
  { viewBox: '0 0 24 24', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export default function ConfettiOverlay({ onComplete }) {
  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => {
      const icon = ICONS[Math.floor(Math.random() * ICONS.length)];
      return {
        id: i,
        x: randomBetween(-250, 250),
        y: randomBetween(-400, -50),
        rotation: randomBetween(0, 1080),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: randomBetween(16, 28),
        delay: randomBetween(0, 0.4),
        duration: randomBetween(1, 2),
        icon,
      };
    }),
  []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2"
          style={{ width: p.size, height: p.size }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 0 }}
          animate={{
            opacity: [1, 1, 0],
            x: p.x,
            y: p.y,
            rotate: p.rotation,
            scale: [0, 1.3, 0.6],
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <svg viewBox={p.icon.viewBox} fill="none" stroke={p.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            className="w-full h-full">
            <path d={p.icon.path} />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
