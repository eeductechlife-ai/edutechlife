// ADN de Aprendizaje (VAK) question banks. Each item is a real situation
// from school, home or free time, with one answer per channel:
// v = visual, a = auditivo, k = kinestésico. Answers carry their own emoji
// (never the style's) and are shown in a rotating order, so a kid can't
// pick "the eye one" or "always the first" and skew the result.

const q = (emoji, contexto, pregunta, v, a, k) => ({
  emoji,
  contexto,
  pregunta,
  opciones: { v, a, k },
});
const o = (emoji, texto) => ({ emoji, texto });

// 6–9 años: frases cortas y situaciones que un niño pequeño vive a diario.
export const KIDS_QUESTIONS = [
  q(
    "🦁",
    "En clase van a aprender sobre los animales de la selva.",
    "¿Qué te gusta más?",
    o("📸", "Ver fotos y videos de los animales"),
    o("🎧", "Escuchar sus sonidos y un cuento"),
    o("🐒", "Jugar a imitar a los animales"),
  ),
  q(
    "🎲",
    "Te regalan un juego de mesa nuevo.",
    "¿Cómo aprendes a jugarlo?",
    o("🖼️", "Miro los dibujos de la caja"),
    o("🗣️", "Le pido a alguien que me explique"),
    o("🙌", "Empiezo a jugar de una vez"),
  ),
  q(
    "🎵",
    "La profe les enseña una canción nueva.",
    "¿Cómo te la aprendes mejor?",
    o("📄", "Leyendo la letra"),
    o("🔁", "Escuchándola muchas veces"),
    o("💃", "Bailándola y haciendo los gestos"),
  ),
  q(
    "🔢",
    "Estás aprendiendo a sumar.",
    "¿Qué te ayuda más?",
    o("✏️", "Ver los números escritos en el tablero"),
    o("🗣️", "Decir los números en voz alta"),
    o("🖐️", "Contar con los dedos o con fichas"),
  ),
  q(
    "🍪",
    "Vas a hacer galletas con tu familia.",
    "¿Cómo aprendes mejor la receta?",
    o("👀", "Mirando cómo lo hacen primero"),
    o("👂", "Escuchando cada paso"),
    o("🤲", "Metiendo las manos en la masa"),
  ),
  q(
    "📖",
    "Vas a la biblioteca del colegio.",
    "¿Qué libro escoges?",
    o("🌈", "Uno con muchos dibujos y colores"),
    o("🎙️", "Uno que alguien me lea en voz alta"),
    o("🧩", "Uno con solapas y cosas para tocar"),
  ),
  q(
    "🔤",
    "Aprendes una palabra nueva: «mariposa».",
    "¿Cómo la recuerdas?",
    o("🖍️", "La veo escrita con colores"),
    o("🔊", "La digo varias veces"),
    o("✍️", "La escribo en el aire o con plastilina"),
  ),
  q(
    "⚽",
    "Suena el timbre del recreo.",
    "¿Qué prefieres hacer?",
    o("🎨", "Dibujar o mirar lo que hacen los demás"),
    o("😄", "Conversar y contar chistes"),
    o("🏃", "Jugar a la lleva o saltar lazo"),
  ),
  q(
    "🎈",
    "Fuiste a una fiesta de cumpleaños.",
    "¿Qué recuerdas más?",
    o("🎭", "Los colores y los disfraces"),
    o("🎶", "La música y lo que dijeron"),
    o("🕺", "Los juegos y los bailes"),
  ),
  q(
    "🧩",
    "Estás armando un rompecabezas.",
    "¿Cómo lo haces?",
    o("🖼️", "Miro la imagen de la caja"),
    o("💬", "Voy diciendo dónde va cada ficha"),
    o("🤏", "Pruebo fichas hasta que encajen"),
  ),
  q(
    "🙋",
    "No entendiste algo en clase.",
    "¿Qué le pides a la profe?",
    o("🖊️", "Que lo dibuje en el tablero"),
    o("🔁", "Que lo explique otra vez"),
    o("🧪", "Hacerlo yo con un ejemplo"),
  ),
  q(
    "🌙",
    "Antes de dormir…",
    "¿Qué te gusta más?",
    o("📚", "Mirar un libro de imágenes"),
    o("📻", "Que me cuenten un cuento"),
    o("🧸", "Jugar un ratico con mis juguetes"),
  ),
];

