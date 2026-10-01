import { STYLE_MAP } from "../vakStyles";
import { scoreVak } from "../../kids-dashboard/vak/vakQuestions";

/**
 * Resultado del ADN de Aprendizaje: puntaje por estilo en porcentaje,
 * estilo principal y, cuando la diferencia es de una respuesta o menos,
 * un segundo estilo ("perfil mixto").
 */
export function calculateDiagnosis({
  answers,
  studentName,
  studentAge,
  studentMood,
  parentName,
  date,
  elapsedTime,
  ageQuestions,
}) {
  const counts = { visual: 0, auditivo: 0, kinestesico: 0 };
  answers.forEach((a) => {
    if (a.type in counts) counts[a.type] += 1;
  });

  const { scores, predominantStyle, secondaryStyle } = scoreVak(
    answers.map((a) => a.type),
  );

  return {
    studentName: studentName || "Estudiante",
    studentAge: studentAge || "",
    studentMood,
    parentName: parentName || "",
    date,
    timeSpent: elapsedTime,
    counts,
    total: ageQuestions.length,
    scores,
    predominantStyle,
    secondaryStyle,
    isMixed: !!secondaryStyle,
    styleDetails: STYLE_MAP[predominantStyle],
    percentage: scores[predominantStyle],
    answers,
  };
}
