/**
 * Pure async helpers for grade extraction (image/PDF) and analysis prompt building.
 * Extracted from useGradeScanner to keep the hook under 500 lines.
 */
import { callDeepseekSmartboard } from "../../utils/api";
import { getAvgScore, normalizeGradeStr, uid } from "./gradeUtils";

/* ─── Prompt template ──────────────────────────────────────────────── */

export const GRADE_PROMPT = (
  text,
) => `Eres un extractor de notas de boletines escolares colombianos.

BOLETÍN:
"${text.slice(0, 4500)}"

TAREA: Extraer las notas de CADA PERÍODO (P1, P2, P3, P4) por asignatura y el grado escolar del estudiante.

REGLAS:
- Extrae UNA entrada por asignatura (sin duplicados)
- Si el boletín tiene columnas P1/P2/P3/P4 (o Período 1, Período 2, etc.), extrae cada una por separado
- Si una columna de período no existe o está vacía → usa null para ese período
- Si solo hay una nota sin indicar período, ponla en p1
- El nombre de la asignatura exactamente como aparece en el boletín
- Convierte porcentajes: 100%=5.0, 90%=4.5, 85%=4.25, 80%=4.0, 75%=3.75, 70%=3.5, 60%=3.0
- NO incluyas una columna "DEFINITIVA" o "PROMEDIO FINAL"
- grade_level: busca el grado en el encabezado del boletín. Si no aparece, usa null

RESPONDE SOLO con este JSON (sin markdown, sin texto adicional):
{"grade_level":"SÉPTIMO","grades":[{"subject":"NOMBRE EXACTO","p1":4.2,"p2":3.8,"p3":null,"p4":null}]}

Si no encuentras notas: {"grade_level":null,"grades":[]}`;

/* ─── Extract grades from a file (image or PDF) ───────────────────── */

async function extractFromPdf(file) {
  const { parsePDF } = await import("../../utils/documentParser");
  const text = await parsePDF(file);
  if (!text) return { grades: [], gradeLevel: null };
  const res = await callDeepseekSmartboard(
    [{ role: "user", content: GRADE_PROMPT(text) }],
    { temperature: 0.05, maxTokens: 1500, isJson: true },
  );
  const parsed = typeof res === "string" ? JSON.parse(res) : res;
  return {
    grades: parsed?.grades || [],
    gradeLevel: parsed?.grade_level ?? null,
  };
}

