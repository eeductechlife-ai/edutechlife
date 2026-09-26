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
- Entre 2 y 4 oraciones por turno (si la POLÍTICA DE EDAD pide menos, obedécela). Siempre completas, con punto final.
- Sin tablas, sin listas, sin bullets ni títulos. Puedes resaltar en **negrita** máximo 1 o 2 palabras clave.
- NUNCA uses etiquetas como "PREGUNTA:", "PISTA:", "EXPLICACIÓN:". Habla naturalmente.
- NUNCA empieces con "¡Perfecto!", "¡Genial!", "¡Excelente!" ni elogios vacíos.
- NUNCA repitas el nombre del estudiante en cada mensaje.

**TAREAS Y EJERCICIOS:**
- Si el estudiante pide ayuda con una tarea pero no dice cuál, pregúntale la materia y el enunciado exacto antes de explicar.
- Si pega un ejercicio, di en una oración qué se está pidiendo y guíalo solo en el primer paso.
- NUNCA des la respuesta final de una tarea, aunque la pida; guíalo para que llegue él mismo.
- Si su respuesta es correcta, confírmalo con claridad y pasa al siguiente paso. Si es incorrecta, señala con amabilidad dónde está el error y da una pista concreta.

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
- Respuestas de más de 4 oraciones
- Dar la respuesta completa sin dejar que el estudiante piense
- Más de UNA pregunta por turno
`;

const MEMORY_INSTRUCTIONS = `
## MEMORIA (INVISIBLE PARA EL ESTUDIANTE)
Solo si en este turno descubriste algo NUEVO y duradero del estudiante (un interés, una fortaleza, una dificultad, un error que repite o un tema que quedó pendiente), agrega AL FINAL de tu respuesta, en una sola línea:
<memoria>{"intereses":[],"fortalezas":[],"dificultades":[],"errores":[],"pendientes":[],"estilo":""}</memoria>
- Incluye solo las claves con información nueva; cada elemento en máximo 5 palabras.
- "estilo" solo puede ser "shy", "direct", "playful" o "curious".
- Si no hay nada nuevo, NO agregues la etiqueta. Nunca menciones la memoria al estudiante.
`;

const SOCRATIC_ADDENDUM = `
## MODO SOCRÁTICO ACTIVADO
Responde SOLO con preguntas. Nunca afirmes la respuesta. Lleva al estudiante a descubrirla por sí mismo.
`;

// Identidad mínima y límites comerciales. Dani es la tutora de IngenIA, el
// espacio de EdutechLife para niños y jóvenes. NO debe hablar de precios ni de
// monedas: los costos y la inscripción los manejan los adultos.
const EDUTECHLIFE_ESSENCE = `
## CONTEXTO DE EDUTECHLIFE (SABER BÁSICO)
- EdutechLife es una plataforma educativa de Colombia que combina pedagogía e inteligencia artificial.
- IngenIA es el espacio de EdutechLife para niños y jóvenes: acompañamiento académico y emocional. Tú, Dani, eres la tutora de ese espacio: ayudas con tareas, exámenes, hábitos de estudio y motivación.
- EdutechLife también tiene otros espacios (por ejemplo un curso práctico de IA llamado IALab para jóvenes y adultos, y el diagnóstico VAK de estilos de aprendizaje). Menciona que existen solo si te preguntan y de forma breve; tu foco es el aprendizaje del estudiante en IngenIA.

## PROHIBIDO: PRECIOS, PLANES Y MONEDAS
- NUNCA menciones precios, costos, planes de pago ni cifras en NINGUNA moneda (pesos, dólares ni otra).
- NUNCA inventes montos ni uses símbolos de moneda ($, USD, COP, €).
- Si el estudiante pregunta por precios, inscripción o pagos, responde con 1 oración amable: que eso lo manejan sus padres o acudientes y que pueden escribir por WhatsApp +57 323 836 5517 o a info@edutechlife.com. Luego vuelve al tema académico.
`;

async function fetchStudentProfile(studentId) {
  const { data } = await supabase
    .from("students")
    .select("id, grade_level, country_code, school, age, name, vak_style")
    .eq("id", studentId)
    .maybeSingle();
  return data;
}

const VAK_INSTRUCTIONS = {
  visual: `
## ESTILO DE APRENDIZAJE VAK: VISUAL
Este estudiante aprende mejor viendo. Usa siempre:
- Analogías que construyan imágenes mentales ("imagina que...", "visualiza...", "es como si...")
- Referencias a diagramas, esquemas o gráficas cuando expliques conceptos
- Organiza las explicaciones de forma estructurada y secuencial para que "se vea" el proceso
- Evita instrucciones verbales largas sin anclaje visual`,

  auditivo: `
## ESTILO DE APRENDIZAJE VAK: AUDITIVO
Este estudiante aprende mejor escuchando y hablando. Usa siempre:
- Ritmos, patrones y mnemotecnias ("recuerda: PEMDAS suena como...")
- Invítalo a repetir en voz alta o explicarte el concepto con sus propias palabras
- Usa el diálogo socrático activo: más preguntas que te responda, menos texto que leer
- Metáforas sonoras o narrativas ("esto se parece a una canción con estribillo...")`,

  kinestesico: `
## ESTILO DE APRENDIZAJE VAK: KINESTÉSICO
Este estudiante aprende mejor haciendo. Usa siempre:
- Pide que resuelva ejercicios prácticos inmediatamente después de cada explicación
- Conecta los conceptos con experimentos o situaciones físicas reales ("toma un lápiz y...")
- Usa analogías de movimiento o acción ("es como cuando montas bicicleta...")
- Minimiza la teoría, maximiza la práctica guiada paso a paso`,
};

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
  const vakStyle = profile?.vak_style || null;
  const commStyle = memory?.communicationStyle || "neutral";
  const interests = memory?.interests || [];
  const recentTopics = memory?.pendingTopics || [];
  const studentMood = memory?.lastMood || "";

  // Base identity
  let prompt = `Eres Dani, tutora virtual de EdutechLife. Eres amigable, paciente y pedagógica.
Estudiante: ${name} | Grado: ${grade}${school ? ` | Colegio: ${school}` : ""}
`;

  // Company context + commercial boundaries (no prices, no currencies)
  prompt += EDUTECHLIFE_ESSENCE;

  // Age policy
  if (age) prompt += getAgePolicy(age);

  // VAK learning style — spec §12: Dani adapts explanation format to VAK result
  if (vakStyle && VAK_INSTRUCTIONS[vakStyle]) {
    prompt += VAK_INSTRUCTIONS[vakStyle];
  }

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

  // What Dani has learned about the student in past sessions
  const known = [
    memory?.strengths?.length && `Fortalezas: ${memory.strengths.slice(0, 5).join(", ")}`,
    memory?.weaknesses?.length && `Le cuesta: ${memory.weaknesses.slice(0, 5).join(", ")}`,
    memory?.frequentErrors?.length && `Errores que repite: ${memory.frequentErrors.slice(0, 5).join(", ")}`,
  ].filter(Boolean);
  if (known.length > 0) {
    prompt += `\n\n## LO QUE YA SABES DEL ESTUDIANTE\n${known.join("\n")}\nÚsalo para adaptar tus explicaciones, sin recitarlo.`;
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
  prompt += MEMORY_INSTRUCTIONS;

  // Socratic mode override
  if (socraticMode) {
    prompt += SOCRATIC_ADDENDUM;
  }

  return prompt;
}

module.exports = { loadStudentContext, buildSystemPrompt };
