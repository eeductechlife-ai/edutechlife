import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../../i18n/I18nProvider';
import { Search, Layout, Database, CheckCircle2 } from 'lucide-react';

const toolIconMap = { Search, Layout, Database };

export default function ToolsMatchup({ items }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [matches, setMatches] = useState({});
  const [wrong, setWrong] = useState(null);

  const shuffledDescs = [...items].sort(() => Math.random() - 0.5).map((item, i) => ({ ...item, sortKey: i }));

  const handleToolClick = (idx) => {
    if (matches[items[idx].title]) return;
    setSelected(idx);
  };

  const handleDescClick = (descItem) => {
    if (selected === null) return;
    if (matches[descItem.title]) return;

    const tool = items[selected];
    if (tool.title === descItem.title) {
      setMatches(prev => ({ ...prev, [tool.title]: true }));
      setWrong(null);
      setSelected(null);
    } else {
      setWrong(descItem.sortKey);
      setTimeout(() => setWrong(null), 600);
    }
  };

  const allMatched = Object.keys(matches).length === items.length;

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500 dark:text-slate-300 font-bold">{t('ova.ecosystem.matchup_hint')}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <h6 className="text-[10px] font-black text-petroleum uppercase tracking-wider text-center">{t('ova.ecosystem.matchup_tools')}</h6>
          {items.map((item, i) => {
            const Icon = toolIconMap[item.icon] || null;
            const matched = matches[item.title];
            return (
              <motion.button
                key={i}
                onClick={() => handleToolClick(i)}
                whileHover={!matched ? { scale: 1.02 } : {}}
                whileTap={!matched ? { scale: 0.98 } : {}}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center gap-2 ${matched ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700' : selected === i ? 'bg-blue-50 border-corporate' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-corporate/50'}`}
              >
                {matched ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                ) : Icon ? (
                  <Icon className="w-4 h-4 text-petroleum shrink-0" />
                ) : null}
                <span className="text-xs font-bold text-petroleum">{item.title}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="space-y-2">
          <h6 className="text-[10px] font-black text-petroleum uppercase tracking-wider text-center">{t('ova.ecosystem.matchup_descs')}</h6>
          {shuffledDescs.map((item) => {
            const matched = matches[item.title];
            const isWrong = wrong === item.sortKey;
            return (
              <motion.button
                key={item.sortKey}
                onClick={() => handleDescClick(item)}
                disabled={matched}
                whileHover={!matched ? { scale: 1.02 } : {}}
                whileTap={!matched ? { scale: 0.98 } : {}}
                animate={isWrong ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                transition={isWrong ? { duration: 0.4 } : {}}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${matched ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700 opacity-50' : isWrong ? 'bg-red-50 border-red-300 dark:bg-red-900/20' : selected !== null ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-corporate/50 cursor-pointer' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 cursor-default'}`}
              >
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.text}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {allMatched && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700 text-center"
          >
            <h5 className="font-[900] text-green-700 dark:text-green-400 text-sm uppercase tracking-wider">{t('ova.ecosystem.matchup_complete')}</h5>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
