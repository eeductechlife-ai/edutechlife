import { memo } from 'react';

const FloatingParticles = ({ 
  count = 20, 
  className = '',
  colors = ['#4DA8C4', '#66CCCC', '#004B63']
}) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 8,
    duration: Math.random() * 6 + 6,
    color: colors[i % colors.length],
    blur: Math.random() > 0.7 ? 'blur-sm' : '',
  }));

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
            opacity: Math.random() * 0.4 + 0.2,
            animation: `particle-float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
      
      <style>{`
        @keyframes particle-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(20px, -30px) scale(1.3);
            opacity: 0.6;
          }
          50% {
            transform: translate(-15px, -60px) scale(0.7);
            opacity: 0.2;
          }
          75% {
            transform: translate(30px, -25px) scale(1.1);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

FloatingParticles.displayName = 'FloatingParticles';

export default memo(FloatingParticles);
