/**
 * Early Warning System — 5 detectors that surface academic risk signals.
 *
 * Reads: student_competency_mastery, learning_streaks, dani_memory, early_warnings
 * Writes: early_warnings (upsert — one unresolved warning per student+type)
 *
 * Detectors:
 *   1. inactivity        — streak.last_activity_date > N days ago
 *   2. performance_drop  — avg mastery decreased > 20% vs 7 days ago
 *   3. repeated_errors   — same subject mastery < 0.3 after ≥ 3 attempts
 *   4. low_completion    — (not yet: requires activity_log with started vs completed)
 *   5. streak_breaks     — current_streak = 0 AND total_days_active > 5
 */
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY,
);

const INACTIVITY_THRESHOLD_DAYS = 3;
const PERFORMANCE_DROP_THRESHOLD = 0.2; // 20% drop
const MASTERY_CRITICAL = 0.3;
const MIN_ATTEMPTS_FOR_REPETITIVE = 3;

function daysSince(dateStr) {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

async function detectInactivity(studentId) {
  const { data } = await supabase
    .from("learning_streaks")
    .select("last_activity_date, current_streak")
    .eq("student_id", studentId)
    .maybeSingle();

  if (!data) return null;

  const days = daysSince(data.last_activity_date);
  if (days === null || days < INACTIVITY_THRESHOLD_DAYS) return null;

  return {
    type: "inactivity",
    severity: days >= 7 ? "high" : "medium",
    evidence_json: { days_inactive: days, last_activity: data.last_activity_date },
    recommendation: `Han pasado ${days} días sin actividad. Recuerda a tu hijo(a) que Dani lo está esperando para continuar.`,
  };
}

async function detectPerformanceDrop(studentId) {
  const { data: rows } = await supabase
    .from("student_competency_mastery")
    .select("competency_id, mastery_level, updated_at")
    .eq("student_id", studentId)
    .order("updated_at", { ascending: false })
    .limit(60);

  if (!rows || rows.length === 0) return null;

  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  const recent = rows.filter((r) => new Date(r.updated_at).getTime() > now - oneWeek);
  const older = rows.filter((r) => new Date(r.updated_at).getTime() <= now - oneWeek);

  if (recent.length === 0 || older.length === 0) return null;

  const avgRecent = recent.reduce((s, r) => s + r.mastery_level, 0) / recent.length;
  const avgOlder = older.reduce((s, r) => s + r.mastery_level, 0) / older.length;

  if (avgOlder - avgRecent < PERFORMANCE_DROP_THRESHOLD) return null;

  return {
    type: "performance_drop",
    severity: avgOlder - avgRecent >= 0.35 ? "high" : "medium",
    evidence_json: {
      avg_this_week: Math.round(avgRecent * 100),
      avg_last_week: Math.round(avgOlder * 100),
      drop_percent: Math.round((avgOlder - avgRecent) * 100),
    },
    recommendation: "El rendimiento bajó esta semana. Revisa las actividades recientes con Dani para identificar los temas de dificultad.",
  };
}

async function detectRepeatedErrors(studentId) {
  const { data: rows } = await supabase
    .from("student_competency_mastery")
    .select("competency_id, mastery_level, practice_count")
    .eq("student_id", studentId);

  if (!rows || rows.length === 0) return null;

  // Find competencies with many attempts but still very low mastery
  const stuck = rows.filter(
    (r) => r.mastery_level < MASTERY_CRITICAL && (r.practice_count || 0) >= MIN_ATTEMPTS_FOR_REPETITIVE,
  );

  if (stuck.length === 0) return null;

  // Group by subject
  const subjects = [...new Set(stuck.map((r) => r.competency_id.split("_").slice(1, 2).join("")))];

  return {
    type: "repeated_errors",
    severity: stuck.length >= 3 ? "high" : "medium",
    evidence_json: {
      stuck_competencies: stuck.length,
      subjects: subjects.slice(0, 3),
    },
    recommendation: `Se detectaron ${stuck.length} competencias con errores repetidos en ${subjects.join(", ")}. Dani puede ayudar con un enfoque diferente.`,
  };
}

async function detectStreakBreaks(studentId) {
  const { data } = await supabase
    .from("learning_streaks")
    .select("current_streak, best_streak, total_days_active")
    .eq("student_id", studentId)
    .maybeSingle();

  if (!data || data.total_days_active < 5) return null; // Not enough history

  const isStreakBroken = data.current_streak === 0 && data.best_streak >= 3;
  if (!isStreakBroken) return null;

  return {
    type: "streak_breaks",
    severity: "low",
    evidence_json: {
      current_streak: data.current_streak,
      best_streak: data.best_streak,
      total_days: data.total_days_active,
    },
    recommendation: `La racha de estudio se rompió. Anima a ${data.total_days_active > 10 ? "retomar el ritmo" : "empezar una nueva racha"} con solo 5 minutos hoy.`,
  };
}

/**
 * Save a warning to DB, deduplicating by student_id+type (one active warning per type).
 */
async function saveWarning(studentId, warning) {
  // Resolve any existing warning of the same type first
  await supabase
    .from("early_warnings")
    .update({ resolved_at: new Date().toISOString() })
    .eq("student_id", studentId)
    .eq("type", warning.type)
    .is("resolved_at", null);

  // Insert the new warning
  const { error } = await supabase.from("early_warnings").insert({
    student_id: studentId,
    ...warning,
  });

  if (error) console.error(`[EarlyWarning] Insert failed for ${warning.type}:`, error.message);
}

/**
 * Run all detectors for a student and persist new warnings.
 * @returns {Array} active warnings (including previously unresolved)
 */
async function runAllDetectors(studentId) {
  const results = await Promise.allSettled([
    detectInactivity(studentId),
    detectPerformanceDrop(studentId),
    detectRepeatedErrors(studentId),
    detectStreakBreaks(studentId),
  ]);

  const newWarnings = results
    .filter((r) => r.status === "fulfilled" && r.value !== null)
    .map((r) => r.value);

  // Persist new warnings
  await Promise.allSettled(newWarnings.map((w) => saveWarning(studentId, w)));

  // Return all active (unresolved) warnings
  const { data: active } = await supabase
    .from("early_warnings")
    .select("id, type, severity, evidence_json, recommendation, created_at")
    .eq("student_id", studentId)
    .is("resolved_at", null)
    .order("created_at", { ascending: false })
    .limit(10);

  return active || [];
}

/**
 * Resolve a warning by ID.
 */
async function resolveWarning(warningId) {
  await supabase
    .from("early_warnings")
    .update({ resolved_at: new Date().toISOString() })
    .eq("id", warningId);
}

module.exports = { runAllDetectors, resolveWarning };
