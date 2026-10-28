import {
  ALL_LESSONS,
  ALL_LESSONS_EN,
  ALL_LESSONS_PT,
} from "../../../data/ialab";

export const MAX_MEMORY_KEY = "ialab_valerio_conversation";

export const LESSONS_BY_LOCALE = {
  en: ALL_LESSONS_EN,
  pt: ALL_LESSONS_PT,
  es: ALL_LESSONS,
};

// Divide un texto en frases completas para hablarlas de una en una

export const splitIntoSentences = (text) => {
  const sentences = [];
  let pending = text;
  while (true) {
    const match = pending.match(/[.!?…](?:\s|$|[\n\r])/);
    if (!match) break;
    const endIdx = match.index + 1;
    const sentence = pending.slice(0, endIdx).trim();
    pending = pending.slice(endIdx + match[0].length);
    if (sentence.length >= 5) sentences.push(sentence);
  }
  const rest = pending.trim();
  if (rest.length > 3) sentences.push(rest);
  return sentences;
};
