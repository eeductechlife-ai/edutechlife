import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import { cn } from '../../forum/forumDesignSystem';
import { useTranslation } from '../../../i18n/I18nProvider';


OvaGeminiQuiz.propTypes = {
  quiz: PropTypes.array,
  selectedAnswers: PropTypes.object,
  showResults: PropTypes.bool,
  isAllCorrect: PropTypes.bool,
  answeredCount: PropTypes.number,
  totalQuestions: PropTypes.number,
  correctCount: PropTypes.number,
  handleAnswerSelect: PropTypes.func,
  handleCheckAnswers: PropTypes.func,
};

export default function OvaGeminiQuiz({
  quiz, selectedAnswers, showResults, isAllCorrect, answeredCount,
  totalQuestions, correctCount, handleAnswerSelect, handleCheckAnswers
}) {
  const { t } = useTranslation();

  return (
    <div key="quiz">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-400/20 dark:from-amber-400/10 dark:to-orange-400/10 flex items-center justify-center">
          <Icon name="fa-question-circle" className="text-amber-600 dark:text-amber-400 text-lg sm:text-xl" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white font-montserrat">
            {t('ova.quiz.final_quiz')}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {t('ova.quiz.put_to_test')}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
        {t('ova.quiz.answer_prompt', { count: totalQuestions })}
      </p>

      <div className="space-y-4 sm:space-y-6">
        {quiz.map((q, qIdx) => {
          const selected = selectedAnswers[qIdx];
          const isCorrect = selected === q.correct;
          const showFeedback = showResults && selected !== undefined;
          const isUnanswered = showResults && selected === undefined;

          return (
            <motion.div
              key={`q-${qIdx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIdx * 0.1 }}
              className={cn(
                'rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 transition-colors',
                showFeedback && isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                  : showFeedback && !isUnanswered
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                    : showFeedback && isUnanswered
                      ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600'
                      : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
              )}
            >
              <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
                <span className="text-cyan-600 dark:text-cyan-400 mr-2">#{qIdx + 1}</span>
                {q.question}
              </p>

              <div className="space-y-2 sm:space-y-2.5">
                {q.options.map((opt) => {
                  const isSelected = selected === opt.id;
                  const isOptionCorrect = opt.id === q.correct;

                  let optionStyle = 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800/30';
                  if (showResults && isOptionCorrect) {
                    optionStyle = 'border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/20';
                  } else if (showResults && isSelected && !isOptionCorrect) {
                    optionStyle = 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20';
                  } else if (isSelected && !showResults) {
                    optionStyle = 'border-cyan-400 dark:border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswerSelect(qIdx, opt.id)}
                      disabled={showResults}
                      aria-pressed={isSelected}
                      className={cn(
                        'w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all text-xs sm:text-sm font-medium',
                        optionStyle,
                        !showResults && 'hover:border-cyan-300 dark:hover:border-cyan-600 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 cursor-pointer'
                      )}
                    >
                      <span className="flex items-center gap-2 sm:gap-3">
                        <span className={cn(
                          "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 flex-shrink-0",
                          isSelected && !showResults
                            ? 'bg-corporate border-corporate text-white'
                            : 'bg-transparent border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                        )}>
                          {opt.id.toUpperCase()}
                        </span>
                        <span className="text-gray-700 dark:text-gray-200">{opt.text}</span>
                        {showResults && isOptionCorrect && (
                          <Icon name="fa-check-circle" className="text-green-500 text-sm sm:text-base ml-auto flex-shrink-0" />
                        )}
                        {showResults && isSelected && !isOptionCorrect && (
                          <Icon name="fa-times-circle" className="text-red-500 text-sm sm:text-base ml-auto flex-shrink-0" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic px-1"
                >
                  <Icon name="fa-lightbulb" className="text-amber-400 mr-1 inline" />
                  {q.explanation}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {!showResults ? (
        <motion.button
          onClick={handleCheckAnswers}
          disabled={answeredCount < totalQuestions}
          className={cn(
            'w-full mt-4 sm:mt-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all',
            answeredCount >= totalQuestions
              ? 'bg-gradient-to-r from-cyan-500 to-petroleum text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5 cursor-pointer'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          )}
        >
          {t('ova.quiz.check_answers')}
        </motion.button>
      ) : (
        <div className="mt-4 sm:mt-6 space-y-3" aria-live="polite">
          <div className="flex items-center justify-between px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-100 dark:border-cyan-800">
            <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">
              {t('ova.quiz.result_label')}
            </span>
            <span className="text-sm sm:text-base font-bold">
              <span className={correctCount === totalQuestions ? 'text-green-500' : correctCount >= 2 ? 'text-cyan-500' : 'text-amber-500'}>
                {correctCount}/{totalQuestions}
              </span>
              <span className="text-gray-400 dark:text-gray-500 ml-1">
                ({Math.round((correctCount / totalQuestions) * 100)}%)
              </span>
            </span>
          </div>

          {isAllCorrect ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700 text-center"
            >
              <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                <Icon name="fa-check-circle" className="text-green-500 mr-1 inline" />
                {t('ova.quiz.completed')}
              </p>
            </motion.div>
          ) : (
            <p className="text-center text-xs sm:text-sm text-gray-400 dark:text-gray-500">
              {t('ova.quiz.all_correct_hint')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
