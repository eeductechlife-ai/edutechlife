import { useIALabStore } from "../../../store/ialabStore"
import { analyzeQuizFailures } from "../../../utils/ialab"
import COURSE_KNOWLEDGE from "../constants/courseKnowledge"

const PROMPT_VALERIO_DOCENTE_ES = `Eres Valerio, el coach de IA de Edutechlife.

IDENTIDAD:
- Eres un Psicólogo Experto en Metodología VAK del programa Edutechlife
- Tienes más de 10 años de experiencia con estudiantes
- Eres un experto en coaching educativo con IA
- Voz: Español colombiano, cálido y cercano

PERSONALIDAD:
- Cálido, cercano y motivador como un entrenador personal
- Explica conceptos complejos de manera simple y con ejemplos prácticos
- Detecta el estado emocional del estudiante y adapta tu respuesta
- Usa un lenguaje claro, positivo y constructivo
- Siempre relaciona tus respuestas con el contenido del curso IALab

INSTRUCCIONES:
1. Responde usando el contenido del módulo que te proporciono abajo como contexto
2. Sé específico: menciona nombres de temas, videos y recursos disponibles
3. Si preguntan sobre un tema, explícalo usando los conceptos del módulo
4. Recomienda videos, PDFs u OVAs específicos del módulo según la duda
5. Si no sabes algo, dilo honestamente y sugiere revisar el material
6. Responde en español, máximo 3 párrafos
7. Sé cálido y motivador, como un coach personal
8. Usa el nombre del estudiante de forma natural y esporádica. No lo repitas en cada respuesta ni de forma forzada. Úsalo como lo haría un coach real: para dar apertura, reconocer un logro, o generar cercanía cuando sea pertinente.`

const PROMPT_VALERIO_DOCENTE_EN = `You are Valerio, the AI coach from Edutechlife.

IDENTITY:
- You are an Expert Psychologist in VAK Methodology from the Edutechlife program
- You have over 10 years of experience with students
- You are an expert in educational coaching with AI

PERSONALITY:
- Warm, approachable and motivating like a personal trainer
- Explain complex concepts simply with practical examples
- Detect the student's emotional state and adapt your response
- Use clear, positive and constructive language
- Always relate your answers to the IALab course content

INSTRUCTIONS:
1. Answer using the module content provided below as context
2. Be specific: mention topic names, videos and available resources
3. If asked about a topic, explain it using the module concepts
4. Recommend specific videos, PDFs or OVAs from the module based on the question
5. If you don't know something, say so honestly and suggest reviewing the material
6. Respond in English, maximum 3 paragraphs
7. Be warm and motivating, like a personal coach
8. Use the student's name naturally and sparingly. Do not repeat it in every answer or force it. Use it as a real coach would: to open a conversation, acknowledge an achievement, or create rapport when appropriate.`

export const buildValerioSystemPrompt = ({ locale, currentModule, modules, studentName, userLevel, completedModules, t }) => {
  const isEn = locale === "en"
  const store = useIALabStore.getState()
  const currentModuleId = currentModule?.id || 1
  const currentModuleData = COURSE_KNOWLEDGE.find(m => m.id === currentModuleId)
  const moduleContent = currentModuleData
    ? JSON.stringify(currentModuleData, null, 2)
    : isEn ? "No module information available." : "No hay información del módulo disponible."

  const prompt = isEn ? PROMPT_VALERIO_DOCENTE_EN : PROMPT_VALERIO_DOCENTE_ES

  const moduleScores = []
  for (let i = 1; i <= 5; i++) {
    const score = store.calculateModuleScore(i)
    const modInfo = modules.find(m => m.id === i)
    moduleScores.push(`${modInfo?.title || `Module ${i}`}: ${score}%`)
  }

  const weakTopicsByModule = analyzeQuizFailures(store.storageGet)
  const weakTopicsStr = Object.entries(weakTopicsByModule)
    .map(([modId, topics]) => {
      const modInfo = modules.find(m => m.id === Number(modId))
      const topicsStr = Object.entries(topics)
        .map(([topic, count]) => `${topic} (${count} ${t("valerio.failures")})`)
        .join(", ")
      return `${modInfo?.title || `Module ${modId}`}: ${topicsStr}`
    })
    .join("\n") || t("valerio.none_identified")

  const lastActivityStr = store.lastActivityDate
    ? new Date(store.lastActivityDate).toLocaleDateString(isEn ? "en-US" : "es-CO", { year: "numeric", month: "short", day: "numeric" })
    : t("valerio.no_activity")

  const weeklyXP = store.getWeeklyXP()

  const streakStatus = store.streak > 0
    ? `${store.streak} ${t("valerio.days")}${store.isStreakAtRisk() ? ` (${t("valerio.at_risk")})` : " ✅"}`
    : t("valerio.no_streak")

  return `${prompt}

## ${t("valerio.current_module_label")}:
${moduleContent}

## ${t("valerio.student_context_label")}:
${t("valerio.name")}: ${studentName || t("valerio.student")}
${t("valerio.level")}: ${userLevel < 3 ? t("valerio.beginner") : userLevel < 6 ? t("valerio.intermediate") : t("valerio.advanced")}
${t("valerio.completed_modules")}: ${completedModules.length} / 5
${t("valerio.course_progress")}: ${store.courseProgress}%
${t("valerio.total_xp")}: ${store.xp}
${t("valerio.weekly_xp")}: ${weeklyXP.weekly} / ${weeklyXP.weeklyTarget} (${Math.round(weeklyXP.weeklyPct)}%)
${t("valerio.streak")}: ${streakStatus}
${t("valerio.last_activity")}: ${lastActivityStr}

${t("valerio.module_scores")}:
${moduleScores.join("\n")}

${t("valerio.weak_topics")}:
${weakTopicsStr}`
}

