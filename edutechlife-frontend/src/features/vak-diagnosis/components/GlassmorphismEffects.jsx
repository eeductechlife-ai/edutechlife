import React, { useEffect, useRef } from 'react';

const GlassmorphismEffects = ({ intensity = 1 }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    // Configurar partículas
    const createParticles = () => {
      const particles = [];
      const particleCount = Math.floor(50 * intensity);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 255)}, ${Math.random() * 0.3 + 0.1})`
        });
      }

      return particles;
    };

    particlesRef.current = createParticles();

    const animate = () => {
      // Limpiar canvas con efecto de desvanecimiento
      ctx.fillStyle = 'rgba(10, 22, 40, 0.05)';
      ctx.fillRect(0, 0, width, height);

      // Dibujar partículas
      particlesRef.current.forEach(particle => {
        // Actualizar posición
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Rebotar en los bordes
        if (particle.x < 0 || particle.x > width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > height) particle.speedY *= -1;

        // Mantener dentro del canvas
        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));

        // Dibujar partícula
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Dibujar glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Dibujar líneas de conexión entre partículas cercanas
      ctx.strokeStyle = 'rgba(77, 168, 196, 0.1)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Manejar resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particlesRef.current = createParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        background: 'transparent',
        zIndex: 0
      }}
    />
  );
};

// Componente de gradiente animado
export const AnimatedGradient = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute -inset-[100%] animate-gradient bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
      <div className="absolute -inset-[100%] animate-gradient bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5" style={{ animationDelay: '2s' }} />
    </div>
  );
};

// Componente de grid glassmorphism
export const GlassGrid = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(77, 168, 196, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(77, 168, 196, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 24s linear infinite'
        }}
      />
    </div>
  );
};

// Componente de orbes flotantes
export const FloatingOrbs = ({ count = 5 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * 100 + 50;
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * 5;
        
        return (
          <div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              background: `radial-gradient(circle, rgba(77, 168, 196, 0.${Math.floor(Math.random() * 3 + 1)}) 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `orb-float ${duration}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
              filter: 'blur(40px)'
            }}
          />
        );
      })}
    </>
  );
};

export default GlassmorphismEffects;