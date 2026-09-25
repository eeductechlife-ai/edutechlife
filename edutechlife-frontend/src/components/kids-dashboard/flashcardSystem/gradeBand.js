// The student's registered grade (1-11, Colombia) → the level bands the AI
// generators use. Falls back to age when the grade is unknown, so no screen
// has to ask the kid something we already know.
export function gradeBand(gradeLevel, age) {
  const g = Number(gradeLevel) || (Number(age) ? Number(age) - 5 : null);
  if (!g) return "4-6";
  if (g <= 3) return "1-3";
  if (g <= 6) return "4-6";
  if (g <= 9) return "7-9";
  return "10-12";
}

// Same band, as the age range the study-summary prompt expects.
export const AGE_KEY_BY_BAND = {
  "1-3": "6-8",
  "4-6": "9-11",
  "7-9": "12-14",
  "10-12": "15-17",
};
