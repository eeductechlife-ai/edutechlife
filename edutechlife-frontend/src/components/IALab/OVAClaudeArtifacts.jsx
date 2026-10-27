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
import { ARTIFACTS_DATA } from "./ova/claudeArtifactsData";
import { ARTIFACTS_EXTRA } from "./ova/claudeArtifactsExtra";
import { ARTIFACTS_SCENARIOS } from "./ova/claudeArtifactsScenarios";

// Taller de Artifacts (Módulo 5): qué es un Artifact, armar el pedido, mejorar por cambios,
// quiz (3 de 4) y revisión antes de compartir. Completa con pedido, quiz y revisión.
const MIN_WORDS = 3;
const PASS_QUIZ = 3;
const OVA_ID = "claude-artifacts-ova-1";
const STAGE = { WHAT: 0, BRIEF: 1, CHANGES: 2, QUIZ: 3, REVIEW: 4 };
const wordCount = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const fill = (text, values) =>
  Object.entries(values).reduce((t, [k, v]) => t.replace(`{${k}}`, v), text);

export default function OVAClaudeArtifacts({ onComplete }) {
  const { locale } = useTranslation();
  const lang = ARTIFACTS_DATA[locale] ? locale : "es";
  const copy = ARTIFACTS_DATA[lang];
  const concepts = CONCEPTS["artifacts"][lang];
  const extra = ARTIFACTS_EXTRA[lang];
  const scenarios = ARTIFACTS_SCENARIOS[lang];
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
  const [verify, setVerify] = usePersistedOvaState(OVA_ID, "verify", () =>
    extra.verifyItems.map(() => false),
  );
  const [verifyDone, setVerifyDone] = usePersistedOvaState(
    OVA_ID,
    "verifyDone",
    false,
  );
  const verifyOk = extra.verifyItems.every((it, i) => verify[i] === it.check);
  const [stage, setStage] = usePersistedOvaState(OVA_ID, "stage", STAGE.WHAT);
  const [typeKey, setTypeKey] = usePersistedOvaState(OVA_ID, "typeKey", null);
  const [values, setValues] = usePersistedOvaState(OVA_ID, "values", {});
  const [applied, setApplied] = usePersistedOvaState(OVA_ID, "applied", []);
  const [checked, setChecked] = usePersistedOvaState(OVA_ID, "checked", () =>
    copy.checks.map(() => false),
  );
  const [copied, setCopied] = useState(false);
  const completedRef = useRef(false);

  const type = extra.types.find((t) => t.key === typeKey);
  const filledCount = copy.parts.filter(
    (p) => wordCount(values[p.key] || "") >= MIN_WORDS,
  ).length;
  const complete = filledCount === copy.parts.length;
  const allChecked = checked.every(Boolean);
  const [compare, setCompare] = usePersistedOvaState(OVA_ID, "compare", null);
  const passed =
    complete && quizPassed && allChecked && verifyOk && compare === "B";

  useEffect(() => {
    if (passed && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [passed, onComplete]);

  const preview = copy.parts
    .filter((p) => (values[p.key] || "").trim())
    .map((p) => `${p.label}: ${values[p.key].trim()}`)
    .join("\n");
  const lastChange = applied.length
    ? extra.changes[applied[applied.length - 1]]
    : null;
  const toggleCheck = (i) =>
    setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)));
  const fillExample = () =>
    setValues(Object.fromEntries(copy.parts.map((p) => [p.key, p.sample])));
  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(preview);
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

      {stage === STAGE.WHAT && (
        <div className="space-y-4">
          <ConceptCards title={concepts.title} items={concepts.items} />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {copy.typeHint}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {extra.types.map((t) => (
              <button
                key={t.key}
                type="button"
                aria-pressed={typeKey === t.key}
                onClick={() => setTypeKey(t.key)}
                className={`rounded-2xl border-2 p-4 text-left transition ${typeKey === t.key ? "border-cyan-600 bg-cyan-50 dark:bg-slate-800" : "border-slate-200 bg-white hover:border-cyan-400 dark:border-slate-700 dark:bg-slate-900"}`}
              >
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {t.name}
                </span>
                <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">
                  {t.use}
                </span>
              </button>
            ))}
          </div>
          {type && (
            <div className="space-y-3 rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5 dark:border-cyan-900 dark:bg-slate-900">
              <p className="text-sm">
                <span className="font-semibold">{copy.typeLabels.use}: </span>
                {type.use}
              </p>
              <div className="rounded-xl bg-white p-3 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {copy.typeLabels.example}
                </p>
                <p className="mt-1">{type.example}</p>
              </div>
              <p className="text-sm">
                <span className="font-semibold">{copy.typeLabels.gets}: </span>
                {type.gets}
              </p>
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            {copy.cards.map((c) => (
              <article
                key={c.t}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <h3 className="font-bold text-slate-900 dark:text-slate-100">
                  {c.t}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {c.d}
                </p>
              </article>
            ))}
          </div>
          <OvaNav onNext={() => setStage(STAGE.BRIEF)} next={copy.next} />
        </div>
      )}

      {stage === STAGE.BRIEF && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white">
            {copy.briefTitle}
          </h3>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {copy.briefHint}
            </p>
            <button
              type="button"
              onClick={fillExample}
              className="rounded-xl border-2 border-cyan-600 px-3 py-1 text-sm font-bold text-cyan-700 dark:text-cyan-300"
            >
              {copy.example}
            </button>
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            {copy.parts.map((p) => (
              <label key={p.key} className="block">
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {p.label}
                </span>
                <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                  {p.hint}
                </span>
                <textarea
                  rows={2}
                  value={values[p.key] || ""}
                  placeholder={p.placeholder}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [p.key]: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2 text-sm text-slate-900 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </label>
            ))}
          </div>
          <div className="space-y-3 rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5 dark:border-cyan-900 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {copy.preview}
            </p>
            <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-100">
              {preview || "—"}
            </pre>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {copy.qualityLabel}:{" "}
                {
                  copy.quality[
                    filledCount <= 1
                      ? 0
                      : filledCount === 2
                        ? 1
                        : filledCount < 5
                          ? 2
                          : 3
                  ]
                }
              </p>
              <div
                className="mt-2 flex gap-1"
                role="meter"
                aria-valuemin={0}
                aria-valuemax={5}
                aria-valuenow={filledCount}
              >
                {copy.parts.map((p, i) => (
                  <span
                    key={p.key}
                    className={`h-2 flex-1 rounded-full ${i < filledCount ? "bg-cyan-600" : "bg-slate-200 dark:bg-slate-700"}`}
                  />
                ))}
              </div>
              {!complete && (
                <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                  {copy.missing}:{" "}
                  {copy.parts
                    .filter((p) => wordCount(values[p.key] || "") < MIN_WORDS)
                    .map((p) => p.label)
                    .join(", ")}
                </p>
              )}
            </div>
          </div>
          <OvaNav
            onBack={() => setStage(STAGE.WHAT)}
            onNext={() => setStage(STAGE.CHANGES)}
            back={copy.back}
            next={copy.next}
          />
        </div>
      )}

      {stage === STAGE.CHANGES && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white">
            {extra.changesTitle}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {extra.changesHint}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {copy.beforeLabel}
              </p>
              <pre className="mt-1 whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-100">
                {applied.length > 1
                  ? extra.changes[applied[applied.length - 2]].after
                  : copy.draft}
              </pre>
            </div>
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-4 dark:border-cyan-900 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {copy.afterLabel}
              </p>
              <pre className="mt-1 whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-100">
                {lastChange ? lastChange.after : copy.draft}
              </pre>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {extra.changes.map((c, i) => (
              <button
                key={c.label}
                type="button"
                aria-pressed={applied.includes(i)}
                disabled={i !== applied.length}
                onClick={() => setApplied([...applied, i])}
                className={`rounded-full border-2 px-3 py-1 text-sm font-bold ${applied[applied.length - 1] === i ? "border-cyan-600 bg-cyan-600 text-white" : "border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
          {lastChange && (
            <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <span className="font-semibold">{copy.why}: </span>
              {lastChange.lesson}
            </p>
          )}
          {applied.length > 0 && (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold">{copy.historyLabel}: </span>
              {applied.map((i) => extra.changes[i].label).join(" → ")}
            </p>
          )}
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-slate-900">
            <span className="font-bold text-amber-800 dark:text-amber-300">
              {copy.ruleTitle}:{" "}
            </span>
            <span className="text-slate-800 dark:text-slate-200">
              {copy.rule}
            </span>
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-bold text-slate-900 dark:text-slate-100">
              {extra.verifyTitle}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {extra.verifyHint}
            </p>
            <ul className="space-y-2">
              {extra.verifyItems.map((it, i) => (
                <li key={it.t}>
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-800 dark:text-slate-100">
                    <input
                      type="checkbox"
                      checked={verify[i]}
                      onChange={() =>
                        setVerify((prev) =>
                          prev.map((v, j) => (j === i ? !v : v)),
                        )
                      }
                      className="mt-1 h-4 w-4 accent-cyan-600"
                    />
                    <span>{it.t}</span>
                  </label>
                  {verifyDone && (
                    <p className="ml-7 mt-1 text-xs text-slate-600 dark:text-slate-400">
                      {it.why}
                    </p>
                  )}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setVerifyDone(true)}
              className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-bold text-white"
            >
              {extra.verifyCheck}
            </button>
            {verifyDone && (
              <p
                className={`text-sm font-semibold ${verifyOk ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}
              >
                {verifyOk ? extra.verifyOk : extra.verifyBad}
              </p>
            )}
          </div>
          <OvaNav
            onBack={() => setStage(STAGE.BRIEF)}
            onNext={() => setStage(STAGE.QUIZ)}
            back={copy.back}
            next={copy.next}
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
            weakLabel={extra.compare.weakLabel}
            value={compare}
            onChange={setCompare}
          />
          <OvaNav
            onBack={() => setStage(STAGE.CHANGES)}
            onNext={() => setStage(STAGE.REVIEW)}
            back={copy.back}
            next={copy.next}
            disabled={!quizPassed}
          />
        </div>
      )}
      {stage === STAGE.REVIEW && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white">
            {copy.reviewTitle}
          </h3>
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-bold text-slate-900 dark:text-slate-100">
              {copy.exportTitle}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {copy.exportText}
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              {copy.shareRules.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {copy.reviewHint}
          </p>
          <ul className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            {copy.checks.map((c, i) => (
              <li key={c}>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-800 dark:text-slate-100">
                  <input
                    type="checkbox"
                    checked={checked[i]}
                    onChange={() => toggleCheck(i)}
                    className="mt-1 h-4 w-4 accent-cyan-600"
                  />
                  <span>{c}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="space-y-3 rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5 dark:border-cyan-900 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {copy.output}
            </p>
            <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-100">
              {preview || "—"}
            </pre>
            <button
              type="button"
              onClick={copyBrief}
              className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-bold text-white"
            >
              {copied ? copy.copied : copy.copy}
            </button>
          </div>
          {passed ? (
            <p className="rounded-xl bg-emerald-50 p-3 text-center font-bold text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
              {copy.done}{" "}
              {correct === scenarios.length
                ? copy.levels.expert
                : copy.levels.competent}
            </p>
          ) : (
            <p className="text-center text-sm text-amber-700 dark:text-amber-400">
              {copy.notComplete}
            </p>
          )}
          <OvaNav onBack={() => setStage(STAGE.QUIZ)} back={copy.back} />
        </div>
      )}
    </section>
  );
}

OVAClaudeArtifacts.propTypes = {
  onComplete: PropTypes.func,
};
