export const STYLE_MAP = {
  visual: {
    name: "APRENDIZ VISUAL",
    color: "var(--color-corporate)",
    bgGradient:
      "linear-gradient(135deg, rgba(77, 168, 196, 0.15), rgba(77, 168, 196, 0.05))",
    description:
      "Entiendes más fácil lo que puedes ver: imágenes, gráficos, colores y esquemas.",
    strategies: [
      "Usa colores y subrayados en tus apuntes",
      "Crea mapas mentales y diagramas",
      "Mira videos educativos",
      "Usa tarjetas de estudio con imágenes",
      "Organiza la información en esquemas",
    ],
    icon: "Video",
    tip: "Mira el tema antes de estudiarlo, con un video o un esquema, para entenderlo mejor",
  },
  auditivo: {
    name: "APRENDIZ AUDITIVO",
    color: "var(--color-mint)",
    bgGradient:
      "linear-gradient(135deg, rgba(102, 204, 204, 0.15), rgba(102, 204, 204, 0.05))",
    description:
      "Entiendes más fácil lo que escuchas y conversas: explicaciones, audios y charlas.",
    strategies: [
      "Graba y escucha tus notas",
      "Explica en voz alta lo que aprendes",
      "Escucha podcasts educativos",
      "Participa en debates y conversaciones",
      "Repasa con alguien, preguntándose por turnos",
    ],
    icon: "Headphones",
    tip: "Graba tus notas y escúchalas cuando vayas de camino o tengas un rato libre",
  },
  kinestesico: {
    name: "APRENDIZ KINESTÉSICO",
    color: "var(--color-vak-kinestesico-500)",
    bgGradient:
      "linear-gradient(135deg, rgba(232, 168, 56, 0.15), rgba(232, 168, 56, 0.05))",
    description:
      "Entiendes más fácil lo que haces y practicas: moverte, probar y construir.",
    strategies: [
      "Escribe tus notas a mano",
      "Haz pausas activas cada 25 minutos",
      "Practica con ejercicios reales",
      "Muévete mientras repasas",
      "Aprende haciendo proyectos",
    ],
    icon: "Activity",
    tip: "Estudiar de pie o caminando puede ayudarte a concentrarte",
  },
};

/**
 * Lo que ve el estudiante en su resultado. Los colores de relleno son los
 * mismos que usa IngenIA para cada estilo; `ink` es la versión oscura para
 * texto sobre fondo claro.
 */
export const STYLE_INSIGHTS = {
  visual: {
    label: "Visual",
    verb: "viendo",
    emoji: "👁️",
    fill: "#06D6A0",
    ink: "#047857",
    superpower: "Entiendes rápido lo que puedes ver dibujado o con colores.",
    tips: [
      "Convierte tus apuntes en mapas mentales o dibujos",
      "Subraya con colores: un color por cada idea",
    ],
    challenge:
      "Esta semana resume un tema de clase en un dibujo o mapa de una sola hoja.",
  },
  auditivo: {
    label: "Auditivo",
    verb: "escuchando",
    emoji: "👂",
    fill: "#A855F7",
    ink: "#7E22CE",
    superpower: "Recuerdas lo que oyes y explicas bien con tus palabras.",
    tips: [
      "Explícale el tema a alguien y luego pídele que te lo explique a ti",
      "Escucha un resumen en audio o grábate repasando",
    ],
    challenge:
      "Esta semana explícale a alguien en casa un tema del colegio, como si fueras el profe.",
  },
  kinestesico: {
    label: "Kinestésico",
    verb: "haciendo",
    emoji: "🏃",
    fill: "#FB8500",
    ink: "#C2410C",
    superpower: "Aprendes rápido cuando pruebas las cosas con tus manos.",
    tips: [
      "Estudia en bloques cortos y muévete en las pausas",
      "Escribe tarjetas y ordénalas sobre la mesa",
    ],
    challenge:
      "Esta semana explica un tema usando objetos que tengas en casa, como fichas, tapas o cubiertos.",
  },
};

