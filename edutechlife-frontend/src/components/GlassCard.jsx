import { forwardRef, memo } from 'react';
import { motion } from 'framer-motion';

const GlassCard = memo(({
  children,
  className = '',
  hover = false,
  padding = 'lg',
  as = 'div',
  animate = false,
  delay = 0,
  ...props
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const baseClasses = `
    relative overflow-hidden
    bg-white/85 backdrop-blur-xl
    border border-[#E2E8F0]/60
    shadow-[0_4px_24px_rgba(0,75,99,0.04)]
    rounded-2xl
    transition-all duration-300 ease-out
    ${hover ? 'hover:shadow-[0_8px_40px_rgba(0,75,99,0.08)] hover:border-[#4DA8C4]/30' : ''}
    ${paddingClasses[padding]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const MotionComponent = motion[as] || motion.div;

  if (animate) {
    return (
      <MotionComponent
        className={baseClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }

  const Component = as;
  return (
    <Component className={baseClasses} {...props}>
      {children}
    </Component>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;
