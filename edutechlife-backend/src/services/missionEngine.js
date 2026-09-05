/**
 * MissionEngine — generates and evaluates personalized daily/weekly missions.
 *
 * Reads: missions catalog, student_missions, student_competency_mastery, dani_memory
 * Writes: student_missions (upsert progress)
 */
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY,
);

/**
 * Get or generate active missions for a student.
 * Returns missions already assigned to the student, seeding from catalog if needed.
 */
async function getStudentMissions(studentId) {
  // Ensure student has 3-5 active missions (one daily, one weekly, some exploration)
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + (7 - now.getDay()));

  // Fetch current active missions
  const { data: existing } = await supabase
    .from("student_missions")
    .select(`
      id, progress, target, completed, expires_at,
      missions(key, type, title, description, icon, xp_reward, criteria_json)
    `)
    .eq("student_id", studentId)
    .eq("completed", false)
    .or(`expires_at.is.null,expires_at.gt.${now.toISOString()}`);

  if (existing && existing.length >= 2) {
    return existing.map(formatMission);
  }

  // Seed missing types
  const existingTypes = new Set((existing || []).map((m) => m.missions?.type));

  const toSeed = [];
  if (!existingTypes.has("daily")) toSeed.push({ type: "daily", expires: endOfDay.toISOString() });
  if (!existingTypes.has("weekly")) toSeed.push({ type: "weekly", expires: endOfWeek.toISOString() });
  if (!existingTypes.has("exploration") && toSeed.length < 2) {
    toSeed.push({ type: "exploration", expires: null });
  }

  for (const seed of toSeed) {
    const { data: catalogItem } = await supabase
      .from("missions")
      .select("id, xp_reward, criteria_json")
      .eq("type", seed.type)
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    if (catalogItem) {
      await supabase.from("student_missions").upsert({
        student_id: studentId,
        mission_id: catalogItem.id,
        progress: 0,
        target: catalogItem.criteria_json?.count || 1,
        completed: false,
        expires_at: seed.expires,
      }, { onConflict: "student_id,mission_id" });
    }
  }

  // Re-fetch after seeding
  const { data: refreshed } = await supabase
    .from("student_missions")
    .select(`
      id, progress, target, completed, expires_at,
      missions(key, type, title, description, icon, xp_reward, criteria_json)
    `)
    .eq("student_id", studentId)
    .eq("completed", false);

  return (refreshed || []).map(formatMission);
}

function formatMission(row) {
  const m = row.missions || {};
  return {
    id: row.id,
    key: m.key,
    type: m.type,
    title: m.title,
    description: m.description,
    icon: m.icon,
    xpReward: m.xp_reward,
    progress: row.progress,
    target: row.target,
    completed: row.completed,
    expiresAt: row.expires_at,
  };
}

/**
 * Record activity completion — advance mission progress.
 * @param {string} studentId
 * @param {string} activityType - matches criteria_json.activity
 * @param {object} meta - { subject?, score?, duration_minutes? }
 */
async function recordActivity(studentId, activityType, meta = {}) {
  // Fetch active missions that match this activity
  const { data: active } = await supabase
    .from("student_missions")
    .select("id, progress, target, missions(criteria_json, type)")
    .eq("student_id", studentId)
    .eq("completed", false);

  if (!active) return;

  const updates = [];
  for (const sm of active) {
    const criteria = sm.missions?.criteria_json || {};
    const matches =
      criteria.activity === activityType ||
      criteria.activity === "any" ||
      (!criteria.activity && activityType);

    if (matches) {
      const newProgress = Math.min(sm.progress + 1, sm.target);
      const isNowComplete = newProgress >= sm.target;
      updates.push(
        supabase.from("student_missions").update({
          progress: newProgress,
          completed: isNowComplete,
          completed_at: isNowComplete ? new Date().toISOString() : null,
        }).eq("id", sm.id),
      );
    }
  }

  await Promise.allSettled(updates);
}

module.exports = { getStudentMissions, recordActivity };
