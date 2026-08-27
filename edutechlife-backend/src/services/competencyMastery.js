const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const RANGE_MAP = {
  1: "1-3", 2: "1-3", 3: "1-3",
  4: "4-5", 5: "4-5",
  6: "6-7", 7: "6-7",
  8: "8-9", 9: "8-9",
  10: "10-11", 11: "10-11",
};

/**
 * Returns competency IDs relevant for a student's grade and subject.
 * @param {string} subject - e.g. 'matematicas'
 * @param {number} grade   - 1-11
 * @param {string} [countryCode]
 */
function getCompetencyIdsForSubject(subject, grade, countryCode = "CO") {
  const range = RANGE_MAP[grade] || "1-3";
  const prefix = `${countryCode.toLowerCase()}_${subject}_${range}_`;
  return [0, 1, 2, 3].map((i) => `${prefix}${i}`);
}

/**
 * Upserts a student's mastery level for one competency.
 *
 * Mastery is a weighted moving average:
 *   new_mastery = old_mastery * 0.7 + score * 0.3
 * This prevents single-session spikes from dominating the score.
 *
 * @param {string} studentId    - UUID from students table
 * @param {string} competencyId - e.g. 'co_matematicas_6-7_0'
 * @param {number} score        - 0.0 to 1.0 (normalized activity score)
 */
async function updateCompetencyMastery(studentId, competencyId, score) {
  if (!studentId || !competencyId) throw new Error("studentId and competencyId required");
  if (score < 0 || score > 1) throw new Error("score must be between 0 and 1");

  const { data: existing } = await supabase
    .from("student_competency_mastery")
    .select("mastery_level, practice_count")
    .eq("student_id", studentId)
    .eq("competency_id", competencyId)
    .maybeSingle();

  const prevMastery = existing?.mastery_level ?? 0;
  const prevCount = existing?.practice_count ?? 0;
  const newMastery = Math.min(1, prevMastery * 0.7 + score * 0.3);

  const { error } = await supabase.from("student_competency_mastery").upsert(
    {
      student_id: studentId,
      competency_id: competencyId,
      mastery_level: Math.round(newMastery * 1000) / 1000,
      last_score: Math.round(score * 1000) / 1000,
      practice_count: prevCount + 1,
      last_practiced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "student_id,competency_id" },
  );

  if (error) throw error;
  return { competencyId, mastery: newMastery, practiceCount: prevCount + 1 };
}

/**
 * Batch-update mastery for multiple competencies at once.
 * @param {string} studentId
 * @param {Array<{competencyId: string, score: number}>} entries
 */
async function batchUpdateMastery(studentId, entries) {
  const results = await Promise.all(
    entries.map(({ competencyId, score }) =>
      updateCompetencyMastery(studentId, competencyId, score).catch((e) => ({
        competencyId,
        error: e.message,
      })),
    ),
  );
  return results;
}

/**
 * Returns all mastery records for a student, optionally filtered by subject.
 * @param {string} studentId
 * @param {string} [subject]
 */
async function getStudentMastery(studentId, subject) {
  let query = supabase
    .from("student_competency_mastery")
    .select("competency_id, mastery_level, practice_count, last_practiced_at, last_score")
    .eq("student_id", studentId)
    .order("mastery_level", { ascending: false });

  if (subject) {
    query = query.like("competency_id", `co_${subject}_%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

module.exports = {
  updateCompetencyMastery,
  batchUpdateMastery,
  getStudentMastery,
  getCompetencyIdsForSubject,
};