export const getCaracteristicasEstilo = (style) => {
  const map = {
    visual: [
      "Suele aprender mejor viendo imágenes, gráficos y diagramas",
      "Le funcionan los mapas mentales, los esquemas y los resúmenes visuales",
      "Recuerda con facilidad rostros, lugares y cosas que vio",
      "Se siente cómodo con el orden y los detalles",
      "Puede distraerse con ruidos fuertes o ambientes desordenados",
      "Disfruta el arte, el diseño y las presentaciones visuales",
      "Entiende rápido cuando la información está bien presentada",
      "Prefiere leer las instrucciones antes que escucharlas",
    ],
    auditivo: [
      "Suele aprender mejor escuchando explicaciones y conversando",
      "Le funcionan los debates, las charlas y las dinámicas habladas",
      "Recuerda con facilidad melodías, ritmos y cosas que escuchó",
      "Se expresa con claridad cuando habla",
      "Disfruta la música, los podcasts y los audiolibros",
      "Puede distraerse con demasiados estímulos visuales",
      "Repasa mejor repitiendo en voz alta o grabándose",
      "Suele encontrar más fácil practicar idiomas hablando",
    ],
    kinestesico: [
      "Suele aprender mejor haciendo, tocando y probando",
      "Le funcionan las actividades prácticas, los proyectos y los experimentos",
      "Se siente cómodo con el movimiento y las actividades con el cuerpo",
      "Necesita moverse con frecuencia para mantener la concentración",
      "Disfruta los deportes, el baile y las manualidades",
      "Recuerda mejor lo que vive y siente",
      "Piensa mejor mientras camina o se mueve",
      "Suele disfrutar los trabajos en los que hay que construir o armar",
    ],
  };
  return map[style] || map.visual;
};

export const getTipsPadres = (style) => {
  const map = {
    visual: [
      "Organicen juntos un espacio de estudio ordenado, con colores y esquemas",
      "Usen calendarios visuales y listas de tareas con dibujos o íconos",
      "Refuercen lo aprendido con documentales, infografías y videos educativos",
      "Inviten a hacer mapas mentales, cuadros y resúmenes con colores",
      "Reduzcan las distracciones sonoras, como música con letra o ruido de fondo",
      "Tengan a la mano marcadores, notas adhesivas y hojas para dibujar",
      "Dejen que decore y personalice su espacio de estudio",
    ],
    auditivo: [
      "Lean en voz alta los temas de estudio o pídanle que les explique lo aprendido",
      "Graben las lecciones importantes para que pueda repasarlas después",
      "Usen podcasts educativos, audiolibros y canciones didácticas",
      "Conversen en casa sobre lo que se vio en el colegio",
      "Inventen rimas, canciones o frases para memorizar conceptos",
      "Si le ayuda, déjenle estudiar con música instrumental suave de fondo",
      "Animen a participar en grupos de estudio y exposiciones orales",
    ],
    kinestesico: [
      "Permitan pausas activas cada 20 o 25 minutos de estudio",
      "Usen experimentos, maquetas y proyectos manuales",
      "Dejen que camine o se mueva mientras repasa",
      "Tengan a la mano materiales para manipular, como plastilina, fichas o kits",
      "Incluyan el movimiento en la rutina: estudiar de pie o con pausas activas",
      "Enseñen con juegos de roles, simulaciones y actividades al aire libre",
      "Dejen que tome notas a mano en lugar de escribir en computador",
    ],
  };
  return map[style] || map.visual;
};

const STYLE_NAMES = {
  visual: "visual",
  auditivo: "auditivo",
  kinestesico: "kinestésico",
};

const percentagesFromCounts = (counts, total) => {
  const sum = total || counts.visual + counts.auditivo + counts.kinestesico;
  const pct = (n) => (sum ? Math.round((n / sum) * 100) : 0);
  return {
    visual: pct(counts.visual),
    auditivo: pct(counts.auditivo),
    kinestesico: pct(counts.kinestesico),
  };
};

/** Lectura corta del resultado para el informe, según la edad. */
export const getAnalysisText = (diagnosis, age) => {
  const style = diagnosis?.predominantStyle;
  const insight = STYLE_INSIGHTS[style];
  if (!insight) return { main: "", footer: "" };

  const counts = diagnosis.counts || { visual: 0, auditivo: 0, kinestesico: 0 };
  const pct =
    diagnosis.scores || percentagesFromCounts(counts, diagnosis.total);
  const second = Object.entries(pct)
    .filter(([key]) => key !== style)
    .sort(([, a], [, b]) => b - a)[0];
  const secondInsight = second ? STYLE_INSIGHTS[second[0]] : null;
  const name = diagnosis.studentName || "El estudiante";

  const main =
    age <= 10
      ? `¡Hola, ${name}! Con tus respuestas vimos que hoy aprendes más fácil ${insight.verb} (${pct[style]}%). ${secondInsight ? `Después viene aprender ${secondInsight.verb} (${second[1]}%). ` : ""}${insight.superpower}`
      : `En esta actividad, ${name} mostró más preferencia por aprender ${insight.verb} (${pct[style]}%)${secondInsight ? `, seguida de aprender ${secondInsight.verb} (${second[1]}%)` : ""}. ${diagnosis.isMixed ? "La diferencia entre las dos es pequeña, así que se ve un perfil mixto. " : ""}${insight.superpower}`;

  return {
    main,
    footer:
      "Las tres formas de aprender se complementan. Conviene usar con más frecuencia las estrategias de la forma principal, sin dejar de practicar las otras.",
  };
};

