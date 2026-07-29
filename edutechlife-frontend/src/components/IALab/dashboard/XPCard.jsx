import { motion } from 'framer-motion';
import { useIALabStore } from '../../../store/ialabStore';
import { Icon } from '../../../utils/iconMapping.jsx';

function XPCard() {
  const xp = useIALabStore(s => s.xp);
  const level = useIALabStore(s => s.getLevel());
  const xpForNext = useIALabStore(s => s.getXpForNextLevel());
  const levelProgress = useIALabStore(s => s.getLevelProgress());

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <Icon name="fa-star" className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Nivel {level}</p>
          <p className="text-xl font-bold text-petroleum">{xp?.toLocaleString() || 0} XP</p>
        </div>
      </div>
      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.round(levelProgress))}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
        />
      </div>
      <p className="text-[10px] text-slate-400 mt-1.5">
        {Math.round(levelProgress)}% para nivel {level + 1} ({xpForNext?.toLocaleString()} XP)
      </p>
    </motion.div>
  );
}

export default XPCard;
