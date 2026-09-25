// Turns a plan activity ("Fracciones con pizza de papel") into the place where
// the kid actually does it: a material generated on that topic, a reto of the
// subject, or an EduCards deck. The words in the activity decide first; when
// they say nothing, the kid's ADN style does.

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// Plan subject labels (AI prose) → Practicar subject ids.
const SUBJECT_RULES = [
  [
    /matem|fraccion|numero|suma|resta|multiplic|divis|geometr|algebra/,
    "matematicas",
  ],
  [/ingl|english/, "ingles"],
  [/lengu|espanol|lectura|escritura|ortograf|gramatic|castellano/, "lenguaje"],
  [/social|histor|geograf|civic|democra/, "historia"],
  [
    /cienc|biolog|quimic|fisic|natural|volcan|planeta|celula|animal/,
    "ciencias",
  ],
  [/arte|artistic|musica|dibujo/, "arte"],
];

/** Practicar subject id for a free-text label, or null. */
export function subjectIdFor(...texts) {
  const t = norm(texts.filter(Boolean).join(" "));
  const hit = SUBJECT_RULES.find(([re]) => re.test(t));
  return hit ? hit[1] : null;
}

const TOOL_RULES = [
  [
    /reto|pregunta|quiz|simulacro|evaluacion|examen de practica/,
    { tool: "retos" },
  ],
  [/tarjeta|flashcard|educard|vocabulario|memoriz/, { tool: "educards" }],
  [/mapa mental|mapa conceptual|esquema/, { tool: "material", type: "mapa" }],
  [
    /infograf|linea del tiempo|diagrama|cartel|afiche/,
    { tool: "material", type: "infografia" },
  ],
  [/video|tutorial|documental/, { tool: "material", type: "video" }],
  [
    /ejercicio|problema|resolver|calcula|practica con/,
    { tool: "material", type: "ejercicios" },
  ],
  [
    /resumen|lee |leer|lectura|cuento|escucha|podcast|cancion/,
    { tool: "material", type: "resumen" },
  ],
];

const BY_TIPO = {
  visual: "infografia",
  auditivo: "resumen",
  kinestesico: "ejercicios",
  lectura: "resumen",
};

/**
 * @returns {{tool: "material"|"retos"|"educards", type?: string,
 *            topic: string, subjectId: string|null}}
 */
export function activityRoute(
  activity,
  week = {},
  { weakSubjects = [], vakStyle } = {},
) {
  const text = norm(activity?.titulo);
  const hit = TOOL_RULES.find(([re]) => re.test(` ${text} `));
  const route = hit
    ? { ...hit[1] }
    : {
        tool: "material",
        type: BY_TIPO[activity?.tipo] || BY_TIPO[vakStyle] || "infografia",
      };
  const subjectId =
    subjectIdFor(week.focus, activity?.titulo) ||
    subjectIdFor(weakSubjects[0]) ||
    null;
  return { ...route, topic: topicOf(activity?.titulo, route.tool), subjectId };
}

// "Tarjetas de las tablas del 6" → deck topic "tablas del 6": the tool words
// only picked the tool; the AI should get the subject matter.
function topicOf(titulo, tool) {
  const t = String(titulo || "").trim();
  if (tool === "material") return t;
  const cleaned = t
    .replace(
      /^(haz|hacer|juega|jugar|practica|repasa)?\s*(unas|unos|una|un)?\s*(retos|reto|quiz|tarjetas|flashcards|educards)\s+(de|sobre|con)\s+(las|los|la|el)?\s*/i,
      "",
    )
    .trim();
  return cleaned || t;
}

export const TOOL_LABEL = {
  retos: "🎮 Reto",
  educards: "🃏 EduCards",
  mapa: "🧠 Mapa mental",
  infografia: "🖼️ Infografía",
  video: "🎬 Videos",
  ejercicios: "✏️ Ejercicios",
  resumen: "📄 Resumen",
};

export const routeLabel = (r) =>
  TOOL_LABEL[r.tool === "material" ? r.type : r.tool];
