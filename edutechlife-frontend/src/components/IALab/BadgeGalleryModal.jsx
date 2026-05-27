import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useIALabStore } from '../../store/ialabStore';
import { BADGE_INFO } from '../../data/ialab';
import BadgeCard from './BadgeCard';

const BadgeGalleryModal = ({ isOpen, onClose }) => {
  const badges = useIALabStore(s => s.badges);
  const badgesDates = useIALabStore(s => s.badgesDates);

  const { earned, locked } = useMemo(() => {
    const earnedList = [];
    const lockedList = [];
    Object.entries(BADGE_INFO).forEach(([id, info]) => {
      if (badges.includes(id)) {
        earnedList.push({ id, ...info, dateEarned: badgesDates[id] || null });
      } else {
        lockedList.push({ id, ...info });
      }
    });
    return { earned: earnedList, locked: lockedList };
  }, [badges, badgesDates]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[80vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
              <div>
                <h2 className="text-lg font-bold text-petroleum dark:text-corporate">Insignias</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {earned.length}/{Object.keys(BADGE_INFO).length} obtenidas
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40"
                aria-label="Cerrar galería"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(80vh - 73px)' }}>
              {earned.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Obtenidas
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {earned.map(badge => (
                      <BadgeCard key={badge.id} badge={badge} earned dateEarned={badge.dateEarned} />
                    ))}
                  </div>
                </div>
              )}

              {locked.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    Por obtener
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {locked.map(badge => (
                      <BadgeCard key={badge.id} badge={badge} earned={false} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BadgeGalleryModal;
