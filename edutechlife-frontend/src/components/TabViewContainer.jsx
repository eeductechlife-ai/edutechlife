import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  slideRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },
};

const transition = {
  type: 'tween',
  duration: 0.25,
  ease: [0.25, 0.46, 0.45, 0.94],
};

const TabViewContainer = memo(({
  children,
  activeTab,
  variant = 'slideUp',
  mode = 'wait',
  className = '',
}) => {
  const motionVariants = useMemo(() => variants[variant] || variants.slideUp, [variant]);

  const content = typeof children === 'function' 
    ? children(activeTab) 
    : children;

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode={mode} initial={false}>
        <motion.div
          key={activeTab}
          initial={motionVariants.initial}
          animate={motionVariants.animate}
          exit={motionVariants.exit}
          transition={transition}
          className="w-full"
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

TabViewContainer.displayName = 'TabViewContainer';

export const TabContent = memo(({
  isActive,
  children,
  className = '',
}) => {
  if (!isActive) return null;
  return (
    <div className={className}>
      {children}
    </div>
  );
});

TabContent.displayName = 'TabContent';

export const TabButton = memo(({
  isActive,
  onClick,
  children,
  icon: Icon,
  className = '',
  badge,
  badgeColor = '#4DA8C4',
}) => (
  <button
    onClick={onClick}
    className={`
      relative flex items-center gap-3 px-4 py-3 rounded-xl
      transition-all duration-300 ease-out
      ${isActive 
        ? 'bg-[#4DA8C4]/10 text-[#004B63]' 
        : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#004B63]'
      }
      ${className}
    `}
  >
    {Icon && (
      <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
    )}
    {children}
    {badge && (
      <span 
        className="px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ 
          backgroundColor: `${badgeColor}20`, 
          color: badgeColor 
        }}
      >
        {badge}
      </span>
    )}
    {isActive && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 border-2 border-[#4DA8C4]/30 rounded-xl -z-10"
        initial={false}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    )}
  </button>
));

TabButton.displayName = 'TabButton';

export default TabViewContainer;
