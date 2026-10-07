import { splitQuestionTable } from "./questionTable";

const strip = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// Palabras que nombran algo que hay que VER.
const VISUAL =
  /\b(grafica|grafico|figura|diagrama|imagen|dibujo|ilustracion|mapa|esquema|foto|fotografia|plano|tabla)\b/;
// Señales de que la pregunta manda a mirarlo («según la tabla», «la gráfica
// muestra»). «Tabla de multiplicar» no las tiene y no se descarta.
const POINTS_AT =
  /\b(muestra|muestran|mostrada|mostrado|observa|observe|mira|mire|segun|de acuerdo con|siguiente|anterior|arriba|abajo|adjunta|adjunto|presentada|presentado|a continuacion)\b/;

/**
 * ¿La pregunta cita una gráfica, figura o tabla que no se muestra?
 * Una tabla escrita dentro del texto (formato markdown) sí cuenta como
 * mostrada: QuestionText la dibuja.
 */
export function refersToMissingVisual(question) {
  if (!question || typeof question.question !== "string") return false;
  if (splitQuestionTable(question.question).table) return false;
  const text = strip(
    [question.question, ...(question.options || [])].join(" "),
  );
  return VISUAL.test(text) && POINTS_AT.test(text);
}

/**
 * Filtra las preguntas inservibles y devuelve también los índices que se
 * conservaron, para mantener alineada la secuencia de DBA.
 */
export function keepSelfContained(questions) {
  const kept = [];
  const indexes = [];
  (questions || []).forEach((q, i) => {
    if (refersToMissingVisual(q)) return;
    kept.push(q);
    indexes.push(i);
  });
  return { questions: kept, indexes };
}
