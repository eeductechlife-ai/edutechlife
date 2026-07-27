import { useState, useCallback } from "react";
import { useTranslation } from "../../i18n/I18nProvider";
import SectionErrorBoundary from "./SectionErrorBoundary";

const PROMPT_PRESETS = [
  {
    label: "Summarize a text",
    prompt: "Summarize the following text in 3 bullet points:\n\n",
  },
  { label: "Write an email", prompt: "Write a professional email about:\n\n" },
  { label: "Brainstorm ideas", prompt: "Generate 5 creative ideas for:\n\n" },
  { label: "Explain concept", prompt: "Explain this concept simply:\n\n" },
];

export default function IALabSandbox() {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [preset, setPreset] = useState("");

  const handlePreset = useCallback((p) => {
    setPreset(p.label);
    setPrompt(p.prompt);
    setResponse("");
  }, []);

  const handleClear = useCallback(() => {
    setPrompt("");
    setResponse("");
    setPreset("");
  }, []);

  return (
    <SectionErrorBoundary name="IALabSandbox">
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-petroleum mb-2">
          Practice Sandbox
        </h2>
        <p className="text-slate-600 mb-6">
          Experiment with prompts. No evaluations, no scoring.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {PROMPT_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => handlePreset(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                preset === p.label
                  ? "bg-petroleum text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write your prompt here..."
          rows={6}
          className="w-full rounded-xl border border-slate-200 p-4 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-petroleum/30 focus:border-petroleum"
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleClear}
            className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Clear
          </button>
        </div>

        {response && (
          <div className="mt-8 rounded-xl bg-slate-50 border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
              Response
            </h3>
            <p className="text-slate-700 whitespace-pre-wrap">{response}</p>
          </div>
        )}

        <div className="mt-8 rounded-xl bg-corporate/5 border border-corporate/20 p-4">
          <h3 className="text-sm font-bold text-corporate mb-2">
            Tips for better prompts
          </h3>
          <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
            <li>Be specific about what you want</li>
            <li>Provide context and examples</li>
            <li>Specify the output format</li>
            <li>Break complex requests into steps</li>
          </ul>
        </div>
      </div>
    </SectionErrorBoundary>
  );
}
