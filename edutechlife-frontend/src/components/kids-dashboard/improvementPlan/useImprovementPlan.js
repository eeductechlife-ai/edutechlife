import { useState, useCallback, useEffect } from "react";
import { callDeepseekSmartboard } from "../../../utils/api";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import {
  getCurriculumPromptText,
  getGradeLabel,
} from "../../../data/curriculum/curriculumHelper";

function storageKey(userId) {
  return `improvement_plan_${userId}`;
}

function loadPlan(userId) {
  if (!userId) return null;
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePlan(userId, plan) {
  if (!userId) return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(plan));
  } catch {
    // ignore quota errors
  }
}

export function useImprovementPlan() {
  const {
    vakResult,
    studentGrades,
    upcomingExams,
    userId,
    gradeLevel,
    countryCode,
  } = useSmartBoardKids();

  const [plan, setPlan] = useState(() => loadPlan(userId));
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Re-load plan when userId changes (e.g. login)
  useEffect(() => {
    setPlan(loadPlan(userId));
  }, [userId]);

  const generatePlan = useCallback(async () => {
    if (isGenerating) return;
    setError(null);
    setIsGenerating(true);

    const vakStyle =
      vakResult?.predominantStyle || vakResult?.dominant || "visual";
    const gradesText = (studentGrades || [])
      .map((g) => {
        const name = g.label || g.subject || g.name || g.key || "Materia";
        const score = g.score ?? g.grade ?? "?";
        return `${name}: ${score}/5`;
      })
      .join(", ");
    const examsText = (upcomingExams || [])
      .slice(0, 5)
      .map((e) => {
        const sub = e.subject || e.materia || e.title || "Examen";
        const date = e.date || e.fecha || "";
        return date ? `${sub} (${date})` : sub;
      })
      .join(", ");

    // Detect weak subjects from grades (score < 3.5) to prioritize in curriculum
    const weakKeys = (studentGrades || [])
      .filter((g) => (g.score ?? g.grade ?? 5) < 3.5)
      .map((g) =>
        (g.label || g.subject || g.key || "")
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

    const prompt = `Eres Dani, tutora IA de EdutechLife para Colombia. Eres experta en pedagogía y currículo escolar.
${gradeInfo}
Estilo de aprendizaje VAK del estudiante: ${vakStyle}.
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
- weakSubjects: máx 3, las más críticas (score < 3.5)
- activities.tipo: debe coincidir con el estilo VAK (${vakStyle}) al menos en 2 de las 3 actividades
- Usar lenguaje motivador y cercano para estudiantes colombianos`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await callDeepseekSmartboard(
        [{ role: "user", content: prompt }],
        { temperature: 0.7, maxTokens: 2000, isJson: true },
      );
      const parsed = typeof res === "string" ? JSON.parse(res) : res;
      if (!parsed?.weeks?.length) throw new Error("Respuesta incompleta");
      const planWithProgress = {
        ...parsed,
        weeks: parsed.weeks.map((w) => ({
          ...w,
          activities: w.activities.map((a) => ({ ...a, done: false })),
        })),
        generatedAt: Date.now(),
      };
      setPlan(planWithProgress);
      savePlan(userId, planWithProgress);
    } catch (e) {
      if (e.name !== "AbortError") {
        setError(e.message || "Error al generar el plan");
      }
    } finally {
      clearTimeout(timeoutId);
      setIsGenerating(false);
    }
  }, [
    isGenerating,
    vakResult,
    studentGrades,
    upcomingExams,
    userId,
    gradeLevel,
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
        savePlan(userId, updated);
        return updated;
      });
    },
    [userId],
  );

  const hasPlan = Boolean(plan?.weeks?.length);

  return { plan, isGenerating, error, generatePlan, markActivityDone, hasPlan };
}
