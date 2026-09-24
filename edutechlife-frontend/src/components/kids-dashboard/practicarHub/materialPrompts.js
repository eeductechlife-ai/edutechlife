import { getDbaForSubjectGrade } from "../../../utils/dbaCatalog";

// Practicar subject ids → curriculo_col.json ids.
const CURRICULO_ID = {
  historia: "sociales",
  ciencias_sociales: "sociales",
  ciencias_naturales: "ciencias",
};

export function gradeTopics(subjectId, grade) {
  if (!grade) return [];
  const id = CURRICULO_ID[subjectId] || subjectId;
  return getDbaForSubjectGrade(id, Number(grade)).map((d) => d.text);
}

const FORMAT = {
  resumen: {
    isJson: false,
    maxTokens: 1100,
    instructions:
      "Escribe un resumen de máximo 250 palabras en Markdown. Usa 2 o 3 subtítulos cortos (##), viñetas y resalta los conceptos clave en **negrita**. Termina con una línea que empiece con 'Recuerda:' y la idea más importante. Sin tablas ni HTML.",
  },
  mapa: {
    isJson: true,
    maxTokens: 900,
    instructions:
      'Crea un mapa mental. Responde SOLO con JSON válido: {"centro": "tema central en 2-5 palabras", "ramas": [{"idea": "idea principal corta", "emoji": "un emoji", "detalles": ["detalle corto", "detalle corto"]}]}. Entre 3 y 5 ramas, cada una con 2 o 3 detalles de máximo 10 palabras.',
  },
  infografia: {
    isJson: true,
    maxTokens: 900,
    instructions:
      'Crea el contenido de una infografía. Responde SOLO con JSON válido: {"titulo": "título corto y llamativo", "subtitulo": "una frase que explique el tema", "bloques": [{"emoji": "un emoji", "titulo": "idea clave en 2-5 palabras", "texto": "explicación de máximo 18 palabras"}], "dato": "un dato curioso y verdadero de máximo 20 palabras"}. Entre 4 y 5 bloques.',
  },
  ejercicios: {
    isJson: true,
    maxTokens: 1400,
    instructions:
      'Crea 5 ejercicios de práctica, de fácil a difícil. Responde SOLO con JSON válido: {"ejercicios": [{"pregunta": "enunciado claro", "pista": "una pista que ayude sin dar la respuesta", "respuesta": "respuesta correcta", "explicacion": "por qué, en una o dos frases"}]}.',
  },
  video: {
    isJson: true,
    maxTokens: 600,
    instructions:
      'Sugiere 4 búsquedas para encontrar videos educativos en YouTube en español. No inventes títulos, canales ni enlaces. Responde SOLO con JSON válido: {"busquedas": [{"texto": "texto para buscar en YouTube", "aprenderas": "qué aprenderá, en una frase"}]}.',
  },
};

export function buildMaterialRequest(
  type,
  { subjectLabel, topic, gradeLabel, age },
) {
  const f = FORMAT[type];
  const reader = age ? `${age} años, ${gradeLabel}` : gradeLabel;
  return {
    isJson: f.isJson,
    maxTokens: f.maxTokens,
    messages: [
      {
        role: "system",
        content: `Eres un tutor para estudiantes colombianos (${reader}). Escribe en español sencillo, con frases cortas y ejemplos de la vida diaria en Colombia. Ajusta la dificultad al grado y sigue el currículo del MEN. ${f.instructions}`,
      },
      {
        role: "user",
        content: `Materia: ${subjectLabel}. Tema: "${topic}".`,
      },
    ],
  };
}

const str = (v) => (typeof v === "string" ? v.trim() : "");

// Validates model output into the shape each view renders; null means unusable.
export function parseMaterial(type, raw) {
  if (type === "resumen") {
    const text = typeof raw === "string" ? raw : raw?.content || "";
    return text.trim() ? { text } : null;
  }
  const obj = typeof raw === "string" ? safeJson(raw) : raw;
  if (!obj) return null;
  if (type === "mapa") {
    const ramas = (obj.ramas || [])
      .map((r) => ({
        idea: str(r.idea),
        emoji: str(r.emoji) || "💡",
        detalles: (r.detalles || []).map(str).filter(Boolean).slice(0, 4),
      }))
      .filter((r) => r.idea);
    return ramas.length
      ? { centro: str(obj.centro), ramas: ramas.slice(0, 6) }
      : null;
  }
  if (type === "infografia") {
    const bloques = (obj.bloques || [])
      .map((b) => ({
        emoji: str(b.emoji) || "💡",
        titulo: str(b.titulo),
        texto: str(b.texto),
      }))
      .filter((b) => b.titulo && b.texto);
    return bloques.length
      ? {
          titulo: str(obj.titulo) || "Infografía",
          subtitulo: str(obj.subtitulo),
          bloques: bloques.slice(0, 6),
          dato: str(obj.dato),
        }
      : null;
  }
  if (type === "ejercicios") {
    const list = (obj.ejercicios || [])
      .map((e) => ({
        pregunta: str(e.pregunta),
        pista: str(e.pista),
        respuesta: str(String(e.respuesta ?? "")),
        explicacion: str(e.explicacion),
      }))
      .filter((e) => e.pregunta && e.respuesta);
    return list.length ? { ejercicios: list.slice(0, 8) } : null;
  }
  if (type === "video") {
    const list = (obj.busquedas || [])
      .map((b) => ({ texto: str(b.texto), aprenderas: str(b.aprenderas) }))
      .filter((b) => b.texto);
    return list.length ? { busquedas: list.slice(0, 6) } : null;
  }
  return null;
}

function safeJson(text) {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    return start >= 0 ? JSON.parse(text.slice(start, end + 1)) : null;
  } catch {
    return null;
  }
}
