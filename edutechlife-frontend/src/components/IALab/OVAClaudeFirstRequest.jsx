import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { usePersistedOvaState } from "../../hooks/IALab/usePersistedOvaState";
import ConceptCards from "./ova/ConceptCards";
import OvaHeader from "./ova/OvaHeader";
import { CONCEPTS } from "./ova/claudeConcepts";
import OvaNav from "./ova/OvaNav";
import ComparePractice from "./ova/ComparePractice";
import ScenarioQuiz from "./ova/ScenarioQuiz";
import { useTranslation } from "../../i18n/I18nProvider";
import { FIRST_REQUEST_DATA } from "./ova/claudeFirstRequestData";
import { FIRST_REQUEST_EXTRA } from "./ova/claudeFirstRequestExtra";
import { FIRST_REQUEST_SCENARIOS } from "./ova/claudeFirstRequestScenarios";

// Primer pedido a Claude (Módulo 5): cómo procesa Claude un pedido, un simulador de partes,
// mejora por versiones, un quiz (4 de 5) y el constructor del pedido propio.
// Completa al aprobar el quiz y tener las cinco partes del pedido.
const MIN_WORDS = 3;
const PASS_QUIZ = 4;
const STAGE = { FLOW: 0, SIM: 1, ITER: 2, QUIZ: 3, BUILD: 4 };
const OVA_ID = "claude-first-request-ova-1";
const emptyFields = () => ({ obj: "", aud: "", fmt: "", tone: "", lim: "" });
const fill = (text, values) =>
  Object.entries(values).reduce((t, [k, v]) => t.replace(`{${k}}`, v), text);

