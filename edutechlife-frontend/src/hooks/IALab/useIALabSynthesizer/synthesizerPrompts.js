import { getAvailableTechniques } from "../../../utils/promptOptimizer";
import {
  analyzePromptQuality,
  identifyPromptType,
  extractKeywords,
} from "../../../utils/promptAnalyzer";

export function getDynamicContext(activeMod, modules, completedModules) {
  const currentModule = modules.find((m) => m.id === activeMod);
  const userLevel = completedModules.length;

  return {
    module: currentModule?.title || "M\u00f3dulo general",
    topics: currentModule?.topics || [
      "Ingenier\u00eda de prompts",
      "Comunicaci\u00f3n con IA",
    ],
    userLevel:
      userLevel < 3
        ? "Principiante"
        : userLevel < 6
          ? "Intermedio"
          : "Avanzado",
    challenge: currentModule?.challenge || "Crear prompts efectivos",
    techniques: getAvailableTechniques().map((t) => t.name),
  };
}

export function getSuggestions(input, getDynamicContextFn) {
  const context = getDynamicContextFn();

  if (input.trim().length > 0) {
    const analysis = analyzePromptQuality(input);
    const promptType = identifyPromptType(input);
    const keywords = extractKeywords(input);

    return [
      `Optimiza este prompt aplicando ${promptType.technique}`,
      `Mejora la claridad de: "${input.substring(0, 40)}..."`,
      `A\u00f1ade m\u00e1s contexto sobre ${keywords[0] || "el tema"}`,
      `Estructura mejor este prompt para ${promptType.type.toLowerCase()}`,
    ];
  }

  return [
    `Como ${context.userLevel.toLowerCase()}, crea un prompt para ${context.challenge.toLowerCase()}`,
    `Genera un prompt que use ${context.techniques[0]} para resolver un problema real`,
    `Optimiza este prompt b\u00e1sico: "Explica c\u00f3mo funciona..."`,
    `Crea un prompt educativo sobre ${context.topics[0]?.toLowerCase() || "IA"}`,
  ];
}
