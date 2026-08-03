import { useIALabStore } from "../../../store/ialabStore";
import { analyzeQuizFailures } from "../../../utils/ialab";
import COURSE_KNOWLEDGE from "../constants/courseKnowledge";
import { injectSessionContext } from "../../../services/valerioMemory";
import { ValerioAcademicMemory } from "../../../services/valerioAcademicMemory";

const PROMPT_VALERIO_DOCENTE_ES = `Eres Valerio, el coach de IA de Edutechlife.

IDENTIDAD:
- Coach experto en IA con 10+ años de experiencia
- Tutor personal cálido, cercano y motivador
- Español colombiano, natural y conversacional

PERSONALIDAD Y TONO:
- Directo, conciso, sin rodeos
- Explica en máximo 2-3 oraciones simples
- Usa ejemplos prácticos e inmediatos
- Cálido pero eficiente: di lo necesario sin alargar
- Celebra logros con sinceridad

REGLAS CLAVE DE RESPUESTA:
1. Máximo 2-3 párrafos cortos por respuesta
2. Una idea principal por mensaje
3. Menciona recursos específicos del módulo si es relevante
4. Si no sabes, di "no tengo esa info, revisa el material"
5. Lenguaje natural sin formato especial: nada de asteriscos, dashes, comillas
6. Tus respuestas serán leídas en voz alta — suena natural
7. Si el estudiante va bien en un tema, dilo. Si va mal, sé directo pero motivador
8. Usa el nombre del estudiante ocasionalmente y naturalmente, no en cada respuesta

CONTEXTO DEL ESTUDIANTE:
- La información abajo incluye su progreso, temas débiles y cómo aprende mejor
- Adapta tu tono y profundidad a SU nivel, no a un nivel genérico
- Si viene frustrado, sé más motivador. Si viene confundido, sé más claro.
- NO repitas conceptos que ya domina — enfócate en lo que necesita

IMPORTANTE:
- Responde en 30-60 segundos de lectura, no más
- No des respuestas largas aunque parezca incompleta — el estudiante puede preguntar más
- Sé el asistente que los estudiantes necesitan, no el que les da todo masticado`;

const PROMPT_VALERIO_DOCENTE_EN = `You are Valerio, the AI coach from Edutechlife.

IDENTITY:
- Expert AI coach with 10+ years of experience
- Personal tutor — warm, approachable, motivating
- Natural conversational English

PERSONALITY AND TONE:
- Direct, concise, no filler
- Explain in maximum 2-3 simple sentences
- Practical examples right away
- Efficient and warm: say what matters, don't pad
- Celebrate wins genuinely

KEY RESPONSE RULES:
1. Maximum 2-3 short paragraphs per response
2. One main idea per message
3. Mention specific module resources if relevant
4. If unsure, say "I don't have that info, check the material"
5. Natural language, no special formatting: no asterisks, dashes, quotes
6. Your responses will be read aloud — sound natural
7. If the student excels at something, acknowledge it. If struggling, be direct but motivating
8. Use student's name occasionally and naturally, not in every response

STUDENT CONTEXT:
- Information below includes their progress, weak areas, and learning style
- Adapt your depth and tone to THEIR level, not generic
- If frustrated, be more motivating. If confused, be clearer
- Do NOT repeat concepts they already know — focus on what they need

IMPORTANT:
- Answer in 30-60 seconds of reading, no more
- Don't give long answers even if it feels incomplete — they can ask follow-up questions
- Be the coach they need, not the one giving everything pre-chewed`;

/**
 * Build Valerio's system prompt with personalized academic context
 * @param {Object} params - Configuration object
 * @param {string} params.locale - Language (es/en)
 * @param {Object} params.currentModule - Current module object
 * @param {Array} params.modules - All modules
 * @param {string} params.studentName - Student name
 * @param {number} params.userLevel - User level (1-10)
 * @param {Array} params.completedModules - Completed module IDs
 * @param {Function} params.t - Translation function
 * @param {Object} params.currentLesson - Current lesson
 * @param {Object} [params.supabaseClient] - Supabase client for academic memory
 * @param {string} [params.userId] - User ID for academic memory
 * @returns {Promise<string>} System prompt with personalization
 */
