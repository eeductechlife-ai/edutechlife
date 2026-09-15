import { Icon } from '../../../../utils/iconMapping';
import { useTranslation } from '../../../../i18n/I18nProvider';
import VoiceReader from '../../VoiceReader';

function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 'fácil': return 'bg-emerald-100 text-emerald-700';
    case 'medio': return 'bg-amber-100 text-amber-700';
    case 'difícil': return 'bg-red-100 text-red-700';
    default: return 'bg-slate-100 text-slate-600';
  }
}

export function QuestionRenderer({ question, questionIndex, totalQuestions, selectedAnswer, markedQuestions, onSelectAnswer, onToggleMark, showFeedback = false }) {
  const { t } = useTranslation();

  if (!question) return null;

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] flex items-center justify-center shadow-lg shadow-[var(--theme-emphasis)]/20 mt-0.5 flex-shrink-0">
            <span className="text-white font-bold text-sm">{questionIndex + 1}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
              {question.question}
            </h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs text-slate-500">{question.topic}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty}
              </span>
              <VoiceReader text={question.question} />
              <button
                onClick={() => onToggleMark(question.id)}
                className={`ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  markedQuestions.has(question.id)
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600 dark:hover:bg-slate-600'
                }`}
                aria-label={markedQuestions.has(question.id) ? t('ialab.quiz.unmark_review') : t('ialab.quiz.mark_review')}
              >
                <Icon name="fa-bookmark" className="text-xs" aria-hidden="true" />
                {markedQuestions.has(question.id) ? t('ialab.quiz.marked') : t('ialab.quiz.mark_review')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 max-w-4xl" role="radiogroup" aria-label={t('ialab.quiz.options_group', { question: questionIndex + 1 })}>
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrectOption = option.id === question.correctAnswer;
          const revealed = showFeedback && Boolean(selectedAnswer);
          const state = revealed
            ? isCorrectOption
              ? 'correct'
              : isSelected
                ? 'wrong'
                : 'neutral'
            : isSelected
              ? 'selected'
              : 'neutral';
          const optionId = `quiz-option-${questionIndex}-${option.id}`;
          const stateClasses = {
            correct:
              'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-600',
            wrong:
              'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-600',
            selected:
              'border-[var(--theme-primary)] bg-[var(--theme-primary)]/5 shadow-[0_0_15px_rgba(0,188,212,0.15)] dark:border-mint dark:bg-mint/10 dark:shadow-mint/20',
            neutral:
              'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:border-slate-500',
          }[state];
          const dotClasses = {
            correct: 'border-emerald-500 bg-emerald-500',
            wrong: 'border-red-500 bg-red-500',
            selected: 'border-[var(--theme-primary)] bg-[var(--theme-primary)]',
            neutral: 'border-slate-300',
          }[state];
          const labelClasses = {
            correct: 'text-emerald-700 dark:text-emerald-400 font-medium',
            wrong: 'text-red-700 dark:text-red-400 font-medium',
            selected: 'text-[var(--theme-emphasis)] font-medium',
            neutral: 'text-slate-700 dark:text-slate-200',
          }[state];
          return (
            <button
              key={option.id}
              id={optionId}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectAnswer(option.id)}
              className={`w-full text-left min-h-[44px] p-3.5 rounded-xl border-2 transition-all duration-300 flex items-start gap-3 ${stateClasses}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 ${dotClasses}`}>
                {state === 'correct' && <Icon name="fa-check" className="text-[10px] text-white" aria-hidden="true" />}
                {state === 'wrong' && <Icon name="fa-xmark" className="text-[10px] text-white" aria-hidden="true" />}
                {state === 'selected' && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
              <label htmlFor={optionId} className={`text-sm md:text-base leading-relaxed cursor-pointer ${labelClasses}`}>
                {option.label}
              </label>
            </button>
          );
        })}
      </div>
    </div>
  );
}
