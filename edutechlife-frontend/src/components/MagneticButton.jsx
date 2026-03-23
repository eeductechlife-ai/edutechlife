import { useRef, useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

export default function MagneticButton({ 
  children, 
  onClick, 
  className = '',
  intensity = 0.3,
  springConfig = { mass: 1, tension: 350, friction: 15 }
}) {
  const buttonRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  
  const [{ x, y }, api] = useSpring(() => ({ 
    x: 0, 
    y: 0, 
    config: springConfig 
  }));

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
        api.start({
          x: distanceX * intensity,
          y: distanceY * intensity,
        });
      } else {
        api.start({ x: 0, y: 0 });
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
  }, [api, intensity]);

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
    <animated.button
      ref={buttonRef}
      className={`relative overflow-hidden cursor-none ${className}`}
      style={{ x, y }}
      onClick={handleClick}
      onMouseLeave={() => api.start({ x: 0, y: 0 })}
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
    </animated.button>
  );
}

const Ripple = ({ x, y, onCompleted }) => {
  const [style] = useSpring(() => ({
    from: { transform: 'scale(0)', opacity: 0.8 },
    to: { transform: 'scale(8)', opacity: 0 },
    config: { duration: 700, easing: t => t * (2 - t) }, // liquid expansion smooth curve
    onRest: onCompleted
  }));

  return (
    <animated.span
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
        zIndex: 1,
        ...style
      }}
    />
  );
};
