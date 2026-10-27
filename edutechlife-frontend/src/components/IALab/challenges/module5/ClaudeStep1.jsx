import { useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../../../i18n/I18nProvider";
import DelegationBoard from "../../claude/DelegationBoard";
import { normalizeClaudeLocale } from "../../../../data/ova/claudeModule";

const COPY = {
  es: {
    title: "Paso 1: Qué delegar",
    desc: "Clasifica cada tarea: delegar, delegar y revisar o no delegar. Usa las tres preguntas del módulo: ¿decide sobre personas o dinero?, ¿compromete legalmente?, ¿sale a terceros o tiene datos personales o cifras para decidir?",
  },
  en: {
    title: "Step 1: What to delegate",
    desc: "Sort each task: delegate, delegate and review, or never delegate. Use the module's three questions: does it decide about people or money?, does it legally commit you?, does it go to third parties or hold personal data or figures for decisions?",
  },
  pt: {
    title: "Passo 1: O que delegar",
    desc: "Classifique cada tarefa: delegar, delegar e revisar ou não delegar. Use as três perguntas do módulo: decide sobre pessoas ou dinheiro?, compromete legalmente?, vai para terceiros ou tem dados pessoais ou números para decidir?",
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
