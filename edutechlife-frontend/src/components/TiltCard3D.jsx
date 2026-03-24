import { memo, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const TiltCard3D = ({ 
  children, 
  className = '',
  glowColor = '#4DA8C4',
  glowIntensity = 'medium',
  tiltAmount = 8,
  onClick,
}) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 400, damping: 30 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [`${tiltAmount}deg`, `-${tiltAmount}deg`]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [`-${tiltAmount}deg`, `${tiltAmount}deg`]), springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const glowIntensities = {
    low: '0 0 15px rgba(77, 168, 196, 0.3), 0 0 30px rgba(77, 168, 196, 0.1)',
    medium: '0 0 20px rgba(77, 168, 196, 0.4), 0 0 40px rgba(77, 168, 196, 0.2)',
    high: '0 0 30px rgba(77, 168, 196, 0.6), 0 0 60px rgba(77, 168, 196, 0.3)',
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ 
        rotateX, 
        rotateY, 
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`relative transform-style-3d ${className}`}
    >
      <motion.div
        style={{ 
          transform: 'translateZ(20px)',
          boxShadow: glowIntensities[glowIntensity],
        }}
        className="h-full rounded-3xl transition-all duration-300"
        whileHover={{ 
          transform: 'translateZ(30px)',
          boxShadow: glowIntensities[glowIntensity].replace('0.3', '0.5').replace('0.1', '0.2'),
        }}
      >
        {children}
      </motion.div>

      <motion.div
        style={{ 
          transform: 'translateZ(-10px)',
          opacity: 0.6,
        }}
        className="absolute inset-0 rounded-3xl -z-10"
        whileHover={{
          boxShadow: `0 0 40px ${glowColor}40`,
        }}
      />
    </motion.div>
  );
};

TiltCard3D.displayName = 'TiltCard3D';

export default memo(TiltCard3D);