/**
 * Nota de Valeria para el informe de la familia. Habla como guía de
 * aprendizaje con IA: describe preferencias de hoy, no emite un diagnóstico.
 */
export const getValentinaCommentary = (diagnosis, studentName, studentAge) => {
  if (!diagnosis) return "";

  const age = parseInt(diagnosis.studentAge) || parseInt(studentAge);
  if (!age || isNaN(age)) return "";

  let ageGroup = "teen";
  if (age >= 6 && age <= 10) ageGroup = "child";
  else if (age >= 11 && age <= 14) ageGroup = "preteen";

  const style = diagnosis.predominantStyle;
  const name = diagnosis.studentName || studentName || "Estudiante";
  const counts = diagnosis.counts || { visual: 0, auditivo: 0, kinestesico: 0 };
  const insight = STYLE_INSIGHTS[style];

  if (!insight) {
    return `Hola ${name}, soy Valeria, tu guía de aprendizaje con IA de Edutechlife. Tus respuestas muestran cómo te gusta aprender hoy. Prueba las ideas de este informe y quédate con las que te funcionen.`;
  }

  const pct =
    diagnosis.scores || percentagesFromCounts(counts, diagnosis.total);
  const second = Object.entries(pct)
    .filter(([key]) => key !== style)
    .sort(([, a], [, b]) => b - a)[0];
  const secondName = second ? STYLE_NAMES[second[0]] : "";
  const secondPct = second ? second[1] : 0;
  const mixed = !!diagnosis.secondaryStyle;

  const intro = {
    child: `¡Hola, ${name}! Soy Valeria. Gracias por contestar con tanta calma. Así aprendes tú.`,
    preteen: `Hola, ${name}. Soy Valeria, tu guía de aprendizaje. Con tus respuestas armé tu mezcla para aprender.`,
    teen: `Hola, ${name}. Soy Valeria, la guía de aprendizaje con IA de Edutechlife. Esto es lo que mostraron tus respuestas.`,
  }[ageGroup];

  const mix = {
    child: `Tu mezcla quedó así: ${pct.visual}% viendo, ${pct.auditivo}% escuchando y ${pct.kinestesico}% haciendo.`,
    preteen: `Tu mezcla quedó así: visual ${pct.visual}%, auditivo ${pct.auditivo}% y kinestésico ${pct.kinestesico}%.`,
    teen: `Tu mezcla: visual ${pct.visual}%, auditivo ${pct.auditivo}% y kinestésico ${pct.kinestesico}%.`,
  }[ageGroup];

  const reading = mixed
    ? `Aprendes bien de dos formas, ${STYLE_NAMES[style]} y ${secondName}. Hoy se te dio un poco más la ${STYLE_NAMES[style]}.`
    : `Hoy se te dio más la forma ${STYLE_NAMES[style]}, y tu segunda forma favorita es la ${secondName} (${secondPct}%).`;

  const superpower = `Tu superpoder: ${insight.superpower.charAt(0).toLowerCase()}${insight.superpower.slice(1)}`;
  const how = `Para estudiar: ${insight.tips.map((t) => t.charAt(0).toLowerCase() + t.slice(1)).join(", y ")}.`;

  const closing = {
    child:
      "Todos aprendemos de muchas formas y puede ir cambiando. Prueba estos trucos y cuéntale a tu familia cuál te gustó más.",
    preteen:
      "Todos aprendemos de varias formas y la tuya puede cambiar con el tiempo. Prueba estos trucos esta semana y quédate con los que te sirvan.",
    teen: "Esto muestra tus preferencias de hoy y puede cambiar. No es un diagnóstico ni una etiqueta: es una pista para estudiar más a gusto. Quédate con lo que te funcione.",
  }[ageGroup];

  return [intro, `${mix} ${reading}`, `${superpower}. ${how}`, closing].join(
    "\n\n",
  );
};
