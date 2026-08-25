import coMen from "./co_men.json";

const CURRICULA = { CO: coMen };

// Map a student's grade_level (1-11) to the MEN range key (e.g. "6-7")
function getMenRange(grade) {
  if (grade <= 3) return "1-3";
  if (grade <= 5) return "4-5";
  if (grade <= 7) return "6-7";
  if (grade <= 9) return "8-9";
  return "10-11";
}

/**
 * Returns an array of subject curriculum blocks for the given grade and country.
 * Each block has: { subject, label, emoji, temas[], competencias[], objetivo }
 *
 * @param {number} grade - Grade level 1-11
 * @param {string} countryCode - ISO 3166-1 alpha-2 (default "CO")
 * @param {string[]} [subjectFilter] - Optional list of subject keys to include
 */
export function getCurriculumForGrade(
  grade,
  countryCode = "CO",
  subjectFilter = null,
) {
  const curriculum = CURRICULA[countryCode] ?? CURRICULA.CO;
  const range = getMenRange(grade);
  const results = [];

  for (const [key, subject] of Object.entries(curriculum.subjects)) {
    if (subjectFilter && !subjectFilter.includes(key)) continue;
    const std = subject.standards?.[range];
    if (!std) continue;
    results.push({
      subject: key,
      label: subject.label,
      emoji: subject.emoji ?? "📚",
      objetivo: std.objetivo ?? "",
      temas: std.temas ?? [],
      competencias: std.competencias ?? [],
    });
  }

  return results;
}

/**
 * Returns a compact text summary for injection into the AI prompt.
 * Limits topics per subject to avoid exceeding token budget.
 *
 * @param {number} grade
 * @param {string} countryCode
 * @param {string[]} [weakSubjectKeys] - Prioritize these subjects first
 */
export function getCurriculumPromptText(
  grade,
  countryCode = "CO",
  weakSubjectKeys = [],
) {
  if (!grade) return "";

  const curriculum = CURRICULA[countryCode] ?? CURRICULA.CO;
  const gradeInfo = curriculum.gradeMap?.[String(grade)];
  const levelLabel = gradeInfo
    ? `${gradeInfo.label} — ${gradeInfo.level}`
    : `Grado ${grade}`;

  const blocks = getCurriculumForGrade(grade, countryCode);
  if (!blocks.length) return "";

  // Put weak subjects first so AI focuses on them
  const sorted = [
    ...blocks.filter((b) => weakSubjectKeys.includes(b.subject)),
    ...blocks.filter((b) => !weakSubjectKeys.includes(b.subject)),
  ];

  const lines = sorted.map((b) => {
    const temas = b.temas.slice(0, 6).join("; ");
    return `• ${b.emoji} ${b.label}: ${temas}`;
  });

  return `Currículo MEN Colombia — ${levelLabel}:\n${lines.join("\n")}`;
}

/**
 * Returns the grade label in Spanish for display.
 * @param {number} grade
 * @param {string} countryCode
 */
export function getGradeLabel(grade, countryCode = "CO") {
  const curriculum = CURRICULA[countryCode] ?? CURRICULA.CO;
  return curriculum.gradeMap?.[String(grade)]?.label ?? `Grado ${grade}`;
}

export const GRADE_OPTIONS = Array.from({ length: 11 }, (_, i) => ({
  value: i + 1,
  label: coMen.gradeMap[String(i + 1)]?.label ?? `Grado ${i + 1}`,
  level: coMen.gradeMap[String(i + 1)]?.level ?? "",
}));

export const COUNTRY_OPTIONS = [
  { value: "CO", label: "Colombia 🇨🇴" },
  { value: "MX", label: "México 🇲🇽" },
  { value: "EC", label: "Ecuador 🇪🇨" },
  { value: "PE", label: "Perú 🇵🇪" },
  { value: "AR", label: "Argentina 🇦🇷" },
  { value: "VE", label: "Venezuela 🇻🇪" },
  { value: "CL", label: "Chile 🇨🇱" },
  { value: "ES", label: "España 🇪🇸" },
];
