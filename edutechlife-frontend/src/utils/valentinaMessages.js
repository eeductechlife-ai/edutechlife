/**
 * Frases que Valeria dice en voz alta en el ADN de Aprendizaje.
 *
 * Valeria es una guía de aprendizaje con IA. Habla con calidez y como en una
 * charla, pero no finge ser una persona ni cuenta experiencias propias, no se
 * presenta como psicóloga y no afirma estudios o cifras.
 *
 * Reglas de la conversación:
 * - Nunca dice el número de la pregunta ni cuántas faltan: cansa a quien escucha.
 * - Nunca felicita una respuesta: no hay respuestas buenas ni malas. Agradece y
 *   reconoce el esfuerzo, no el contenido.
 * - Usa el nombre del estudiante de vez en cuando, no en cada pregunta.
 * - Ajusta el tono a la edad (hasta 10 años, más cercano y sencillo) y al
 *   ánimo que contó al empezar (si no se siente bien, va más despacio).
 */
const STYLE_VERBS = {
  visual: "viendo",
  auditivo: "escuchando",
  kinestesico: "haciendo",
};

const TRANSITIONS = {
  child: [
    "Vamos con otra.",
    "Ahora imagina esto.",
    "Te cuento otra situación.",
    "Gracias por contarme. Sigamos.",
    "Mmm, esta es divertida.",
    "Ahora piensa en esto.",
    "A ver qué dices de esta.",
  ],
  teen: [
    "Siguiente situación.",
    "Ahora piensa en esto.",
    "Va otra.",
    "Gracias, sigamos.",
    "Esta es interesante.",
    "Imagina esto.",
    "A ver qué harías aquí.",
  ],
};

// Cada cuántas preguntas Valeria dice el nombre en la transición.
const NAME_EVERY = 5;

const LETTERS = ["A", "B", "C", "D"];

// Hasta esta edad Valeria dice la letra de cada opción, como en los botones:
// quien todavía no lee bien sabe qué tocar.
const LETTERS_UP_TO_AGE = 8;

const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const noEndPunct = (s) => s.trim().replace(/[.!?…]+$/, "");
const firstName = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)[0] || "";
const ageGroup = (age) => ((parseInt(age, 10) || 12) <= 10 ? "child" : "teen");

