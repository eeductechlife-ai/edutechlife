import { Icon } from '../../../../utils/iconMapping';
import { useTranslation } from '../../../../i18n/I18nProvider';

export function QuestionProgressBar({ quizQuestions, quizAnswers, currentQuestion, markedQuestions, onSelectQuestion, showScoreResult }) {
  const { t } = useTranslation();

  if (showScoreResult) return null;

  return (
    <div className="px-6 py-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 overflow-x-auto">
      {quizQuestions.map((q, idx) => {
        const answered = !!quizAnswers[q.id];
        const marked = markedQuestions.has(q.id);
        return (
          <button
            key={q.id}
            onClick={() => onSelectQuestion(idx)}
            className={`w-11 h-11 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
              idx === currentQuestion
                ? 'ring-2 ring-[var(--theme-primary)] ring-offset-1 dark:ring-offset-slate-800'
                : ''
            } ${
              answered
                ? marked
                  ? 'bg-amber-400 text-white'
                  : 'bg-emerald-500 text-white'
                : marked
                  ? 'bg-amber-200 text-amber-700'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}
            title={`${t('ialab.quiz.question_count', { current: idx + 1, total: '' })}${marked ? ` (${t('ialab.quiz.marked')})` : ''}`}
          >
            {idx + 1}
          </button>
        );
      })}
    </div>
  );
}
