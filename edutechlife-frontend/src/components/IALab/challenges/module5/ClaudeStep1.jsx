import { useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../../../i18n/I18nProvider";
import DelegationBoard from "../../claude/DelegationBoard";
import { normalizeClaudeLocale } from "../../../../data/ova/claudeModule";

const COPY = {
  es: {
    title: "Paso 1: Qué delegar",
    desc: "Clasifica cada tarea: delegar, delegar con revisión o no delegar. Justifica con el criterio del módulo.",
  },
  en: {
    title: "Step 1: What to delegate",
    desc: "Sort each task: delegate, delegate with review, or never delegate. Use the module's criteria.",
  },
  pt: {
    title: "Passo 1: O que delegar",
    desc: "Classifique cada tarefa: delegar, delegar com revisão ou não delegar. Use o critério do módulo.",
  },
};

// Paso 1 del desafío: el estudiante clasifica las tareas. La respuesta se guarda
// como JSON { answers: { [taskId]: "delegate" | "review" | "never" } }.
export default function ClaudeStep1({ response, onResponseChange }) {
  const { locale } = useTranslation();
  const lang = normalizeClaudeLocale(locale);
  const copy = COPY[lang];

  const answers = useMemo(() => {
    if (!response) return {};
    try {
      return JSON.parse(response).answers || {};
    } catch {
      return {};
    }
  }, [response]);

  const handleChange = (id, value) => {
    onResponseChange(JSON.stringify({ answers: { ...answers, [id]: value } }));
  };

  return (
    <section className="space-y-4">
      <header>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{copy.title}</h3>
        <p className="mt-1 text-slate-600 dark:text-slate-300">{copy.desc}</p>
      </header>
      <DelegationBoard locale={lang} answers={answers} onChange={handleChange} />
    </section>
  );
}

ClaudeStep1.propTypes = {
  response: PropTypes.string,
  onResponseChange: PropTypes.func.isRequired,
};
