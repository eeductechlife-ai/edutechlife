import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../i18n/I18nProvider';

export default function DashboardModuleRow({ id, title, icon, approved, unlocked, score, examScore, challengeScore, onNavigate }) {
  const { t } = useTranslation();
  const isActive = unlocked && !approved;
  const isLocked = !unlocked;
  return (
    <motion.div
      whileHover={unlocked ? { x: 3 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 16 }}
      className={`flex items-center gap-3.5 bg-white rounded-xl p-3.5 shadow-sm border transition-all duration-200 ${
        isActive ? 'border-corporate/60 shadow-[0_0_0_2px_rgba(0,188,212,0.08),0_4px_16px_rgba(0,188,212,0.1)]' : 'border-slate-100'
      } ${isLocked ? 'opacity-65' : ''}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-corporate/10' : 'bg-slate-100'}`}>
        <Icon name={isActive ? 'fa-play' : icon} className={`text-base ${isActive ? 'text-corporate' : 'text-slate-400'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-petroleum">{t('dashboard.module_row_title', { id, title })}</p>
        {isActive && (
          <div className="h-1 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-corporate rounded-full transition-all duration-700" style={{ width: `${score}%` }} />
          </div>
        )}
        {approved && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <Icon name="fa-check-circle" className="w-3 h-3 text-corporate" />
            <span className="text-[11px] text-slate-500">{t('dashboard.module_score_detail', { score, examScore, challengeScore })}</span>
          </div>
        )}
      </div>
      {unlocked ? (
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 12 }}
          onClick={onNavigate}
          className="flex-shrink-0 bg-corporate text-white text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all">
          {t(approved ? 'dashboard.review_btn' : 'dashboard.continue_btn')} <Icon name="fa-arrow-right" className="w-3 h-3" />
        </motion.button>
      ) : (
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] flex-shrink-0">
          <Icon name="fa-lock" className="w-3 h-3 text-slate-300" />
          {t('dashboard.locked_module_hint')}
        </div>
      )}
    </motion.div>
  );
}
