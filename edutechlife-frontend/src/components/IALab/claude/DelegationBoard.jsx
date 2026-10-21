import PropTypes from "prop-types";
import { getClaudeTasks, normalizeClaudeLocale } from "../../../data/ova/claudeModule";

const CATEGORY_LABELS = {
  es: { delegate: "Delegar", review: "Delegar y revisar", never: "No delegar" },
  en: { delegate: "Delegate", review: "Delegate and review", never: "Never delegate" },
  pt: { delegate: "Delegar", review: "Delegar e revisar", never: "Não delegar" },
};

const CATEGORY_ORDER = ["delegate", "review", "never"];

// Tablero de clasificación: cada tarea se asigna a una categoría de delegación.
// Lo usan la OVA y el paso 1 del desafío; por eso es controlado (answers/onChange).
export default function DelegationBoard({ locale, answers, onChange, showFeedback, disabled }) {
  const lang = normalizeClaudeLocale(locale);
  const tasks = getClaudeTasks(lang);
  const labels = CATEGORY_LABELS[lang];
  const answered = Object.keys(answers).length;

  return (
    <div className="space-y-4" data-testid="delegation-board">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {answered}/{tasks.length}
      </p>
      {tasks.map((item) => {
        const current = answers[item.id];
        const isCorrect = current === item.answer;
        return (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
          >
            <p className="mb-3 font-semibold text-slate-900 dark:text-slate-100">{item.task}</p>
            <div role="group" aria-label={item.task} className="flex flex-wrap gap-2">
              {CATEGORY_ORDER.map((cat) => {
                const selected = current === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    disabled={disabled}
                    aria-pressed={selected}
                    onClick={() => onChange(item.id, cat)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      selected
                        ? "border-cyan-600 bg-cyan-600 text-white"
                        : "border-slate-300 text-slate-700 hover:border-cyan-600 dark:border-slate-600 dark:text-slate-200"
                    } disabled:opacity-60`}
                  >
                    {labels[cat]}
                  </button>
                );
              })}
            </div>
            {showFeedback && current && (
              <p
                className={`mt-3 text-sm ${
                  isCorrect ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"
                }`}
              >
                {isCorrect ? "✔" : "✖"} {item.why}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

DelegationBoard.propTypes = {
  locale: PropTypes.string,
  answers: PropTypes.objectOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  showFeedback: PropTypes.bool,
  disabled: PropTypes.bool,
};

DelegationBoard.defaultProps = {
  locale: "es",
  showFeedback: false,
  disabled: false,
};
