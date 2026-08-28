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
  process.env.SUPABASE_SERVICE_ROLE_KEY,
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
      .select("competency_id, mastery_score, attempts, last_updated")
      .eq("student_id", studentId)
      .order("last_updated", { ascending: false })
      .limit(50),
    supabase
      .from("dani_memory")
      .select("memory_data")
      .eq("student_id", studentId)
      .maybeSingle(),
    supabase
      .from("learning_plans")
      .select("type, plan_data, created_at")
      .eq("student_id", studentId)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("activity_sessions")
      .select("completed_at, duration_seconds, subject")
      .eq("student_id", studentId)
      .order("completed_at", { ascending: false })
      .limit(20),
  ]);

  return {
    profile: profileRes.status === "fulfilled" ? profileRes.value.data : null,
    mastery: masteryRes.status === "fulfilled" ? (masteryRes.value.data || []) : [],
    memory: memoryRes.status === "fulfilled" ? memoryRes.value.data?.memory_data : null,
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
    bySubject[subj].sum += row.mastery_score;
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
 * Generate 3-5 parent insights from normalized data.
 * @returns {Array<{type, title, body, severity, actionLabel}>}
 */
async function generateParentInsights(studentId) {
  const data = await loadInsightData(studentId);
  const { profile, mastery, memory, plan, sessions } = data;
  const insights = [];

  const masteryBySubject = aggregateMasteryBySubject(mastery);
  const subjects = Object.keys(masteryBySubject);

  // 1. PROGRESS insight — best subject
  if (subjects.length > 0) {
    const bestSubj = subjects.reduce((a, b) =>
      masteryBySubject[a] >= masteryBySubject[b] ? a : b,
    );
    const bestScore = masteryBySubject[bestSubj];
    if (bestScore >= 0.6) {
      insights.push({
        type: "progress",
        title: `Avance en ${SUBJECT_NAMES[bestSubj] || bestSubj}`,
        body: `${profile?.name || "Tu hijo(a)"} tiene un dominio de ${Math.round(bestScore * 100)}% en ${SUBJECT_NAMES[bestSubj] || bestSubj}. ¡Sigue así!`,
        severity: "success",
        actionLabel: "Ver detalle",
      });
    }
  }

  // 2. RISK insight — weakest subject needing attention
  const weakSubjects = subjects
    .filter((s) => masteryBySubject[s] < 0.4)
    .sort((a, b) => masteryBySubject[a] - masteryBySubject[b]);

  if (weakSubjects.length > 0) {
    const weakest = weakSubjects[0];
    insights.push({
      type: "risk",
      title: `Refuerzo necesario en ${SUBJECT_NAMES[weakest] || weakest}`,
      body: `Dominio actual: ${Math.round(masteryBySubject[weakest] * 100)}%. Dani recomienda practicar con ejercicios cortos de 10 minutos al día.`,
      severity: "warning",
      actionLabel: "Ver plan de mejora",
    });
  }

  // 3. FOCUS insight — current learning plan
  if (plan?.plan_data) {
    const planData = plan.plan_data;
    const activities = Array.isArray(planData.activities) ? planData.activities : [];
    const focusSubject = activities[0]?.subject || planData.focusSubject || null;
    if (focusSubject) {
      insights.push({
        type: "focus",
        title: "Enfoque actual del plan",
        body: `El plan de esta semana está enfocado en ${SUBJECT_NAMES[focusSubject] || focusSubject}. ${activities.length > 1 ? `Incluye ${activities.length} actividades.` : ""}`,
        severity: "info",
        actionLabel: "Ver plan completo",
      });
    }
  }

  // 4. HABIT insight — session consistency
  if (sessions.length > 0) {
    const lastSession = sessions[0];
    const daysSinceLast = daysSince(lastSession.completed_at);
    if (daysSinceLast !== null && daysSinceLast <= 1) {
      insights.push({
        type: "habit",
        title: "Hábito de estudio activo",
        body: `${profile?.name || "Tu hijo(a)"} estudió ${daysSinceLast === 0 ? "hoy" : "ayer"}. Mantener la constancia es clave para el aprendizaje.`,
        severity: "success",
        actionLabel: "Ver historial",
      });
    } else if (daysSinceLast !== null && daysSinceLast > 3) {
      insights.push({
        type: "habit",
        title: "Pausa prolongada detectada",
        body: `Han pasado ${daysSinceLast} días desde la última sesión. Anima a ${profile?.name || "tu hijo(a)"} a volver hoy con una actividad corta.`,
        severity: "warning",
        actionLabel: "Ver actividades sugeridas",
      });
    }
  }

  // 5. EMOTIONAL insight — from Dani memory
  const studentMood = memory?.studentProfile?.studentMood;
  if (studentMood === "frustrated") {
    insights.push({
      type: "emotional",
      title: "Señal de frustración detectada",
      body: `Dani observó señales de frustración en las últimas sesiones. Puede ser útil conversar sobre el material o reducir la dificultad temporalmente.`,
      severity: "alert",
      actionLabel: "Ver recomendaciones",
    });
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

module.exports = { generateParentInsights, buildLearningGraphSummary };
