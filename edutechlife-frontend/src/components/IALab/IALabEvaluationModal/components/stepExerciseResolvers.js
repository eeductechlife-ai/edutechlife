export const resolveDocuments = ({ exercises, exercise } = {}) => {
  const fromWhole = exercises?.documentos || exercises?.conceptos;
  if (Array.isArray(fromWhole)) return fromWhole;

  const fromSlice = exercise?.documentos || exercise?.conceptos;
  if (Array.isArray(fromSlice)) return fromSlice;

  if (Array.isArray(exercise)) return exercise;

  return [];
};

// Clave canónica del ejercicio que corresponde a cada paso, por módulo. Evita
// depender del orden en que la IA devuelva las claves del objeto `exercises`.
export const STEP_EXERCISE_KEYS = {
  1: ["ejercicio1", "ejercicio2", "ejercicio3"],
  2: ["casoUso", "gptConfig", "functionCallSpec"],
  3: ["temaInvestigacion", "fuentes", "afirmaciones", "informeTemplate"],
  4: ["conceptos", "preguntasSintesis", "guionTemplate"],
  5: ["casoEtico", "tiposSesgo", "protocoloPlantilla"],
};

export const resolveStepExercise = (exercises, moduleId, step) => {
  if (!exercises || typeof exercises !== "object") return exercises;
  const keys = Object.keys(exercises);
  const canonicalKey = STEP_EXERCISE_KEYS[moduleId]?.[step - 1];
  if (canonicalKey && canonicalKey in exercises) return exercises[canonicalKey];
  if (step <= keys.length) return exercises[keys[step - 1]];
  return exercises;
};
