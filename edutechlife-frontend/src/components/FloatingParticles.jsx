import { useMemo } from 'react';

const COLORS = ['#4DA8C4', '#66CCCC', '#004B63', '#B2D8E5'];

function seededRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

const FloatingParticles = ({
  count = 20,
  className = '',
  colors = COLORS,
}) => {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const seed = i * 7919 + count;
      return {
        id: i,
        size: seededRandom(seed) * 10 + 4,
        left: seededRandom(seed + 1) * 100,
        top: seededRandom(seed + 2) * 100,
        delay: seededRandom(seed + 3) * 20,
        duration: seededRandom(seed + 4) * 16 + 16,
        color: colors[i % colors.length],
        blur: seededRandom(seed + 5) > 0.7 ? 'blur-sm' : '',
        zIndex: Math.floor(seededRandom(seed + 6) * 10),
      };
    }),
    [count, colors],
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${particle.blur}`}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            backgroundColor: particle.color,
            opacity: seededRandom(particle.id + 100) * 0.3 + 0.15,
            animation: `particle-float-3d ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
            willChange: 'transform, opacity',
            zIndex: particle.zIndex,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}
    </div>
  );
};

FloatingParticles.displayName = 'FloatingParticles';

export default FloatingParticles;
