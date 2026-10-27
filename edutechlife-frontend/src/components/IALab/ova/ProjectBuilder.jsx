import { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Etapa "Tu Proyecto y tu Skill" (tema 3 del Módulo 5): instrucciones del Proyecto, archivos
// seguros, una Skill de tres pasos y el conector con el mínimo acceso.
// onReady recibe true/false y debe ser estable (por ejemplo, el setter de un useState).
const MIN_WORDS = 2;
const words = (s = "") => s.trim().split(/\s+/).filter(Boolean).length;
const inputCls =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";

export default function ProjectBuilder({ data, onReady }) {
  const [values, setValues] = useState({});
  const [files, setFiles] = useState(() => data.files.map(() => false));
  const [connector, setConnector] = useState(null);
  const [copied, setCopied] = useState(false);

  const SKILL_KEYS = ["sname", "when", "s1", "s2", "s3"];
  const minFor = (key) => (SKILL_KEYS.includes(key) ? 4 : MIN_WORDS);
  const fieldsOk = [...data.projectFields, ...data.skillFields].every(
    (f) => words(values[f.key]) >= minFor(f.key),
  );
  const filesOk =
    data.files.every((f, i) => (f.ok ? true : !files[i])) &&
    data.files.filter((f, i) => f.ok && files[i]).length >= 2;
  const ready = fieldsOk && filesOk && connector === data.connectorCorrect;

  useEffect(() => {
    onReady(ready);
  }, [ready, onReady]);

  const val = (k) => (values[k] || "").trim();
  const output = [
    `${data.projectHeading}: ${val("name")}`,
    `${data.projectFields[1].label}: ${val("purpose")}`,
    ...data.projectFields.slice(2).map((f) => `- ${val(f.key)}`),
    `${data.filesHeading}: ${data.files
      .filter((f, i) => files[i])
      .map((f) => f.t)
      .join(", ")}`,
    "",
    `${data.skillHeading}: ${val("sname")}`,
    `${data.skillFields[1].label}: ${val("when")}`,
    ...["s1", "s2", "s3"].map((k, i) => `${i + 1}. ${val(k)}`),
  ].join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  const field = (f) => (
    <label key={f.key} className="block">
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        {f.label}
      </span>
      <input
        type="text"
        value={values[f.key] || ""}
        placeholder={f.placeholder}
        onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
        className={inputCls}
      />
    </label>
  );
  const box =
    "space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900";

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-900 dark:text-white">{data.title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">{data.intro}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {data.planNote}
      </p>

      <div className={box}>
        <p className="font-bold text-slate-900 dark:text-slate-100">
          {data.projectTitle}
        </p>
        {data.projectFields.map(field)}
      </div>

      <div className={box}>
        <p className="font-bold text-slate-900 dark:text-slate-100">
          {data.filesTitle}
        </p>
        <ul className="space-y-2">
          {data.files.map((f, i) => (
            <li key={f.t}>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-800 dark:text-slate-100">
                <input
                  type="checkbox"
                  checked={files[i]}
                  onChange={() =>
                    setFiles((p) => p.map((v, j) => (j === i ? !v : v)))
                  }
                  className="mt-1 h-4 w-4 accent-cyan-600"
                />
                <span>{f.t}</span>
              </label>
              {files[i] && (
                <p
                  className={`ml-7 mt-1 text-xs ${f.ok ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}
                >
                  {f.ok ? "✔ " : "✖ "}
                  {f.why}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className={box}>
        <p className="font-bold text-slate-900 dark:text-slate-100">
          {data.skillTitle}
        </p>
        {data.skillFields.map(field)}
      </div>

      <div className={box}>
        <p className="font-bold text-slate-900 dark:text-slate-100">
          {data.connectorTitle}
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {data.connectorQ}
        </p>
        {data.connectorOptions.map((opt, i) => (
          <button
            key={opt}
            type="button"
            aria-pressed={connector === i}
            onClick={() => setConnector(i)}
            className={`w-full rounded-xl border-2 p-3 text-left text-sm transition ${connector === i ? (i === data.connectorCorrect ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : "border-rose-400 bg-rose-50 dark:bg-rose-900/20") : "border-slate-300 dark:border-slate-600"} text-slate-900 dark:text-slate-100`}
          >
            {opt}
          </button>
        ))}
        {connector !== null && (
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {data.connectorWhy}
          </p>
        )}
      </div>

      <div className="space-y-3 rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5 dark:border-cyan-900 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {data.outputTitle}
        </p>
        <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-100">
          {output}
        </pre>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={copy}
            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-bold text-white"
          >
            {copied ? data.copied : data.copy}
          </button>
          <p
            className={`text-sm font-semibold ${ready ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}
          >
            {ready ? data.ready : data.notReady}
          </p>
        </div>
      </div>
    </div>
  );
}

ProjectBuilder.propTypes = {
  data: PropTypes.object.isRequired,
  onReady: PropTypes.func.isRequired,
};
