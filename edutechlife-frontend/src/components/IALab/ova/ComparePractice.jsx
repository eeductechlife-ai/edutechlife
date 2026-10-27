import PropTypes from "prop-types";

// Práctica de comparación compartida por los OVA del Módulo 5: dos resultados del mismo
// encargo (pedido vago y pedido completo), el estudiante elige cuál usaría y lee por qué.
export default function ComparePractice({ data, weakLabel, value, onChange }) {
  const options = [
    ["A", data.a, data.whyA, data.chooseA],
    ["B", data.b, data.whyB, data.chooseB],
  ];
  return (
    <div className="space-y-3 rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5 dark:border-cyan-900 dark:bg-slate-900">
      <p className="font-bold text-slate-900 dark:text-slate-100">
        {data.title}
      </p>
      <p className="rounded-xl bg-white p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        <span className="font-semibold">{weakLabel}: </span>
        {data.weak}
      </p>
      <p className="rounded-xl bg-white p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        <span className="font-semibold">{data.strongLabel}: </span>
        {data.strong}
      </p>
      {options.map(([key, text, why, label]) => (
        <div key={key} className="space-y-2">
          <p className="whitespace-pre-line rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
            <span className="mb-1 block text-xs font-bold text-slate-500">
              {key}
            </span>
            {text}
          </p>
          <button
            type="button"
            aria-pressed={value === key}
            onClick={() => onChange(key)}
            className={`rounded-full border-2 px-4 py-1 text-sm font-bold ${value === key ? "border-cyan-600 bg-cyan-600 text-white" : "border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200"}`}
          >
            {label}
          </button>
          {value === key && (
            <p className="text-sm text-slate-700 dark:text-slate-300">{why}</p>
          )}
        </div>
      ))}
      {value !== null && (
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          {data.done}
        </p>
      )}
    </div>
  );
}

ComparePractice.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    weak: PropTypes.string,
    strongLabel: PropTypes.string,
    strong: PropTypes.string,
    a: PropTypes.string,
    b: PropTypes.string,
    whyA: PropTypes.string,
    whyB: PropTypes.string,
    chooseA: PropTypes.string,
    chooseB: PropTypes.string,
    done: PropTypes.string,
  }).isRequired,
  weakLabel: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
