import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { usePersistedOvaState } from "../../hooks/IALab/usePersistedOvaState";
import ConceptCards from "./ova/ConceptCards";
import OvaHeader from "./ova/OvaHeader";
import { CONCEPTS } from "./ova/claudeConcepts";
import OvaNav from "./ova/OvaNav";
import { useTranslation } from "../../i18n/I18nProvider";
import { DELEGATION_DATA } from "./ova/claudeDelegationData";
import { PROJECT_BUILDER } from "./ova/claudeProjectBuilderData";
import ProjectBuilder from "./ova/ProjectBuilder";

// Tablero de delegación (Módulo 5): reglas con ejemplos, clasificación con razón,
// tu propia tarea con tres preguntas guiadas y resumen. Completa al clasificar todas
// las tareas y obtener una recomendación para tu propia tarea.
const OVA_ID = "claude-delegation-ova-1";
const STAGE = { RULES: 0, BOARD: 1, OWN: 2, BUILD: 3, SUMMARY: 4 };
const CATEGORY_ORDER = ["delegate", "review", "never"];

// Recomendación según las tres preguntas: decide tú, sale a terceros, afecta a personas o legal.
const recommend = ([people, legal, external]) => {
  if (people || legal) return "never";
  if (external) return "review";
  return "delegate";
};

