import { speakTextConversational, stopSpeech } from "../../../utils/speech";
import {
  getVoiceOverrides,
  stripEmoji,
} from "../daniTutorChat/DaniVoiceController";

let run = 0;

export function toSpeakable(markdown) {
  return stripEmoji(String(markdown || ""))
    .replace(/[#*_>`~]+/g, " ")
    .replace(/^\s*-\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Dani's TTS call is capped at ~30 s, so long texts are read in short chunks.
function toChunks(text, max = 220) {
  const sentences = text.match(/[^.!?¡¿]+[.!?]*/g) || [text];
  const chunks = [];
  let cur = "";
  for (const s of sentences.map((x) => x.trim()).filter(Boolean)) {
    if ((cur + " " + s).length > max && cur) {
      chunks.push(cur);
      cur = s;
    } else {
      cur = cur ? `${cur} ${s}` : s;
    }
  }
  if (cur) chunks.push(cur);
  return chunks;
}

/** Reads text with Dani's voice; a new call interrupts the previous one. */
export function speakAsDani(text, { onEnd } = {}) {
  const current = ++run;
  const chunks = toChunks(toSpeakable(text));
  const next = (i) => {
    if (current !== run) return;
    if (i >= chunks.length) {
      onEnd?.();
      return;
    }
    speakTextConversational(
      chunks[i],
      "dani",
      getVoiceOverrides("explaining"),
      () => next(i + 1),
      () => next(i + 1),
    );
  };
  next(0);
  return current;
}

export function stopDani() {
  run += 1;
  stopSpeech();
}

export function isCurrentRun(id) {
  return id === run;
}
