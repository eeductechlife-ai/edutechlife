import { memo, useEffect, useRef, useState } from 'react';

const ParticlesOrb = memo(({ particleCount = 50, size = 200 }) => {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);
  const [particles, setParticles] = useState([]);

  const colors = ['#004B63', '#4DA8C4', '#66CCCC', '#B2D8E5'];

  useEffect(() => {
    const newParticles = [];
    const center = size / 2;
    const radius = size * 0.4;

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.3 + Math.random() * 0.7);

      newParticles.push({
        id: i,
        x: center + r * Math.sin(phi) * Math.cos(theta),
        y: center + r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        size: Math.random() * 4 + 2,
        color: colors[i % colors.length],
        opacity: Math.random() * 0.6 + 0.3,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 4,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }
    setParticles(newParticles);
  }, [particleCount, size]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseRef.current = {
        x: (e.clientX - centerX) / rect.width,
        y: (e.clientY - centerY) / rect.height,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mouseMove', handleMouseMove);
  }, []);

  useEffect(() => {
    const animate = () => {
      targetRef.current.x += (mouseRef.current.x - targetRef.current.x) * 0.05;
      targetRef.current.y += (mouseRef.current.y - targetRef.current.y) * 0.05;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const center = size / 2;

  return (
    <div 
      ref={containerRef}
      className="relative"
      style={{ 
        width: size, 
        height: size,
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Outer glow */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(77, 168, 196, 0.15) 0%, transparent 70%)',
          filter: 'blur(20px)',
          animation: 'pulse-glow 4s ease-in-out infinite',
        }}
      />

      {/* Particles container with 3D transform */}
      <div
        className="absolute inset-0"
        style={{
          transform: `rotateX(10deg) rotateY(${targetRef.current.x * 20}deg) rotateZ(${targetRef.current.y * 10}deg)`,
          transition: 'transform 0.3s ease-out',
          willChange: 'transform',
        }}
      >
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              transform: `translateZ(${particle.z}px)`,
              boxShadow: `0 0 ${particle.size * 1.5}px ${particle.color}`,
              animation: `particleOrbFloat ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Center glow */}
      <div 
        className="absolute rounded-full"
        style={{
          left: '50%',
          top: '50%',
          width: size * 0.3,
          height: size * 0.3,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(77, 168, 196, 0.4) 0%, transparent 70%)',
          filter: 'blur(15px)',
          pointerEvents: 'none',
        }}
      />

      <style>{`
        @keyframes particleOrbFloat {
          0%, 100% {
            transform: translateZ(0) scale(1);
          }
          50% {
            transform: translateZ(10px) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
});

ParticlesOrb.displayName = 'ParticlesOrb';

export default ParticlesOrb;
