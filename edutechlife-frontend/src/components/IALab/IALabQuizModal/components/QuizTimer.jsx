import { motion } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping';
import { useTranslation } from '../../../../i18n/I18nProvider';

export function QuizTimer({ timeElapsed, suggestedTime, currentQuestion, totalQuestions, isTimerRunning, showSecurityMessage, securityMessage, practiceMode, onTogglePractice, onClose, formatTime }) {
  const { t } = useTranslation();
  const timeWarning = timeElapsed > suggestedTime * 0.8;

  return (
    <div className="bg-gradient-to-r from-petroleum to-corporate px-6 py-4 flex items-center justify-between z-50">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
      >
        <Icon name="fa-arrow-left" className="text-sm" aria-hidden="true" />
        <span className="text-sm font-medium">{t('ialab.quiz.exit')}</span>
      </button>

      <div className="flex items-center gap-6">
        {isTimerRunning && (
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              timeWarning
                ? 'bg-red-50 border border-red-200 text-red-600'
                : 'bg-white/10 border border-white/20 text-white/90'
            }`}
            role="timer"
            aria-live="polite"
            aria-label={t('ialab.quiz.time_remaining', { time: formatTime(Math.max(0, suggestedTime - timeElapsed)) })}
          >
            <Icon name="fa-clock" className="text-sm" aria-hidden="true" />
            <span className="text-sm font-mono font-bold">{formatTime(Math.max(0, suggestedTime - timeElapsed))}</span>
          </div>
        )}

        <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors select-none">
          <input
            type="checkbox"
            checked={practiceMode}
            onChange={onTogglePractice}
            className="w-3.5 h-3.5 rounded border-white/30 bg-white/10 text-petroleum focus:ring-petroleum focus:ring-offset-0"
          />
          <span className="text-[11px] font-medium text-white/80">{t('ialab.quiz.practice')}</span>
        </label>

        <div className="flex items-center gap-3">
          <span className="text-sm text-white/80">
            {t('ialab.quiz.question_count', { current: currentQuestion + 1, total: totalQuestions })}
          </span>
          <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-petroleum transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {showSecurityMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-50 to-amber-100/80 dark:from-amber-900/30 dark:to-amber-800/20 border border-amber-200 dark:border-amber-700/50 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center shadow-sm flex-shrink-0">
                <Icon name="fa-shield-halved" className="text-white text-xs" aria-hidden="true" />
              </div>
              <span className="text-xs font-medium text-amber-800 dark:text-amber-300">{securityMessage}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
