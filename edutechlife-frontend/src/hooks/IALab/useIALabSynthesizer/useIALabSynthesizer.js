import { useState, useCallback, useRef, useEffect } from "react";
import { useIALabProgressContext } from "../../../context/IALabContext";
import {
  analyzePromptQuality,
} from "../../../utils/promptAnalyzer.js";
import {
  selectAppropriateTechnique,
  applyTechnique,
  explainTechniqueSelection,
} from "../../../utils/promptOptimizer.js";
import {
  generateEducationalFeedback,
  generateComparisonMetrics,
  generateExecutiveSummary,
} from "../../../utils/promptEvaluator.js";
import {
  MIN_INPUT_LENGTH,
  MAX_INPUT_LENGTH,
  HISTORY_LIMIT,
  DEEPSEEK_SCORE_DEFAULTS,
  BEFORE_COMPARISON_DEFAULTS,
  DEEPSEEK_PROCESSING_TIME,
  LOCAL_PROCESSING_TIME,
  DEEPSEEK_MODEL_VERSION,
  LOCAL_MODEL_VERSION,
  DEEPSEEK_TECHNIQUE,
  DEEPSEEK_SOURCE_NAME,
} from "./synthesizerConfig";
import {
  getDynamicContext as getDynamicContextFn,
  getSuggestions as getSuggestionsFn,
} from "./synthesizerPrompts";
import {
  getUsageStats as getUsageStatsFn,
  getTechniquesForDisplay as getTechniquesForDisplayFn,
  getQuickAnalysis as getQuickAnalysisFn,
  isValidInput as isValidInputFn,
  copyToClipboard as copyToClipboardFn,
} from "./synthesizerUtils";
import { callDeepSeekApi } from "./synthesizerApi";

/**
 * Hook especializado para sintetizador de prompts educativo
 * Enseña prompt engineering aplicando técnicas reales con feedback educativo
 *
 * @returns {Object} Funciones y estados para sintetizador de prompts
 */