export const buildValerioSystemPrompt = async ({
  locale,
  currentModule,
  modules,
  studentName,
  userLevel,
  completedModules,
  t,
  currentLesson,
  supabaseClient = null,
  userId = null,
}) => {
  const isEn = locale === "en";
  const store = useIALabStore.getState();
  const currentModuleId = currentModule?.id || 1;
  const currentModuleData = COURSE_KNOWLEDGE.find(
    (m) => m.id === currentModuleId,
  );
  const moduleContent = currentModuleData
    ? JSON.stringify(currentModuleData, null, 2)
    : isEn
      ? "No module information available."
      : "No hay información del módulo disponible.";

  const prompt = isEn ? PROMPT_VALERIO_DOCENTE_EN : PROMPT_VALERIO_DOCENTE_ES;

  const moduleScores = [];
  for (let i = 1; i <= 5; i++) {
    const score = store.calculateModuleScore(i);
    const modInfo = modules.find((m) => m.id === i);
    moduleScores.push(`${modInfo?.title || `Module ${i}`}: ${score}%`);
  }

  const weakTopicsByModule = analyzeQuizFailures(store.storageGet);
  const weakTopicsStr =
    Object.entries(weakTopicsByModule)
      .map(([modId, topics]) => {
        const modInfo = modules.find((m) => m.id === Number(modId));
        const topicsStr = Object.entries(topics)
          .map(
            ([topic, count]) => `${topic} (${count} ${t("valerio.failures")})`,
          )
          .join(", ");
        return `${modInfo?.title || `Module ${modId}`}: ${topicsStr}`;
      })
      .join("\n") || t("valerio.none_identified");

  const lastActivityStr = store.lastActivityDate
    ? new Date(store.lastActivityDate).toLocaleDateString(
        isEn ? "en-US" : "es-CO",
        { year: "numeric", month: "short", day: "numeric" },
      )
    : t("valerio.no_activity");

  const weeklyXP = store.getWeeklyXP();

  const streakStatus =
    store.streak > 0
      ? `${store.streak} ${t("valerio.days")}${store.isStreakAtRisk() ? ` (${t("valerio.at_risk")})` : " ✅"}`
      : t("valerio.no_streak");

  const sessionContext = injectSessionContext();
  const sessionStr = sessionContext
    ? `\n\n## ${t("valerio.session_history") || "Sesiones anteriores"}:\n${sessionContext}`
    : "";

  const lessonStr = currentLesson?.lessonId
    ? `\n\n## ${isEn ? "Current Lesson" : "Lección Actual"}:
${isEn ? "Lesson ID" : "ID de Lección"}: ${currentLesson.lessonId}
${isEn ? "The student is currently viewing this lesson. Use this context to provide targeted help." : "El estudiante está viendo esta lección actualmente. Usa este contexto para brindar ayuda específica."}`
    : "";

  // Integrate academic memory for deeper personalization
  let academicContextStr = "";
  if (supabaseClient && userId) {
    try {
      const academicMemory = new ValerioAcademicMemory(supabaseClient, userId);
      const academicProfile = await academicMemory.buildPersonalizedContext();

      if (academicProfile.hasHistory) {
        academicContextStr = `\n\n## ${isEn ? "Learning Profile" : "Perfil de Aprendizaje"}:
${academicProfile.instruction}`;
      }
    } catch (err) {
      console.warn("[valerioPrompts] Failed to load academic memory:", err.message);
      // Fall back to session-only context if academic memory fails
    }
  }

  return `${prompt}${sessionStr}${academicContextStr}

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
${weakTopicsStr}${lessonStr}`;
};

import { searchKnowledgeBase } from "../../../data/valerioKnowledgeBase";
import { smartFallback } from "../../../hooks/IALab/useValerioFallback";

export const generateFallbackResponse = (
  inputText,
  locale,
  { currentModule, userLevel },
) => {
  const kbResult = searchKnowledgeBase(inputText, locale);
  if (kbResult) return kbResult.answer;

  return smartFallback(inputText, locale, { currentModule, userLevel });
};

