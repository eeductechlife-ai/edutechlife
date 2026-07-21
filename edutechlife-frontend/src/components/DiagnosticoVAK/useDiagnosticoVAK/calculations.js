import { STYLE_MAP } from "../vakStyles";

export function calculateDiagnosis({
  answers,
  studentName,
  studentAge,
  studentEmail,
  studentPhone,
  studentMood,
  parentName,
  parentPhone,
  parentEmail,
  date,
  elapsedTime,
  ageQuestions,
}) {
  const counts = { visual: 0, auditivo: 0, kinestesico: 0 };
  answers.forEach((a) => {
    if (a.type === "visual") counts.visual++;
    else if (a.type === "auditivo") counts.auditivo++;
    else if (a.type === "kinestesico") counts.kinestesico++;
  });

  let predominant = "visual";
  let max = counts.visual;
  if (counts.auditivo > max) {
    predominant = "auditivo";
    max = counts.auditivo;
  }
  if (counts.kinestesico > max) {
    predominant = "kinestesico";
    max = counts.kinestesico;
  }

  return {
    studentName: studentName || "Estudiante",
    studentAge: studentAge || "",
    studentEmail,
    studentPhone,
    studentMood,
    parentName: parentName || "",
    parentPhone: parentPhone || "",
    parentEmail: parentEmail || "",
    date,
    timeSpent: elapsedTime,
    counts,
    predominantStyle: predominant,
    styleDetails: STYLE_MAP[predominant],
    percentage: Math.round((max / ageQuestions.length) * 100),
    answers,
  };
}
