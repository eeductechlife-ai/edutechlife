/**
 * DaniOrchestrator — assembles full student context from DB and builds
 * the system prompt for Dani's pedagogical AI interactions.
 *
 * Context loaded per request:
 *   - Student profile (grade, age, school, city, interests)
 *   - Competency mastery by subject
 *   - Active learning plan
 *   - Dani memory (topics, mood, communication style)
 *   - Today's schedule (current/next class, exams)
 */
const { createClient } = require("@supabase/supabase-js");
const { getAgePolicy } = require("./aiSafetyGateway");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const PEDAGOGICAL_CYCLE = `
## CICLO PEDAGÓGICO DE DANI
Sigue este ciclo en cada interacción académica:
1. PREGUNTA — Haz una pregunta diagnóstica para entender qué sabe el estudiante
2. PISTA — Si no sabe, da una pista, no la respuesta directa
3. EXPLICACIÓN — Explica el concepto con claridad y lenguaje apropiado a la edad
4. EJEMPLO — Usa un ejemplo concreto del mundo real del estudiante
5. VERIFICACIÓN — Haz una pregunta corta para confirmar comprensión
6. RETROALIMENTACIÓN — Celebra el avance, señala el siguiente paso

⚠️ NUNCA des la respuesta directa a un ejercicio. Guía con preguntas.
⚠️ Si detectas dependencia excesiva (el estudiante solo pide respuestas), di: "Vamos a pensarlo juntos, ¿qué crees tú primero?"
`;

const SOCRATIC_ADDENDUM = `
## MODO SOCRÁTICO ACTIVADO
Responde SOLO con preguntas. Nunca afirmes la respuesta. Lleva al estudiante a descubrirla por sí mismo.
`;

async function fetchStudentProfile(studentId) {
  const { data } = await supabase
    .from("students")
    .select("id, grade_level, country_code, school_name, age, name")
    .eq("id", studentId)
    .maybeSingle();
  return data;
}

async function fetchMastery(studentId) {
  const { data } = await supabase
    .from("student_competency_mastery")
    .select("competency_id, mastery_score, last_updated")
    .eq("student_id", studentId)
    .order("mastery_score", { ascending: true })
    .limit(30);
  return data || [];
}

async function fetchDaniMemory(studentId) {
  const { data } = await supabase
    .from("dani_memory")
    .select("memory_data")
    .eq("student_id", studentId)
    .maybeSingle();
  return data?.memory_data || null;
}

async function fetchActivePlan(studentId) {
  const { data } = await supabase
    .from("learning_plans")
    .select("type, plan_data, created_at")
    .eq("student_id", studentId)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();
  return data;
}

async function fetchTodaySchedule(studentId) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const { data } = await supabase
    .from("schedule_slots")
    .select("subject, start_time, end_time, teacher")
    .eq("student_id", studentId)
    .eq("day_of_week", today)
    .order("start_time");
  return data || [];
}

/**
 * Load all student context in parallel from DB.
 * Non-blocking: each failure returns null/[] gracefully.
 */
async function loadStudentContext(studentId) {
  const [profile, mastery, memory, activePlan, todaySchedule] = await Promise.allSettled([
    fetchStudentProfile(studentId),
    fetchMastery(studentId),
    fetchDaniMemory(studentId),
    fetchActivePlan(studentId),
    fetchTodaySchedule(studentId),
  ]);

  return {
    profile: profile.status === "fulfilled" ? profile.value : null,
    mastery: mastery.status === "fulfilled" ? mastery.value : [],
    memory: memory.status === "fulfilled" ? memory.value : null,
    activePlan: activePlan.status === "fulfilled" ? activePlan.value : null,
    todaySchedule: todaySchedule.status === "fulfilled" ? todaySchedule.value : [],
  };
}

/**
 * Build the Dani system prompt from orchestrated context.
 */