export default function OVAClaudeFirstRequest({ onComplete }) {
  const { locale } = useTranslation();
  const lang = FIRST_REQUEST_DATA[locale] ? locale : "es";
  const copy = FIRST_REQUEST_DATA[lang];
  const concepts = CONCEPTS["first"][lang];
  const extra = FIRST_REQUEST_EXTRA[lang];
  const scenarios = FIRST_REQUEST_SCENARIOS[lang];
  const [quiz, setQuiz] = usePersistedOvaState(OVA_ID, "quiz", {
    passed: false,
    correct: 0,
  });
  const quizPassed = quiz.passed;
  const correct = quiz.correct;
  const quizLabels = {
    weak: copy.weak,
    why: copy.why,
    next: copy.next,
    seeResult: copy.seeResult,
    retry: copy.retry,
    correct: copy.quizCorrect,
    passed: copy.quizPassed,
    failed: copy.quizFailed,
  };
  const [diag, setDiag] = usePersistedOvaState(OVA_ID, "diag", {});
  const [diagDone, setDiagDone] = usePersistedOvaState(
    OVA_ID,
    "diagDone",
    false,
  );
  const diagOk =
    extra.diagCorrect.every((k) => diag[k]) &&
    copy.parts.filter((p) => diag[p.key]).length === extra.diagCorrect.length;
  const [stage, setStage] = usePersistedOvaState(OVA_ID, "stage", STAGE.FLOW);
  const [flowIndex, setFlowIndex] = usePersistedOvaState(
    OVA_ID,
    "flowIndex",
    0,
  );
  const [enabled, setEnabled] = usePersistedOvaState(OVA_ID, "enabled", {
    obj: false,
    aud: false,
    fmt: false,
    tone: false,
    lim: false,
  });
  const [iterIndex, setIterIndex] = usePersistedOvaState(
    OVA_ID,
    "iterIndex",
    0,
  );
  const [fields, setFields] = usePersistedOvaState(
    OVA_ID,
    "fields",
    emptyFields,
  );
  const [copied, setCopied] = useState(false);
  const completedRef = useRef(false);

  const builderReady = copy.fields.every(
    (f) =>
      fields[f.key].trim().split(/\s+/).filter(Boolean).length >= MIN_WORDS,
  );
  const [compare, setCompare] = usePersistedOvaState(OVA_ID, "compare", null);
  const passed = quizPassed && builderReady && compare === "B";

  useEffect(() => {
    if (passed && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [passed, onComplete]);

  const missing = copy.parts.filter((p) => !enabled[p.key]);
  const activeCount = copy.parts.length - missing.length;
  const qualityLevel =
    activeCount <= 1 ? 0 : activeCount === 2 ? 1 : activeCount < 5 ? 2 : 3;
  const built = [
    copy.base,
    ...copy.parts.filter((p) => enabled[p.key]).map((p) => p.text),
  ].join(" ");
  const requestText = copy.fields
    .map((f) => `${f.label}: ${fields[f.key].trim()}`)
    .join("\n");
  const iteration = extra.iterations[iterIndex];
  const flow = extra.flowSteps[flowIndex];

  const toggle = (key) =>
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
  const copyRequest = async () => {
    try {
      await navigator.clipboard.writeText(requestText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <OvaHeader title={copy.title} intro={copy.intro} />

      <ol className="flex flex-wrap gap-2" aria-label="Etapas">
        {copy.stages.map((label, i) => (
          <li
            key={label}
            aria-current={stage === i ? "step" : undefined}
            className={`rounded-full px-3 py-1 text-xs font-bold ${stage === i ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}
          >
            {label}
          </li>
        ))}
      </ol>

      {stage === STAGE.FLOW && (
        <div className="space-y-4">
          <ConceptCards title={concepts.title} items={concepts.items} />
          <h3 className="font-bold text-slate-900 dark:text-white">
            {copy.flowTitle}
          </h3>
          <div className="space-y-3 rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5 dark:border-cyan-900 dark:bg-slate-900">
            <div className="flex gap-1" aria-hidden="true">
              {extra.flowSteps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${i <= flowIndex ? "bg-cyan-600" : "bg-slate-200 dark:bg-slate-700"}`}
                />
              ))}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {fill(copy.flowStep, {
                n: flowIndex + 1,
                total: extra.flowSteps.length,
              })}
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {flow.t}
            </p>
            <p className="text-slate-700 dark:text-slate-300">{flow.d}</p>
            {flowIndex < extra.flowSteps.length - 1 && (
              <button
                type="button"
                onClick={() => setFlowIndex(flowIndex + 1)}
                className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-bold text-white"
              >
                {copy.next2}
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {copy.cards.map((c) => (
              <article
                key={c.t}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <h4 className="font-bold text-slate-900 dark:text-slate-100">
                  {c.t}
                </h4>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {c.d}
                </p>
              </article>
            ))}
          </div>
          <OvaNav onNext={() => setStage(STAGE.SIM)} next={copy.next} />
        </div>
      )}

      {stage === STAGE.SIM && (
        <div className="space-y-4 rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5 dark:border-cyan-900 dark:bg-slate-900">
          <h3 className="font-bold text-slate-900 dark:text-white">
            {copy.simTitle}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {copy.simHint}
          </p>
          <div className="flex flex-wrap gap-2">
            {copy.parts.map((p) => (
              <button
                key={p.key}
                type="button"
                aria-pressed={enabled[p.key]}
                onClick={() => toggle(p.key)}
                className={`rounded-full border-2 px-3 py-1 text-sm font-bold transition ${enabled[p.key] ? "border-cyan-600 bg-cyan-600 text-white" : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="rounded-xl bg-white p-3 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {copy.built}
            </p>
            <p className="mt-1">{built}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {copy.assumeTitle}
            </p>
            {missing.length === 0 ? (
              <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                {copy.noAssume}
              </p>
            ) : (
              <ul className="mt-1 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                {missing.map((p) => (
                  <li key={p.key}>
                    <span className="font-semibold">{p.label}: </span>
                    {p.assume}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {copy.qualityTitle}: {copy.quality[qualityLevel]}
            </p>
            <div
              className="mt-2 flex gap-1"
              role="meter"
              aria-valuemin={0}
              aria-valuemax={3}
              aria-valuenow={qualityLevel}
            >
              {copy.quality.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 flex-1 rounded-full ${i <= qualityLevel ? "bg-cyan-600" : "bg-slate-200 dark:bg-slate-700"}`}
                />
              ))}
            </div>
            <p
              className={`mt-2 text-sm font-bold ${missing.length === 0 ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}
            >
              {missing.length === 0
                ? copy.ready
                : fill(copy.notReady, { n: missing.length })}
            </p>
          </div>
          <div className="space-y-2 rounded-xl bg-white p-4 text-sm dark:bg-slate-800">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {extra.outputsTitle}
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              {extra.outputs[qualityLevel]}
            </p>
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-bold text-slate-900 dark:text-slate-100">
              {extra.diagTitle}
            </p>
            <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {extra.diagWeak}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {extra.diagHint}
            </p>
            <div className="flex flex-wrap gap-2">
              {copy.parts.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  aria-pressed={!!diag[p.key]}
                  onClick={() =>
                    setDiag((prev) => ({ ...prev, [p.key]: !prev[p.key] }))
                  }
                  className={`rounded-full border-2 px-3 py-1 text-sm font-bold transition ${diag[p.key] ? "border-rose-500 bg-rose-500 text-white" : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setDiagDone(true)}
              className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-bold text-white"
            >
              {extra.diagCheck}
            </button>
            {diagDone && (
              <p
                className={`text-sm font-semibold ${diagOk ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}
              >
                {diagOk ? extra.diagOk : extra.diagBad}
              </p>
            )}
          </div>
          <OvaNav
            onBack={() => setStage(STAGE.FLOW)}
            onNext={() => setStage(STAGE.ITER)}
            back={copy.back}
            next={copy.next}
          />
        </div>
      )}

      {stage === STAGE.ITER && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white">
            {copy.iterTitle}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {copy.iterHint}
          </p>
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              v{iterIndex + 1} / {extra.iterations.length}
            </p>
            <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100">
              {iteration.text}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold">{copy.why}: </span>
              {iteration.note}
            </p>
            <p className="rounded-xl bg-cyan-50 p-3 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-200">
              <span className="font-semibold">{copy.resultLabel}: </span>
              {iteration.result}
            </p>
            {iterIndex < extra.iterations.length - 1 && (
              <button
                type="button"
                onClick={() => setIterIndex(iterIndex + 1)}
                className="w-full rounded-xl bg-cyan-600 py-2 text-sm font-bold text-white"
              >
                {copy.nextVersion}
              </button>
            )}
          </div>
          <OvaNav
            onBack={() => setStage(STAGE.SIM)}
            onNext={() => setStage(STAGE.QUIZ)}
            back={copy.back}
            next={copy.next}
            disabled={iterIndex < extra.iterations.length - 1}
          />
        </div>
      )}

      {stage === STAGE.QUIZ && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white">
            {copy.quizTitle}
          </h3>
          <ScenarioQuiz
            scenarios={scenarios}
            labels={quizLabels}
            passMin={PASS_QUIZ}
            onResult={setQuiz}
          />
          <ComparePractice
            data={extra.compare}
            weakLabel={copy.weak}
            value={compare}
            onChange={setCompare}
          />
          <OvaNav
            onBack={() => setStage(STAGE.ITER)}
            onNext={() => setStage(STAGE.BUILD)}
            back={copy.back}
            next={copy.next}
            disabled={!quizPassed}
          />
        </div>
      )}
      {stage === STAGE.BUILD && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white">
            {copy.builderTitle}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {copy.builderHint}
          </p>
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            {copy.fields.map((f) => (
              <label key={f.key} className="block">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {f.label}
                </span>
                <input
                  type="text"
                  value={fields[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) =>
                    setFields((prev) => ({ ...prev, [f.key]: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </label>
            ))}
          </div>
          <div className="space-y-3 rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5 dark:border-cyan-900 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {copy.output}
            </p>
            <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-100">
              {requestText}
            </pre>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={copyRequest}
                className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-bold text-white"
              >
                {copied ? copy.copied : copy.copy}
              </button>
              <p
                className={`text-sm font-semibold ${builderReady ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}
              >
                {builderReady ? copy.builderReady : copy.builderNotReady}
              </p>
            </div>
          </div>
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {copy.checkTitle}
            </p>
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
              {copy.checks.map((c, i) => (
                <li key={c}>
                  {i === 0 ? (builderReady ? "✓ " : "○ ") : "○ "}
                  {c}
                </li>
              ))}
            </ul>
          </div>
          {passed && (
            <p className="rounded-xl bg-emerald-50 p-3 text-center font-bold text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
              {copy.done}
            </p>
          )}
          {passed && (
            <p className="rounded-xl bg-cyan-50 p-3 text-center text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-100">
              {correct === scenarios.length
                ? copy.levels.expert
                : copy.levels.competent}
            </p>
          )}
          <OvaNav onBack={() => setStage(STAGE.QUIZ)} back={copy.back} />
        </div>
      )}
    </section>
  );
}

OVAClaudeFirstRequest.propTypes = {
  onComplete: PropTypes.func,
  onClose: PropTypes.func,
};
