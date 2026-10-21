import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../i18n/I18nProvider";
import { getBriefElements, normalizeClaudeLocale } from "../../data/ova/claudeModule";

const COPY = {
  es: {
    title: "El Taller de Artifacts",
    intro: "Arma el pedido para Claude completando cada parte. Un buen pedido produce un buen Artifact a la primera.",
    preview: "Así quedaría tu pedido",
    missing: "Te falta completar",
    done: "Pedido completo. Ahora pídeselo a Claude y revisa el resultado antes de compartirlo.",
    placeholder: "Escribe aquí…",
  },
  en: {
    title: "The Artifacts Workshop",
    intro: "Build your request for Claude by completing each part. A good request produces a good Artifact on the first try.",
    preview: "This is how your request reads",
    missing: "Still missing",
    done: "Complete request. Now ask Claude and review the result before sharing it.",
    placeholder: "Type here…",
  },
  pt: {
    title: "A Oficina de Artifacts",
    intro: "Monte o pedido para o Claude completando cada parte. Um bom pedido gera um bom Artifact de primeira.",
    preview: "Assim ficaria o seu pedido",
    missing: "Falta completar",
    done: "Pedido completo. Agora peça ao Claude e revise o resultado antes de compartilhar.",
    placeholder: "Escreva aqui…",
  },
};

export default function OVAClaudeArtifacts({ onComplete }) {
  const { locale } = useTranslation();
  const lang = normalizeClaudeLocale(locale);
  const copy = COPY[lang];
  const elements = getBriefElements(lang);
  const [values, setValues] = useState({});
  const completedRef = useRef(false);

  const filled = elements.filter((e) => (values[e.key] || "").trim().length >= 3);
  const complete = filled.length === elements.length;

  useEffect(() => {
    if (complete && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [complete, onComplete]);

  const preview = elements
    .map((e) => (values[e.key] || "").trim() && `${e.label}: ${values[e.key].trim()}`)
    .filter(Boolean)
    .join("\n");

  return (
    <section className="mx-auto max-w-3xl space-y-6 p-6">
      <header>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{copy.title}</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{copy.intro}</p>
      </header>

      <div className="space-y-4">
        {elements.map((e) => (
          <label key={e.key} className="block">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{e.label}</span>
            <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">{e.hint}</span>
            <textarea
              rows={2}
              value={values[e.key] || ""}
              onChange={(ev) => setValues((prev) => ({ ...prev, [e.key]: ev.target.value }))}
              placeholder={copy.placeholder}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
        <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{copy.preview}</p>
        <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-100">{preview || "—"}</pre>
        {!complete && (
          <p className="mt-3 text-sm text-amber-700 dark:text-amber-300">
            {copy.missing}: {elements.filter((e) => !filled.includes(e)).map((e) => e.label).join(", ")}
          </p>
        )}
        {complete && <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-300">{copy.done}</p>}
      </div>
    </section>
  );
}

OVAClaudeArtifacts.propTypes = {
  onComplete: PropTypes.func,
};