async function extractFromImage(file) {
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const { API_BASE_URL } = await import("../../config/api");
  const token = sessionStorage.getItem("auth_token");
  const resp = await fetch(`${API_BASE_URL}/api/smartboard/scan-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ imageBase64: base64 }),
  });
  if (!resp.ok) {
    const errBody = await resp.json().catch(() => null);
    const err = new Error(errBody?.error || `HTTP ${resp.status}`);
    err.status = resp.status;
    throw err;
  }
  const { text } = await resp.json();
  if (!text || text.trim().length <= 10)
    return { grades: [], gradeLevel: null };
  const res = await callDeepseekSmartboard(
    [{ role: "user", content: GRADE_PROMPT(text) }],
    { temperature: 0.05, maxTokens: 1500, isJson: true },
  );
  const parsed = typeof res === "string" ? JSON.parse(res) : res;
  return {
    grades: parsed?.grades || [],
    gradeLevel: parsed?.grade_level ?? null,
  };
}

/**
 * Core extraction — returns { extractedGrades, detectedGradeLevel }.
 * De-duplicates subjects by uppercase name.
 */
export async function extractGradesFromFile(file) {
  const isPdfFile =
    file.type === "application/pdf" ||
    file.name?.toLowerCase().endsWith(".pdf");
  const { grades: rawGrades, gradeLevel } = isPdfFile
    ? await extractFromPdf(file)
    : await extractFromImage(file);

  if (!rawGrades.length)
    return { extractedGrades: [], detectedGradeLevel: gradeLevel };

  // de-duplicate by uppercase subject
  const seen = new Map();
  rawGrades.forEach((g) => {
    if (g.subject && typeof g.subject === "string")
      seen.set(g.subject.toUpperCase().trim(), g);
  });
  const deduped = [...seen.values()];

  return { extractedGrades: deduped, detectedGradeLevel: gradeLevel };
}

/**
 * Normalize raw extracted grades into the shape the hook stores.
 */
export function normalizeExtractedGrades(extractedGrades) {
  return extractedGrades.map((g) => ({
    id: uid(),
    subject: g.subject,
    p1:
      g.p1 != null
        ? Number(g.p1)
        : g.p2 == null && g.p3 == null && g.p4 == null
          ? g.score != null
            ? Number(g.score)
            : null
          : null,
    p2: g.p2 != null ? Number(g.p2) : null,
    p3: g.p3 != null ? Number(g.p3) : null,
    p4: g.p4 != null ? Number(g.p4) : null,
  }));
}

/**
 * Normalize a detected grade level string and return the numeric value (or null).
 */
export function resolveGradeLevel(detectedGradeLevel) {
  if (!detectedGradeLevel) return null;
  return normalizeGradeStr(detectedGradeLevel);
}

/* ─── Build the analysis prompt for Dani ───────────────────────────── */

export function buildAnalysisPrompt({ grades, vakStyle, SUBJECTS }) {
  const getLabel = (g) =>
    SUBJECTS.find((x) => x.v === g.subject)?.l || g.subject;
  const avgScore = (
    grades.reduce((s, g) => s + getAvgScore(g), 0) / grades.length
  ).toFixed(1);
  const failing = grades.filter((g) => getAvgScore(g) < 3.0);
  const toImprove = grades.filter(
    (g) => getAvgScore(g) >= 3.0 && getAvgScore(g) < 4.0,
  );
  const strong = grades.filter((g) => getAvgScore(g) >= 4.0);
  const weakCount = Math.min(failing.length + toImprove.length, 5);
  const planWeeks = Math.min(Math.max(weakCount, 2), 4);
  const fmt = (arr) =>
    arr
      .sort((a, b) => getAvgScore(a) - getAvgScore(b))
      .map((g) => `${getLabel(g)} (${getAvgScore(g).toFixed(1)}/5)`)
      .join(", ") || "ninguna";

  return `Eres Dani, tutora IA de EdutechLife para Colombia.
Estilo de aprendizaje VAK: ${vakStyle}.

CALIFICACIONES (escala 1.0–5.0, aprobatorio ≥ 3.0):
- Promedio: ${avgScore}/5 | Total: ${grades.length} asignaturas
- FUERTES (≥ 4.0): ${fmt(strong)}
- A MEJORAR (3.0–3.9): ${fmt(toImprove)}
- REPROBADAS (< 3.0): ${fmt(failing)}

Responde SOLO con JSON válido (sin markdown):
{"overall":"Mensaje CORTO al estudiante: máx 2 frases, tutéalo, motivador","motivation":"Frase final de Dani al estudiante (1 frase)","strengths":["emoji Materia (nota)"],"topActions":["Acción urgente 1","Acción 2","Acción 3"],"weaknesses":[{"subject":"nombre","score":2.8,"emoji":"emoji","why":"razón en 1 frase","vakTip":"consejo ${vakStyle} (1 frase)","steamLink":"conexión mundo real (1 frase)","actions":["acción 1","acción 2","acción 3"]}],"studyPlan":[{"week":1,"focus":"materia","activities":["actividad 1","actividad 2","actividad 3"],"daniTip":"consejo de Dani"}],"parentReport":{"summary":"Párrafo formal 3-4 frases para los padres. Promedio ${avgScore}/5.","concerns":["Preocupación 1"],"recommendations":["Recomendación 1","Recomendación 2","Recomendación 3"],"followUp":"Sugerencia de seguimiento"}}

REGLAS: overall+motivation MUY CORTOS para niños 6-16; weaknesses máx ${weakCount}; studyPlan ${planWeeks} semanas; parentReport formal sin emojis.`;
}
