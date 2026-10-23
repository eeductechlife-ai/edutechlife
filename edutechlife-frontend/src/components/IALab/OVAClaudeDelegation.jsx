import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../i18n/I18nProvider";
import { getClaudeTasks, normalizeClaudeLocale } from "../../data/ova/claudeModule";
import DelegationBoard from "./claude/DelegationBoard";

const COPY = {
  es: {
    title: "El Tablero de Delegación",
    intro: "Clasifica cada tarea: ¿la delegas, la delegas con revisión o no la delegas? Recibirás la razón de cada decisión.",
    done: "Completaste el tablero",
    score: "Acertaste {n} de {total}.",
    rule: "Regla de oro: delega el trabajo de forma y el borrador; nunca delegues la decisión ni la firma.",
  },
  en: {
    title: "The Delegation Board",
    intro: "Sort each task: do you delegate it, delegate it with review, or never delegate it? You will get the reason for each decision.",
    done: "You completed the board",
    score: "You got {n} of {total} right.",
    rule: "Golden rule: delegate form and drafts; never delegate the decision or the signature.",
  },
  pt: {
    title: "O Quadro de Delegação",
    intro: "Classifique cada tarefa: você delega, delega com revisão ou não delega? Você receberá o motivo de cada decisão.",
    done: "Você concluiu o quadro",
    score: "Você acertou {n} de {total}.",
    rule: "Regra de ouro: delegue a forma e os rascunhos; nunca delegue a decisão nem a assinatura.",
  },
};

export default function OVAClaudeDelegation({ onComplete }) {
  const { locale } = useTranslation();
  const lang = normalizeClaudeLocale(locale);
  const copy = COPY[lang];
  const tasks = getClaudeTasks(lang);
  const [answers, setAnswers] = useState({});
  const completedRef = useRef(false);

  const allAnswered = Object.keys(answers).length === tasks.length;
  const correct = tasks.filter((t) => answers[t.id] === t.answer).length;

  useEffect(() => {
    if (allAnswered && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [allAnswered, onComplete]);

  const handleChange = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }));

  return (
    <section className="mx-auto max-w-3xl space-y-6 p-6">
      <header>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{copy.title}</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{copy.intro}</p>
      </header>

      <DelegationBoard
        locale={lang}
        answers={answers}
        onChange={handleChange}
        showFeedback
        disabled={allAnswered}
      />

      {allAnswered && (
        <div className="rounded-2xl bg-cyan-50 p-5 dark:bg-slate-800">
          <p className="font-bold text-slate-900 dark:text-white">{copy.done}</p>
          <p className="mt-1 text-slate-700 dark:text-slate-200">
            {copy.score.replace("{n}", String(correct)).replace("{total}", String(tasks.length))}
          </p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{copy.rule}</p>
        </div>
      )}
    </section>
  );
}

OVAClaudeDelegation.propTypes = {
  onComplete: PropTypes.func,
};
