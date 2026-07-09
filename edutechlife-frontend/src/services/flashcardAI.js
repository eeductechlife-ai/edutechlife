import { callDeepseek } from "../utils/api";

// Mapeo de grados a rangos de edad y nivel de complejidad
const GRADE_LEVELS = {
  "1-3": {
    ages: "6-8 años",
    complexity: "muy simple",
    wordLimit: 15,
    defLimit: 1,
  },
  "4-6": {
    ages: "9-11 años",
    complexity: "simple",
    wordLimit: 25,
    defLimit: 2,
  },
  "7-9": {
    ages: "12-14 años",
    complexity: "académico",
    wordLimit: 35,
    defLimit: 3,
  },
  "10-12": {
    ages: "15-16+ años",
    complexity: "avanzado",
    wordLimit: 50,
    defLimit: 3,
  },
};

const buildSystemPrompt = (grade) => {
  const level = GRADE_LEVELS[grade] || GRADE_LEVELS["4-6"];

  return `Eres un asistente educativo experto que genera tarjetas de estudio (flashcards) adaptadas a estudiantes de ${level.ages}.

Genera EXACTAMENTE 10 tarjetas sobre el tema solicitado. Cada tarjeta debe tener esta estructura:
{
  "keyword": "palabra clave principal (máximo ${level.wordLimit} caracteres)",
  "definition": "explicación clara en ${level.defLimit} línea(s)",
  "example": "ejemplo práctico y concreto apropiado para la edad",
  "relatedTerms": ["término 1", "término 2", "término 3"]
}

REGLAS IMPORTANTES:
- Nivel de lenguaje: ${level.complexity}
- Contenido científicamente exacto y verificable
- Ejemplos del mundo real que el estudiante pueda reconocer
- Sin markdown, sin formatos especiales
- Las palabras relacionadas deben estar en el mismo tema
- La definición debe ser clara pero no demasiado técnica para la edad

Responde ÚNICAMENTE con un array JSON válido con EXACTAMENTE 10 objetos.`;
};

export async function generateFlashcards(topic, grade = "4-6") {
  if (!topic.trim()) {
    throw new Error("Por favor escribe un tema");
  }

  if (!GRADE_LEVELS[grade]) {
    throw new Error("Grado inválido");
  }

  const systemPrompt = buildSystemPrompt(grade);
  const userMessage = `Tema: "${topic.trim()}"\nGrado: ${grade} (${GRADE_LEVELS[grade].ages})`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ];

  const result = await callDeepseek(messages, {
    isJson: true,
    temperature: 0.7,
    maxTokens: 2500,
  });

  if (!Array.isArray(result) || result.length === 0) {
    throw new Error(
      "No se pudieron generar flashcards. Intenta con otro tema.",
    );
  }

  return result.slice(0, 10).map((card, i) => ({
    id: `${Date.now().toString(36)}-${i}-${Math.random().toString(36).slice(2, 5)}`,
    front: card.keyword || card.front || "Término",
    back: card.definition || card.back || "Definición",
    example: card.example || "Ejemplo",
    relatedTerms: Array.isArray(card.relatedTerms) ? card.relatedTerms : [],
    grade,
  }));
}

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

  // Default si no coincide ninguno
  return {
    color: "#4DA8C4",
    icon: "📖",
    name: "General",
  };
}
