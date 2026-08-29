const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY,
);

// ── Data Access ───────────────────────────────────────────────────────────────

async function fetchStudentRow(studentId) {
  const { data } = await supabase
    .from("students")
    .select("id, grade_level, country_code, school, created_at")
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
    .select("subject, duration_minutes, created_at")
    .eq("student_id", studentId)
    .gte("created_at", since)
    .order("created_at", { ascending: false });
  return data || [];
}

async function fetchStreak(studentId) {
  const { data } = await supabase
    .from("learning_streaks")
    .select("current_streak, best_streak, last_activity_date")
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
      ? Math.round(sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / sessions.length)
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
      longestStreak: streak?.best_streak || 0,
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

/**
 * Por-subject MIN mastery a nivel competencia. Detecta déficits puntuales que
 * el promedio de materia enmascara (p. ej. ecuaciones 0.35 dentro de
 * matemáticas 0.425).
 */
function computeSubjectMinMastery(masteryRows) {
  const min = {};
  for (const row of masteryRows || []) {
    const subject = subjectFromCompetencyId(row.competency_id);
    if (!subject) continue;
    if (!(subject in min) || Number(row.mastery_level) < min[subject]) {
      min[subject] = Number(row.mastery_level);
    }
  }
  return min;
}

const LEARNING_MIN = 0.4;
const ENGAGEMENT_ACTIVE_DAYS = 3;

/**
 * SMARTBOARD PRIORITY (E5) — separa conceptualmente LEARNING NEED de
 * ENGAGEMENT NEED y produce una decisión final:
 *   - si existe un déficit de aprendizaje real (min mastery < 0.4) → gana
 *     LEARNING (práctica en la competencia más débil), sin importar la
 *     actividad reciente (Student A: math 35% → prioriza aprender).
 *   - si no hay déficit real pero la actividad es baja → gana ENGAGEMENT
 *     (motivación/racha) (Student B: math 90% → puede priorizar engagement).
 *   - si no hay déficit ni baja actividad → fortaleza (challenge/transfer).
 */
function computeSmartboardPriority(state) {
  const subjectMin = computeSubjectMinMastery(state.masteryRows || []);
  const weakest = Object.entries(subjectMin).sort((a, b) => a[1] - b[1])[0];
  const minMastery = weakest ? weakest[1] : 1;
  const { activeDaysLast14 = 0 } = state.behavior || {};

  const learningNeed = Math.min(1, (LEARNING_MIN - minMastery) / LEARNING_MIN + 0.5);
  const engagementNeed = Math.min(1, 1 - activeDaysLast14 / ENGAGEMENT_ACTIVE_DAYS);
  const totalPractice = (state.masteryRows || []).reduce((s, r) => s + (r.practice_count || 0), 0);
  const confidence = state.masteryRows?.length
    ? Math.min(1, totalPractice / (state.masteryRows.length * 4))
    : 0;
  const urgency = minMastery < LEARNING_MIN ? Math.round((LEARNING_MIN - minMastery) * 100) : 0;
  const goal = minMastery < 0.3 ? "recovery" : minMastery < 0.6 ? "practice" : minMastery < 0.8 ? "mastery" : "transfer";
  const winning = minMastery < LEARNING_MIN ? "learning" : engagementNeed > 0.5 ? "engagement" : "strength";

  return {
    subjectMinMastery: subjectMin,
    weakestSubject: weakest ? weakest[0] : null,
    minMastery: Math.round(minMastery * 1000) / 1000,
    learningNeed: Math.round(Math.max(0, learningNeed) * 100) / 100,
    engagementNeed: Math.round(engagementNeed * 100) / 100,
    confidence: Math.round(confidence * 100) / 100,
    urgency,
    goal,
    winning,
  };
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

// ── Content-backed recommendations (RecommendationEngine, §52) ────────────────

/**
 * Finds real content for a subject from learning_content, filtered by
 * difficulty (and age when known), easiest first.
 */
async function fetchContentForSubject(subject, { difficultyMax = 3, difficultyMin = 1, age = null, limit = 1 } = {}) {
  let q = supabase
    .from("learning_content")
    .select("id, title, type, subject, difficulty, duration_min, competency_id, learning_objective")
    .eq("subject", subject)
    .eq("is_active", true)
    .gte("difficulty", difficultyMin)
    .lte("difficulty", difficultyMax)
    .order("difficulty", { ascending: true })
    .limit(limit);
  if (age) q = q.lte("age_min", age).gte("age_max", age);
  const { data } = await q;
  return data || [];
}

/**
 * Persists recommendations to the `recommendations` table (motivo/prioridad/
 * estado/resultado per §52). Returns the inserted rows.
 */
async function persistRecommendations(studentId, recs) {
  if (!studentId || !recs.length) return [];
  const rows = recs.map((r) => ({
    student_id: studentId,
    type: r.type || "content",
    content_id: r.contentId || null,
    competency_id: r.competencyId || null,
    reason: r.reason,
    priority: r.priority || 3,
    status: "pending",
    metadata: r.metadata || {},
  }));
  const { data } = await supabase
    .from("recommendations")
    .insert(rows)
    .select("id, type, content_id, reason, priority, status");
  return data || [];
}

/**
 * Turns the student's state into concrete, explainable, PERSISTED content
 * recommendations: reinforcement for weaknesses (easy content) and a transfer
 * challenge for a strength (harder content). This is the RecommendationEngine
 * the Adaptive Engine exposes.
 */
async function recommendContent(studentId, state) {
  const age = state.age || null;
  const out = [];

  const subjectsToCover = (state.weaknesses || []).slice(0, 2);
  const targetSubject = subjectsToCover[0] || Object.keys(state.masteryBySubject || {})[0] || "matematicas";

  // 1. Contenido exacto para las debilidades (fácil)
  for (const subj of subjectsToCover) {
    const [content] = await fetchContentForSubject(subj, { difficultyMax: 2, age });
    if (content) {
      out.push({
        type: "reinforcement",
        contentId: content.id,
        competencyId: content.competency_id,
        priority: 5,
        reason: `Tu dominio en ${SUBJECT_MAP[subj] || subj} está bajo. "${content.title}" (${content.duration_min} min) te ayuda a reforzar: ${content.learning_objective}.`,
        metadata: { subject: subj, difficulty: content.difficulty, source: "weakness" },
      });
    }
  }

  // 2. Reto para una fortaleza (difícil)
  for (const subj of (state.strengths || []).slice(0, 1)) {
    const [content] = await fetchContentForSubject(subj, { difficultyMin: 3, difficultyMax: 5, age });
    if (content) {
      out.push({
        type: "challenge",
        contentId: content.id,
        competencyId: content.competency_id,
        priority: 2,
        reason: `¡Dominas ${SUBJECT_MAP[subj] || subj}! Súbete de nivel con "${content.title}".`,
        metadata: { subject: subj, difficulty: content.difficulty, source: "strength" },
      });
    }
  }

  // 3. FALLBACKS — nunca devolver [] cuando exista una alternativa útil (E6)
  if (out.length === 0) {
    // Fallback 1: contenido relacionado (cualquier dificultad en la materia débil)
    const [related] = await fetchContentForSubject(targetSubject, { difficultyMin: 1, difficultyMax: 5, age });
    if (related) {
      out.push({
        type: "reinforcement",
        contentId: related.id,
        competencyId: related.competency_id,
        priority: 4,
        reason: `Contenido relacionado con ${SUBJECT_MAP[targetSubject] || targetSubject}: "${related.title}".`,
        metadata: { subject: targetSubject, difficulty: related.difficulty, source: "fallback_related" },
      });
    } else {
      // Fallback 2: prerrequisito (concepto base de la materia)
      const [prereq] = await fetchContentForSubject(targetSubject, { difficultyMax: 5, age });
      if (prereq) {
        out.push({
          type: "reinforcement",
          contentId: prereq.id,
          competencyId: prereq.competency_id,
          priority: 4,
          reason: `Base de ${SUBJECT_MAP[targetSubject] || targetSubject}: "${prereq.title}".`,
          metadata: { subject: targetSubject, difficulty: prereq.difficulty, source: "fallback_prerequisite" },
        });
      } else {
        // Fallback 3: diagnóstico (siempre generable)
        out.push({
          type: "diagnostic",
          priority: 4,
          reason: `Hagamos un diagnóstico rápido de ${SUBJECT_MAP[targetSubject] || targetSubject} para afinar tu plan.`,
          metadata: { subject: targetSubject, source: "fallback_diagnostic" },
        });
        // Fallback 4: exploración
        out.push({
          type: "exploration",
          priority: 2,
          reason: "Explora un tema nuevo o un recurso distinto para mantener el interés.",
          metadata: { source: "fallback_exploration" },
        });
      }
    }
  }

  const persisted = await persistRecommendations(studentId, out);
  return { recommendations: out, persisted };
}

/**
 * Returns the single best next action for the student with an explanation,
 * driven by the SMARTBOARD PRIORITY (E5): learning need > engagement > strength.
 */
function getNextBestAction(state) {
  const smartboardPriority = computeSmartboardPriority(state);

  // 1. LEARNING NEED: existe un déficit real (< 40% min) → práctica en la
  //    competencia/materia más débil, aunque la actividad reciente sea alta.
  if (smartboardPriority.winning === "learning" && smartboardPriority.weakestSubject) {
    const subj = smartboardPriority.weakestSubject;
    return {
      subject: subj,
      label: SUBJECT_MAP[subj] || subj,
      action: "practice",
      reason: `${SUBJECT_MAP[subj] || subj} está en ${Math.round(smartboardPriority.minMastery * 100)}% de dominio (meta: ${smartboardPriority.goal}). Practicar ahora tiene el mayor impacto en tu aprendizaje.`,
      estimatedMinutes: 10,
      priority: "high",
      difficulty: smartboardPriority.minMastery < 0.4 ? "easy" : "medium",
      smartboardPriority,
    };
  }

  // 2. ENGAGEMENT NEED: sin déficit real pero poca actividad → motivación.
  if (smartboardPriority.winning === "engagement") {
    const subj = state.strengths[0] || "matematicas";
    return {
      subject: subj,
      label: SUBJECT_MAP[subj] || subj,
      action: "quick",
      reason: "No has estudiado hoy. Una actividad rápida reactiva tu racha y mantiene el hábito.",
      estimatedMinutes: 5,
      priority: "medium",
      difficulty: "easy",
      smartboardPriority,
    };
  }

  // 3. STRENGTH: sin déficit y con hábito → reto/transferencia.
  const subj = state.strengths[0] || "matematicas";
  return {
    subject: subj,
    label: SUBJECT_MAP[subj] || subj,
    action: "challenge",
    reason: `Estás progresando bien en ${SUBJECT_MAP[subj] || subj}. Sube el nivel para mantener el impulso.`,
    estimatedMinutes: 15,
    priority: "low",
    difficulty: "hard",
    smartboardPriority,
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
  computeSmartboardPriority,
  detectRisks,
  generateRecommendations,
  recommendContent,
  fetchContentForSubject,
  persistRecommendations,
  getNextBestAction,
  generateDailyPlan,
  generateWeeklyPlan,
  saveLearningPlan,
};
