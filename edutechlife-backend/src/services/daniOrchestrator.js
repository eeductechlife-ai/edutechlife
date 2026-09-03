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
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY,
);

const PEDAGOGICAL_CYCLE = `
## REGLAS ESTRICTAS — SIGUE TODAS SIN EXCEPCIÓN

**FORMATO:**
- Exactamente 2-3 oraciones por turno. Siempre completas, con punto final.
- Sin tablas, sin listas, sin bullets, sin markdown.
- NUNCA uses etiquetas como "PREGUNTA:", "PISTA:", "EXPLICACIÓN:". Habla naturalmente.
- NUNCA empieces con "¡Perfecto!", "¡Genial!", "¡Excelente!" ni elogios vacíos.
- NUNCA repitas el nombre del estudiante en cada mensaje.

**PENSAMIENTO SECUENCIAL — UN PASO A LA VEZ:**
NO des la respuesta completa en un turno. Sigue este ciclo:
1. PASO 1: Explica el concepto más simple (1 oración).
2. PASO 2: Pide al estudiante que lo aplique (1 pregunta).
3. Espera que responda antes de pasar al PASO 3.
4. PASO 3: Refuerza con un ejemplo (1 oración).
5. PASO 4: Pregunta para verificar comprensión (1 pregunta).
Nunca aceleres — cada respuesta es UN solo paso.

**EJEMPLOS DE RESPUESTA BUENA:**
Estudiante: "no entiendo cómo sumar fracciones"
Dani: "Para sumar fracciones, los números de abajo (denominadores) deben ser iguales. Imagina que tienes media pizza y un cuarto de pizza, primero conviertes la mitad en dos cuartos para poder sumarlas. ¿Cuántos cuartos tendrías en total?"

Estudiante: "qué es fotosíntesis"
Dani: "La fotosíntesis es el proceso que usan las plantas para hacer su propio alimento usando luz solar, agua y CO2. Es como una fábrica solar dentro de cada hoja verde. ¿Qué crees que le pasaría a una planta si la pones en un cuarto sin luz?"

**PROHIBIDO:**
- Respuestas de más de 3 oraciones
- Dar la respuesta completa sin dejar que el estudiante piense
- Más de UNA pregunta por turno
`;

const SOCRATIC_ADDENDUM = `
## MODO SOCRÁTICO ACTIVADO
Responde SOLO con preguntas. Nunca afirmes la respuesta. Lleva al estudiante a descubrirla por sí mismo.
`;

async function fetchStudentProfile(studentId) {
  const { data } = await supabase
    .from("students")
    .select("id, grade_level, country_code, school, age, name")
    .eq("id", studentId)
    .maybeSingle();
  return data;
}

async function fetchMastery(studentId) {
  const { data } = await supabase
    .from("student_competency_mastery")
    .select("competency_id, mastery_level, updated_at")
    .eq("student_id", studentId)
    .order("mastery_level", { ascending: true })
    .limit(30);
  return data || [];
}

async function fetchDaniMemory(studentId) {
  const { data } = await supabase
    .from("dani_memory")
    .select("communication_style, strengths, weaknesses, interests, frequent_errors, pending_topics, last_mood")
    .eq("student_id", studentId)
    .maybeSingle();
  if (!data) return null;
  return {
    communicationStyle: data.communication_style,
    strengths: data.strengths || [],
    weaknesses: data.weaknesses || [],
    interests: data.interests || [],
    frequentErrors: data.frequent_errors || [],
    pendingTopics: data.pending_topics || [],
    lastMood: data.last_mood,
  };
}

async function fetchActivePlan(studentId) {
  const { data } = await supabase
    .from("learning_plans")
    .select("type, plan_json, generated_at")
    .eq("student_id", studentId)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();
  return data;
}

async function fetchTodaySchedule(studentId) {
  // day_of_week en timetable_slots: SMALLINT, Mon=1 … Sun=7
  const day = new Date().getDay(); // 0=Sun .. 6=Sat
  const dayOfWeek = day === 0 ? 7 : day;

  const { data: timetable } = await supabase
    .from("student_timetable")
    .select("id")
    .eq("student_id", studentId)
    .eq("is_active", true)
    .maybeSingle();
  if (!timetable?.id) return [];

  const { data } = await supabase
    .from("timetable_slots")
    .select("subject, subject_label, start_time, end_time, teacher")
    .eq("timetable_id", timetable.id)
    .eq("day_of_week", dayOfWeek)
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
  const school = profile?.school || "";
  const commStyle = memory?.communicationStyle || "neutral";
  const interests = memory?.interests || [];
  const recentTopics = memory?.pendingTopics || [];
  const studentMood = memory?.lastMood || "";

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
    const weak = mastery.filter((m) => m.mastery_level < 0.5).slice(0, 3);
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
  if (activePlan?.plan_json) {
    const plan = activePlan.plan_json;
    const todayActivities = Array.isArray(plan.activities)
      ? plan.activities.slice(0, 2).map((a) => a.label || a.subject).join(", ")
      : "";
    if (todayActivities) {
      prompt += `\n\n## PLAN DE HOY\nActividades: ${todayActivities}`;
    }
  }

  // Schedule — brief summary only, no tables
  if (todaySchedule.length > 0) {
    const subjects = [...new Set(todaySchedule.map((s) => s.subject_label || s.subject))].join(", ");
    prompt += `\n\n## CLASES DE HOY\n${subjects}. Úsalo solo si el estudiante pregunta por su horario.`;
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
