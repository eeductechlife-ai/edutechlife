import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping';
import { useTranslation } from '../../i18n/I18nProvider';

const sparkPositions = [
  { x: -10, y: -6, size: 2, delay: 0 },
  { x: 10, y: -8, size: 2.5, delay: 0.15 },
  { x: -12, y: 8, size: 1.5, delay: 0.3 },
  { x: 12, y: 6, size: 2, delay: 0.45 },
  { x: -6, y: -12, size: 1.8, delay: 0.6 },
  { x: 8, y: -10, size: 2.2, delay: 0.2 },
];

const Sparkle = ({ x, y, size, delay, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0.8, 0],
      scale: [0, 1, 0.6, 0],
      x: [0, x * 0.5, x],
      y: [0, y * 0.5, y],
    }}
    transition={{ delay, duration: 0.9, ease: 'easeOut' }}
    className="absolute pointer-events-none"
    style={{ top: '50%', left: '50%' }}
  >
    <div
      className="rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color || '#FBBF24',
        boxShadow: `0 0 ${size * 2}px ${color || '#FBBF24'}`,
      }}
    />
  </motion.div>
);

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0,
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  }),
};

const BadgeCard = ({ badge, earned, dateEarned, onClick, isNewlyEarned, index = 0 }) => {
  const prefersReducedMotion = useReducedMotion();
  const { t } = useTranslation();

  if (!prefersReducedMotion) {
    cardVariants.visible = (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.05,
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    });
  }

  return (
    <motion.button
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -2 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
      onClick={onClick}
      className={`relative flex flex-col items-center p-4 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 ${
        earned
          ? 'bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:shadow-corporate/5'
          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/50 opacity-60 grayscale'
      }`}
      aria-label={t(earned ? 'badge.earned_aria' : 'badge.locked_aria', { label: badge.label, desc: badge.desc })}
    >
      {earned && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          {!prefersReducedMotion && (
            <motion.div
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 1.5 }}
              className="absolute inset-0 bg-gradient-to-br from-yellow-300/10 to-transparent"
            />
          )}
          {!prefersReducedMotion && isNewlyEarned && sparkPositions.map((sp, i) => (
            <Sparkle key={i} {...sp} color={badge.color} />
          ))}
        </div>
      )}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-2 relative"
        style={{
          backgroundColor: earned ? `${badge.color}20` : 'transparent',
          color: earned ? badge.color : '#94a3b8',
        }}
      >
        <motion.div
          animate={earned && !prefersReducedMotion ? {
            rotate: [0, -8, 8, -4, 4, 0],
            scale: [1, 1.15, 1.08, 1],
          } : {}}
          transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
        >
          <Icon name={badge.icon} />
        </motion.div>
      </div>
      <span className={`text-xs font-semibold text-center leading-tight ${earned ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
        {badge.label}
      </span>
      <span className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-1 leading-tight">
        {badge.desc}
      </span>
      {earned && dateEarned && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-1.5 font-medium"
        >
          {new Date(dateEarned).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
        </motion.span>
      )}
      {!earned && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-xl bg-slate-100/60 dark:bg-slate-900/40 flex items-center justify-center"
        >
          <div className="w-8 h-8 rounded-full bg-white/80 dark:bg-slate-700/80 flex items-center justify-center shadow-sm">
            <Icon name="fa-lock" className="text-slate-300 dark:text-slate-500 text-xs" />
          </div>
        </motion.div>
      )}
    </motion.button>
  );
};

export default BadgeCard;
