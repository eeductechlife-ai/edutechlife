/**
 * Edad y grado del estudiante: una sola fuente de verdad.
 *
 * El perfil guardaba edad y grado por separado y nada los comparaba: un niño
 * de 12 años quedaba en «Grado 9» y los retos le traían temas de 10.º y 11.º.
 */

export const AGE_MIN = 8;
export const AGE_MAX = 16;
export const GRADE_MIN = 3;
export const GRADE_MAX = 11;

export const AGE_OPTIONS = Array.from(
  { length: AGE_MAX - AGE_MIN + 1 },
  (_, i) => AGE_MIN + i,
);
export const GRADE_OPTIONS = Array.from(
  { length: GRADE_MAX - GRADE_MIN + 1 },
  (_, i) => GRADE_MIN + i,
);

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const toInt = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
};

export const gradeLabel = (grade) => `${grade}.º`;

/**
 * En Colombia se entra a 1.º hacia los 6 años, así que a la edad `age` lo
 * habitual es el grado `age - 6` (cumpleaños tarde en el año) o `age - 5`.
 */
export function expectedGradeRange(age) {
  const a = toInt(age);
  if (a == null) return null;
  return { min: clamp(a - 6, 1, 11), max: clamp(a - 5, 1, 11) };
}

/**
 * Valida la pareja edad–grado. Se tolera un grado de diferencia respecto a lo
 * habitual (repitencia, adelanto); más que eso casi siempre es un error de
 * captura.
 *
 * @returns {{ ok: boolean, field: "age"|"grade"|"pair"|null, message: string }}
 */
export function validateAgeGrade(age, grade) {
  const a = toInt(age);
  if (a == null || a < AGE_MIN || a > AGE_MAX) {
    return {
      ok: false,
      field: "age",
      message: `La edad va de ${AGE_MIN} a ${AGE_MAX} años.`,
    };
  }
  const g = toInt(grade);
  if (g == null || g < GRADE_MIN || g > GRADE_MAX) {
    return {
      ok: false,
      field: "grade",
      message: `Elige un grado entre ${gradeLabel(GRADE_MIN)} y ${gradeLabel(GRADE_MAX)}.`,
    };
  }
  const range = expectedGradeRange(a);
  if (g < range.min - 1 || g > range.max + 1) {
    const usual =
      range.min === range.max
        ? gradeLabel(range.min)
        : `${gradeLabel(range.min)} o ${gradeLabel(range.max)}`;
    return {
      ok: false,
      field: "pair",
      message: `A los ${a} años lo habitual es ${usual}. Revisa la edad o el grado.`,
    };
  }
  return { ok: true, field: null, message: "" };
}

/**
 * Grado efectivo del estudiante para generar contenido: el del perfil, salvo
 * que no cuadre con la edad (más de un grado por encima de lo habitual), en
 * cuyo caso manda la edad. No se le pone a un niño de 12 años contenido de 9.º.
 * Sin grado se deduce de la edad; sin ninguno de los dos devuelve null.
 */
export function effectiveGrade(grade, age) {
  const range = expectedGradeRange(age);
  let g = toInt(grade);
  if (g == null || g < 1) g = range ? range.max : null;
  if (g != null && range && g > range.max + 1) g = range.max;
  return g;
}

/**
 * Grado con el que se generan las preguntas de un reto: el efectivo, y
 * «Fácil» baja un grado. Sin datos, 5.º.
 */
export function challengeGrade({ grade, age, difficulty }) {
  let g = effectiveGrade(grade, age) ?? 5;
  if (difficulty === "easy") g -= 1;
  return clamp(g, 1, GRADE_MAX);
}

/**
 * Grupo de edad de la interfaz: early (hasta 8), middle (9–12), senior (13+).
 * Sin edad registrada se usa «middle»: antes `null <= 8` daba «early» y a un
 * estudiante sin edad le llegaba la versión de 8 años.
 */
export function ageGroupFor(age) {
  const a = toInt(age);
  if (a == null || a <= 0) return "middle";
  return a <= 8 ? "early" : a <= 12 ? "middle" : "senior";
}
