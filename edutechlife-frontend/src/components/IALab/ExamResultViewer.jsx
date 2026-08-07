import PropTypes from "prop-types";
import { Icon } from "../../utils/iconMapping.jsx";
import { useIALabStore } from "../../store/ialabStore";
import { useTranslation } from "../../i18n/I18nProvider";
// Estas cuatro constantes estaban duplicadas a mano y `TOTAL_QUESTIONS` valía 8
// cuando el examen tiene 12: con 10 aciertos mostraba "-2 incorrectas".
import {
  PASSING_SCORE,
  TOTAL_QUESTIONS,
  MAX_ATTEMPTS,
} from "../../data/ialabQuizData";

const ExamResultViewer = ({ moduleId, score, onClose, onRetry }) => {
  const { t } = useTranslation();
  const passed = score >= PASSING_SCORE;
  const setShowValerioDrawer = useIALabStore((s) => s.setShowValerioDrawer);
  const setValerioInitialMessage = useIALabStore((s) => s.setValerioInitialMessage);

  const handleAskMax = () => {
    const key = passed ? "ialab.ask_max_exam_passed" : "ialab.ask_max_exam_failed";
    setValerioInitialMessage(t(key, { mod: moduleId, score }));
    setShowValerioDrawer(true);
    onClose?.();
  };

  let storedAttempt = null;
  try {
    const attempts = useIALabStore
      .getState()
      .storageGet(`quizAttempts_${moduleId}`, []);
    storedAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null;
  } catch {}

  const correctCount =
    storedAttempt?.correctCount ?? Math.round((score / 100) * TOTAL_QUESTIONS);
  const incorrectCount = TOTAL_QUESTIONS - correctCount;
  const failedTopics = storedAttempt?.failedQuestions || [];

  // Lógica de intentos. Antes leía y escribía `localStorage` directo, pero esas
  // claves van namespaceadas por cuenta (userScopedStorage), así que lo que se
  // descontaba aquí era invisible para `canAttemptQuiz` y viceversa. El store
  // ya expone la misma lógica sobre el almacenamiento correcto.
  const remaining = useIALabStore.getState().getExamRemainingAttempts(moduleId);
  const nextAttempt =
    useIALabStore.getState().getExamNextAttemptTime(moduleId) || 0;
  const now = Date.now();
  const inCooldown = nextAttempt > 0 && now < nextAttempt;
  const hoursLeft = Math.ceil((nextAttempt - now) / 3600000);

  const handleRetry = () => {
    if (remaining <= 0) return;
    if (inCooldown) return;
    // decrementExamAttempt aplica el cooldown, respeta el rol admin y emite
    // 'ialab:attemptsUpdated' por su cuenta.
    useIALabStore.getState().decrementExamAttempt(moduleId);
    if (onRetry) onRetry();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={
        passed
          ? t("ialab.exam_result.title_passed")
          : t("ialab.exam_result.title_failed")
      }
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Score Circle */}
          <div className="text-center mb-6">
            <div
              className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${passed ? "bg-emerald-50" : "bg-red-50"}`}
            >
              <div className="relative">
                <Icon
                  name={passed ? "fa-trophy" : "fa-exclamation-circle"}
                  className={`text-4xl ${passed ? "text-emerald-500" : "text-red-500"}`}
                />
                <div
                  className={`absolute -top-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${passed ? "bg-emerald-500" : "bg-red-500"}`}
                >
                  {score}%
                </div>
              </div>
            </div>
            <h2
              className={`text-xl font-bold mb-1 font-montserrat ${passed ? "text-emerald-600" : "text-red-600"}`}
            >
              {passed
                ? t("ialab.exam_result.title_passed")
                : t("ialab.exam_result.title_failed")}
            </h2>
            <p className="text-sm text-slate-500">
              {passed
                ? t("ialab.exam_result.desc_passed")
                : t("ialab.exam_result.desc_failed", { score: PASSING_SCORE })}
            </p>
          </div>

          {/* Stats */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
            <div className="flex justify-around text-center">
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {correctCount}
                </div>
                <div className="text-xs text-slate-500">
                  {t("ialab.exam_result.correct")}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {incorrectCount}
                </div>
                <div className="text-xs text-slate-500">
                  {t("ialab.exam_result.incorrect")}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {TOTAL_QUESTIONS}
                </div>
                <div className="text-xs text-slate-500">
                  {t("ialab.exam_result.total")}
                </div>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full rounded-full transition-all duration-700 ${passed ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : "bg-gradient-to-r from-red-500 to-red-400"}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* Feedback de mejora */}
          {!passed && failedTopics.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
              <h4 className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1.5">
                <Icon name="fa-lightbulb" className="text-sm" />
                {t("ialab.exam_result.improvement_areas")}
              </h4>
              <p className="text-xs text-red-600 leading-relaxed">
                {t("ialab.exam_result.improvement_desc")}
              </p>
            </div>
          )}

          {/* Intentos / Retry */}
          {!passed && (
            <div className="mb-4">
              {remaining > 0 && !inCooldown && (
                <>
                  <button
                    onClick={handleRetry}
                    className="w-full py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-lg transition-all duration-200 font-bold text-sm mb-2 flex items-center justify-center gap-2"
                  >
                    <Icon name="fa-rocket" />
                    {t("ialab.exam_result.retry")}
                  </button>
                  <p className="text-xs text-center text-slate-600">
                    {t("ialab.exam_result.retry_info", {
                      remaining: remaining - 1,
                      max: MAX_ATTEMPTS,
                    })}
                  </p>
                </>
              )}
              {remaining > 0 && inCooldown && (
                <p className="text-xs text-center text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  {t("ialab.exam_result.cooldown", {
                    hours: hoursLeft,
                    max: MAX_ATTEMPTS,
                  })}
                </p>
              )}
              {remaining <= 0 && (
                <p className="text-xs text-center text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {t("ialab.exam_result.no_attempts", { max: MAX_ATTEMPTS })}
                </p>
              )}
            </div>
          )}

          {/* Valerio CTA */}
          <button
            onClick={handleAskMax}
            className="w-full py-2.5 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-lg transition-all duration-200 font-bold text-sm flex items-center justify-center gap-2 mb-2"
          >
            <Icon name="fa-robot" className="w-4 h-4" aria-hidden="true" />
            {t("ialab.ask_max_exam_btn")}
          </button>
          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-petroleum/30 text-petroleum rounded-xl hover:bg-petroleum/5 transition-all duration-200 font-bold text-sm"
          >
            {t("ialab.exam_result.back_to_module")}
          </button>
        </div>
      </div>
    </div>
  );
};

ExamResultViewer.propTypes = {
  moduleId: PropTypes.number,
  score: PropTypes.number,
  onClose: PropTypes.func,
  onRetry: PropTypes.func,
};

export default ExamResultViewer;
