import { getSubjectEmoji, createSubject } from "../../config/subjectMappings";

// supabase-js hangs in dev — use direct REST fetch instead
const SUPA_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function sbFetch(path, opts = {}) {
  const token = sessionStorage.getItem("auth_token");
  const resp = await fetch(`${SUPA_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPA_KEY,
      Authorization: `Bearer ${token}`,
      ...(opts.headers || {}),
    },
    signal: opts.signal ?? AbortSignal.timeout(10000),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${resp.status}`);
  }
  if (resp.status === 204 || resp.headers.get("content-length") === "0")
    return null;
  return resp.json();
}

export const DEFAULT_SUBJECTS = [
  "matematicas",
  "lenguaje",
  "ciencias",
  "sociales",
  "ingles",
  "arte",
  "educacion_fisica",
  "tecnologia",
];

export const getSubjects = (t, extractedSubjects = null) => {
  if (extractedSubjects && Array.isArray(extractedSubjects)) {
    return extractedSubjects.map((name) => createSubject(name));
  }
  return DEFAULT_SUBJECTS.map((key) => ({
    v: key,
    l: t(`kid.grades.subject_${key}`),
    i: getSubjectEmoji(t(`kid.grades.subject_${key}`)),
  }));
};

// MEN report-card scale (Decreto 1290), the same bands Materias shows:
// Bajo < 3.0, Básico 3.0–3.9, Alto 4.0–4.5, Superior 4.6–5.0. One scale
// everywhere, so a 3.7 never reads "✅" in one tab and "refuérzala" in another.
export const gradeColor = (n) => {
  if (n >= 4.6) return "#7C3AED";
  if (n >= 4.0) return "#10B981";
  if (n >= 3.0) return "#F59E0B";
  return "#EF4444";
};

export const gradeEmoji = (n) => {
  if (n >= 4.6) return "🏆";
  if (n >= 4.0) return "⭐";
  if (n >= 3.0) return "📈";
  return "🆘";
};

export const getAvgScore = (g) => {
  const vals = [g.p1, g.p2, g.p3, g.p4].filter(
    (v) => v != null && !isNaN(Number(v)),
  );
  if (vals.length) return vals.reduce((a, b) => a + Number(b), 0) / vals.length;
  return Number(g.score) || 0;
};

export const uid = () => Math.random().toString(36).slice(2, 8);

const GRADE_NUMBER_WORDS = {
  primero: 1,
  segundo: 2,
  tercero: 3,
  cuarto: 4,
  quinto: 5,
  sexto: 6,
  septimo: 7,
  octavo: 8,
  noveno: 9,
  decimo: 10,
  undecimo: 11,
  once: 11,
};

export function normalizeGradeStr(s) {
  if (!s) return null;
  const clean = String(s)
    .toLowerCase()
    .trim()
    .replace(/[áàä]/g, "a")
    .replace(/[éèë]/g, "e")
    .replace(/[íìï]/g, "i")
    .replace(/[óòö]/g, "o")
    .replace(/[úùü]/g, "u")
    .replace(/[°º\s]/g, "");
  const num = parseInt(clean, 10);
  if (!Number.isNaN(num) && num >= 1 && num <= 11) return num;
  for (const [word, grade] of Object.entries(GRADE_NUMBER_WORDS)) {
    if (clean.includes(word)) return grade;
  }
  return null;
}
