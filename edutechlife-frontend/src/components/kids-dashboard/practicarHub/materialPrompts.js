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

// Extract numeric grade from a label like "Grado 7" or "7°"
function gradeNum(gradeLabel) {
  if (!gradeLabel) return 6;
  const m = gradeLabel.match(/\d+/);
  return m ? Number(m[0]) : 6;
}

// Grade-adaptive content depth: more branches/details/words for higher grades
function gradeDepth(gradeLabel) {
  const n = gradeNum(gradeLabel);
  if (n <= 3)
    return {
      ramas: "3 o 4",
      detalles: 2,
      palabrasDetalle: 8,
      bloques: 4,
      palabrasTexto: 14,
    };
  if (n <= 6)
    return {
      ramas: "4 o 5",
      detalles: 3,
      palabrasDetalle: 12,
      bloques: 5,
      palabrasTexto: 20,
    };
  return {
    ramas: "5 o 6",
    detalles: 4,
    palabrasDetalle: 18,
    bloques: 6,
    palabrasTexto: 28,
  };
}

function mapaInstructions(d) {
  return (
    `Crea un mapa mental completo y educativo. Responde SOLO con JSON válido: ` +
    `{"centro": "tema central en 2-5 palabras", ` +
    `"subtitulo": "frase introductoria que contextualiza el tema, máximo 10 palabras", ` +
    `"ramas": [{"idea": "concepto clave en 2-5 palabras", "emoji": "un emoji relacionado", ` +
    `"detalles": ["detalle de máximo ${d.palabrasDetalle} palabras"], ` +
    `"curiosidad": "dato curioso o ejemplo colombiano de la vida real, máximo 15 palabras"}], ` +
    `"conclusion": "la idea más importante para recordar, máximo 15 palabras"}. ` +
    `Usa ${d.ramas} ramas, cada una con exactamente ${d.detalles} detalles bien explicados. ` +
    `El campo "curiosidad" debe sorprender al estudiante y conectar el tema con su vida cotidiana.`
  );
}

function infografiaInstructions(d) {
  return (
    `Crea una infografía educativa. Elige el formato que MEJOR explica este tema: ` +
    `"pasos" (proceso, etapas o partes de algo), ` +
    `"datos" (cifras, porcentajes o fechas reales comprobables), ` +
    `"comparacion" (dos cosas que se comparan), ` +
    `"cronologia" (línea de tiempo con fechas importantes), ` +
    `"ciclo" (fases que se repiten, como ciclos biológicos o del agua). ` +
    `Responde SOLO con JSON válido según el formato elegido: ` +
    `Para pasos/datos: {"formato": "pasos|datos", "titulo": "título llamativo", ` +
    `"subtitulo": "frase que explique el tema", ` +
    `"bloques": [{"emoji": "emoji", "titulo": "idea en 2-5 palabras", ` +
    `"texto": "explicación de máximo ${d.palabrasTexto} palabras", ` +
    `"cifra": "solo en datos: número real, ej: 70% o 1810"}], ` +
    `"dato": "dato curioso y verdadero, máximo 20 palabras", ` +
    `"conclusion": "idea clave para recordar, máximo 15 palabras"}. ` +
    `Para comparacion: añade "comparacion": {"izquierda": {"titulo": "...", "emoji": "...", ` +
    `"puntos": ["rasgo en máximo 10 palabras"]}, "derecha": {...}, ` +
    `"semejanzas": ["algo en común, máximo 12 palabras"]}, ` +
    `"conclusion": "idea clave para recordar, máximo 15 palabras". ` +
    `Para cronologia: {"formato": "cronologia", "titulo": "...", "subtitulo": "...", ` +
    `"eventos": [{"año": "fecha o año", "hecho": "descripción en máximo ${d.palabrasTexto} palabras", "emoji": "emoji"}], ` +
    `"dato": "...", "conclusion": "..."}. ` +
    `Para ciclo: {"formato": "ciclo", "titulo": "...", "subtitulo": "...", ` +
    `"etapas": [{"emoji": "emoji", "nombre": "fase en 2-4 palabras", "descripcion": "máximo ${d.palabrasTexto} palabras"}], ` +
    `"dato": "...", "conclusion": "..."}. ` +
    `Usa entre ${d.bloques - 1} y ${d.bloques} elementos. Nunca inventes cifras. Sin HTML.`
  );
}

