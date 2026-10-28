import PropTypes from "prop-types";
import { useTranslation } from "../../../i18n/I18nProvider";

/**
 * QuizIntroCard — Pantalla previa al examen: explica cuántas preguntas hay y
 * el tiempo sugerido. El cronómetro arranca solo al pulsar "Comenzar".
 */
const QuizIntroCard = ({ totalQuestions, suggestedTimeSeconds, onStart }) => {
  const { t } = useTranslation();

  return (
    <div
      data-testid="quiz-intro"
      className="mx-auto max-w-lg rounded-3xl border border-[var(--theme-emphasis)]/15 bg-white dark:bg-slate-800 p-8 text-center shadow-sm"
    >
      <h2 className="text-2xl font-extrabold text-[var(--theme-emphasis)]">
        {t("ialab.quiz.intro_title")}
      </h2>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {t("ialab.quiz.intro_desc", {
          total: totalQuestions,
          minutes: Math.round(suggestedTimeSeconds / 60),
        })}
      </p>
      <button
        type="button"
        onClick={onStart}
        className="mt-6 inline-flex items-center justify-center rounded-full px-8 py-3 font-semibold !text-white min-h-[44px]"
        style={{
          background:
            "linear-gradient(120deg, var(--theme-emphasis), var(--theme-primary))",
        }}
      >
        {t("ialab.quiz.intro_cta")}
      </button>
    </div>
  );
};

QuizIntroCard.propTypes = {
  totalQuestions: PropTypes.number,
  suggestedTimeSeconds: PropTypes.number,
  onStart: PropTypes.func.isRequired,
};

export default QuizIntroCard;