function buildSystemPrompt(ctx, opts = {}) {
  const { profile, mastery, memory, activePlan, todaySchedule } = ctx;
  const { socraticMode = false, documentContext = null } = opts;

  const grade = profile?.grade_level || "desconocido";
  const age = profile?.age || null;
  const name = profile?.name || "estudiante";
  const school = profile?.school_name || "";
  const commStyle = memory?.studentProfile?.communicationStyle || "neutral";
  const interests = memory?.studentProfile?.interests || [];
  const recentTopics = memory?.recentTopics || [];
  const studentMood = memory?.studentProfile?.studentMood || "";

  // Base identity
  let prompt = `Eres Dani, tutora virtual de EdutechLife. Eres amigable, paciente y pedagógica.
Estudiante: ${name} | Grado: ${grade}${school ? ` | Colegio: ${school}` : ""}
`;

  // Age policy
  if (age) prompt += getAgePolicy(age);

  // Communication style adaptation
  if (commStyle === "shy") {
    prompt += "\n\n## ESTILO\nEste estudiante es reservado. Usa preguntas abiertas, celebra cada intento.";
  } else if (commStyle === "direct") {
    prompt += "\n\n## ESTILO\nEste estudiante es directo. Ve al grano, respuestas concisas.";
  } else if (commStyle === "playful") {
    prompt += "\n\n## ESTILO\nEste estudiante es juguetón. Usa emojis, mantén tono alegre.";
  } else if (commStyle === "curious") {
    prompt += "\n\n## ESTILO\nEste estudiante es curioso. Ofrece datos interesantes, invita a explorar.";
  }

  // Interests
  if (interests.length > 0) {
    prompt += `\n\n## INTERESES DEL ESTUDIANTE\n${interests.join(", ")} — úsalos como ejemplos cuando sea relevante.`;
  }

  // Mastery summary (weakest subjects)
  if (mastery.length > 0) {
    const weak = mastery.filter((m) => m.mastery_score < 0.5).slice(0, 3);
    if (weak.length > 0) {
      const weakSubjects = weak
        .map((m) => m.competency_id.split("_").slice(1, 2).join(""))
        .join(", ");
      prompt += `\n\n## ÁREAS DE REFUERZO PRIORITARIAS\n${weakSubjects} — necesitan más práctica.`;
    }
  }

  // Recent topics from memory
  if (recentTopics.length > 0) {
    prompt += `\n\n## TEMAS RECIENTES\n${recentTopics.slice(0, 5).join(", ")}`;
  }

  // Emotional state from memory
  if (studentMood === "frustrated") {
    prompt += "\n\n## ESTADO EMOCIONAL\nEl estudiante ha mostrado frustración recientemente. Sé extra paciente y motivadora.";
  }

  // Active learning plan summary
  if (activePlan?.plan_data) {
    const plan = activePlan.plan_data;
    const todayActivities = Array.isArray(plan.activities)
      ? plan.activities.slice(0, 2).map((a) => a.label || a.subject).join(", ")
      : "";
    if (todayActivities) {
      prompt += `\n\n## PLAN DE HOY\nActividades: ${todayActivities}`;
    }
  }

  // Schedule
  if (todaySchedule.length > 0) {
    const scheduleText = todaySchedule
      .map((s) => `${s.subject} (${s.start_time}–${s.end_time})`)
      .join(", ");
    prompt += `\n\n## HORARIO DE HOY\n${scheduleText}`;
  }

  // Document context (ephemeral, sent from frontend)
  if (documentContext) {
    prompt += `\n\n## DOCUMENTO DEL ESTUDIANTE\nTítulo: ${documentContext.title || "Documento"}\nMateria: ${documentContext.subject || "General"}\nResumen: ${documentContext.summary || ""}\nFortalezas: ${(documentContext.strengths || []).join(", ")}\nMejoras: ${(documentContext.improvements || []).join(", ")}\nPuntuación: ${documentContext.score || "N/A"}/100\n\nIMPORTANTE: El estudiante acaba de subir este documento. Guía la tutoría basándote en él.`;
  }

  // Pedagogical cycle (always)
  prompt += PEDAGOGICAL_CYCLE;

  // Socratic mode override
  if (socraticMode) {
    prompt += SOCRATIC_ADDENDUM;
  }

  return prompt;
}

module.exports = { loadStudentContext, buildSystemPrompt };
