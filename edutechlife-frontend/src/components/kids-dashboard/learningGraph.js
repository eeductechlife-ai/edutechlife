/**
 * Learning Graph — Pedagogical recommendation engine for SmartBoard 3.0 (§6).
 *
 * Models subject prerequisites and computes next-action recommendations
 * based on mastery state and dependency relationships between competencies.
 *
 * Mastery thresholds (§6):
 *   Recovery   < 30%  — fundamental concepts must be rebuilt
 *   Practice   30-59% — developing, needs guided support
 *   Mastery    60-79% — solid, can be challenged
 *   Transfer  ≥ 80%   — can teach others, ready for next level
 *
 * Pre-requisite graph:
 *   Matemáticas → Ciencias Naturales, Tecnología
 *   Lenguaje    → Ciencias Sociales, Inglés
 */

// Prerequisite edges: {subject, requires, minProgress}
const PREREQUISITES = [
  { subject: "ciencias_naturales", requires: "matematicas", minProgress: 30 },
  { subject: "tecnologia", requires: "matematicas", minProgress: 30 },
  { subject: "ciencias_sociales", requires: "lenguaje", minProgress: 30 },
  { subject: "ingles", requires: "lenguaje", minProgress: 30 },
];

// Subject id normalization (context uses these keys)
const SUBJECT_ID_MAP = {
  math: "matematicas",
  matemáticas: "matematicas",
  matematicas: "matematicas",
  language: "lenguaje",
  lenguaje: "lenguaje",
  science: "ciencias_naturales",
  ciencias: "ciencias_naturales",
  social: "ciencias_sociales",
  sociales: "ciencias_sociales",
  english: "ingles",
  ingles: "ingles",
  tech: "tecnologia",
  tecnologia: "tecnologia",
};

function normalizeId(id) {
  if (!id) return id;
  const lower = String(id).toLowerCase();
  return SUBJECT_ID_MAP[lower] || lower;
}

/** For each subject, compute which subjects it directly blocks. */
function computeBlockedBy(subjects) {
  const blockedBy = {}; // normalizedId -> [normalizedIds it blocks]
  for (const s of subjects) {
    blockedBy[normalizeId(s.id)] = [];
  }
  for (const p of PREREQUISITES) {
    if (blockedBy[p.requires] !== undefined) {
      blockedBy[p.requires].push(p.subject);
    }
  }
  return blockedBy;
}

/** Check if a subject's prerequisites are satisfied. */
function checkPrerequisites(subjectId, subjectsById) {
  const nid = normalizeId(subjectId);
  for (const p of PREREQUISITES) {
    if (p.subject !== nid) continue;
    const req =
      subjectsById[p.requires] || subjectsById[p.requires.replace("_", "")];
    if (!req) continue;
    if (Number(req.progress || 0) < p.minProgress) {
      return {
        met: false,
        blocking: req,
        requires: p.requires,
        minProgress: p.minProgress,
      };
    }
  }
  return { met: true };
}

const GRADIENTS = {
  default: "linear-gradient(135deg, #7B2FF7 0%, #9D4EDD 55%, #C77DFF 100%)",
  mission: "linear-gradient(135deg, #EF476F 0%, #FF6B9D 55%, #FF8FA3 100%)",
};

function subjectGradient(s) {
  const c = s.color || "#9D4EDD";
  return `linear-gradient(135deg, ${c} 0%, ${c}CC 100%)`;
}

function progress(s) {
  return Number(s.progress || 0);
}

/**
 * Main entry point — returns the pedagogically-optimal next action.
 *
 * @param {{ subjects, missions, vakResult, onboardingComplete }} opts
 * @returns {object} NBA recommendation object
 */
