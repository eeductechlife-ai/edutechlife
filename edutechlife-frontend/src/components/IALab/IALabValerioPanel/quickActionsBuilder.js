/**
 * valerioQuickActions.js — Acciones rápidas del tutor Valerio (Fase 5)
 *
 * Extrae la construcción de acciones rápidas para poder testearla y añade
 * dos capacidades pedagógicas: explicación paso a paso y micro-plan.
 */

const pickPrompt = (locale, prompts) => prompts[locale] || prompts.es;

const LEVEL_WORDS = {
  es: ["principiante", "intermedio", "avanzado"],
  en: ["beginner", "intermediate", "advanced"],
  pt: ["iniciante", "intermediário", "avançado"],
};

export function buildValerioQuickActions({
  locale = "es",
  currentModule,
  lessonTitle,
  userLevel,
  t,
} = {}) {
  const label = (key) => (typeof t === "function" ? t(key) : key);
  const moduleTitle = currentModule?.title || "";
  const challenge = currentModule?.challenge || "";
  const topicRef = lessonTitle
    ? `"${moduleTitle}" > "${lessonTitle}"`
    : `"${moduleTitle}"`;
  const tier = userLevel < 3 ? 0 : userLevel < 6 ? 1 : 2;
  const levelWord = (LEVEL_WORDS[locale] || LEVEL_WORDS.es)[tier];

  return [
    {
      id: "explain_topic",
      label: label("ialab.valerio.quick_explain_topic"),
      icon: "fa-book",
      prompt: pickPrompt(locale, {
        en: `Explain the main topic of ${topicRef} clearly and concisely, in at most 3 sentences.`,
        pt: `Explique o tópico principal de ${topicRef} de forma clara e concisa, em no máximo 3 frases.`,
        es: `Explica el tema principal de ${topicRef} de manera clara y concisa, en máximo 3 frases.`,
      }),
    },
    {
      id: "explain_step_by_step",
      label: label("ialab.valerio.quick_step_by_step"),
      icon: "fa-list-check",
      prompt: pickPrompt(locale, {
        en: `Explain ${topicRef} step by step in at most 4 steps, one short sentence per step (step 1, step 2, ...), no examples.`,
        pt: `Explique ${topicRef} passo a passo em no máximo 4 passos, uma frase curta por passo (passo 1, passo 2, ...), sem exemplos.`,
        es: `Explica ${topicRef} paso a paso en máximo 4 pasos, una frase corta por paso (paso 1, paso 2, ...), sin ejemplos.`,
      }),
    },
    {
      id: "give_example",
      label: label("ialab.valerio.quick_give_example"),
      icon: "fa-lightbulb",
      prompt: pickPrompt(locale, {
        en: `Provide one very brief practical example (1-2 sentences) related to "${challenge || "prompt engineering"}".`,
        pt: `Forneça um exemplo prático muito breve (1-2 frases) relacionado a "${challenge || "engenharia de prompts"}".`,
        es: `Proporciona un ejemplo práctico muy breve (1-2 frases) relacionado con "${challenge || "ingeniería de prompts"}".`,
      }),
    },
    {
      id: "help_challenge",
      label: label("ialab.valerio.quick_help_challenge"),
      icon: "fa-puzzle-piece",
      prompt: pickPrompt(locale, {
        en: `How can I effectively approach the "${challenge}" challenge?`,
        pt: `Como posso abordar o desafio "${challenge}" de forma eficaz?`,
        es: `¿Cómo puedo abordar el desafío "${challenge}" de manera efectiva?`,
      }),
    },
    {
      id: "micro_plan",
      label: label("ialab.valerio.quick_micro_plan"),
      icon: "fa-calendar-days",
      prompt: pickPrompt(locale, {
        en: `Build a short, actionable plan (3 steps, about 20 minutes) to practice ${topicRef} at ${levelWord} level, in at most 4 sentences. Include how to check my progress.`,
        pt: `Monte um plano curto e acionável (3 passos, cerca de 20 minutos) para praticar ${topicRef} no nível ${levelWord}, em no máximo 4 frases. Inclua como verificar o meu progresso.`,
        es: `Arma un plan corto y accionable (3 pasos, unos 20 minutos) para practicar ${topicRef} a nivel ${levelWord}, en máximo 4 frases. Incluye cómo comprobar mi progreso.`,
      }),
    },
    {
      id: "study_tips",
      label: label("ialab.valerio.quick_study_tips"),
      icon: "fa-graduation-cap",
      prompt: pickPrompt(locale, {
        en: `Give me study tips for the "${moduleTitle}" module (level ${levelWord}). I am currently on the lesson "${lessonTitle || moduleTitle}".`,
        pt: `Dê-me dicas de estudo para o módulo "${moduleTitle}" (nível ${levelWord}). Estou na lição "${lessonTitle || moduleTitle}".`,
        es: `Dame consejos de estudio para el módulo "${moduleTitle}" (nivel ${levelWord}). Estoy en la lección "${lessonTitle || moduleTitle}".`,
      }),
    },
  ];
}
