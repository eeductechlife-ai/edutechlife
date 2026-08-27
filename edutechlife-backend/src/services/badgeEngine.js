/**
 * BadgeEngine — checks criteria and unlocks badges for students.
 *
 * Reads: badges catalog, student_competency_mastery, learning_streaks, student_missions
 * Writes: student_badges (insert on unlock)
 */
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function getStudentData(studentId) {
  const [masteryRes, streakRes, missionsRes, badgesRes] = await Promise.allSettled([
    supabase
      .from("student_competency_mastery")
      .select("competency_id, mastery_score")
      .eq("student_id", studentId),
    supabase
      .from("learning_streaks")
      .select("current_streak, best_streak")
      .eq("student_id", studentId)
      .maybeSingle(),
    supabase
      .from("student_missions")
      .select("missions(criteria_json), completed")
      .eq("student_id", studentId)
      .eq("completed", true),
    supabase
      .from("student_badges")
      .select("badge_id")
      .eq("student_id", studentId),
  ]);

  return {
    mastery: masteryRes.status === "fulfilled" ? (masteryRes.value.data || []) : [],
    streak: streakRes.status === "fulfilled" ? streakRes.value.data : null,
    completedMissions: missionsRes.status === "fulfilled" ? (missionsRes.value.data || []) : [],
    unlockedBadgeIds: new Set(
      badgesRes.status === "fulfilled"
        ? (badgesRes.value.data || []).map((b) => b.badge_id)
        : [],
    ),
  };
}

/**
 * Check if a badge's criteria are met given the student's data.
 */
function criteriaIsMet(criteria, { mastery, streak, completedMissions }) {
  if (!criteria || Object.keys(criteria).length === 0) return false;

  // Streak check
  if (criteria.streak_days) {
    const currentStreak = streak?.current_streak || 0;
    const bestStreak = streak?.best_streak || 0;
    if (Math.max(currentStreak, bestStreak) < criteria.streak_days) return false;
  }

  // Subject mastery check
  if (criteria.subject && criteria.min_mastery !== undefined) {
    const bySubject = mastery.filter((m) => m.competency_id.includes(criteria.subject));
    if (bySubject.length === 0) return false;
    const avg = bySubject.reduce((s, m) => s + m.mastery_score, 0) / bySubject.length;
    if (avg < criteria.min_mastery) return false;
  }

  // Activity count check (via completed missions)
  if (criteria.activity && criteria.count) {
    const relevant = completedMissions.filter(
      (m) => m.missions?.criteria_json?.activity === criteria.activity,
    );
    if (relevant.length < criteria.count) return false;
  }

  // Unique activities check
  if (criteria.unique_activities) {
    const types = new Set(
      completedMissions.map((m) => m.missions?.criteria_json?.activity).filter(Boolean),
    );
    if (types.size < criteria.unique_activities) return false;
  }

  return true;
}

/**
 * Run badge checks for a student. Unlocks any newly earned badges.
 * @returns {Array} newly unlocked badges
 */
async function checkAndUnlockBadges(studentId) {
  const [catalogRes, studentData] = await Promise.all([
    supabase.from("badges").select("id, key, name, icon, criteria_json").eq("is_active", true),
    getStudentData(studentId),
  ]);

  const catalog = catalogRes.data || [];
  const { unlockedBadgeIds } = studentData;
  const newlyUnlocked = [];

  for (const badge of catalog) {
    if (unlockedBadgeIds.has(badge.id)) continue; // Already unlocked

    const criteria = badge.criteria_json || {};
    if (criteriaIsMet(criteria, studentData)) {
      const { error } = await supabase.from("student_badges").insert({
        student_id: studentId,
        badge_id: badge.id,
        evidence_json: { checked_at: new Date().toISOString() },
      });
      if (!error) {
        newlyUnlocked.push({ key: badge.key, name: badge.name, icon: badge.icon });
      }
    }
  }

  return newlyUnlocked;
}

/**
 * Get all badges for a student (unlocked + locked catalog).
 */
async function getStudentBadges(studentId) {
  const [catalogRes, unlockedRes] = await Promise.allSettled([
    supabase.from("badges").select("id, key, name, description, icon").eq("is_active", true),
    supabase
      .from("student_badges")
      .select("badge_id, unlocked_at")
      .eq("student_id", studentId),
  ]);

  const catalog = catalogRes.status === "fulfilled" ? (catalogRes.value.data || []) : [];
  const unlocked = unlockedRes.status === "fulfilled" ? (unlockedRes.value.data || []) : [];
  const unlockedMap = new Map(unlocked.map((u) => [u.badge_id, u.unlocked_at]));

  return catalog.map((b) => ({
    ...b,
    unlocked: unlockedMap.has(b.id),
    unlockedAt: unlockedMap.get(b.id) || null,
  }));
}

module.exports = { checkAndUnlockBadges, getStudentBadges };
