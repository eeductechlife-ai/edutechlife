// ==========================================
// Utility: Mood detection from text
// ==========================================
export function scrollMessagesToBottom(container) {
  if (!container || typeof container.scrollTo !== "function") return;
  container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
}

export function inferMoodFromText(text) {
  const t = text.toLowerCase();
  if (
    /suicid|matarme|quitarme la vida|no quiero vivir|dañarme|lastimarme|acabar con todo|desaparecer|no vale la pena|sin esperanza|quiero morir|me duele el alma/i.test(
      t,
    )
  )
    return { mood: "CRISIS_ALERT", confidence: 0.95 };
  if (
    /triste|mal|aburrido|cansado|desanimado|no puedo|difícil|frustrado|pesado|agotado/i.test(
      t,
    )
  )
    return { mood: "triste", confidence: 0.7 };
  if (
    /feliz|genial|excelente|logré|entendí|me encantó|gracias|increíble|contento|alegre|wow|divertido/i.test(
      t,
    )
  )
    return { mood: "feliz", confidence: 0.8 };
  if (
    /enojado|molesto|rabia|no quiero|fastidio|harto|basta|me enfada|irritado/i.test(
      t,
    )
  )
    return { mood: "enojado", confidence: 0.7 };
  if (
    /nervioso|miedo|preocupado|ansioso|qué pasa si|temor|asustado|estrés|estresado/i.test(
      t,
    )
  )
    return { mood: "ansioso", confidence: 0.7 };
  if (
    /confundido|no entiendo|qué significa|cómo es|no sé|duda|complicado|lío|enredado/i.test(
      t,
    )
  )
    return { mood: "confundido", confidence: 0.6 };
  return null;
}

const TIME_LOCALE_MAP = { en: "en-US", pt: "pt-BR", es: "es-ES" };

export function getRelativeTime(timestamp, locale = "es", t = null) {
  const now = new Date();
  const msgTime = new Date(timestamp);
  const diffMs = now - msgTime;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return t ? t("dani.time_now") : "ahora";
  if (diffMin < 60)
    return t ? t("dani.time_min", { min: diffMin }) : `hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24)
    return t
      ? t("dani.time_hours", { hours: diffHours })
      : `hace ${diffHours}h`;
  return msgTime.toLocaleTimeString(TIME_LOCALE_MAP[locale] || "es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ==========================================
// Utility: Extract academic topic
// ==========================================
export const SUBJECT_KEYWORDS = [
  {
    topic: "Matemáticas",
    keywords: [
      "matemáticas",
      "mate",
      "álgebra",
      "cálculo",
      "geometría",
      "trigonometría",
      "ecuación",
      "ecuaciones",
      "fracciones",
      "números",
      "suma",
      "resta",
      "multiplicación",
      "división",
      "porcentaje",
      "estadística",
    ],
    icon: "📐",
  },
  {
    topic: "Lenguaje",
    keywords: [
      "lenguaje",
      "español",
      "lectura",
      "gramática",
      "literatura",
      "poesía",
      "cuento",
      "novela",
      "escritura",
      "ortografía",
      "redacción",
      "ensayo",
    ],
    icon: "📖",
  },
  {
    topic: "Ciencias",
    keywords: [
      "ciencias",
      "biología",
      "química",
      "física",
      "naturaleza",
      "ecología",
      "célula",
      "organismo",
      "experimento",
      "reacción",
      "energía",
      "fuerza",
    ],
    icon: "🔬",
  },
  {
    topic: "Historia",
    keywords: [
      "historia",
      "geografía",
      "sociales",
      "política",
      "civilización",
      "antiguo",
      "revolución",
      "cultura",
      "mapa",
      "país",
      "continente",
    ],
    icon: "🌍",
  },
  {
    topic: "Inglés",
    keywords: [
      "inglés",
      "idioma",
      "vocabulario",
      "grammar",
      "verbos",
      "pronunciación",
    ],
    icon: "🇬🇧",
  },
  {
    topic: "Arte",
    keywords: [
      "arte",
      "música",
      "dibujo",
      "pintura",
      "escultura",
      "teatro",
      "danza",
      "color",
    ],
    icon: "🎨",
  },
  {
    topic: "Tecnología",
    keywords: [
      "tecnología",
      "computación",
      "programación",
      "robótica",
      "código",
      "algoritmo",
      "internet",
      "computador",
      "software",
    ],
    icon: "💻",
  },
];

export function extractTopic(text) {
  const t = text.toLowerCase();
  for (const subject of SUBJECT_KEYWORDS) {
    for (const kw of subject.keywords) {
      if (t.includes(kw)) return subject;
    }
  }
  return null;
}