export const useIALabSynthesizer = () => {
  const { activeMod, modules, completedModules } = useIALabProgressContext();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [genData, setGenData] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // Nuevos estados para integración con DeepSeek
  const [deepSeekResult, setDeepSeekResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  // Obtener contexto dinámico basado en módulo activo
  const getDynamicContext = useCallback(() => {
    return getDynamicContextFn(activeMod, modules, completedModules);
  }, [activeMod, modules, completedModules]);

  // Optimizar prompt con DeepSeek API o análisis local
  const optimizePrompt = useCallback(async (userPrompt) => {
    if (!userPrompt.trim()) {
      setError("Por favor, ingresa una idea para convertir en prompt");
      return null;
    }

    if (userPrompt.trim().length < MIN_INPUT_LENGTH) {
      setError("La idea debe tener al menos 3 caracteres");
      return null;
    }

    if (userPrompt.trim().length > MAX_INPUT_LENGTH) {
      setError("La idea no debe exceder 500 caracteres");
      return null;
    }

    setLoading(true);
    setLoadMsg("Generando prompt maestro con DeepSeek...");
    setError(null);
    setApiError(null);

    try {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      // Intentar usar DeepSeek API primero
      const deepSeekResult = await (async () => {
        setIsGenerating(true);
        setLoadMsg("Conectando con DeepSeek API...");

        try {
          const result = await callDeepSeekApi(userPrompt, controller.signal);
          setDeepSeekResult(result);
          return result;
        } catch (error) {
          console.error("❌ DeepSeek API Error completo:", error);
          setApiError(
            `Error con DeepSeek API: ${error.message}. Usando sistema local...`,
          );
          return null;
        } finally {
          setIsGenerating(false);
        }
      })();

      let result;

      if (deepSeekResult) {
        // Usar resultado de DeepSeek
        result = {
          // Datos originales
          originalPrompt: userPrompt,
          timestamp: new Date().toISOString(),

          // Análisis
          analysis: {
            ...DEEPSEEK_SCORE_DEFAULTS,
            commonProblems: ["Idea demasiado básica", "Falta de estructura"],
            suggestions: [
              "Agregar rol específico",
              "Definir formato de salida",
              "Especificar tarea concreta",
            ],
            wordCount: deepSeekResult.prompt_maestro.split(" ").length,
            charCount: deepSeekResult.prompt_maestro.length,
          },

          // Optimización
          optimizedPrompt: deepSeekResult.prompt_maestro,
          techniqueApplied: DEEPSEEK_TECHNIQUE,

          // Feedback educativo
          feedback: {
            summary: deepSeekResult.analisis_tecnico,
            improvements: [
              `Rol definido: ${deepSeekResult.rol}`,
              `Tarea específica: ${deepSeekResult.tarea}`,
              `Formato estructurado: ${deepSeekResult.formato}`,
            ],
            educationalInsights: "",
            beforeAfterComparison: {
              before: BEFORE_COMPARISON_DEFAULTS,
              after: DEEPSEEK_SCORE_DEFAULTS,
              improvement: 137.5,
            },
            executiveSummary: `Transformación de idea básica "${userPrompt}" en prompt profesional con estructura RTF (Rol, Tarea, Formato)`,
          },

          // Metadata
          metadata: {
            processingTime: DEEPSEEK_PROCESSING_TIME,
            techniqueUsed: DEEPSEEK_SOURCE_NAME,
            modelVersion: DEEPSEEK_MODEL_VERSION,
            source: "DeepSeek API",
          },

          // Datos de DeepSeek para renderizado específico
          deepSeekData: deepSeekResult,
        };
      } else {
        // Fallback a sistema local
        setLoadMsg("Usando sistema local de análisis...");

        const analysis = analyzePromptQuality(userPrompt);
        const technique = selectAppropriateTechnique(userPrompt, analysis);
        const optimizedPrompt = applyTechnique(userPrompt, technique, analysis);
        const feedback = generateEducationalFeedback(
          userPrompt,
          optimizedPrompt,
          technique,
          analysis,
        );
        const comparisonMetrics = generateComparisonMetrics(
          userPrompt,
          optimizedPrompt,
        );
        const executiveSummary = generateExecutiveSummary(feedback);

        result = {
          // Datos originales
          originalPrompt: userPrompt,
          timestamp: new Date().toISOString(),

          // Análisis
          analysis: {
            score: analysis.score,
            clarity: analysis.clarity,
            specificity: analysis.specificity,
            context: analysis.context,
            structure: analysis.structure,
            commonProblems: analysis.commonProblems,
            suggestions: analysis.suggestions,
            wordCount: analysis.wordCount,
            charCount: analysis.charCount,
          },

          // Optimización
          optimizedPrompt: optimizedPrompt,
          techniqueApplied: {
            name: technique.name,
            description: technique.description,
            icon: technique.icon,
            color: technique.color,
            explanation: explainTechniqueSelection(
              userPrompt,
              technique,
              analysis,
            ),
          },

          // Feedback educativo
          feedback: {
            summary: feedback.summary,
            improvements: feedback.improvements,
            educationalInsights: feedback.educationalInsights,
            beforeAfterComparison: comparisonMetrics,
            executiveSummary: executiveSummary,
          },

          // Metadata
          metadata: {
            processingTime: LOCAL_PROCESSING_TIME,
            techniqueUsed: technique.name,
            modelVersion: LOCAL_MODEL_VERSION,
            source: "Sistema local",
          },
        };
      }

      setGenData(result);

      // Agregar al historial
      setHistory((prev) => {
        const newHistory = [result, ...prev.slice(0, HISTORY_LIMIT - 1)];
        return newHistory;
      });

      return result;
    } catch (error) {
      if (error.name === "AbortError") return null;
      console.error("Error en optimizePrompt:", error);
      setError(`Error al procesar la idea: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
      setLoadMsg("");
    }
  }, []);

  // Limpiar historial
  const clearHistory = useCallback(() => {
    setHistory([]);
    setGenData(null);
    setInput("");
  }, []);

  // Cargar prompt del historial
  const loadFromHistory = useCallback(
    (index) => {
      if (history[index]) {
        setInput(history[index].originalPrompt || "");
        setGenData(history[index]);
      }
    },
    [history],
  );

  // Obtener estadísticas de uso
  const getUsageStats = useCallback(() => {
    return getUsageStatsFn(history);
  }, [history]);

  // Generar sugerencias contextuales inteligentes
  const getSuggestions = useCallback(() => {
    return getSuggestionsFn(input, getDynamicContext);
  }, [getDynamicContext, input]);

  // Función para copiar al portapapeles
  const copyToClipboard = useCallback((text) => {
    return copyToClipboardFn(text);
  }, []);

  // Validación de input
  const isValidInput = useCallback((text) => {
    return isValidInputFn(text);
  }, []);

  // Obtener técnicas disponibles para mostrar
  const getTechniquesForDisplay = useCallback(() => {
    return getTechniquesForDisplayFn();
  }, []);

  // Obtener análisis rápido (para preview en tiempo real)
  const getQuickAnalysis = useCallback((text) => {
    return getQuickAnalysisFn(text);
  }, []);

  return {
    // Estados
    input,
    setInput,
    loading,
    loadMsg,
    genData,
    error,
    history,

    // Funciones principales
    optimizePrompt,
    copyToClipboard,
    clearHistory,
    loadFromHistory,
    getUsageStats,

    // Utilidades
    getDynamicContext,
    getSuggestions,
    getTechniquesForDisplay,
    getQuickAnalysis,

    // Validaciones
    isValidInput,

    // Constantes útiles
    MAX_INPUT_LENGTH,
    MIN_INPUT_LENGTH,

    // Funciones de integración con DeepSeek
    generateWithDeepSeek: async (userIdea) => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsGenerating(true);
      setApiError(null);
      setLoadMsg("Conectando con DeepSeek API...");

      try {
        const result = await callDeepSeekApi(userIdea, controller.signal);
        setDeepSeekResult(result);
        return result;
      } catch (error) {
        if (error.name === "AbortError") return null;
        console.error("DeepSeek API Error:", error);
        setApiError(
          `Error con DeepSeek API: ${error.message}. Verifica que el servidor backend est\u00e9 ejecut\u00e1ndose.`,
        );
        return null;
      } finally {
        setIsGenerating(false);
        setLoadMsg("");
      }
    },

    // Estados de DeepSeek
    deepSeekResult,
    isGenerating,
    apiError,
    setDeepSeekResult,
  };
};

export default useIALabSynthesizer;
