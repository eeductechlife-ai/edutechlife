import { memo } from 'react';

const FloatingParticles = ({ 
  count = 20, 
  className = '',
  colors = ['#4DA8C4', '#66CCCC', '#004B63', '#B2D8E5']
}) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 10 + 4,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 20,
    duration: Math.random() * 16 + 16,
    color: colors[i % colors.length],
    blur: Math.random() > 0.7 ? 'blur-sm' : '',
    zIndex: Math.floor(Math.random() * 10),
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
            opacity: Math.random() * 0.3 + 0.15,
            animation: `particle-float-3d ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
            willChange: 'transform, opacity',
            zIndex: particle.zIndex,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}
      
      <style>{`
        @keyframes particle-float-3d {
          0%, 100% {
            transform: translate(0, 0) scale(1) translateZ(0);
            opacity: 0.2;
          }
          25% {
            transform: translate(15px, -20px) scale(1.2) translateZ(10px);
            opacity: 0.45;
          }
          50% {
            transform: translate(-10px, -40px) scale(0.8) translateZ(-10px);
            opacity: 0.15;
          }
          75% {
            transform: translate(20px, -15px) scale(1.1) translateZ(5px);
            opacity: 0.35;
          }
        }
      `}</style>
    </div>
  );
};

FloatingParticles.displayName = 'FloatingParticles';

export default memo(FloatingParticles);
