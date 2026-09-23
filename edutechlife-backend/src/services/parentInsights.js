/**
 * Parent Intelligence — generates actionable insights for parents
 * from the normalized Learning Graph tables.
 *
 * Reads: students, student_competency_mastery, dani_memory, learning_plans
 * Returns: array of InsightCard { type, title, body, severity, actionLabel, actionHref }
 */
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY,
);

const SUBJECT_NAMES = {
  matematicas: "Matemáticas",
  lenguaje: "Lenguaje",
  ciencias_naturales: "Ciencias Naturales",
  ciencias_sociales: "Ciencias Sociales",
  ingles: "Inglés",
  tecnologia: "Tecnología",
};

async function loadInsightData(studentId) {
  const [profileRes, masteryRes, memoryRes, planRes, sessionsRes] = await Promise.allSettled([
    supabase
      .from("students")
      .select("grade_level, name, age, created_at")
      .eq("id", studentId)
      .maybeSingle(),
    supabase
      .from("student_competency_mastery")
      .select("competency_id, mastery_level, practice_count, updated_at")
      .eq("student_id", studentId)
      .order("updated_at", { ascending: false })
      .limit(50),
    supabase
      .from("dani_memory")
      .select("communication_style, strengths, weaknesses, interests, frequent_errors, pending_topics, last_mood")
      .eq("student_id", studentId)
      .maybeSingle(),
    supabase
      .from("learning_plans")
      .select("type, plan_json, generated_at")
      .eq("student_id", studentId)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("sessions")
      .select("created_at, duration_minutes, subject")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return {
    profile: profileRes.status === "fulfilled" ? profileRes.value.data : null,
    mastery: masteryRes.status === "fulfilled" ? (masteryRes.value.data || []) : [],
    memory: memoryRes.status === "fulfilled"
      ? (memoryRes.value.data
          ? {
              communicationStyle: memoryRes.value.data.communication_style,
              strengths: memoryRes.value.data.strengths || [],
              weaknesses: memoryRes.value.data.weaknesses || [],
              interests: memoryRes.value.data.interests || [],
              frequentErrors: memoryRes.value.data.frequent_errors || [],
              pendingTopics: memoryRes.value.data.pending_topics || [],
              lastMood: memoryRes.value.data.last_mood,
            }
          : null)
      : null,
    plan: planRes.status === "fulfilled" ? planRes.value.data : null,
    sessions: sessionsRes.status === "fulfilled" ? (sessionsRes.value.data || []) : [],
  };
}

/**
 * Extract subject from competency ID (format: co_subject_graderange_index)
 */
function subjectFromCompetencyId(id) {
  const parts = id.split("_");
  return parts.length >= 2 ? parts.slice(1, -2).join("_") : null;
}

/**
 * Aggregate mastery scores by subject.
 * Returns { subject: avgMastery }
 */
function aggregateMasteryBySubject(masteryRows) {
  const bySubject = {};
  for (const row of masteryRows) {
    const subj = subjectFromCompetencyId(row.competency_id);
    if (!subj) continue;
    if (!bySubject[subj]) bySubject[subj] = { sum: 0, count: 0 };
    bySubject[subj].sum += row.mastery_level;
    bySubject[subj].count++;
  }
  const result = {};
  for (const [subj, { sum, count }] of Object.entries(bySubject)) {
    result[subj] = sum / count;
  }
  return result;
}

/**
 * Compute days since a date string.
 */
function daysSince(dateStr) {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

/**
 * Build an insight following the mandatory spec format:
 * WHAT → WHY → ACTION → EVIDENCE
 */
function buildInsight({ type, title, severity, what, why, action, evidence, actionLabel }) {
  return {
    type,
    title,
    severity,
    // Structured fields for consumers that render each section separately
    what,
    why,
    action,
    evidence,
    // body kept for backward compatibility with consumers that use a single string
    body: `${what} ${why} ${action}`.trim(),
    actionLabel: actionLabel || "Ver detalle",
  };
}

/**
 * Generate 3-5 parent insights from normalized data.
 * Each insight follows the spec-mandated WHAT→WHY→ACTION→EVIDENCE format.
 * @returns {Array<Insight>}
 */
async function generateParentInsights(studentId) {
  const data = await loadInsightData(studentId);
  const { profile, mastery, memory, plan, sessions } = data;
  const insights = [];

  const name = profile?.name || "Tu hijo(a)";
  const masteryBySubject = aggregateMasteryBySubject(mastery);
  const subjects = Object.keys(masteryBySubject);

  // 1. PROGRESS — best subject with mastery ≥ 60%
  if (subjects.length > 0) {
    const bestSubj = subjects.reduce((a, b) =>
      masteryBySubject[a] >= masteryBySubject[b] ? a : b,
    );
    const bestScore = masteryBySubject[bestSubj];
    const subjectName = SUBJECT_NAMES[bestSubj] || bestSubj;
    if (bestScore >= 0.6) {
      insights.push(buildInsight({
        type: "progress",
        title: `Buen avance en ${subjectName}`,
        severity: "success",
        what: `${name} domina el ${Math.round(bestScore * 100)}% de ${subjectName}.`,
        why: "Un dominio por encima del 60% indica que está consolidando los conceptos clave de esta materia.",
        action: "Celebra su progreso y anímalo(a) a mantener el ritmo con sesiones cortas de práctica.",
        evidence: `Promedio de dominio sobre ${mastery.filter(r => r.competency_id.includes(bestSubj)).length} competencias evaluadas en ${subjectName}.`,
        actionLabel: "Ver detalle de progreso",
      }));
    }
  }

  // 2. RISK — weakest subject below 40%
  const weakSubjects = subjects
    .filter((s) => masteryBySubject[s] < 0.4)
    .sort((a, b) => masteryBySubject[a] - masteryBySubject[b]);

  if (weakSubjects.length > 0) {
    const weakest = weakSubjects[0];
    const weakScore = masteryBySubject[weakest];
    const subjectName = SUBJECT_NAMES[weakest] || weakest;
    insights.push(buildInsight({
      type: "risk",
      title: `Área que necesita refuerzo: ${subjectName}`,
      severity: "warning",
      what: `${name} tiene un dominio del ${Math.round(weakScore * 100)}% en ${subjectName}, por debajo del nivel esperado.`,
      why: "Un dominio menor al 40% indica que existen conceptos base que aún no están consolidados y pueden dificultar temas futuros.",
      action: "Agenda 10 minutos diarios de práctica guiada con Dani en esta materia. La constancia supera a la intensidad.",
      evidence: `Datos de ${mastery.filter(r => r.competency_id.includes(weakest)).length} competencias evaluadas en ${subjectName} en las últimas semanas.`,
      actionLabel: "Ver plan de mejora",
    }));
  }

  // 3. FOCUS — active learning plan
  if (plan?.plan_json) {
    const planData = plan.plan_json;
    const activities = Array.isArray(planData.activities) ? planData.activities : [];
    const focusSubject = activities[0]?.subject || planData.focusSubject || null;
    if (focusSubject) {
      const subjectName = SUBJECT_NAMES[focusSubject] || focusSubject;
      insights.push(buildInsight({
        type: "focus",
        title: `Plan activo: ${subjectName}`,
        severity: "info",
        what: `El plan de aprendizaje actual está enfocado en ${subjectName}${activities.length > 1 ? ` con ${activities.length} actividades programadas` : ""}.`,
        why: "SmartBoard priorizó esta materia según el estado actual de dominio y las necesidades de aprendizaje detectadas.",
        action: "Revisa el plan con tu hijo(a) para que sepa qué esperar esta semana y puedas acompañarlo(a).",
        evidence: `Plan generado el ${plan.generated_at ? new Date(plan.generated_at).toLocaleDateString("es-CO") : "recientemente"}.`,
        actionLabel: "Ver plan completo",
      }));
    }
  }

  // 4. ACTIVITY — session consistency
  if (sessions.length > 0) {
    const lastSession = sessions[0];
    const daysSinceLast = daysSince(lastSession.created_at);
    if (daysSinceLast !== null && daysSinceLast <= 1) {
      insights.push(buildInsight({
        type: "activity",
        title: "Hábito de estudio activo",
        severity: "success",
        what: `${name} tuvo una sesión de aprendizaje ${daysSinceLast === 0 ? "hoy" : "ayer"}.`,
        why: "La constancia diaria es el factor más importante para el aprendizaje duradero.",
        action: "Sigue apoyando este hábito: un recordatorio amable a la misma hora cada día ayuda a mantenerlo.",
        evidence: `Última sesión: ${new Date(lastSession.created_at).toLocaleDateString("es-CO")}${lastSession.duration_minutes ? `, duración ${lastSession.duration_minutes} min` : ""}.`,
        actionLabel: "Ver historial de sesiones",
      }));
    } else if (daysSinceLast !== null && daysSinceLast > 3) {
      insights.push(buildInsight({
        type: "activity",
        title: "Pausa prolongada detectada",
        severity: "warning",
        what: `${name} no ha tenido sesiones en los últimos ${daysSinceLast} días.`,
        why: "Las pausas prolongadas dificultan la retención y pueden generar brechas de conocimiento.",
        action: "Invítalo(a) a retomar con una actividad corta de 5-10 minutos hoy. Empezar es lo más difícil.",
        evidence: `Última sesión registrada: ${new Date(lastSession.created_at).toLocaleDateString("es-CO")}.`,
        actionLabel: "Ver actividades sugeridas",
      }));
    }
  }

  // 5. MOOD — emotional signal from Dani memory
  const studentMood = memory?.lastMood;
  if (studentMood === "frustrated") {
    insights.push(buildInsight({
      type: "mood",
      title: "Señal de frustración detectada",
      severity: "alert",
      what: `Dani registró indicios de frustración en las últimas interacciones de ${name}.`,
      why: "La frustración sostenida puede bloquear el aprendizaje si no se atiende a tiempo.",
      action: "Conversa con tu hijo(a) sobre cómo se siente con el material. Reducir temporalmente la dificultad puede ayudar.",
      evidence: "Señal registrada por Dani en las últimas sesiones de conversación (dato contextual, no diagnóstico clínico).",
      actionLabel: "Ver recomendaciones",
    }));
  }

  return insights.slice(0, 5);
}

/**
 * Build a Learning Graph summary for the weekly report.
 * Extends the blob-based summary with real mastery data.
 */
async function buildLearningGraphSummary(studentId) {
  const { mastery } = await loadInsightData(studentId);
  const bySubject = aggregateMasteryBySubject(mastery);

  return Object.entries(bySubject).map(([subject, avg]) => ({
    subject: SUBJECT_NAMES[subject] || subject,
    masteryPercent: Math.round(avg * 100),
    trend: avg >= 0.6 ? "up" : avg >= 0.4 ? "stable" : "down",
  }));
}

module.exports = {
  generateParentInsights,
  buildLearningGraphSummary,
  // Helpers puros (exportados para testing; sin comportamiento de producto)
  subjectFromCompetencyId,
  aggregateMasteryBySubject,
  daysSince,
};
