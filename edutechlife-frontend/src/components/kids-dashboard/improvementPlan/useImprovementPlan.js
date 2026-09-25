import { useState, useCallback, useEffect, useRef } from "react";
import { callDeepseekSmartboard } from "../../../utils/api";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";
import {
  getCurriculumPromptText,
  getGradeLabel,
} from "../../../data/curriculum/curriculumHelper";
import { API_BASE_URL } from "../../../config/api";
import { getAvgScore } from "../gradeUtils";
import { normalizePlan } from "./planModel";

function getAuthToken() {
  try {
    return sessionStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

function storageKey(userId) {
  return `improvement_plan_${userId}`;
}

function loadPlanLocal(userId) {
  if (!userId) return null;
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePlanLocal(userId, plan) {
  if (!userId) return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(plan));
  } catch {
    // ignore quota errors
  }
}

async function loadPlanFromServer() {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/api/ingenia/improvement-plan`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.plan || null;
  } catch {
    return null;
  }
}

async function savePlanToServer(plan) {
  const token = getAuthToken();
  if (!token) return;
  try {
    await fetch(`${API_BASE_URL}/api/ingenia/improvement-plan`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ plan }),
    });
  } catch {
    // localStorage remains the fallback
  }
}

/** Saves a plan where "Mi Plan" reads it (this device + the student's account). */
export function storePlan(userId, plan) {
  savePlanLocal(userId, plan);
  savePlanToServer(plan);
}

/** Ticks an activity from outside "Mi Plan" (e.g. after doing it in Practicar). */
export function markStoredActivityDone(userId, weekIdx, actIdx) {
  const plan = normalizePlan(loadPlanLocal(userId));
  const act = plan?.weeks?.[weekIdx]?.activities?.[actIdx];
  if (!act || act.done) return false;
  act.done = true;
  storePlan(userId, plan);
  return true;
}

// Grades are stored per period (p1–p4) and not always with a `score`; reading
// only `score` sent "Matemáticas: ?/5" to the AI and no subject looked weak.
const scoreOf = (g) => {
  const avg = getAvgScore(g);
  return avg > 0 ? avg : Number(g.grade) || null;
};

function ageGuidance(age) {
  const a = Number(age);
  if (!a) return "";
  if (a <= 8)
    return `El estudiante tiene ${a} años: actividades de 10 a 15 minutos, muy concretas, con juegos y ayuda de un adulto.`;
  if (a <= 12)
    return `El estudiante tiene ${a} años: actividades de 15 a 25 minutos, claras y con ejemplos de la vida diaria.`;
  return `El estudiante tiene ${a} años: actividades de 25 a 40 minutos, con más autonomía.`;
}

function parseJson(res) {
  if (res && typeof res === "object") return res;
  const text = String(res || "");
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

const TIMEOUT_MS = 45000;

export function useImprovementPlan() {
  const {
    vakResult,
    studentGrades,
    upcomingExams,
    exams,
    userId,
    gradeLevel,
    studentAge,
    countryCode,
  } = useIngenIAKids();

  const [plan, setPlan] = useState(() => normalizePlan(loadPlanLocal(userId)));
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const loadedFromServer = useRef(false);

  useEffect(() => {
    if (!userId || loadedFromServer.current) return;
    loadedFromServer.current = true;

    loadPlanFromServer().then((serverRaw) => {
      const server = normalizePlan(serverRaw);
      const local = normalizePlan(loadPlanLocal(userId));
      // A plan just made in Notas may still be on its way to the server.
      const newest =
        server && (!local || server.generatedAt >= local.generatedAt)
          ? server
          : local;
      setPlan(newest);
      if (newest) savePlanLocal(userId, newest);
    });
  }, [userId]);

  const generatePlan = useCallback(async () => {
    if (isGenerating) return;
    setError(null);
    setIsGenerating(true);

    const vakStyle = vakResult?.predominantStyle || vakResult?.dominant || "";
    const graded = (studentGrades || [])
      .map((g) => ({
        name: g.label || g.subject || g.name || g.key || "Materia",
        score: scoreOf(g),
      }))
      .filter((g) => g.score);
    const gradesText = graded
      .map((g) => `${g.name}: ${g.score.toFixed(1)}/5`)
      .join(", ");
    const examList = (upcomingExams?.length ? upcomingExams : exams) || [];
    const examsText = examList
      .slice(0, 5)
      .map((e) => {
        const sub =
          e.subject || e.materia || e.exam_name || e.title || "Examen";
        const date = e.date || e.exam_date || e.fecha || "";
        return date ? `${sub} (${date})` : sub;
      })
      .join(", ");

    // Básico (3.0–3.9) already means "refuérzala" everywhere else in IngenIA.
    const weakKeys = graded
      .filter((g) => g.score < 4.0)
      .map((g) =>
        g.name
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/á/g, "a")
          .replace(/é/g, "e")
          .replace(/í/g, "i")
          .replace(/ó/g, "o")
          .replace(/ú/g, "u"),
      );

    const curriculumText = gradeLevel
      ? getCurriculumPromptText(gradeLevel, countryCode || "CO", weakKeys)
      : "";
    const gradeLabel = gradeLevel
      ? getGradeLabel(gradeLevel, countryCode || "CO")
      : null;
    const gradeInfo = gradeLabel
      ? `Grado del estudiante: ${gradeLabel} (${countryCode || "CO"}).`
      : "";

    const vakLine = vakStyle
      ? `Estilo de aprendizaje VAK del estudiante: ${vakStyle}.`
      : "Estilo de aprendizaje: aún no identificado; mezcla actividades visuales, auditivas y kinestésicas.";
    const vakRule = vakStyle
      ? `- activities.tipo: debe coincidir con el estilo VAK (${vakStyle}) al menos en 2 de las 3 actividades`
      : "- activities.tipo: usa tipos variados (visual, auditivo, kinestesico)";

    const prompt = `Eres Dani, tutora IA de EdutechLife para Colombia. Eres experta en pedagogía y currículo escolar.
${gradeInfo}
${ageGuidance(studentAge)}
${vakLine}
Calificaciones (escala 1.0-5.0, aprobatorio ≥ 3.0): ${gradesText || "no disponibles"}.
Próximos exámenes: ${examsText || "ninguno registrado"}.
${curriculumText ? `\n${curriculumText}\n` : ""}
Genera un plan de mejora académica de 4 semanas personalizado, alineado al currículo MEN Colombia para el grado del estudiante.

Responde SOLO con JSON válido (sin markdown, sin explicaciones):
{
  "weeks": [
    {
      "week": 1,
      "title": "título motivador de la semana",
      "focus": "materia o habilidad prioritaria",
      "activities": [
        {"titulo": "nombre actividad", "duracion": "30 min", "tipo": "visual|auditivo|kinestesico|lectura"}
      ],
      "danTip": "consejo personalizado de Dani para esta semana (1 frase motivadora)"
    }
  ],
  "topActions": ["acción urgente 1", "acción urgente 2", "acción urgente 3"],
  "weakSubjects": ["materia débil 1", "materia débil 2"]
}

REGLAS:
- weeks: exactamente 4 semanas, cada una con 3 actividades
- topActions: exactamente 3, las más urgentes según las calificaciones
- weakSubjects: máx 3, las más críticas (score < 4.0)
${vakRule}
- Actividades concretas que el estudiante pueda hacer solo o con un adulto (nada de "estudiar más")
- Usar lenguaje motivador y cercano para estudiantes colombianos`;

    let timeoutId;
    try {
      // callDeepseekSmartboard has no abort signal: race it against a timer
      // so the spinner never stays forever.
      const res = await Promise.race([
        callDeepseekSmartboard([{ role: "user", content: prompt }], {
          temperature: 0.7,
          maxTokens: 2000,
          isJson: true,
        }),
        new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            const err = new Error("timeout");
            err.code = "TIMEOUT";
            reject(err);
          }, TIMEOUT_MS);
        }),
      ]);
      const next = normalizePlan({ ...parseJson(res), source: "plan" });
      if (!next) {
        const err = new Error("unusable");
        err.code = "UNUSABLE";
        throw err;
      }
      setPlan(next);
      storePlan(userId, next);
    } catch (e) {
      setError(
        e.code === "PARENTAL_CONSENT_REQUIRED"
          ? "Se necesita el permiso de tus padres para generar un plan de mejora. Pide a un adulto que autorice tu cuenta."
          : e.code === "TIMEOUT"
            ? "Dani se demoró mucho esta vez. Inténtalo otra vez."
            : // callDeepseekSmartboard throws with `raw` when the reply isn't JSON
              e.code === "UNUSABLE" ||
                e.raw !== undefined ||
                e instanceof SyntaxError
              ? "Dani no pudo armar tu plan esta vez. Inténtalo otra vez."
              : /sesión|servidor|minuto|conexión/i.test(e.message || "")
                ? e.message
                : "No pudimos crear tu plan. Revisa tu conexión e intenta de nuevo.",
      );
    } finally {
      clearTimeout(timeoutId);
      setIsGenerating(false);
    }
  }, [
    isGenerating,
    vakResult,
    studentGrades,
    upcomingExams,
    exams,
    userId,
    gradeLevel,
    studentAge,
    countryCode,
  ]);

  const markActivityDone = useCallback(
    (weekIdx, actIdx) => {
      setPlan((prev) => {
        if (!prev?.weeks) return prev;
        const updated = {
          ...prev,
          weeks: prev.weeks.map((w, wi) =>
            wi !== weekIdx
              ? w
              : {
                  ...w,
                  activities: w.activities.map((a, ai) =>
                    ai !== actIdx ? a : { ...a, done: !a.done },
                  ),
                },
          ),
        };
        savePlanLocal(userId, updated);
        savePlanToServer(updated);
        return updated;
      });
    },
    [userId],
  );

  const hasPlan = Boolean(plan?.weeks?.length);

  return { plan, isGenerating, error, generatePlan, markActivityDone, hasPlan };
}