export const generateFallbackResponse = (inputText, locale, { currentModule, userLevel }) => {
  const isEn = locale === "en"
  const text = inputText.toLowerCase()

  if (text.includes("explic") || text.includes("qu") || text.includes("what") || text.includes("explain") || text.includes("how")) {
    const topicList = currentModule?.topics?.join(", ") || (isEn ? "key AI concepts" : "conceptos clave de IA")
    if (isEn) {
      return `Of course! Let's take it step by step.

We are in the ${currentModule?.title || "this topic"} module, where we explore ${topicList}. The idea is to understand how each concept works and why it matters, not just memorize it.

Since you are at ${userLevel < 3 ? "beginner" : userLevel < 6 ? "intermediate" : "advanced"} level, I suggest you ${userLevel < 3 ? "start with the basics: get familiar with the fundamentals and practice with simple examples" : userLevel < 6 ? "dive deeper into intermediate techniques and apply them to real cases" : "explore advanced applications. You are at a level where you can innovate and optimize"}.

Tell me, is there anything specific about this topic you would like me to explain in more detail?`
    }
    return `¡Claro que sí! Vamos a verlo con calma.

Estamos en el módulo de ${currentModule?.title || "este tema"}, donde exploramos ${topicList}. La idea es que entiendas cómo funciona cada concepto y por qué es importante, no solo que lo memorices.

Como vas en nivel ${userLevel < 3 ? "principiante" : userLevel < 6 ? "intermedio" : "avanzado"}, te sugiero ${userLevel < 3 ? "empezar por lo básico: familiarízate con los fundamentos y practica con ejemplos sencillos" : userLevel < 6 ? "profundizar en las técnicas intermedias y aplicarlas a casos reales" : "explorar las aplicaciones avanzadas. Estás en un nivel donde puedes innovar y optimizar"}.

Dime, ¿hay algo en particular de este tema que te gustaría que te explique con más detalle?`
  }

  if (text.includes("ejemplo") || text.includes("example") || text.includes("cómo") || text.includes("how to")) {
    if (isEn) {
      return `Great question, I love that you want to see this in action.

Let's think about this module's challenge: ${currentModule?.challenge || "creating something practical with what you have learned"}. One way to approach it is:

First, ask yourself: what exactly do I want to achieve? Having a clear goal is key. Then, think about the role you need the AI to take on and give it enough context to understand your situation.

Are you seeing where this is going? If you want, we can build an example together step by step.`
    }
    return `Buena pregunta, me encanta que quieras ver esto en acción.

Pensemos en el desafío de este módulo: ${currentModule?.challenge || "crear algo práctico con lo aprendido"}. Una forma de abordarlo es así:

Primero, pregúntate: ¿qué quiero lograr exactamente? Tener claro el objetivo es clave. Luego, piensa en el rol que necesitas que la IA asuma y dale contexto suficiente para que entienda tu situación.

¿Vas viendo por dónde va la cosa? Si quieres, podemos construir un ejemplo juntos paso a paso.`
  }

  if (isEn) {
    return `I understand your question about "${inputText}". Let me think about how I can best help you with that.

Considering you are in ${currentModule?.title || "this module"}, I suggest you review the material you already have available, as it contains the foundations to answer your question. Then, practice with related examples — practice is what really solidifies concepts.

Would you like me to explain a specific concept or would you prefer a practical example related to your question? Whatever works best for you, I am here for that.`
  }
  return `Entiendo tu pregunta sobre "${inputText}". Déjame pensar cómo puedo ayudarte mejor con eso.

Considerando que estás en ${currentModule?.title || "este módulo"}, te sugiero que revises el material que ya tienes disponible, porque allí encuentras las bases para responder tu duda. Luego, practica con ejemplos relacionados — la práctica es la que realmente fija los conceptos.

¿Te gustaría que te explique algún concepto en particular o prefieres un ejemplo práctico relacionado con tu pregunta? Lo que más te sirva, aquí estoy para eso.`
}

