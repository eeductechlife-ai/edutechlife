export { VOICE_PROFILES, VOICE_FALLBACKS } from "./voiceProfiles.js";
export { AudioCache, audioCache } from "./audioCache.js";
export {
  __backendReachable,
  __testBackend,
  API_BASE_URL,
  prefetchTts,
  warmupTts,
} from "./googleTtsClient.js";
export {
  speakTextConversational,
  stopSpeech,
  speakValerioSentence,
  fireConfetti,
  speakAsValentina,
  getValentinaVoiceConfig,
} from "./nativeSpeech.js";
export { iniciarReconocimiento, stopRecognition } from "./speechRecognition.js";