// 10–16 años: situaciones más elaboradas de estudio, tecnología y vida social.
export const TEEN_QUESTIONS = [
  q(
    "🌋",
    "Tu profe de ciencias va a explicar cómo funciona un volcán.",
    "¿Qué te ayudaría más a entenderlo de verdad?",
    o("🎞️", "Ver un video o un diagrama del volcán por dentro"),
    o("🎙️", "Escuchar al profe contarlo como una historia"),
    o("🧪", "Armar una maqueta y hacerla «erupcionar»"),
  ),
  q(
    "🗺️",
    "Tienes que llegar a la casa de un amigo que nunca has visitado.",
    "¿Cómo te orientas?",
    o("📱", "Miro el mapa en el celular antes de salir"),
    o("🗣️", "Pido que me expliquen las indicaciones paso a paso"),
    o("🚶", "Me voy guiando por lo que reconozco en el camino"),
  ),
  q(
    "📅",
    "Mañana tienes examen de sociales y debes memorizar fechas.",
    "¿Cómo estudias?",
    o("🖍️", "Hago una línea del tiempo con colores"),
    o("🎵", "Repito las fechas en voz alta o con una canción"),
    o("🗂️", "Escribo tarjetas y las ordeno sobre la mesa"),
  ),
  q(
    "🎮",
    "Descargas un videojuego que no conoces.",
    "¿Cómo aprendes a jugarlo?",
    o("📺", "Veo un tutorial o las imágenes de ayuda"),
    o("💬", "Le pregunto a alguien que ya lo juega"),
    o("🕹️", "Empiezo a jugar y aprendo equivocándome"),
  ),
  q(
    "👥",
    "Te toca un trabajo en grupo.",
    "¿Qué papel te sale más natural?",
    o("🖼️", "Diseñar las diapositivas o el cartel"),
    o("🎤", "Explicar y exponer frente al salón"),
    o("🔧", "Construir o hacer la parte práctica"),
  ),
  q(
    "🧮",
    "Te encuentras con un problema de matemáticas difícil.",
    "¿Qué haces primero?",
    o("📐", "Lo dibujo o hago un esquema"),
    o("🗨️", "Lo leo en voz alta o se lo explico a alguien"),
    o("🧱", "Pruebo con números u objetos hasta que salga"),
  ),
  q(
    "🎬",
    "Un amigo te pregunta por una película que viste hace meses.",
    "¿Qué recuerdas primero?",
    o("🌆", "Las escenas y cómo se veían los personajes"),
    o("🎼", "Los diálogos, la música o frases famosas"),
    o("💥", "Lo que sentiste en las escenas de acción"),
  ),
  q(
    "😣",
    "Estás estudiando y pierdes la concentración.",
    "¿Qué te distrae más?",
    o("🌀", "El desorden o cosas moviéndose a mi alrededor"),
    o("🔔", "Los ruidos o gente hablando cerca"),
    o("🪑", "Estar mucho tiempo sentado(a) sin moverme"),
  ),
  q(
    "🤝",
    "Un compañero no entiende un tema que tú sí.",
    "¿Cómo se lo explicas?",
    o("✏️", "Le hago un dibujo o le muestro un ejemplo escrito"),
    o("🗣️", "Se lo explico hablando con calma"),
    o("🙌", "Le muestro cómo se hace y le pido que lo intente"),
  ),
  q(
    "🏫",
    "Piensa en tu clase favorita.",
    "¿Qué la hace tan buena?",
    o("📊", "Tiene imágenes, videos y un tablero ordenado"),
    o("💬", "El profe cuenta historias y hay debates"),
    o("🧪", "Hay experimentos, juegos o salidas"),
  ),
  q(
    "📝",
    "Estás en clase y el profe explica algo importante.",
    "¿Cómo tomas apuntes?",
    o("🌈", "Con colores, flechas y dibujos"),
    o("👂", "Escribo poco: me concentro en escuchar"),
    o("✍️", "Escribo mucho a mano; eso me ayuda a recordar"),
  ),
  q(
    "🔐",
    "Tienes que recordar la clave de 6 números de tu cuenta.",
    "¿Cómo la memorizas?",
    o("🔢", "Me imagino los números escritos"),
    o("🥁", "La repito con ritmo en mi cabeza"),
    o("⌨️", "La marco varias veces hasta que mis dedos la saben"),
  ),
  q(
    "🎧",
    "Tienes una tarde libre.",
    "¿Qué te dan más ganas de hacer?",
    o("🎨", "Dibujar, ver series o tomar fotos"),
    o("🎶", "Escuchar música, podcasts o conversar"),
    o("🏀", "Hacer deporte, bailar o construir algo"),
  ),
  q(
    "🪛",
    "Te toca armar un mueble o un set de construcción.",
    "¿Cómo lo haces?",
    o("📘", "Sigo los dibujos del manual"),
    o("📢", "Pido que alguien me lea los pasos"),
    o("🔩", "Miro las piezas y voy probando"),
  ),
  q(
    "🌎",
    "Quieres mejorar tu inglés.",
    "¿Qué te funciona mejor?",
    o("🔤", "Tarjetas, subtítulos y palabras escritas"),
    o("🎤", "Canciones, series y conversaciones"),
    o("🎭", "Juegos, mímica o actuar diálogos"),
  ),
  q(
    "📖",
    "Estás leyendo un libro largo para el colegio.",
    "¿Cómo lo disfrutas más?",
    o("🎥", "Imaginando las escenas como una película"),
    o("🔈", "Escuchándolo en audiolibro o leyéndolo en voz baja"),
    o("🚶", "Cambiando de posición y tomando pausas activas"),
  ),
  q(
    "❓",
    "El profe dio una instrucción y no la entendiste.",
    "¿Qué pides?",
    o("🖊️", "Que la escriba en el tablero"),
    o("🔁", "Que la repita con otras palabras"),
    o("🧩", "Un ejemplo para hacerlo yo mismo"),
  ),
  q(
    "🏠",
    "Vas a estudiar en casa para un examen.",
    "¿Dónde te concentras mejor?",
    o("💡", "En un lugar ordenado y bien iluminado"),
    o("🎼", "En silencio o con música suave"),
    o("🧘", "Donde pueda levantarme y moverme un rato"),
  ),
  q(
    "📲",
    "Pasó algo muy emocionante y se lo quieres contar a un amigo.",
    "¿Cómo se lo cuentas?",
    o("📷", "Por mensaje con fotos o emojis"),
    o("🎙️", "Por nota de voz o llamada"),
    o("🤸", "En persona, actuando lo que pasó"),
  ),
  q(
    "🏆",
    "Te fue muy bien en una presentación.",
    "¿Qué fue lo que más te ayudó a prepararla?",
    o("🖼️", "Tener diapositivas o fichas bien organizadas"),
    o("🗣️", "Practicarla en voz alta varias veces"),
    o("🎯", "Ensayarla de pie, como si ya estuviera en el salón"),
  ),
];

export const questionsFor = (ageGroup) =>
  ageGroup === "early" ? KIDS_QUESTIONS : TEEN_QUESTIONS;

// Rotating answer order: the same channel is never always first.
const ORDERS = [
  ["v", "a", "k"],
  ["k", "v", "a"],
  ["a", "k", "v"],
];
export const answerOrder = (index) => ORDERS[index % ORDERS.length];

export const CHANNEL_STYLE = { v: "visual", a: "auditivo", k: "kinestesico" };

/** Percentages per style + predominant and (when close) secondary style. */
export function scoreVak(answers) {
  const counts = { visual: 0, auditivo: 0, kinestesico: 0 };
  answers.forEach((style) => {
    if (style in counts) counts[style] += 1;
  });
  const total = answers.length || 1;
  const scores = {
    visual: Math.round((counts.visual / total) * 100),
    auditivo: Math.round((counts.auditivo / total) * 100),
    kinestesico: Math.round((counts.kinestesico / total) * 100),
  };
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [first, second] = ranked;
  return {
    scores,
    predominantStyle: first[0],
    // Within 10 points the kid learns well both ways: say so.
    secondaryStyle: first[1] - second[1] <= 10 ? second[0] : null,
  };
}
