import { Icon } from '../../../../utils/iconMapping';
import { useTranslation } from '../../../../i18n/I18nProvider';

function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 'fácil': return 'bg-emerald-100 text-emerald-700';
    case 'medio': return 'bg-amber-100 text-amber-700';
    case 'difícil': return 'bg-red-100 text-red-700';
    default: return 'bg-slate-100 text-slate-600';
  }
}

export function QuestionRenderer({ question, questionIndex, totalQuestions, selectedAnswer, markedQuestions, onSelectAnswer, onToggleMark }) {
  const { t } = useTranslation();

  if (!question) return null;

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center shadow-lg shadow-petroleum/20 mt-0.5 flex-shrink-0">
            <span className="text-white font-bold text-sm">{questionIndex + 1}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
              {question.question}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-slate-500">{question.topic}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty}
              </span>
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
          const optionId = `quiz-option-${questionIndex}-${option.id}`;
          return (
            <button
              key={option.id}
              id={optionId}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectAnswer(option.id)}
              className={`w-full text-left min-h-[44px] p-3.5 rounded-xl border-2 transition-all duration-300 flex items-start gap-3 ${
                isSelected
                  ? 'border-corporate bg-corporate/5 shadow-[0_0_15px_rgba(0,188,212,0.15)] dark:border-mint dark:bg-mint/10 dark:shadow-mint/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:border-slate-500'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 ${
                isSelected ? 'border-corporate bg-corporate' : 'border-slate-300'
              }`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
              <label htmlFor={optionId} className={`text-sm md:text-base leading-relaxed cursor-pointer ${
                isSelected ? 'text-petroleum font-medium' : 'text-slate-700 dark:text-slate-200'
              }`}>
                {option.label}
              </label>
            </button>
          );
        })}
      </div>
    </div>
  );
}