const cleanOption = (opt) => noEndPunct((opt.text || "").replace(/[«»"]/g, ""));

/**
 * "A. O B. O C.": una frase por opción, para que la voz haga pausa entre
 * ellas. Unirlas con comas se enreda cuando una opción ya trae comas o una "o".
 * Con `letters`, "A: … B: … C: …", en el mismo orden de los botones.
 */
export const joinOptions = (options, { letters = false } = {}) =>
  options
    .map(cleanOption)
    .filter(Boolean)
    .map((t, i) => {
      if (letters) return `${LETTERS[i]}: ${lowerFirst(t)}.`;
      return i === 0 ? `${t}.` : `O ${lowerFirst(t)}.`;
    })
    .join(" ");

/** Aviso amable, una sola vez, cuando responde antes de pensarlo. */
export const slowDownNote = (age) =>
  ageGroup(age) === "child"
    ? "¡Vas rapidísimo! Tómate un momento para pensar cuál se parece más a ti."
    : "Vas rápido. Tómate un segundo con cada una: así el resultado se parece más a ti.";

/** Si se queda un rato sin responder: sin presión y ofreciendo ayuda. */
export const idleNudge = (age, name) => {
  const who = firstName(name);
  return ageGroup(age) === "child"
    ? `Tómate tu tiempo${who ? `, ${who}` : ""}, no hay afán. Si quieres que te la repita, toca Escuchar.`
    : "Sin afán. Si quieres que te la repita, toca Escuchar.";
};

/**
 * Cómo arranca Valeria cada pregunta.
 * `mode`: "forward" (avanza), "back" (volvió atrás), "resume" (retoma una
 * prueba a medias), "repeat" (pidió escucharla otra vez) o "plain" (solo la
 * pregunta, por ejemplo al activar la voz a mitad de camino).
 */
export const questionOpener = ({
  index = 0,
  total = 0,
  name = "",
  age,
  mood,
  mode = "forward",
  slowDown = false,
} = {}) => {
  const group = ageGroup(age);
  const kid = group === "child";
  const who = firstName(name);
  const low = mood === "sad";

  if (mode === "plain") return "";
  if (mode === "repeat") return kid ? "Claro, te la repito." : "Te la repito.";
  if (mode === "back")
    return "Volvamos a esta. Si quieres, puedes cambiar tu respuesta.";
  if (mode === "resume")
    return kid
      ? `¡Qué bueno que volviste${who ? `, ${who}` : ""}! Seguimos donde íbamos.`
      : `Hola de nuevo${who ? `, ${who}` : ""}. Seguimos donde íbamos.`;

  if (index === 0) {
    const hello = who ? `¡Hola, ${who}! Soy Valeria.` : "¡Hola! Soy Valeria.";
    const intro = kid
      ? "Te voy a contar unas situaciones y tú me dices qué harías. Aquí no hay respuestas buenas ni malas: solo quiero saber cómo eres tú."
      : "Te voy a plantear situaciones de todos los días y tú me dices qué harías. No hay respuestas correctas: entre más sincera sea tu respuesta, mejor te conozco.";
    const pace = low
      ? kid
        ? "Vamos con calma, sin afán."
        : "Vamos a tu ritmo, sin afán."
      : kid
        ? "¿Empezamos?"
        : "Empecemos.";
    return `${hello} ${intro} ${pace}`;
  }

  let base;
  if (total > 1 && index === total - 1) {
    base = kid && who ? `Y la última, ${who}.` : "Y la última.";
  } else if (total > 6 && index === Math.floor(total / 2)) {
    const half = kid
      ? `¡Ya vamos por la mitad${who ? `, ${who}` : ""}! Ya te voy conociendo mejor.`
      : "Ya vamos por la mitad. Gracias por tomártelo en serio.";
    base = low ? `${half} Si necesitas una pausa, puedes tomarla.` : half;
  } else {
    const list = TRANSITIONS[group];
    const line = list[(index - 1) % list.length];
    base =
      who && index % NAME_EVERY === 3 ? `${who}, ${lowerFirst(line)}` : line;
  }
  return slowDown ? `${slowDownNote(age)} ${base}` : base;
};

export const VALENTINA_MESSAGES = {
  all: {
    /**
     * Lectura de una pregunta. `ctx` trae index (desde 0), total, name, age,
     * mood y mode. El total solo sirve para saber la mitad y la última: nunca
     * se dice en voz alta.
     */
    readQuestion: (questionText, options, ctx = {}) => {
      const opener = questionOpener(ctx);
      const letters = (parseInt(ctx.age, 10) || 12) <= LETTERS_UP_TO_AGE;
      // En la primera (o al repetir) avisa que lo que sigue son las opciones,
      // porque están escritas como si las dijera el estudiante.
      const cue =
        ctx.index === 0 || ctx.mode === "repeat" ? "Te leo las opciones." : "";
      return [
        opener,
        questionText.trim(),
        cue,
        joinOptions(options, { letters }),
      ]
        .filter(Boolean)
        .join(" ");
    },

    resultsShort: (name, style, secondStyle = null, { age, mood } = {}) => {
      const kid = ageGroup(age) === "child";
      const who = firstName(name);
      const to = who ? `, ${who}` : "";
      const verb = STYLE_VERBS[style] || style;
      const second = secondStyle ? STYLE_VERBS[secondStyle] : null;
      const mix = second
        ? `aprendes bien ${verb} y también ${second}`
        : `hoy se te da más aprender ${verb}`;

      const open = kid
        ? `¡Lo lograste${to}! Gracias por contarme tantas cosas de ti.`
        : `Listo${to}. Gracias por responder con sinceridad.`;
      const care =
        mood === "sad"
          ? " Gracias por hacerlo aunque hoy no te sentías muy bien. Si algo te preocupa, cuéntaselo a tu acudiente o a un adulto de confianza."
          : "";
      const close = kid
        ? "Ninguna forma de aprender es mejor que otra: todos aprendemos de muchas maneras, y la tuya puede ir cambiando."
        : "Esto muestra cómo te gusta aprender hoy y puede cambiar. Ninguna forma es mejor que otra.";

      return `${open} Con tus respuestas vi que ${mix}. En pantalla tienes tu superpoder, unos trucos para estudiar y un reto para esta semana.${care} ${close}`;
    },
  },
};

export default VALENTINA_MESSAGES;
