import { useMemo } from 'react';
import { motion } from 'framer-motion';

const SHAPES = ['circle', 'diamond', 'star', 'plus'];
const COLORS = ['#4DA8C4', '#66CCCC', '#FFD166', '#FF6B9D'];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

const StarShape = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const PlusShape = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const DiamondShape = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} opacity="0.3">
    <path d="M12 2l10 10-10 10L2 12z" />
  </svg>
);

export default function FloatingParticles({ color, count = 15 }) {
  const particles = useMemo(() => {
    const baseColors = color ? [color, `${color}cc`, `${color}88`, `${color}44`] : COLORS;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: randomBetween(12, 24),
      x: randomBetween(0, 100),
      y: randomBetween(0, 100),
      duration: randomBetween(20, 40),
      delay: randomBetween(0, 15),
      color: baseColors[Math.floor(Math.random() * baseColors.length)],
      driftX: randomBetween(-20, 20),
      driftY: randomBetween(-15, 15),
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      startRotate: randomBetween(0, 360),
    }));
  }, [count, color]);

  const renderShape = (p) => {
    switch (p.shape) {
      case 'star': return <StarShape size={p.size} color={p.color} />;
      case 'plus': return <PlusShape size={p.size} color={p.color} />;
      case 'diamond': return <DiamondShape size={p.size} color={p.color} />;
      default:
        return (
          <div
            className="rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute flex items-center justify-center"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, p.driftY, 0, -p.driftY, 0],
            x: [0, p.driftX, 0, -p.driftX, 0],
            opacity: [0.06, 0.12, 0.06, 0.1, 0.06],
            rotate: [p.startRotate, p.startRotate + 180, p.startRotate + 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {renderShape(p)}
        </motion.div>
      ))}
    </div>
  );
}
