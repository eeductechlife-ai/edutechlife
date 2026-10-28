import { callDeepseekStream } from "../../../utils/api";
import { MAX_MEMORY_KEY } from "./IALabMaxPanelParts";

// Marcadores genéricos que no deben usarse como nombre del estudiante
const GENERIC_NAMES = [
  "usuario",
  "user",
  "estudiante",
  "student",
  "alumno",
  "invitado",
  "guest",
];

// Nombre para personalizar la conversación. Si el perfil no trae nombre y el
// valor es el marcador genérico, se prefiere no usar nombre antes que
// decirle "Usuario" al estudiante.
export const sanitizeStudentName = (rawStudentName) =>
  GENERIC_NAMES.includes(rawStudentName.trim().toLowerCase())
    ? ""
    : rawStudentName.trim();

// Carga la conversación guardada en localStorage
export const loadSavedConversation = () => {
  try {
    const saved = localStorage.getItem(MAX_MEMORY_KEY);
    // Conversaciones guardadas antes del renombre usan type "valerio".
    return saved
      ? JSON.parse(saved).map((m) =>
          m.type === "valerio" ? { ...m, type: "max" } : m,
        )
      : [];
  } catch {
    return [];
  }
};

// Helper: Extract topics from messages
export const extractTopicsFromMessages = (messages) => {
  const topics = new Set();
  const keywords = {
    "prompt engineering": ["prompt", "instruction", "role"],
    IA: ["ai", "ia", "inteligencia", "artificial"],
    "text to speech": ["tts", "audio", "voice"],
    chatgpt: ["chatgpt", "gpt", "openai"],
    gemini: ["gemini", "google"],
  };

  messages.forEach((msg) => {
    const lower = msg.toLowerCase();
    Object.entries(keywords).forEach(([topic, kws]) => {
      if (kws.some((kw) => lower.includes(kw))) {
        topics.add(topic);
      }
    });
  });

  return Array.from(topics).slice(0, 5);
};

// Helper: Calculate progress (simple heuristic)
export const calculateProgress = (conversation) => {
  const userMessages = conversation.filter((m) => m.type === "user").length;
  return Math.min(userMessages * 15, 95); // 15% per question, max 95%
};

// Basic sentiment detection (could be enhanced)
export const detectSentiment = (lastMessage) => {
  let sentiment = "neutral";
  if (lastMessage.toLowerCase().match(/confus|no entend|no entiend/))
    sentiment = "confused";
  if (lastMessage.toLowerCase().match(/gracias|excelent|perfecto/))
    sentiment = "confident";
  return sentiment;
};

// Saca del búfer las frases completas; devuelve las frases y el resto
// pendiente (las frases de menos de 5 caracteres se descartan).
export const takeCompleteSentences = (buffer) => {
  const sentences = [];
  let pending = buffer;
  while (true) {
    const match = pending.match(/[.!?…](?:\s|$|[\n\r])/);
    if (!match) break;
    const endIdx = match.index + 1;
    const sentence = pending.slice(0, endIdx).trim();
    pending = pending.slice(endIdx + match[0].length);
    if (sentence.length >= 5) sentences.push(sentence);
  }
  return { sentences, rest: pending };
};

// Llama a DeepSeek en streaming con un reintento ante timeout o cancelación
export const streamMaxResponse = async (messages, signal, onChunk) => {
  let retries = 0;
  const maxRetries = 1;

  while (true) {
    try {
      await callDeepseekStream(
        messages,
        { temperature: 0.7, maxTokens: 500, signal },
        false,
        onChunk,
      );
      break;
    } catch (err) {
      if (
        retries < maxRetries &&
        (err.name === "AbortError" || err.name === "TimeoutError")
      ) {
        retries++;
        if (import.meta.env.DEV)
          console.warn(`⚠️ Reintentando (${retries}/${maxRetries})...`);
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      throw err;
    }
  }
};

// Teclado en pantalla táctil: Enter inserta salto de línea en vez de enviar
export const isCoarsePointer = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(pointer: coarse)").matches;
