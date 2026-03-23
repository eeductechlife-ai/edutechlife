import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MagneticButton({ 
  children, 
  onClick, 
  className = '',
  intensity = 0.3,
  springConfig = { stiffness: 350, damping: 15, mass: 1 }
}) {
  const buttonRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    let rafId = null;
    let lastEvent = null;

    const computeMagneticPull = () => {
      if (!buttonRef.current || !lastEvent) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = lastEvent.clientX - centerX;
      const distanceY = lastEvent.clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      // Magnetic pull radius = element radius + 40px threshold
      const magneticRadius = Math.max(rect.width, rect.height) / 2 + 40;

      if (distance < magneticRadius) {
        x.set(distanceX * intensity);
        y.set(distanceY * intensity);
      } else {
        x.set(0);
        y.set(0);
      }
      rafId = null;
    };

    const handleMouseMove = (e) => {
      lastEvent = { clientX: e.clientX, clientY: e.clientY };
      if (!rafId) {
        rafId = requestAnimationFrame(computeMagneticPull);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [intensity, x, y]);

  const handleClick = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;

    const newRipple = {
      x: rippleX,
      y: rippleY,
      id: Date.now()
    };
    
    setRipples((prev) => [...prev, newRipple]);
    if (onClick) onClick(e);
  };

  const handleRippleEnd = (id) => {
    setRipples((prev) => prev.filter(r => r.id !== id));
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden cursor-none ${className}`}
      style={{ x: springX, y: springY }}
      onClick={handleClick}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      <span className="relative z-10 flex items-center justify-center pointer-events-none w-full h-full">
          {children}
      </span>
      {ripples.map((ripple) => (
        <Ripple 
          key={ripple.id} 
          x={ripple.x} 
          y={ripple.y} 
          onCompleted={() => handleRippleEnd(ripple.id)} 
        />
      ))}
    </motion.button>
  );
}

const Ripple = ({ x, y, onCompleted }) => {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0.8 }}
      animate={{ scale: 8, opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      onAnimationComplete={onCompleted}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        width: 40,
        height: 40,
        marginLeft: -20,
        marginTop: -20,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(102, 204, 204, 0.3))',
        backdropFilter: 'blur(2px)',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};
