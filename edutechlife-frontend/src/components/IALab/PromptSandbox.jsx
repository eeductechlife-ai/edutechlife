/**
 * PromptSandbox — Laboratorio interactivo de Prompt Engineering
 *
 * ADITIVO: Componente autocontenido. Usa `callDeepseek` existente.
 * No modifica lógica de MAX ni otros chats. Ideal para OVA hands-on.
 *
 * Features:
 *   - Editor de prompt con system prompt + user prompt
 *   - Ejecuta contra DeepSeek (backend existente)
 *   - Muestra respuesta en vivo
 *   - Sugerencias de mejora (heurística local)
 *   - Historial de intentos (localStorage)
 *   - Sample prompts para arrancar
 *
 * Uso:
 *   <PromptSandbox
 *     title="Lab 1: Prompt básico"
 *     samplePrompts={[...]}
 *     onComplete={(result) => ...}
 *   />
 *
 * @see src/utils/api.js — callDeepseek
 */
import { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import { callDeepseek } from "../../utils/api";
import { useIALabStore } from "../../store/ialabStore";
import { useTranslation } from "../../i18n/I18nProvider";

const STORAGE_KEY = "ialab_prompt_sandbox_history";

// Heurísticas simples para sugerir mejoras (sin llamada externa)
const analyzePrompt = (systemPrompt, userPrompt, t) => {
  const suggestions = [];
  const full = `${systemPrompt}\n${userPrompt}`;

  if (userPrompt.length < 20) {
    suggestions.push({
      level: "warn",
      text: t("ialab.prompt_sandbox.suggestion_short"),
    });
  }

  if (
    !/(paso|pasos|primero|luego|después|considera|piensa)/i.test(userPrompt)
  ) {
    suggestions.push({
      level: "tip",
      text: t("ialab.prompt_sandbox.suggestion_cot"),
    });
  }

  if (!/(formato|json|lista|tabla|markdown|estructura)/i.test(full)) {
    suggestions.push({
      level: "tip",
      text: t("ialab.prompt_sandbox.suggestion_format"),
    });
  }

  if (!systemPrompt || systemPrompt.length < 10) {
    suggestions.push({
      level: "tip",
      text: t("ialab.prompt_sandbox.suggestion_system"),
    });
  }

  if (/tú eres|actúa como|imagina que eres/i.test(full)) {
    suggestions.push({
      level: "ok",
      text: t("ialab.prompt_sandbox.suggestion_roleplay"),
    });
  }

  if (userPrompt.length > 800) {
    suggestions.push({
      level: "warn",
      text: t("ialab.prompt_sandbox.suggestion_long"),
    });
  }

  return suggestions;
};

const loadHistory = () => {
  try {
    const raw =
      typeof localStorage !== "undefined"
        ? localStorage.getItem(STORAGE_KEY)
        : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveHistory = (history) => {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-10)));
    }
  } catch {
    /* silent */
  }
};

const DEFAULT_SAMPLES = [
  {
    label: "ialab.prompt_sandbox.sample_explain_label",
    system: "ialab.prompt_sandbox.sample_explain_system",
    user: "ialab.prompt_sandbox.sample_explain_user",
  },
  {
    label: "ialab.prompt_sandbox.sample_cot_label",
    system: "ialab.prompt_sandbox.sample_cot_system",
    user: "ialab.prompt_sandbox.sample_cot_user",
  },
  {
    label: "ialab.prompt_sandbox.sample_format_label",
    system: "ialab.prompt_sandbox.sample_format_system",
    user: "ialab.prompt_sandbox.sample_format_user",
  },
];

