// Construcción de la petición a la IA para el plan del Arquitecto de Automatización.
// Usa el formato nuevo de callDeepseek (array de mensajes + opciones): el formato
// legacy (prompt, system, isJson) fija maxTokens en 500 y recorta la respuesta a
// 500 caracteres, lo que truncaba el plan de 6 secciones.
export const PLAN_MAX_TOKENS = 2000;

export function buildPlanRequest(formData, selectedArchitecture) {
  const prompt = `Como arquitecto de automatización empresarial experto, genera un plan detallado para:
        
Empresa: ${formData.empresa}
Industria: ${formData.industria}
Número de empleados: ${formData.empleados}
Procesos a automatizar: ${formData.procesos.join(", ")}
Objetivos: ${formData.objetivos}
Presupuesto: ${formData.presupuesto}
Tiempo estimado: ${formData.tiempo}
Arquitectura seleccionada: ${selectedArchitecture?.nombre || "Por definir"}

Genera un plan de automatización que incluya:
1. Arquitectura recomendada (basada en la seleccionada)
2. Fases de implementación con cronograma
3. Tecnologías y herramientas específicas
4. KPIs de éxito y métricas de ROI
5. Análisis de riesgos y mitigaciones
6. Estándares aplicables (ISO/IEC 42001, NIST AI RMF)

Formato: Título, descripción, y secciones claras con viñetas.`;

  const system =
    "Eres un arquitecto de automatización empresarial experto en IA, estándares internacionales y transformación digital. Genera planes detallados, prácticos y realistas.";

  return {
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
    options: { maxTokens: PLAN_MAX_TOKENS, temperature: 0.7 },
  };
}
