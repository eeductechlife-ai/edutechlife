const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// ── Data Access ───────────────────────────────────────────────────────────────

async function fetchStudentRow(studentId) {
  const { data } = await supabase
    .from("students")
    .select("id, grade_level, country_code, school_name, created_at")
    .eq("id", studentId)
    .maybeSingle();
  return data;
}

async function fetchMastery(studentId) {
  const { data } = await supabase
    .from("student_competency_mastery")
    .select("competency_id, mastery_level, practice_count, last_practiced_at")
    .eq("student_id", studentId);
  return data || [];
}

async function fetchRecentSessions(studentId, days = 14) {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data } = await supabase
    .from("sessions")
    .select("subject, duration, created_at")
    .eq("student_id", studentId)
    .gte("created_at", since)
    .order("created_at", { ascending: false });
  return data || [];
}

async function fetchStreak(studentId) {
  const { data } = await supabase
    .from("learning_streaks")
    .select("current_streak, longest_streak, last_activity_date")
    .eq("student_id", studentId)
    .maybeSingle();
  return data;
}

async function fetchGrades(studentId) {
  // Grades are not a table of their own — they live in `grade_analyses`
  // as a JSONB array (`grades: [{subject, score}]`) keyed by the auth user
  // id (`student_user_id`), not by `students.id`. Resolve the auth id first,
  // then read the most recent analysis.
  const { data: student } = await supabase
    .from("students")
    .select("auth_id")
    .eq("id", studentId)
    .maybeSingle();
  if (!student?.auth_id) return [];

  const { data } = await supabase
    .from("grade_analyses")
    .select("grades, created_at")
    .eq("student_user_id", student.auth_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const grades = Array.isArray(data?.grades) ? data.grades : [];
  return grades.map((g) => ({ subject: g.subject, grade: g.score }));
}

// ── Competency helpers ────────────────────────────────────────────────────────

const SUBJECT_MAP = {
  matematicas: "Matemáticas",
  lenguaje: "Lengua Castellana",
  ciencias_naturales: "Ciencias Naturales",
  ciencias_sociales: "Ciencias Sociales",
  ingles: "Inglés",
  tecnologia: "Tecnología e Informática",
};

function subjectFromCompetencyId(id) {
  // id format: co_matematicas_6-7_0
  const parts = id.split("_");
  // skip country prefix (parts[0] = 'co')
  // subject may be multi-word like ciencias_naturales
  const rangeIdx = parts.findIndex((p) => /^\d+-\d+$/.test(p));
  if (rangeIdx < 2) return null;
  return parts.slice(1, rangeIdx).join("_");
}

function groupMasteryBySubject(masteryRows) {
  const grouped = {};
  for (const row of masteryRows) {
    const subject = subjectFromCompetencyId(row.competency_id);
    if (!subject) continue;
    if (!grouped[subject]) grouped[subject] = [];
    grouped[subject].push(row.mastery_level);
  }
  const result = {};
  for (const [subj, levels] of Object.entries(grouped)) {
    result[subj] = levels.reduce((a, b) => a + b, 0) / levels.length;
  }
  return result;
}

// ── Core State ────────────────────────────────────────────────────────────────

/**
 * Builds the full student learning state used by all adaptive functions.
 * @param {string} studentId
 */
async function getStudentState(studentId) {
  const [student, masteryRows, sessions, streak, grades] = await Promise.all([
    fetchStudentRow(studentId),
    fetchMastery(studentId),
    fetchRecentSessions(studentId),
    fetchStreak(studentId),
    fetchGrades(studentId),
  ]);

  if (!student) throw new Error("Student not found");

  const masteryBySubject = groupMasteryBySubject(masteryRows);

  const gradeMap = {};
  for (const g of grades) gradeMap[g.subject] = g.grade;

  const activeDaysLast14 = new Set(
    sessions.map((s) => s.created_at?.slice(0, 10)),
  ).size;

  const avgSessionMin =
    sessions.length
      ? Math.round(sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length / 60)
      : 0;

  const strengths = detectStrengths(masteryBySubject, gradeMap);
  const weaknesses = detectWeaknesses(masteryBySubject, gradeMap);
  const risks = detectRisks({ activeDaysLast14, streak: streak?.current_streak || 0, weaknesses });

  return {
    studentId,
    grade: student.grade_level,
    countryCode: student.country_code || "CO",
    masteryBySubject,
    masteryRows,
    grades: gradeMap,
    strengths,
    weaknesses,
    risks,
    behavior: {
      activeDaysLast14,
      avgSessionMin,
      streak: streak?.current_streak || 0,
      longestStreak: streak?.longest_streak || 0,
    },
    rawSessions: sessions,
  };
}

// ── Analysis ──────────────────────────────────────────────────────────────────

function detectStrengths(masteryBySubject, gradeMap) {
  const subjects = new Set([
    ...Object.keys(masteryBySubject),
    ...Object.keys(gradeMap),
  ]);
  return [...subjects].filter((s) => {
    const m = masteryBySubject[s] ?? 0;
    const g = gradeMap[s];
    return m >= 0.7 || (g !== undefined && g >= 4.0);
  });
}

function detectWeaknesses(masteryBySubject, gradeMap) {
  const subjects = new Set([
    ...Object.keys(masteryBySubject),
    ...Object.keys(gradeMap),
  ]);
  return [...subjects].filter((s) => {
    const m = masteryBySubject[s] ?? 0;
    const g = gradeMap[s];
    return m < 0.4 || (g !== undefined && g < 3.5);
  });
}

function detectRisks({ activeDaysLast14, streak, weaknesses }) {
  const risks = [];
  if (activeDaysLast14 < 3)
    risks.push({ type: "low_activity", severity: "medium", label: "Poca actividad reciente" });
  if (streak === 0)
    risks.push({ type: "streak_broken", severity: "low", label: "Racha rota" });
  if (weaknesses.length >= 2)
    risks.push({
      type: "multiple_weak_subjects",
      severity: "medium",
      label: `Materias por reforzar: ${weaknesses.slice(0, 2).map((s) => SUBJECT_MAP[s] || s).join(", ")}`,
    });
  return risks;
}

// ── Recommendations ───────────────────────────────────────────────────────────

function generateRecommendations(state) {
  const recs = [];

  // Prioritize weaknesses
  for (const subj of state.weaknesses.slice(0, 2)) {
    recs.push({
      subject: subj,
      label: SUBJECT_MAP[subj] || subj,
      action: "practice",
      reason: `Tu nivel de dominio en ${SUBJECT_MAP[subj] || subj} está por debajo del 40%. Practicar ahora te ayudará a mejorar más rápido.`,
      difficulty: "easy",
      estimatedMinutes: 10,
    });
  }

  // Add a strength consolidation rec
  for (const subj of state.strengths.slice(0, 1)) {
    recs.push({
      subject: subj,
      label: SUBJECT_MAP[subj] || subj,
      action: "challenge",
      reason: `¡Vas muy bien en ${SUBJECT_MAP[subj] || subj}! Prueba un nivel más difícil para consolidar tu dominio.`,
      difficulty: "hard",
      estimatedMinutes: 15,
    });
  }

  // Streak recovery
  if (state.behavior.streak === 0) {
    recs.push({
      subject: state.weaknesses[0] || state.strengths[0] || "matematicas",
      label: "Recuperar racha",
      action: "quick",
      reason: "Completa una actividad corta hoy para volver a encender tu racha de estudio.",
      difficulty: "easy",
      estimatedMinutes: 5,
    });
  }

  return recs.slice(0, 4);
}

/**
 * Returns the single best next action for the student with an explanation.
 */
function getNextBestAction(state) {
  // Highest priority: a weak subject that needs immediate attention
  if (state.weaknesses.length > 0) {
    const subj = state.weaknesses[0];
    return {
      subject: subj,
      label: SUBJECT_MAP[subj] || subj,
      action: "practice",
      reason: `${SUBJECT_MAP[subj] || subj} necesita más atención. Practicar ahora tiene el mayor impacto en tu promedio.`,
      estimatedMinutes: 10,
      priority: "high",
    };
  }

  // Next: streak recovery
  if (state.behavior.streak === 0) {
    const subj = state.strengths[0] || "matematicas";
    return {
      subject: subj,
      label: SUBJECT_MAP[subj] || subj,
      action: "quick",
      reason: "No has estudiado hoy. Una actividad rápida reactiva tu racha.",
      estimatedMinutes: 5,
      priority: "medium",
    };
  }

  // Default: reinforce a strength
  const subj = state.strengths[0] || "matematicas";
  return {
    subject: subj,
    label: SUBJECT_MAP[subj] || subj,
    action: "challenge",
    reason: `Estás progresando bien en ${SUBJECT_MAP[subj] || subj}. Sube el nivel para mantener el impulso.`,
    estimatedMinutes: 15,
    priority: "low",
  };
}

// ── Plan Generation ───────────────────────────────────────────────────────────

const ACTIVITY_TEMPLATES = {
  practice: (subj, label, mins) => ({
    type: "flashcards",
    subject: subj,
    label,
    description: `Repasa conceptos clave de ${label}`,
    estimatedMinutes: mins,
    difficulty: "medium",
    tab: "flashcards",
  }),
  oral: (subj, label, mins) => ({
    type: "oral_exam",
    subject: subj,
    label,
    description: `Examen oral de ${label} con Dani`,
    estimatedMinutes: mins,
    difficulty: "medium",
    tab: "oral",
  }),
  challenge: (subj, label, mins) => ({
    type: "exam_prep",
    subject: subj,
    label,
    description: `Prepárate para el examen de ${label}`,
    estimatedMinutes: mins,
    difficulty: "hard",
    tab: "examen",
  }),
};

/**
 * Generates a daily plan adapted to available time (5 / 10 / 20 / 30 min).
 * @param {object} state
 * @param {number} availableMinutes
 */
function generateDailyPlan(state, availableMinutes = 20) {
  const activities = [];
  let budget = availableMinutes;

  const recs = generateRecommendations(state);

  for (const rec of recs) {
    const mins = Math.min(rec.estimatedMinutes, budget);
    if (mins < 5) break;

    const template =
      ACTIVITY_TEMPLATES[rec.action] ||
      ACTIVITY_TEMPLATES.practice;

    activities.push({
      ...template(rec.subject, rec.label, mins),
      reason: rec.reason,
    });

    budget -= mins;
    if (budget < 5) break;
  }

  return {
    type: "daily",
    date: new Date().toISOString().slice(0, 10),
    availableMinutes,
    totalEstimatedMinutes: availableMinutes - budget,
    activities,
    nextBestAction: getNextBestAction(state),
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generates a 5-day weekly plan.
 */
function generateWeeklyPlan(state) {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const allSubjects = [
    ...state.weaknesses.slice(0, 3),
    ...state.strengths.slice(0, 2),
  ];

  const plan = days.map((day, i) => {
    const subj = allSubjects[i % allSubjects.length] || "matematicas";
    const label = SUBJECT_MAP[subj] || subj;
    const isWeak = state.weaknesses.includes(subj);

    return {
      day,
      subject: subj,
      label,
      focus: isWeak ? "Refuerzo" : "Consolidación",
      activities: [
        ACTIVITY_TEMPLATES.practice(subj, label, 15),
        isWeak
          ? ACTIVITY_TEMPLATES.oral(subj, label, 10)
          : ACTIVITY_TEMPLATES.challenge(subj, label, 10),
      ],
      estimatedMinutes: 25,
    };
  });

  return {
    type: "weekly",
    weekStart: getMonday(),
    days: plan,
    focus: state.weaknesses.length > 0 ? "remediation" : "enrichment",
    generatedAt: new Date().toISOString(),
  };
}

function getMonday() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().slice(0, 10);
}

// ── Plan Persistence ──────────────────────────────────────────────────────────

async function saveLearningPlan(studentId, plan) {
  // Deactivate old plan of same type first, then insert a fresh one
  await supabase
    .from("learning_plans")
    .update({ is_active: false })
    .eq("student_id", studentId)
    .eq("type", plan.type);

  const { error } = await supabase.from("learning_plans").insert({
    student_id: studentId,
    type: plan.type,
    plan_json: plan,
    is_active: true,
    generated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

module.exports = {
  getStudentState,
  detectStrengths,
  detectWeaknesses,
  detectRisks,
  generateRecommendations,
  getNextBestAction,
  generateDailyPlan,
  generateWeeklyPlan,
  saveLearningPlan,
};
