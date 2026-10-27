import PropTypes from "prop-types";
import { useTranslation } from "../../../../i18n/I18nProvider";
import {
  getBriefElements,
  normalizeClaudeLocale,
} from "../../../../data/ova/claudeModule";
import {
  BRIEF_REVIEW_COUNT,
  encodeBriefEvidence,
  parseBriefEvidence,
} from "../../../../data/ova/claudeBriefEvidence";

const COPY = {
  es: {
    title: "Paso 2: Escribe el pedido y revisa el resultado",
    desc: "Escribe el pedido completo para la situación. Luego pega el resultado que te dio Claude y revísalo.",
    scenario: "Situación",
    checklist: "Tu pedido debe cubrir",
    placeholder: "Escribe el pedido para Claude…",
    resultTitle: "Pega aquí el resultado que te dio Claude",
    resultPlaceholder: "Pega el texto completo que generó Claude…",
    reviewTitle: "Revisa el resultado antes de usarlo",
    reviewItems: [
      "Comprobé cada cifra o dato con su fuente.",
      "El tono y la audiencia son los que quería.",
      "El resultado no inventa datos: si faltó algo, Claude lo dejó entre corchetes o preguntó.",
    ],
  },
  en: {
    title: "Step 2: Write the request and review the result",
    desc: "Write the full request for the situation. Then paste the result Claude gave you and review it.",
    scenario: "Situation",
    checklist: "Your request must cover",
    placeholder: "Write the request for Claude…",
    resultTitle: "Paste the result Claude gave you here",
    resultPlaceholder: "Paste the full text Claude generated…",
    reviewTitle: "Review the result before using it",
    reviewItems: [
      "I checked every figure or fact against its source.",
      "The tone and audience are the ones I wanted.",
      "The result does not invent data: if something was missing, Claude left a gap or asked.",
    ],
  },
  pt: {
    title: "Passo 2: Escreva o pedido e revise o resultado",
    desc: "Escreva o pedido completo para a situação. Depois cole o resultado que o Claude te deu e revise.",
    scenario: "Situação",
    checklist: "Seu pedido deve cobrir",
    placeholder: "Escreva o pedido para o Claude…",
    resultTitle: "Cole aqui o resultado que o Claude te deu",
    resultPlaceholder: "Cole o texto completo que o Claude gerou…",
    reviewTitle: "Revise o resultado antes de usar",
    reviewItems: [
      "Conferi cada número ou dado com a fonte.",
      "O tom e o público são os que eu queria.",
      "O resultado não inventa dados: se faltou algo, o Claude deixou uma lacuna ou perguntou.",
    ],
  },
};

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100";

// Paso 2: pedido (exercise = casoBrief), resultado real de Claude y revisión marcada.
// La respuesta se guarda como JSON; ver claudeBriefEvidence.js.
export default function ClaudeStep2({ exercise, response, onResponseChange }) {
  const { locale } = useTranslation();
  const lang = normalizeClaudeLocale(locale);
  const copy = COPY[lang];
  const scenario =
    typeof exercise === "string" ? exercise : exercise?.casoBrief || "";
  const elements = getBriefElements(lang);
  const evidence = parseBriefEvidence(response);

  const update = (patch) =>
    onResponseChange(encodeBriefEvidence({ ...evidence, ...patch }));
  const toggleReview = (i) =>
    update({ revision: evidence.revision.map((v, j) => (j === i ? !v : v)) });

  return (
    <section className="space-y-4">
      <header>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {copy.title}
        </h3>
        <p className="mt-1 text-slate-600 dark:text-slate-300">{copy.desc}</p>
      </header>

      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {copy.scenario}
        </p>
        <p className="mt-1 text-slate-900 dark:text-slate-100">{scenario}</p>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {copy.checklist}:
        </p>
        <ul className="mt-1 flex flex-wrap gap-2">
          {elements.map((e) => (
            <li
              key={e.key}
              className="rounded-full border border-cyan-600 px-3 py-1 text-sm text-cyan-800 dark:text-cyan-200"
            >
              {e.label}
            </li>
          ))}
        </ul>
      </div>

      <textarea
        rows={6}
        value={evidence.pedido}
        onChange={(ev) => update({ pedido: ev.target.value })}
        placeholder={copy.placeholder}
        className={inputCls}
      />

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {copy.resultTitle}
        </p>
        <textarea
          rows={8}
          value={evidence.resultado}
          onChange={(ev) => update({ resultado: ev.target.value })}
          placeholder={copy.resultPlaceholder}
          className={inputCls}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {copy.reviewTitle}
        </p>
        <ul className="space-y-2">
          {copy.reviewItems.slice(0, BRIEF_REVIEW_COUNT).map((text, i) => (
            <li key={text}>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-800 dark:text-slate-100">
                <input
                  type="checkbox"
                  checked={evidence.revision[i]}
                  onChange={() => toggleReview(i)}
                  className="mt-1 h-4 w-4 accent-cyan-600"
                />
                <span>{text}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

ClaudeStep2.propTypes = {
  exercise: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  response: PropTypes.string,
  onResponseChange: PropTypes.func.isRequired,
};
