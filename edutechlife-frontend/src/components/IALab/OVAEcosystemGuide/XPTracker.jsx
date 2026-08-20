import PropTypes from "prop-types";
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function XPTracker({ xp, maxXp }) {
  const pct = Math.min((xp / maxXp) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full w-full bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] rounded-full"
          style={{ transformOrigin: 'left' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: pct / 100 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
      <div className="flex items-center gap-1 text-[10px] font-black text-[var(--theme-emphasis)] uppercase tracking-wider shrink-0">
        <Sparkles className="w-3 h-3 text-[var(--theme-primary)]" />
        <span>{xp}/{maxXp} XP</span>
      </div>
    </div>
  );
}

XPTracker.propTypes = {
  xp: PropTypes.number.isRequired,
  maxXp: PropTypes.number.isRequired,
};
