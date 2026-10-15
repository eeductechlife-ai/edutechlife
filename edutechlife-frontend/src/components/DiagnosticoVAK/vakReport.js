import {
  STYLE_MAP,
  STYLE_INSIGHTS,
  getAnalysisText,
  getCaracteristicasEstilo,
  getTipsPadres,
  getValentinaCommentary,
  isTie,
  isThreeWayTie,
} from "./vakStyles";

export const STYLE_ORDER = ["visual", "auditivo", "kinestesico"];

/** Colores de marca (logo): azul profundo y turquesa. */
export const BRAND = {
  navy: "#072F46",
  teal: "#199DB9",
  ink: "#1E293B",
  muted: "#64748B",
  line: "#E2E8F0",
  paper: "#F8FAFC",
};

const MEANING = {
  visual: "Imágenes, colores y esquemas",
  auditivo: "Explicaciones, audios y charlas",
  kinestesico: "Practicar, moverse y construir",
};

const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const noPeriod = (s) => s.replace(/[.\s]+$/, "");

/**
 * Todo lo que dice el informe, en un solo lugar: la vista previa en pantalla
 * y el PDF leen de aquí, así nunca cuentan cosas distintas.
 */
export function buildVakReport(diagnosis, { parentName = "", date } = {}) {
  if (!diagnosis || !STYLE_INSIGHTS[diagnosis.predominantStyle]) return null;

  const main = diagnosis.predominantStyle;
  const scores = diagnosis.scores || {};
  const ranked = STYLE_ORDER.filter((s) => s !== main).sort(
    (a, b) => (scores[b] || 0) - (scores[a] || 0),
  );
  const runnerUp = ranked[0];
  const second = diagnosis.secondaryStyle || null;
  const tiedTwo = isTie(diagnosis, main, second || runnerUp);
  const tiedThree = isThreeWayTie(diagnosis);
  const age = parseInt(diagnosis.studentAge, 10) || 12;
  const name = (diagnosis.studentName || "Estudiante").trim();
  const insight = STYLE_INSIGHTS[main];
  const secondInsight = second ? STYLE_INSIGHTS[second] : null;

  let headline;
  if (tiedThree) headline = "Aprende de las tres formas por igual";
  else if (tiedTwo)
    headline = `Aprende igual de bien ${insight.verb} y ${STYLE_INSIGHTS[second || runnerUp].verb}`;
  else if (secondInsight)
    headline = `Aprende mejor ${insight.verb}, y también ${secondInsight.verb}`;
  else headline = `Aprende mejor ${insight.verb}`;

  const profileLabel = tiedThree
    ? "Mezcla equilibrada"
    : secondInsight
      ? `${insight.label} + ${secondInsight.label}`
      : insight.label;

  const tips = secondInsight
    ? [insight.tips[0], secondInsight.tips[0]]
    : insight.tips.slice(0, 2);

  const analysis = getAnalysisText(diagnosis, age);
  const when = date ? new Date(date) : new Date();

  return {
    name,
    age,
    guardian: String(parentName || diagnosis.parentName || "").trim(),
    dateLabel: when.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    main,
    second,
    tie: tiedThree ? "three" : tiedTwo ? "two" : "none",
    headline,
    profileLabel,
    description: STYLE_MAP[main].description,
    styles: STYLE_ORDER.map((key) => ({
      key,
      label: STYLE_INSIGHTS[key].label,
      verb: STYLE_INSIGHTS[key].verb,
      pct: scores[key] || 0,
      fill: STYLE_INSIGHTS[key].fill,
      ink: STYLE_INSIGHTS[key].ink,
      meaning: MEANING[key],
      // Con empate a tres ninguna forma "gana": no se marca ninguna.
      isMain: !tiedThree && key === main,
      isSecond: !tiedThree && key === second,
    })),
    summary: analysis.main,
    summaryNote: analysis.footer,
    superpower: insight.superpower,
    challenge: insight.challenge,
    tips,
    strategies: STYLE_MAP[main].strategies,
    traits: getCaracteristicasEstilo(main).slice(0, 4),
    parentTips: getTipsPadres(main).slice(0, 6),
    weekPlan: [
      {
        day: "Día 1",
        text: `Prueba este truco: ${lowerFirst(noPeriod(tips[0]))}.`,
      },
      {
        day: "Día 3",
        text: `Prueba este otro: ${lowerFirst(noPeriod(tips[1]))}.`,
      },
      {
        day: "Día 5",
        text: insight.challenge.replace(/^Esta semana /, "Reto: "),
      },
      {
        day: "Día 7",
        text: "En familia: conversen qué truco funcionó mejor y repítanlo la semana que viene.",
      },
    ],
    valeriaNote: getValentinaCommentary(diagnosis, name, age),
    personalTip: STYLE_MAP[main].tip,
    disclaimer:
      "Este mapa muestra cómo le gusta aprender hoy, a partir de unas pocas preguntas. Puede cambiar con el tiempo y según la materia. No es un diagnóstico psicológico ni una evaluación profesional, y no reemplaza la orientación de un docente o de un especialista.",
  };
}
