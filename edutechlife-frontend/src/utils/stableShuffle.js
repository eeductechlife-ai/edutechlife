/**
 * Reubicación determinista de las opciones de un quiz.
 *
 * Los bancos de preguntas se escribieron con la respuesta correcta casi
 * siempre en la misma posición (p. ej. la opción B en 6/6 preguntas). En vez
 * de aleatorizar (impredecible y difícil de testear), se coloca la opción
 * correcta en una posición que va rotando con el índice de la pregunta, de
 * modo que la respuesta nunca cae siempre en la misma letra. El resto de
 * opciones también rota para no conservar el orden original.
 *
 * @param {{options?: unknown[], correct?: number}} question
 * @param {number} [seed] - índice estable de la pregunta (0-based)
 */
export function withShuffledOptions(question, seed = 0) {
  if (!question || !Array.isArray(question.options)) return question;
  const length = question.options.length;
  if (length < 2 || typeof question.correct !== "number") return question;

  const target = ((seed % length) + length) % length;
  const rest = [];
  for (let i = 0; i < length; i++) {
    if (i !== question.correct) rest.push(i);
  }
  const shift = rest.length ? seed % rest.length : 0;
  const rotated = rest.slice(shift).concat(rest.slice(0, shift));

  const order = [];
  let r = 0;
  for (let pos = 0; pos < length; pos++) {
    order.push(pos === target ? question.correct : rotated[r++]);
  }

  return {
    ...question,
    options: order.map((i) => question.options[i]),
    correct: target,
  };
}

export default withShuffledOptions;
