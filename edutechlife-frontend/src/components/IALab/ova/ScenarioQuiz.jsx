import { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Quiz de escenarios compartido por los OVA del Módulo 5: elige la opción completa y lee por qué.
// onResult recibe { passed, correct } y debe ser estable (por ejemplo, el setter de un useState).
export default function ScenarioQuiz({ scenarios, labels, passMin, onResult }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const correct = answers.filter(Boolean).length;
  const passed = finished && correct >= passMin;
  const scenario = scenarios[index];

  useEffect(() => {
    onResult({ passed, correct });
  }, [passed, correct, onResult]);

  const advance = () => {
    setAnswers([...answers, picked === scenario.correct]);
    setPicked(null);
    if (index >= scenarios.length - 1) setFinished(true);
    else setIndex(index + 1);
  };

  const retry = () => {
    setIndex(0);
    setPicked(null);
    setAnswers([]);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-700 dark:bg-slate-900">
        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {labels.correct
            .replace("{correct}", correct)
            .replace("{total}", scenarios.length)}
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          {passed ? labels.passed : labels.failed}
        </p>
        {!passed && (
          <button
            type="button"
            onClick={retry}
            className="rounded-xl bg-cyan-600 px-5 py-2 text-sm font-bold text-white"
          >
            {labels.retry}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {index + 1} / {scenarios.length}
      </p>
      <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        <span className="font-semibold">{labels.weak}: </span>
        {scenario.weak}
      </p>
      <div className="space-y-2">
        {scenario.options.map((opt, i) => {
          const isCorrect = i === scenario.correct;
          const cls =
            picked === null
              ? "border-slate-300 hover:border-cyan-500 dark:border-slate-600"
              : isCorrect
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                : i === picked
                  ? "border-rose-400 bg-rose-50 dark:bg-rose-900/20"
                  : "border-slate-200 opacity-60 dark:border-slate-700";
          return (
            <button
              key={opt}
              type="button"
              onClick={() => picked === null && setPicked(i)}
              disabled={picked !== null}
              className={`w-full rounded-xl border-2 p-3 text-left text-sm text-slate-900 transition dark:text-slate-100 ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="space-y-3">
          <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <span className="font-semibold">{labels.why}: </span>
            {scenario.why}
          </p>
          <button
            type="button"
            onClick={advance}
            className="w-full rounded-xl bg-cyan-600 py-3 text-sm font-bold text-white"
          >
            {index >= scenarios.length - 1 ? labels.seeResult : labels.next}
          </button>
        </div>
      )}
    </div>
  );
}

ScenarioQuiz.propTypes = {
  scenarios: PropTypes.arrayOf(PropTypes.object).isRequired,
  labels: PropTypes.shape({
    weak: PropTypes.string,
    why: PropTypes.string,
    next: PropTypes.string,
    seeResult: PropTypes.string,
    retry: PropTypes.string,
    correct: PropTypes.string,
    passed: PropTypes.string,
    failed: PropTypes.string,
  }).isRequired,
  passMin: PropTypes.number.isRequired,
  onResult: PropTypes.func.isRequired,
};