const PromptSandbox = ({
  title = "ialab.prompt_sandbox.title",
  samplePrompts = DEFAULT_SAMPLES,
  itemId = "prompt-sandbox",
  onComplete,
  className = "",
}) => {
  const { t } = useTranslation();
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(() => loadHistory());
  const [showHistory, setShowHistory] = useState(false);
  const abortRef = useRef(null);

  // Store integrations (aditivas)
  const recordView = useIALabStore((s) => s.recordView);
  const addXp = useIALabStore((s) => s.addXp);

  const suggestions = analyzePrompt(systemPrompt, userPrompt, t);

  const translateText = (value) =>
    typeof value === "string" && value.startsWith("ialab.") ? t(value) : value;

  const applySample = (sample) => {
    setSystemPrompt(translateText(sample.system));
    setUserPrompt(translateText(sample.user));
    setResponse("");
    setError(null);
  };

  const runPrompt = useCallback(async () => {
    if (!userPrompt.trim() || loading) return;
    setLoading(true);
    setResponse("");
    setError(null);
    const startTime = Date.now();

    try {
      const messages = [];
      if (systemPrompt.trim()) {
        messages.push({ role: "system", content: systemPrompt.trim() });
      }
      messages.push({ role: "user", content: userPrompt.trim() });

      const result = await callDeepseek(messages, {
        temperature: 0.7,
        maxTokens: 800,
      });

      const text =
        typeof result === "string"
          ? result
          : result?.content || JSON.stringify(result);
      setResponse(text);

      // Registrar en adaptive slice
      if (recordView) {
        recordView(itemId, {
          type: "lab",
          timeSpent: Date.now() - startTime,
        });
      }

      // Recompensar el intento
      if (addXp) addXp(5);

      // Guardar en historial
      const newEntry = {
        ts: Date.now(),
        system: systemPrompt,
        user: userPrompt,
        response: text.slice(0, 500),
      };
      const newHistory = [...history, newEntry].slice(-10);
      setHistory(newHistory);
      saveHistory(newHistory);

      if (onComplete) onComplete({ prompt: userPrompt, response: text });
    } catch (err) {
      setError(err?.message || t("ialab.prompt_sandbox.error_generate"));
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [
    systemPrompt,
    userPrompt,
    loading,
    history,
    recordView,
    addXp,
    itemId,
    onComplete,
    t,
  ]);

  const clearAll = () => {
    setSystemPrompt("");
    setUserPrompt("");
    setResponse("");
    setError(null);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
            <Icon name="fa-flask" className="text-white text-sm" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--theme-emphasis)] dark:text-white">
              {translateText(title)}
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {t("ialab.prompt_sandbox.subtitle")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHistory((v) => !v)}
          className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-[var(--theme-primary)] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5"
          aria-label={t("ialab.prompt_sandbox.history_aria")}
        >
          <Icon name="fa-clock-rotate-left" className="text-xs" />
          <span>
            {t("ialab.prompt_sandbox.history", { count: history.length })}
          </span>
        </button>
      </div>

      {/* Sample prompts */}
      {samplePrompts.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            {t("ialab.prompt_sandbox.samples_label")}
          </p>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applySample(sample)}
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
              >
                {translateText(sample.label)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="space-y-3">
          <div>
            <label
              htmlFor="prompt-sandbox-system"
              className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"
            >
              <Icon name="fa-user-tie" className="text-[var(--theme-primary)] text-xs" />
              System prompt{" "}
              <span className="text-gray-400 font-normal">
                {t("ialab.prompt_sandbox.system_hint")}
              </span>
            </label>
            <textarea
              id="prompt-sandbox-system"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder={t("ialab.prompt_sandbox.placeholder_system")}
              rows={3}
              className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-transparent resize-y text-[var(--theme-emphasis)] dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="prompt-sandbox-user"
              className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"
            >
              <Icon name="fa-message" className="text-[var(--theme-primary)] text-xs" />
              User prompt{" "}
              <span className="text-gray-400 font-normal">
                {t("ialab.prompt_sandbox.user_hint")}
              </span>
            </label>
            <textarea
              id="prompt-sandbox-user"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder={t("ialab.prompt_sandbox.placeholder_user")}
              rows={6}
              className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-transparent resize-y text-[var(--theme-emphasis)] dark:text-white"
            />
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-gray-400">
                {t("ialab.prompt_sandbox.char_tokens", {
                  chars: userPrompt.length,
                  tokens: Math.ceil(userPrompt.length / 4),
                })}
              </span>
              <button
                type="button"
                onClick={clearAll}
                className="text-[10px] text-gray-500 hover:text-rose-500 transition-colors"
              >
                {t("ialab.prompt_sandbox.clear_all")}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={runPrompt}
            disabled={loading || !userPrompt.trim()}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Icon name="fa-spinner" className="animate-spin text-sm" />
                {t("ialab.prompt_sandbox.generating")}
              </>
            ) : (
              <>
                <Icon name="fa-play" className="text-sm" />
                {t("ialab.prompt_sandbox.run")}
              </>
            )}
          </button>

          {/* Suggestions */}
          {suggestions.length > 0 &&
            (userPrompt.length > 0 || systemPrompt.length > 0) && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-1">
                  <Icon name="fa-lightbulb" className="text-[10px]" />
                  {t("ialab.prompt_sandbox.suggestions")}
                </p>
                <ul className="space-y-1.5">
                  {suggestions.map((s, i) => (
                    <li
                      key={i}
                      className={`text-[11px] leading-relaxed flex items-start gap-1.5 ${
                        s.level === "warn"
                          ? "text-amber-700 dark:text-amber-300"
                          : s.level === "ok"
                            ? "text-emerald-700 dark:text-emerald-300"
                            : "text-blue-700 dark:text-blue-300"
                      }`}
                    >
                      <span className="shrink-0 mt-0.5">
                        {s.level === "warn"
                          ? "⚠️"
                          : s.level === "ok"
                            ? "✓"
                            : "💡"}
                      </span>
                      <span>{s.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>

        {/* Response */}
        <div>
          <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
            <Icon name="fa-sparkles" className="text-[var(--theme-primary)] text-xs" />
            {t("ialab.prompt_sandbox.response_label")}
          </label>
          <div className="min-h-[280px] p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-[var(--theme-emphasis)] dark:text-gray-200 whitespace-pre-wrap font-mono leading-relaxed">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-2 text-rose-600 dark:text-rose-400"
                >
                  <Icon
                    name="fa-circle-exclamation"
                    className="text-sm mt-0.5"
                  />
                  <span>{error}</span>
                </motion.div>
              ) : loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-gray-500"
                >
                  <Icon name="fa-spinner" className="animate-spin" />
                  {t("ialab.prompt_sandbox.thinking")}
                </motion.div>
              ) : response ? (
                <motion.div
                  key="response"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {response}
                </motion.div>
              ) : (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-400 italic"
                >
                  {t("ialab.prompt_sandbox.empty_response")}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {response && !loading && (
            <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500">
              <span>
                {t("ialab.prompt_sandbox.generated_chars", {
                  count: response.length,
                })}
              </span>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(response)}
                className="hover:text-[var(--theme-primary)] transition-colors flex items-center gap-1"
              >
                <Icon name="fa-copy" className="text-[10px]" />
                {t("ialab.prompt_sandbox.copy")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Historial */}
      <AnimatePresence>
        {showHistory && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                {t("ialab.prompt_sandbox.history_title")}
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {[...history].reverse().map((h, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSystemPrompt(h.system);
                      setUserPrompt(h.user);
                      setResponse(h.response);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                  >
                    <div className="text-[10px] text-gray-500 mb-0.5">
                      {new Date(h.ts).toLocaleTimeString("es-CO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="text-[11px] text-[var(--theme-emphasis)] dark:text-white truncate">
                      {h.user}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

PromptSandbox.propTypes = {
  title: PropTypes.string,
  samplePrompts: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      system: PropTypes.string,
      user: PropTypes.string.isRequired,
    }),
  ),
  itemId: PropTypes.string,
  onComplete: PropTypes.func,
  className: PropTypes.string,
};

export default PromptSandbox;