export const buildContextualWelcome = ({
  locale,
  studentName,
  currentModule,
  userLevel,
  activeMod,
}) => {
  const isEn = locale === "en";
  const store = useIALabStore.getState();
  const name = studentName || (isEn ? "Student" : "Estudiante");
  const moduleTitle =
    currentModule?.title || (isEn ? "this module" : "este módulo");
  const levelLabel =
    userLevel < 3
      ? isEn
        ? "beginner"
        : "principiante"
      : userLevel < 6
        ? isEn
          ? "intermediate"
          : "intermedio"
        : isEn
          ? "advanced"
          : "avanzado";

  const modScore = store.calculateModuleScore(activeMod);
  const isModComplete = modScore >= 80;
  const overallPct = store.courseProgress;
  const streakNum = store.streak;
  const atRisk = store.isStreakAtRisk();

  const daysSinceLast = store.lastActivityDate
    ? Math.floor(
        (Date.now() - new Date(store.lastActivityDate).getTime()) / 86400000,
      )
    : null;

  if (isEn) {
    if (daysSinceLast !== null && daysSinceLast >= 3) {
      return `Welcome back, ${name}! It's been ${daysSinceLast} days — great to see you again. You're working on "${moduleTitle}" at ${levelLabel} level. Need a refresher or want to keep moving forward?`;
    }
    if (streakNum > 0 && atRisk) {
      return `Hey ${name}! Your ${streakNum}-day streak is at risk today. How about one quick activity to keep it going? You're in "${moduleTitle}" at ${levelLabel} level — let's do this!`;
    }
    if (streakNum >= 5) {
      return `Wow, ${streakNum} days in a row, ${name}! Your consistency is amazing. You're making great progress in "${moduleTitle}" (${levelLabel} level). What would you like to work on today?`;
    }
    if (isModComplete && overallPct < 100) {
      const recModule = store.getDailyRoute()?.nextModule;
      return `Awesome, ${name}! You aced this module 🎉. Overall you're at ${overallPct}% of the course. ${recModule ? `Ready to jump into "${recModule.title}"?` : "Ready for the next challenge?"} Ask me anything!`;
    }
    if (overallPct >= 80) {
      return `You're almost there, ${name}! ${overallPct}% complete — just the final stretch left. Keep pushing, and let me know if you need help with anything!`;
    }
    return `Hello${studentName ? ", " + studentName : ""}! I'm Valerio, your coach. I see you're in "${moduleTitle}" — great topic! You're at ${levelLabel} level, and we'll explore it together. Ask me anything: explain a topic, give you an example, or help you with the challenge. Where would you like to start?`;
  }

  if (daysSinceLast !== null && daysSinceLast >= 3) {
    return `¡Bienvenido de vuelta, ${name}! Hacía ${daysSinceLast} días — qué gusto verte de nuevo. Estás en "${moduleTitle}" nivel ${levelLabel}. ¿Necesitas un repaso o quieres seguir avanzando?`;
  }
  if (streakNum > 0 && atRisk) {
    return `¡Oye ${name}! Tu racha de ${streakNum} días está en riesgo hoy. ¿Qué tal una actividad rápida para mantenerla? Estás en "${moduleTitle}" nivel ${levelLabel} — ¡vamos!`;
  }
  if (streakNum >= 5) {
    return `¡${streakNum} días seguidos, ${name}! Tu constancia es increíble. Vas muy bien en "${moduleTitle}" (nivel ${levelLabel}). ¿En qué te gustaría trabajar hoy?`;
  }
  if (isModComplete && overallPct < 100) {
    const recModule = store.getDailyRoute()?.nextModule;
    return `¡${name}, dominaste este módulo! 🎉 Llevas ${overallPct}% del curso. ${recModule ? `¿Listo para saltar a "${recModule.title}"?` : "¿Listo para el siguiente reto?"} ¡Pregúntame lo que quieras!`;
  }
  if (overallPct >= 80) {
    return `Ya casi terminas, ${name}! ${overallPct}% completado — solo queda el empujón final. ¡Sigue así y cuéntame si necesitas ayuda con algo!`;
  }
  return `¡Hola${studentName ? ", " + studentName : ""}! Soy Valerio, tu coach. Veo que estás en "${moduleTitle}" — ¡qué tema tan interesante! Estás en nivel ${levelLabel}, y lo exploraremos juntos. Pregúntame lo que quieras: explicarte un tema, darte un ejemplo, o ayudarte con el desafío. ¿Por dónde te gustaría empezar?`;
};
