import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../i18n/I18nProvider";

/**
 * Guía de selección de modelo de IA: criterios de costo, latencia,
 * privacidad y capacidades. Autocontenida, no afecta progreso ni XP.
 */
import {
  SCENARIOS_ES,
  SCENARIOS_EN,
  SCENARIOS_PT,
} from "./ModelSelectionGuideParts";

export default function ModelSelectionGuide() {
  const { t, locale } = useTranslation();
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [expandedCriteria, setExpandedCriteria] = useState(null);
  const [showExpert, setShowExpert] = useState(false);

  const scenarios = useMemo(() => {
    if (locale === "en") return SCENARIOS_EN;
    if (locale === "pt") return SCENARIOS_PT;
    return SCENARIOS_ES;
  }, [locale]);

  const currentScenario = scenarios[selectedScenario];

  const handleCriterionClick = useCallback(
    (index) => {
      setExpandedCriteria(expandedCriteria === index ? null : index);
    },
    [expandedCriteria],
  );

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          {locale === "en"
            ? "AI Model Selection Guide"
            : locale === "pt"
              ? "Guia de Seleção de Modelo de IA"
              : "Guía de Selección de Modelo de IA"}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {locale === "en"
            ? "Learn when to use ChatGPT, Gemini, Gemini Notebook, and open-source alternatives"
            : locale === "pt"
              ? "Aprenda quando usar ChatGPT, Gemini, Gemini Notebook e alternativas open-source"
              : "Aprende cuándo usar ChatGPT, Gemini, Gemini Notebook y alternativas open-source"}
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-2 gap-2">
        {scenarios.map((scenario, idx) => (
          <motion.button
            key={scenario.id}
            onClick={() => {
              setSelectedScenario(idx);
              setShowExpert(false);
              setExpandedCriteria(null);
            }}
            className={`p-3 rounded-lg text-sm font-medium transition-all ${
              selectedScenario === idx
                ? "bg-teal-500 text-white shadow-lg"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {scenario.title}
          </motion.button>
        ))}
      </div>

      {/* Current Scenario */}
      <motion.div
        key={currentScenario.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-700 space-y-4"
      >
        {/* Context */}
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
            {locale === "en"
              ? "Context"
              : locale === "pt"
                ? "Contexto"
                : "Contexto"}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {currentScenario.context}
          </p>
        </div>

        {/* Criteria */}
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3">
            {locale === "en"
              ? "Decision Criteria"
              : locale === "pt"
                ? "Critérios de Decisão"
                : "Criterios de Decisión"}
          </p>
          <div className="space-y-2">
            {currentScenario.criteria.map((criterion, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleCriterionClick(idx)}
                className="w-full text-left p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 transition-colors"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {criterion.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {criterion.reason}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      criterion.importance === "CRITICAL" ||
                      criterion.importance === "CRÍTICA"
                        ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                        : criterion.importance === "HIGH" ||
                            criterion.importance === "ALTA"
                          ? "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                          : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    {criterion.importance}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3">
            {locale === "en"
              ? "Model Options"
              : locale === "pt"
                ? "Opções de Modelo"
                : "Opciones de Modelo"}
          </p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {currentScenario.options.map((option, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1"
              >
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  {option.model}
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">
                      {locale === "en"
                        ? "Cost: "
                        : locale === "pt"
                          ? "Custo: "
                          : "Costo: "}
                    </span>
                    <span className="font-mono text-slate-900 dark:text-slate-50">
                      {option.cost}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">
                      {locale === "en"
                        ? "Latency: "
                        : locale === "pt"
                          ? "Latência: "
                          : "Latencia: "}
                    </span>
                    <span className="font-mono text-slate-900 dark:text-slate-50">
                      {option.latency}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">
                      {locale === "en"
                        ? "Privacy: "
                        : locale === "pt"
                          ? "Privacidade: "
                          : "Privacidad: "}
                    </span>
                    <span className="font-mono text-slate-900 dark:text-slate-50">
                      {option.privacy}
                    </span>
                  </div>
                </div>
                <p className="text-xs italic text-slate-600 dark:text-slate-400">
                  {option.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Expert Answer Toggle */}
        <motion.button
          onClick={() => setShowExpert(!showExpert)}
          className="w-full p-3 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-medium text-sm hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {showExpert
            ? locale === "en"
              ? "Hide Expert Solution"
              : locale === "pt"
                ? "Ocultar Solução Experta"
                : "Ocultar Solución Experta"
            : locale === "en"
              ? "Reveal Expert Solution"
              : locale === "pt"
                ? "Revelar Solução Experta"
                : "Revelar Solución Experta"}
        </motion.button>

        {/* Expert Solution */}
        <AnimatePresence>
          {showExpert && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700"
            >
              {currentScenario.expert.map((step, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {locale === "en"
                      ? "Step"
                      : locale === "pt"
                        ? "Passo"
                        : "Paso"}{" "}
                    {idx + 1}:
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
        {locale === "en"
          ? "💡 This is an interactive guide. Choose scenarios, explore criteria, and learn the trade-offs between models."
          : locale === "pt"
            ? "💡 Este é um guia interativo. Escolha cenários, explore critérios e aprenda os trade-offs entre modelos."
            : "💡 Esta es una guía interactiva. Elige escenarios, explora criterios y aprende los trade-offs entre modelos."}
      </p>
    </div>
  );
}