export function getLearningGraphRecommendation({
  subjects,
  missions,
  vakResult,
  onboardingComplete,
}) {
  // ── 1. Onboarding must complete first ─────────────────────────────────────
  if (!onboardingComplete && !vakResult) {
    return {
      emoji: "🧠",
      label: "Descúbrete antes de estudiar",
      sub: "Haz el diagnóstico VAK para personalizar tu ruta de aprendizaje",
      tab: "perfil",
      xp: 100,
      gradient: GRADIENTS.default,
      eyebrow: "Empieza aquí",
      pedagogicReason: null,
    };
  }

  if (!subjects?.length) return null;

  // ── Index subjects by normalized id ───────────────────────────────────────
  const subjectsById = {};
  for (const s of subjects) {
    subjectsById[normalizeId(s.id)] = s;
    subjectsById[s.id] = s; // also keep original key
  }

  const blockedBy = computeBlockedBy(subjects);

  // ── 2. Prerequisites blocking other subjects (highest pedagogical impact) ──
  // Find Recovery subjects that block at least one other subject.
  const blockingSubjects = subjects
    .filter((s) => progress(s) < 30)
    .map((s) => ({ s, blocked: blockedBy[normalizeId(s.id)] || [] }))
    .filter(({ blocked }) => blocked.length > 0)
    .sort((a, b) => b.blocked.length - a.blocked.length);

  if (blockingSubjects.length > 0) {
    const { s, blocked } = blockingSubjects[0];
    const blockedNames = blocked
      .map((id) => subjectsById[id]?.name || id)
      .filter(Boolean)
      .join(" y ");
    return {
      emoji: s.icon || "📚",
      label: `Refuerza ${s.name}`,
      sub: `Es la base que necesitas para avanzar en ${blockedNames}`,
      tab: "retos",
      xp: 80,
      gradient: subjectGradient(s),
      eyebrow: "Desbloquea materias",
      pedagogicReason: `Prerequisito de: ${blockedNames}`,
    };
  }

  // ── 3. Subjects in Recovery without blocking others ────────────────────────
  const recoverySubjects = subjects
    .filter((s) => progress(s) < 30)
    .sort((a, b) => progress(a) - progress(b));

  if (recoverySubjects.length > 0) {
    const s = recoverySubjects[0];
    return {
      emoji: s.icon || "📚",
      label: `Refuerza ${s.name}`,
      sub: `${progress(s)}% de progreso — ¡puedes mejorar hoy!`,
      tab: "retos",
      xp: 60,
      gradient: subjectGradient(s),
      eyebrow: "Necesitas repasar",
      pedagogicReason: null,
    };
  }

  // ── 4. ZPD — Practice subjects (30-59%) sorted by most dependents ─────────
  const practiceSubjects = subjects
    .filter((s) => {
      const p = progress(s);
      return p >= 30 && p < 60;
    })
    .map((s) => ({
      s,
      dependents: (blockedBy[normalizeId(s.id)] || []).length,
    }))
    .sort(
      (a, b) => b.dependents - a.dependents || progress(a.s) - progress(b.s),
    );

  if (practiceSubjects.length > 0) {
    const { s, dependents } = practiceSubjects[0];
    const hasDownstream = dependents > 0;
    return {
      emoji: s.icon || "📚",
      label: `Practica ${s.name}`,
      sub: hasDownstream
        ? `Sube de nivel aquí para desbloquear más materias`
        : `Estás en zona de aprendizaje activo — ¡sigue subiendo!`,
      tab: "retos",
      xp: 50,
      gradient: subjectGradient(s),
      eyebrow: "Zona de práctica",
      pedagogicReason: hasDownstream
        ? `Desbloquea ${dependents} materia(s) más`
        : null,
    };
  }

  // ── 5. First pending mission ───────────────────────────────────────────────
  const firstMission = (missions || []).find((m) => m && !m.completed);
  if (firstMission) {
    return {
      emoji: firstMission.icon || "🎯",
      label: firstMission.title,
      sub: firstMission.description || "Completa esta misión y gana XP",
      tab: "misiones",
      xp: firstMission.xp || 50,
      gradient: GRADIENTS.mission,
      eyebrow: "Tu misión de hoy",
      pedagogicReason: null,
    };
  }

  // ── 6. Mastery subjects (60-79%) — challenge zone ─────────────────────────
  const masterySubjects = subjects
    .filter((s) => {
      const p = progress(s);
      return p >= 60 && p < 80;
    })
    .sort((a, b) => progress(a) - progress(b));

  if (masterySubjects.length > 0) {
    const s = masterySubjects[0];
    return {
      emoji: s.icon || "⭐",
      label: `Lleva ${s.name} al siguiente nivel`,
      sub: `${progress(s)}% — ya tienes dominio, ¡ahora profundiza!`,
      tab: "retos",
      xp: 35,
      gradient: subjectGradient(s),
      eyebrow: "Zona de dominio",
      pedagogicReason: null,
    };
  }

  // ── 7. Default ─────────────────────────────────────────────────────────────
  return {
    emoji: "⚡",
    label: "¡Gira la ruleta y practica!",
    sub: "Pon a prueba lo que sabes y gana XP",
    tab: "retos",
    xp: 30,
    gradient: GRADIENTS.default,
    eyebrow: "Siguiente acción",
    pedagogicReason: null,
  };
}