export const buildContextualWelcome = ({ locale, studentName, currentModule, userLevel, activeMod }) => {
  const isEn = locale === "en"
  const store = useIALabStore.getState()
  const name = studentName || (isEn ? "Student" : "Estudiante")
  const moduleTitle = currentModule?.title || (isEn ? "this module" : "este módulo")
  const levelLabel = userLevel < 3
    ? (isEn ? "beginner" : "principiante")
    : userLevel < 6
      ? (isEn ? "intermediate" : "intermedio")
      : (isEn ? "advanced" : "avanzado")

  const modScore = store.calculateModuleScore(activeMod)
  const isModComplete = modScore >= 80
  const overallPct = store.courseProgress
  const streakNum = store.streak
  const atRisk = store.isStreakAtRisk()

  const daysSinceLast = store.lastActivityDate
    ? Math.floor((Date.now() - new Date(store.lastActivityDate).getTime()) / 86400000)
    : null

  if (isEn) {
    if (daysSinceLast !== null && daysSinceLast >= 3) {
      return `Welcome back, ${name}! It's been ${daysSinceLast} days — great to see you again. You're working on "${moduleTitle}" at ${levelLabel} level. Need a refresher or want to keep moving forward?`
    }
    if (streakNum > 0 && atRisk) {
      return `Hey ${name}! Your ${streakNum}-day streak is at risk today. How about one quick activity to keep it going? You're in "${moduleTitle}" at ${levelLabel} level — let's do this!`
    }
    if (streakNum >= 5) {
      return `Wow, ${streakNum} days in a row, ${name}! Your consistency is amazing. You're making great progress in "${moduleTitle}" (${levelLabel} level). What would you like to work on today?`
    }
    if (isModComplete && overallPct < 100) {
      const recModule = store.getDailyRoute()?.nextModule
      return `Awesome, ${name}! You aced this module 🎉. Overall you're at ${overallPct}% of the course. ${recModule ? `Ready to jump into "${recModule.title}"?` : "Ready for the next challenge?"} Ask me anything!`
    }
    if (overallPct >= 80) {
      return `You're almost there, ${name}! ${overallPct}% complete — just the final stretch left. Keep pushing, and let me know if you need help with anything!`
    }
    return `Hello${studentName ? ", " + studentName : ""}! I'm Valerio, your coach. I see you're in "${moduleTitle}" — great topic! You're at ${levelLabel} level, and we'll explore it together. Ask me anything: explain a topic, give you an example, or help you with the challenge. Where would you like to start?`
  }

  if (daysSinceLast !== null && daysSinceLast >= 3) {
    return `¡Bienvenido de vuelta, ${name}! Hacía ${daysSinceLast} días — qué gusto verte de nuevo. Estás en "${moduleTitle}" nivel ${levelLabel}. ¿Necesitas un repaso o quieres seguir avanzando?`
  }
  if (streakNum > 0 && atRisk) {
    return `¡Oye ${name}! Tu racha de ${streakNum} días está en riesgo hoy. ¿Qué tal una actividad rápida para mantenerla? Estás en "${moduleTitle}" nivel ${levelLabel} — ¡vamos!`
  }
  if (streakNum >= 5) {
    return `¡${streakNum} días seguidos, ${name}! Tu constancia es increíble. Vas muy bien en "${moduleTitle}" (nivel ${levelLabel}). ¿En qué te gustaría trabajar hoy?`
  }
  if (isModComplete && overallPct < 100) {
    const recModule = store.getDailyRoute()?.nextModule
    return `¡${name}, dominaste este módulo! 🎉 Llevas ${overallPct}% del curso. ${recModule ? `¿Listo para saltar a "${recModule.title}"?` : "¿Listo para el siguiente reto?"} ¡Pregúntame lo que quieras!`
  }
  if (overallPct >= 80) {
    return `Ya casi terminas, ${name}! ${overallPct}% completado — solo queda el empujón final. ¡Sigue así y cuéntame si necesitas ayuda con algo!`
  }
  return `¡Hola${studentName ? ", " + studentName : ""}! Soy Valerio, tu coach. Veo que estás en "${moduleTitle}" — ¡qué tema tan interesante! Estás en nivel ${levelLabel}, y lo exploraremos juntos. Pregúntame lo que quieras: explicarte un tema, darte un ejemplo, o ayudarte con el desafío. ¿Por dónde te gustaría empezar?`
}
