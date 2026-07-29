import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../../i18n/I18nProvider';
import { ChevronDown, Lightbulb } from 'lucide-react';

export default function EvolutionTimeline({ items }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = expanded === i;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 200, damping: 25 }}
            className="relative pl-8"
          >
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-petroleum to-corporate rounded-full" />
            <motion.div
              className={`absolute left-[-5px] top-2 w-3 h-3 rounded-full border-2 border-white z-10 ${isOpen ? 'bg-corporate' : 'bg-petroleum'}`}
              animate={{ scale: isOpen ? 1.4 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
            <button
              onClick={() => setExpanded(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full text-left"
            >
              <div className={`bg-white dark:bg-slate-800 rounded-xl border-2 transition-all p-4 ${isOpen ? 'border-corporate shadow-md' : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="font-[900] text-petroleum text-xs uppercase">{item.title}</h5>
                      {item.date && (
                        <span className="text-[10px] font-black text-corporate bg-corporate/10 px-2 py-0.5 rounded-md">{item.date}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5 leading-relaxed">{item.text}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4 text-slate-300 dark:text-slate-500 shrink-0" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic flex gap-2">
                          <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
                          <span>{item.extendedText}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}

EvolutionTimeline.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    date: PropTypes.string,
    text: PropTypes.string.isRequired,
    extendedText: PropTypes.string.isRequired,
  })),
};
