import PropTypes from "prop-types";
import { useTranslation } from "../../../../i18n/I18nProvider";
import { getBriefElements, normalizeClaudeLocale } from "../../../../data/ova/claudeModule";

const COPY = {
  es: {
    title: "Paso 2: Escribe el pedido para Claude",
    desc: "Lee la situación y escribe el pedido completo: incluye objetivo, audiencia, formato, tono y restricciones.",
    scenario: "Situación",
    checklist: "Tu pedido debe cubrir",
    placeholder: "Escribe el pedido para Claude…",
  },
  en: {
    title: "Step 2: Write the request for Claude",
    desc: "Read the situation and write the full request: include goal, audience, format, tone and constraints.",
    scenario: "Situation",
    checklist: "Your request must cover",
    placeholder: "Write the request for Claude…",
  },
  pt: {
    title: "Passo 2: Escreva o pedido para o Claude",
    desc: "Leia a situação e escreva o pedido completo: inclua objetivo, público, formato, tom e restrições.",
    scenario: "Situação",
    checklist: "Seu pedido deve cobrir",
    placeholder: "Escreva o pedido para o Claude…",
  },
};

// Paso 2: el estudiante escribe el pedido a partir del caso (exercise = casoBrief).
export default function ClaudeStep2({ exercise, response, onResponseChange }) {
  const { locale } = useTranslation();
  const lang = normalizeClaudeLocale(locale);
  const copy = COPY[lang];
  const scenario = typeof exercise === "string" ? exercise : exercise?.casoBrief || "";
  const elements = getBriefElements(lang);

  return (
    <section className="space-y-4">
      <header>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{copy.title}</h3>
        <p className="mt-1 text-slate-600 dark:text-slate-300">{copy.desc}</p>
      </header>

      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{copy.scenario}</p>
        <p className="mt-1 text-slate-900 dark:text-slate-100">{scenario}</p>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{copy.checklist}:</p>
        <ul className="mt-1 flex flex-wrap gap-2">
          {elements.map((e) => (
            <li key={e.key} className="rounded-full border border-cyan-600 px-3 py-1 text-sm text-cyan-800 dark:text-cyan-200">
              {e.label}
            </li>
          ))}
        </ul>
      </div>

      <textarea
        rows={8}
        value={response || ""}
        onChange={(ev) => onResponseChange(ev.target.value)}
        placeholder={copy.placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
      />
    </section>
  );
}

ClaudeStep2.propTypes = {
  exercise: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  response: PropTypes.string,
  onResponseChange: PropTypes.func.isRequired,
};
