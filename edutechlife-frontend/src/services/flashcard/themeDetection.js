// Detectar tema basado en palabras clave para asignar color/icono
export function detectThemeFromTopic(topic) {
  const topicLower = topic.toLowerCase();

  const themes = {
    science: {
      keywords: [
        "fotosíntesis",
        "célula",
        "adn",
        "biología",
        "física",
        "química",
        "átomo",
        "molécula",
        "ecosistema",
        "animal",
        "planta",
        "virus",
        "bacteria",
      ],
      color: "#2ECC71",
      icon: "🔬",
      name: "Ciencias",
    },
    history: {
      keywords: [
        "historia",
        "revolución",
        "imperio",
        "guerra",
        "conquistador",
        "civilización",
        "dinastía",
        "edad",
        "geografía",
        "mapa",
        "continente",
        "país",
      ],
      color: "#8B4513",
      icon: "📚",
      name: "Historia",
    },
    language: {
      keywords: [
        "idioma",
        "inglés",
        "español",
        "francés",
        "gramática",
        "vocabulario",
        "literatura",
        "poesía",
        "verbo",
        "sustantivo",
        "pronombre",
        "conjugación",
      ],
      color: "#E67E22",
      icon: "🗣️",
      name: "Idiomas",
    },
    math: {
      keywords: [
        "matemáticas",
        "número",
        "suma",
        "resta",
        "multiplicación",
        "división",
        "álgebra",
        "geometría",
        "ecuación",
        "fórmula",
        "ángulo",
        "triángulo",
      ],
      color: "#3498DB",
      icon: "🧮",
      name: "Matemáticas",
    },
    arts: {
      keywords: [
        "arte",
        "música",
        "pintura",
        "escultura",
        "compositor",
        "canción",
        "nota",
        "instrumento",
        "color",
        "dibujo",
        "danza",
        "teatro",
      ],
      color: "#E91E63",
      icon: "🎨",
      name: "Artes",
    },
    tech: {
      keywords: [
        "tecnología",
        "computadora",
        "programación",
        "código",
        "software",
        "internet",
        "robot",
        "algoritmo",
        "datos",
        "red",
        "app",
        "digital",
      ],
      color: "#9B59B6",
      icon: "💻",
      name: "Tecnología",
    },
  };

  for (const [key, theme] of Object.entries(themes)) {
    if (theme.keywords.some((keyword) => topicLower.includes(keyword))) {
      return theme;
    }
  }

  return {
    color: "#4DA8C4",
    icon: "📖",
    name: "General",
  };
}