const FORMAT = {
  resumen: {
    isJson: false,
    maxTokens: 1100,
    instructions:
      "Escribe un resumen de máximo 250 palabras en Markdown. Usa 2 o 3 subtítulos cortos (##), viñetas y resalta los conceptos clave en **negrita**. Termina con una línea que empiece con 'Recuerda:' y la idea más importante. Sin tablas ni HTML.",
  },
  mapa: { isJson: true, maxTokens: 1400 },
  infografia: { isJson: true, maxTokens: 1600 },
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
  const depth = gradeDepth(gradeLabel);
  const reader = age ? `${age} años, ${gradeLabel}` : gradeLabel;
  const instructions =
    type === "mapa"
      ? mapaInstructions(depth)
      : type === "infografia"
        ? infografiaInstructions(depth)
        : f.instructions;
  return {
    isJson: f.isJson,
    maxTokens: f.maxTokens,
    messages: [
      {
        role: "system",
        content: `Eres un tutor para estudiantes colombianos (${reader}). Escribe en español sencillo, con frases cortas y ejemplos de la vida diaria en Colombia. Ajusta la dificultad al grado y sigue el currículo del MEN. ${instructions}`,
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
        curiosidad: str(r.curiosidad),
      }))
      .filter((r) => r.idea);
    return ramas.length
      ? {
          centro: str(obj.centro),
          subtitulo: str(obj.subtitulo),
          ramas: ramas.slice(0, 6),
          conclusion: str(obj.conclusion),
        }
      : null;
  }
  if (type === "infografia") return parseInfographic(obj);
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

function parseSide(s) {
  const puntos = (Array.isArray(s?.puntos) ? s.puntos : [])
    .map(str)
    .filter(Boolean)
    .slice(0, 5);
  const titulo = str(s?.titulo);
  return titulo && puntos.length
    ? { titulo, emoji: str(s.emoji) || "🔹", puntos }
    : null;
}

// Picks the drawing format; anything the model gets half right degrades to
// "pasos" so the kid always gets an image instead of an error.
function parseInfographic(obj) {
  const base = {
    titulo: str(obj.titulo) || "Infografía",
    subtitulo: str(obj.subtitulo),
    dato: str(obj.dato),
    conclusion: str(obj.conclusion),
  };

  // Cronologia → render as datos (year as the big number/cifra)
  if (obj.formato === "cronologia") {
    const eventos = (obj.eventos || [])
      .map((e) => ({
        emoji: str(e.emoji) || "📅",
        titulo: str(e.año || e.fecha),
        texto: str(e.hecho),
        cifra: str(e.año || e.fecha).slice(0, 14),
      }))
      .filter((e) => e.titulo && e.texto)
      .slice(0, 7);
    if (eventos.length)
      return {
        ...base,
        formato: eventos.every((e) => e.cifra) ? "datos" : "pasos",
        bloques: eventos,
      };
  }

  // Ciclo → render as pasos (sequential steps in a cycle)
  if (obj.formato === "ciclo") {
    const etapas = (obj.etapas || [])
      .map((e) => ({
        emoji: str(e.emoji) || "🔄",
        titulo: str(e.nombre),
        texto: str(e.descripcion),
      }))
      .filter((e) => e.titulo && e.texto)
      .slice(0, 7);
    if (etapas.length) return { ...base, formato: "pasos", bloques: etapas };
  }

  const bloques = (obj.bloques || [])
    .map((b) => ({
      emoji: str(b.emoji) || "💡",
      titulo: str(b.titulo),
      texto: str(b.texto),
      cifra: str(String(b.cifra ?? "")).slice(0, 14),
    }))
    .filter((b) => b.titulo && b.texto)
    .slice(0, 7);
  const izquierda = parseSide(obj.comparacion?.izquierda);
  const derecha = parseSide(obj.comparacion?.derecha);
  if (obj.formato === "comparacion" && izquierda && derecha) {
    const semejanzas = (obj.comparacion.semejanzas || [])
      .map(str)
      .filter(Boolean)
      .slice(0, 3);
    return {
      ...base,
      formato: "comparacion",
      bloques: bloques.map(({ cifra: _c, ...b }) => b),
      comparacion: { izquierda, derecha, semejanzas },
    };
  }
  if (!bloques.length) return null;
  // One missing number would leave an empty badge, so "datos" is all-or-nothing.
  const datos = obj.formato === "datos" && bloques.every((b) => b.cifra);
  return {
    ...base,
    formato: datos ? "datos" : "pasos",
    bloques: datos ? bloques : bloques.map(({ cifra: _c, ...b }) => b),
  };
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