export default function OVADelegation({ onComplete }) {
  const { locale } = useTranslation();
  const lang = DELEGATION_DATA[locale] ? locale : "es";
  const copy = DELEGATION_DATA[lang];
  const concepts = CONCEPTS["delegation"][lang];
  const [stage, setStage] = usePersistedOvaState(OVA_ID, "stage", STAGE.RULES);
  const [answers, setAnswers] = usePersistedOvaState(OVA_ID, "answers", {});
  const [showHint, setShowHint] = useState({});
  const [own, setOwn] = usePersistedOvaState(OVA_ID, "own", "");
  const [ownAnswers, setOwnAnswers] = usePersistedOvaState(
    OVA_ID,
    "ownAnswers",
    [null, null, null],
  );
  const completedRef = useRef(false);

  const tasks = copy.tasks;
  const boardDone = tasks.every((t) => answers[t.id]);
  const correct = tasks.filter((t) => answers[t.id] === t.answer).length;
  const ownReady =
    ownAnswers.every((a) => a !== null) &&
    own.trim().split(/\s+/).filter(Boolean).length >= 3;
  const ownResult = ownReady ? recommend(ownAnswers) : null;
  const [buildReady, setBuildReady] = usePersistedOvaState(
    OVA_ID,
    "buildReady",
    false,
  );
  const passed = correct >= 6 && ownReady && buildReady;

  useEffect(() => {
    if (passed && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [passed, onComplete]);

  const resetBoard = () => {
    setAnswers({});
    setShowHint({});
  };
  const setOwnAnswer = (i, value) =>
    setOwnAnswers((prev) => prev.map((v, j) => (j === i ? value : v)));

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

      {stage === STAGE.RULES && (
        <div className="space-y-4">
          <ConceptCards title={concepts.title} items={concepts.items} />
          <h3 className="font-bold text-slate-900 dark:text-white">
            {copy.rulesTitle}
          </h3>
          <div className="grid gap-3">
            {copy.rules.map((r) => (
              <article
                key={r.key}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <h4
                  className={`font-extrabold ${r.key === "never" ? "text-rose-700 dark:text-rose-400" : r.key === "review" ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"}`}
                >
                  {r.label}
                </h4>
                <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                  {r.criteria}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {r.examples}
                </p>
              </article>
            ))}
          </div>
          <div className="space-y-2 rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5 dark:border-cyan-900 dark:bg-slate-900">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {copy.questionsTitle}
            </p>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-800 dark:text-slate-200">
              {copy.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
          </div>
          <OvaNav onNext={() => setStage(STAGE.BOARD)} next={copy.next} />
        </div>
      )}

      {stage === STAGE.BOARD && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white">
            {copy.boardTitle}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {copy.boardHint}
          </p>
          {tasks.map((t) => {
            const current = answers[t.id];
            const isCorrect = current === t.answer;
            return (
              <div
                key={t.id}
                className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {t.task}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setShowHint((prev) => ({ ...prev, [t.id]: !prev[t.id] }))
                    }
                    className="text-xs font-bold text-cyan-700 underline dark:text-cyan-300"
                  >
                    {copy.taskHint}
                  </button>
                </div>
                {showHint[t.id] && (
                  <p className="rounded-xl bg-slate-50 p-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <span className="font-semibold">{copy.hintLabel}: </span>
                    {copy.questions.join(" · ")}
                  </p>
                )}
                <div
                  role="group"
                  aria-label={t.task}
                  className="flex flex-wrap gap-2"
                >
                  {CATEGORY_ORDER.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      aria-pressed={current === cat}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [t.id]: cat }))
                      }
                      className={`rounded-full border-2 px-3 py-1 text-sm font-semibold transition ${current === cat ? "border-cyan-600 bg-cyan-600 text-white" : "border-slate-300 text-slate-700 hover:border-cyan-600 dark:border-slate-600 dark:text-slate-200"}`}
                    >
                      {copy.categories[cat]}
                    </button>
                  ))}
                </div>
                {current && (
                  <p
                    className={`text-sm ${isCorrect ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}
                  >
                    <span className="font-bold">
                      {isCorrect
                        ? `✔ ${copy.correctLabel}. `
                        : `✖ ${copy.wrongLabel}. `}
                    </span>
                    {t.why}
                  </p>
                )}
              </div>
            );
          })}
          <div className="flex flex-wrap items-center gap-3">
            <OvaNav
              onBack={() => setStage(STAGE.RULES)}
              onNext={() => setStage(STAGE.OWN)}
              back={copy.back}
              next={copy.next}
              disabled={!boardDone}
            />
            {Object.keys(answers).length > 0 && (
              <button
                type="button"
                onClick={resetBoard}
                className="text-sm font-bold text-slate-600 underline dark:text-slate-300"
              >
                {copy.retry}
              </button>
            )}
          </div>
        </div>
      )}

      {stage === STAGE.OWN && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white">
            {copy.ownTitle}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {copy.ownHint}
          </p>
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <input
              type="text"
              value={own}
              onChange={(e) => setOwn(e.target.value)}
              placeholder={copy.ownPlaceholder}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
            {copy.questions.map((q, i) => (
              <div
                key={q}
                className="flex flex-wrap items-center justify-between gap-3"
              >
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {q}
                </span>
                <div className="flex gap-2">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      type="button"
                      aria-pressed={ownAnswers[i] === v}
                      onClick={() => setOwnAnswer(i, v)}
                      className={`rounded-full border-2 px-4 py-1 text-sm font-bold ${ownAnswers[i] === v ? "border-cyan-600 bg-cyan-600 text-white" : "border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200"}`}
                    >
                      {v ? copy.yes : copy.no}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {ownResult && (
              <div className="space-y-2 rounded-xl bg-cyan-50 p-4 dark:bg-slate-800">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {copy.ownResult}: {copy.categories[ownResult]}
                </p>
                {own.trim() && (
                  <p className="text-sm italic text-slate-600 dark:text-slate-300">
                    “{own.trim()}”
                  </p>
                )}
                <p className="text-sm text-slate-800 dark:text-slate-200">
                  {copy.ownExplain[ownResult]}
                </p>
              </div>
            )}
          </div>
          <OvaNav
            onBack={() => setStage(STAGE.BOARD)}
            onNext={() => setStage(STAGE.BUILD)}
            back={copy.back}
            next={copy.next}
            disabled={!ownReady}
          />
        </div>
      )}

      {stage === STAGE.BUILD && (
        <div className="space-y-4">
          <ProjectBuilder
            data={PROJECT_BUILDER[lang]}
            onReady={setBuildReady}
          />
          <OvaNav
            onBack={() => setStage(STAGE.OWN)}
            onNext={() => setStage(STAGE.SUMMARY)}
            back={copy.back}
            next={copy.next}
            disabled={!buildReady}
          />
        </div>
      )}

      {stage === STAGE.SUMMARY && (
        <div className="space-y-4 rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5 dark:border-cyan-900 dark:bg-slate-900">
          <h3 className="font-bold text-slate-900 dark:text-white">
            {copy.summaryTitle}
          </h3>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {copy.score
              .replace("{n}", String(correct))
              .replace("{total}", String(tasks.length))}
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            {correct >= 6 ? copy.summaryGood : copy.summaryMore}
          </p>
          <p className="rounded-xl bg-white p-3 text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-100">
            {copy.goldenRule}
          </p>
          {passed && (
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
              {copy.done}{" "}
              {correct === tasks.length
                ? copy.levels.expert
                : copy.levels.competent}
            </p>
          )}
          <OvaNav onBack={() => setStage(STAGE.BUILD)} back={copy.back} />
        </div>
      )}
    </section>
  );
}

OVADelegation.propTypes = {
  onComplete: PropTypes.func,
};
