/**
 * bloomAlignment.js — Alineación pedagógica a Bloom (Fase 3)
 *
 * Asigna a cada tema de cada módulo un nivel de la taxonomía de Bloom
 * (revisada) y define un caso aplicado por industria para cerrar la brecha
 * entre teoría y práctica profesional.
 *
 * ADITIVO y de solo lectura: no altera contenido ni comportamiento existente.
 */

export const BLOOM_LEVELS = [
  "recordar",
  "comprender",
  "aplicar",
  "analizar",
  "evaluar",
  "crear",
];

export const BLOOM_LEVELS_EN = [
  "remember",
  "understand",
  "apply",
  "analyze",
  "evaluate",
  "create",
];

export const BLOOM_LEVELS_PT = [
  "lembrar",
  "compreender",
  "aplicar",
  "analisar",
  "avaliar",
  "criar",
];

export const BLOOM_VERBS = {
  recordar: ["Identificar", "Reconocer", "Enumerar"],
  comprender: ["Explicar", "Describir", "Interpretar"],
  aplicar: ["Aplicar", "Utilizar", "Construir", "Configurar"],
  analizar: ["Analizar", "Diferenciar", "Organizar", "Detectar"],
  evaluar: ["Evaluar", "Verificar", "Juzgar", "Argumentar"],
  crear: ["Diseñar", "Producir", "Crear", "Componer"],
};

/**
 * Nivel Bloom por tema, alineado 1:1 con CONTENT_ES[m].overviewData.topics.
 * @type {Record<number, Array<{ level: string, verb: string }>>}
 */
export const MODULE_BLOOM = {
  1: [
    { level: "recordar", verb: "Identificar" },
    { level: "aplicar", verb: "Construir" },
  ],
  2: [
    { level: "comprender", verb: "Describir" },
    { level: "aplicar", verb: "Configurar" },
    { level: "crear", verb: "Diseñar" },
  ],
  3: [
    { level: "aplicar", verb: "Utilizar" },
    { level: "analizar", verb: "Diferenciar" },
    { level: "evaluar", verb: "Verificar" },
  ],
  4: [
    { level: "comprender", verb: "Explicar" },
    { level: "analizar", verb: "Organizar" },
    { level: "crear", verb: "Producir" },
  ],
  5: [
    { level: "analizar", verb: "Detectar" },
    { level: "evaluar", verb: "Juzgar" },
    { level: "crear", verb: "Diseñar" },
  ],
};

/**
 * Caso aplicado por industria (uno por módulo).
 * @type {Record<number, { industry: string, title: string, scenario: string, prompt: string, outcome: string }>}
 */
export const MODULE_CASE_STUDY = {
  1: {
    industry: "Educación",
    title: "Prompts que nivelan un aula",
    scenario:
      "Una docente de secundaria debe adaptar un texto de ciencias a tres niveles de lectura en menos de una hora.",
    prompt:
      "Usa el método RTF (papel, tarea, formato) para pedir tres versiones del texto, una por nivel de lectura.",
    outcome:
      "Tres versiones listas para imprimir, con vocabulario y longitud ajustados a cada grupo.",
  },
  2: {
    industry: "Retail",
    title: "Un GPT que atiende devoluciones",
    scenario:
      "Una tienda en línea recibe cientos de consultas repetidas sobre su política de devoluciones cada semana.",
    prompt:
      "Diseña un GPT con instrucciones, base de conocimiento y una Action para consultar el estado real del pedido.",
    outcome:
      "Respuestas consistentes y trazables, con escalado a una persona cuando el caso es complejo.",
  },
  3: {
    industry: "Periodismo",
    title: "Un informe verificable en una tarde",
    scenario:
      "Una reportera necesita un informe sobre un tema de actualidad con fuentes rastreables para publicar el mismo día.",
    prompt:
      "Formula una pregunta delimitada y usa Deep Research con enfoque y fuentes, verificando cada cita.",
    outcome:
      "Un informe con citas comprobadas y una lista clara de hallazgos verificados y descartados.",
  },
  4: {
    industry: "Salud",
    title: "De 8 papers a un resumen escuchable",
    scenario:
      "Un equipo clínico debe alinear criterios a partir de ocho artículos y repasarlos durante sus traslados.",
    prompt:
      "Cura las fuentes, sintetiza con citas en NotebookLM y genera un Audio Overview para repaso.",
    outcome:
      "Un protocolo interno citado y un audio que resume las conclusiones mientras el equipo se desplaza.",
  },
  5: {
    industry: "Finanzas",
    title: "Un crédito que se puede explicar",
    scenario:
      "Una fintech evalúa solicitudes de crédito con IA y debe justificar cada rechazo ante el solicitante.",
    prompt:
      "Audita sesgos, aplica explicabilidad, define supervisión humana y verifica el cumplimiento normativo.",
    outcome:
      "Decisiones justas, explicables y auditables, con derecho a revisión para cada solicitante.",
  },
};

/**
 * @param {number|string} moduleId
 * @returns {Array<{ level: string, verb: string }>}
 */
export function getBloomForModule(moduleId) {
  return MODULE_BLOOM[Number(moduleId)] || [];
}

/**
 * Niveles de Bloom cubiertos a lo largo de todo el curso.
 * @returns {string[]}
 */
export function getCourseBloomCoverage() {
  const covered = new Set();
  Object.values(MODULE_BLOOM).forEach((entries) => {
    entries.forEach((entry) => covered.add(entry.level));
  });
  return BLOOM_LEVELS.filter((level) => covered.has(level));
}
