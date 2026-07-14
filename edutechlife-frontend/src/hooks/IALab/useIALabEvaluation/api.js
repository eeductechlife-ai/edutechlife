import { API_BASE_URL } from "../../../config/api";

export async function generateExercises({ config, locale, signal }) {
  const activeLocale = locale || "es";

  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "deepseek-chat",
      isJson: true,
      messages: [
        { role: "system", content: config.generateSystemPrompt(activeLocale) },
        { role: "user", content: config.generateUserPrompt(activeLocale) },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Error de API: ${response.status}`);
  }

  const data = await response.json();
  const content = data.result;

  const jsonMatch =
    content.match(/```(?:json)?\s*\n?(\{[\s\S]*?\})\n?\s*```/) ||
    content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No se pudo extraer JSON de la respuesta");
  }

  const rawJson = jsonMatch[1] || jsonMatch[0];
  const cleaned = rawJson
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]")
    .replace(/([{,])\s*(\w+)\s*:/g, '$1"$2":');

  let exercises;
  try {
    exercises = JSON.parse(cleaned);
  } catch {
    try {
      exercises = JSON.parse(rawJson);
    } catch {
      throw new Error("JSON inválido en la respuesta");
    }
  }

  if (
    !exercises ||
    typeof exercises !== "object" ||
    Object.keys(exercises).length === 0
  ) {
    throw new Error("Estructura de ejercicios inválida");
  }

  return exercises;
}

export async function evaluateAnswers({
  config,
  exercises,
  responses,
  signal,
}) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "deepseek-chat",
      isJson: true,
      messages: [
        { role: "system", content: config.evaluateSystemPrompt() },
        {
          role: "user",
          content: config.evaluateUserPrompt(exercises, responses),
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Error de API: ${response.status}`);
  }

  const data = await response.json();
  const content = data.result;

  const jsonMatch =
    content.match(/```(?:json)?\s*\n?(\{[\s\S]*?\})\n?\s*```/) ||
    content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No se pudo extraer JSON de la evaluación");
  }

  const evaluation = JSON.parse(jsonMatch[1] || jsonMatch[0]);

  const notas = ["nota_ej1", "nota_ej2", "nota_ej3", "nota_ej4"];
  for (const key of notas) {
    if (typeof evaluation[key] !== "number") evaluation[key] = 0;
  }
  if (typeof evaluation.notaGlobal !== "number") {
    evaluation.notaGlobal =
      Math.round(
        (((evaluation.nota_ej1 || 0) +
          (evaluation.nota_ej2 || 0) +
          (evaluation.nota_ej3 || 0) +
          (evaluation.nota_ej4 || 0)) /
          config.totalSteps) *
          10,
      ) / 10;
  }

  return evaluation;
}
