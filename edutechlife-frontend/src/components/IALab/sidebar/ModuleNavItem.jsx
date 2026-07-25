import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping';

const ModuleNavItem = ({
  mod,
  isActive = false,
  isLocked = false,
  score = 0,
  variant = 'expanded',
  onClick,
  motionVariants,
  whileHover,
  whileTap,
  className = '',
  children,
}) => {
  const completed = !isLocked && score >= 80;

  if (variant === 'compact') {
    return (
      <motion.button
        onClick={() => !isLocked && onClick?.(mod.id)}
        disabled={isLocked}
        whileHover={whileHover ?? (isLocked ? {} : { scale: 1.05 })}
        whileTap={whileTap ?? (isLocked ? {} : { scale: 0.95 })}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className={`relative w-full min-h-[44px] rounded-lg flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 flex-shrink-0 ${isActive
          ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-[0_4px_12px_rgba(0,75,99,0.25)]'
          : 'text-petroleum/50 dark:text-slate-500 hover:text-petroleum dark:hover:text-[#4DA8C4]'
        } ${isLocked ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
        aria-current={isActive ? 'page' : undefined}
        aria-label={`${mod.title}${isLocked ? ' (bloqueado)' : ''}`}
      >
        {isActive && (
          <motion.div layoutId="activeModuleBar" className="absolute -left-1.5 w-[3px] h-5 rounded-full bg-gradient-to-b from-petroleum-dark to-corporate shadow-sm" />
        )}
        <span className="text-base font-extrabold">{mod.id}</span>
        {isLocked && <Icon name="fa-lock" className="text-xs text-petroleum/40 dark:text-slate-500" aria-hidden="true" />}
        {completed && (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm ring-1 ring-white dark:ring-slate-800">
            <Icon name="fa-check" className="text-[6px] text-white" aria-hidden="true" />
          </div>
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      variants={motionVariants}
      onClick={() => !isLocked && onClick?.(mod.id)}
      className={`w-full group flex items-center gap-2 min-h-[44px] p-2.5 rounded-xl transition-all duration-300 ${isActive
        ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-md shadow-petroleum/15 dark:shadow-petroleum/30'
        : 'hover:bg-petroleum/10 dark:hover:bg-petroleum/20 text-slate-700 dark:text-slate-300'
      } ${isLocked ? 'opacity-60 cursor-not-allowed' : ''} focus:outline-none focus:ring-2 focus:ring-petroleum/30 dark:focus:ring-petroleum/50 focus:ring-offset-1 ${className}`}
      disabled={isLocked}
      aria-current={isActive ? 'page' : undefined}
      aria-label={`${mod.title}${isLocked ? ' (bloqueado)' : ''}`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${isActive
        ? 'bg-white/20'
        : 'bg-petroleum/8 dark:bg-petroleum/20 group-hover:bg-petroleum/15'
      }`}>
        <span className={`${isActive ? 'text-white' : 'text-petroleum dark:text-[#4DA8C4]'} text-sm font-bold`}>{mod.id}</span>
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className={`font-semibold text-sm truncate transition-colors ${isActive ? 'text-white' : 'group-hover:text-petroleum dark:group-hover:text-[#4DA8C4]'}`}>{mod.title}</p>
        {score > 0 && (
          <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${isActive ? 'bg-white/60' : 'bg-corporate'}`}
                 style={{ width: `${score}%` }} />
          </div>
        )}
      </div>
      {isLocked && <Icon name="fa-lock" className="text-xs text-petroleum/40 dark:text-slate-500" aria-hidden="true" />}
      {!isLocked && completed && <Icon name="fa-check" className="text-xs text-emerald-500" aria-hidden="true" />}
      {children}
    </motion.button>
  );
};

ModuleNavItem.displayName = 'ModuleNavItem';

export default ModuleNavItem;
