import PropTypes from "prop-types";
import { useTranslation } from "../../../../i18n/I18nProvider";
import { normalizeClaudeLocale } from "../../../../data/ova/claudeModule";

const COPY = {
  es: {
    title: "Paso 3: Protocolo de uso de Claude",
    desc: "Diseña el protocolo que seguiría tu equipo con esta situación. Cubre estos cuatro puntos.",
    scenario: "Situación",
    sections: [
      "Qué datos personales o confidenciales no se comparten",
      "Qué se verifica antes de usar o enviar un resultado",
      "Quién revisa y firma la decisión final",
      "Cómo se declara el uso de IA",
    ],
    placeholder: "Escribe el protocolo…",
  },
  en: {
    title: "Step 3: Claude usage protocol",
    desc: "Design the protocol your team would follow in this situation. Cover these four points.",
    scenario: "Situation",
    sections: [
      "What personal or confidential data is never shared",
      "What is verified before a result is used or sent",
      "Who reviews and signs the final decision",
      "How the use of AI is disclosed",
    ],
    placeholder: "Write the protocol…",
  },
  pt: {
    title: "Passo 3: Protocolo de uso do Claude",
    desc: "Desenhe o protocolo que sua equipe seguiria nesta situação. Cubra estes quatro pontos.",
    scenario: "Situação",
    sections: [
      "Quais dados pessoais ou confidenciais nunca são compartilhados",
      "O que é verificado antes de usar ou enviar um resultado",
      "Quem revisa e assina a decisão final",
      "Como o uso de IA é declarado",
    ],
    placeholder: "Escreva o protocolo…",
  },
};

// Paso 3: protocolo de uso (exercise = casoProtocolo).
export default function ClaudeStep3({ exercise, response, onResponseChange }) {
  const { locale } = useTranslation();
  const lang = normalizeClaudeLocale(locale);
  const copy = COPY[lang];
  const scenario = typeof exercise === "string" ? exercise : exercise?.casoProtocolo || "";

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

      <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
        {copy.sections.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>

      <textarea
        rows={10}
        value={response || ""}
        onChange={(ev) => onResponseChange(ev.target.value)}
        placeholder={copy.placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
      />
    </section>
  );
}

ClaudeStep3.propTypes = {
  exercise: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  response: PropTypes.string,
  onResponseChange: PropTypes.func.isRequired,
};
