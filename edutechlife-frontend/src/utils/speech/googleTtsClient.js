import { VOICE_PROFILES } from "./voiceProfiles.js";
import { audioCache } from "./audioCache.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "";

let __backendReachable = null;

const __testBackend = async (apiBase) => {
  if (__backendReachable !== null) return __backendReachable;
  try {
    const r = await fetch(`${apiBase}/api/health`, {
      method: "GET",
      signal: AbortSignal.timeout(300),
    });
    __backendReachable = r.ok;
  } catch (e) {
    __backendReachable = false;
  }
  return __backendReachable;
};

const prefetchTts = async (text, profile = "valeria", overrides = {}) => {
  if (!text || text.length < 3) return;
  try {
    const cached = audioCache.get(profile, text);
    if (cached) return;
    const apiBase =
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_URL ||
      (typeof window !== "undefined" && window.location.hostname === "localhost"
        ? "http://localhost:3001"
        : "https://edutechlife-backend.onrender.com");
    const voice = {
      ...(VOICE_PROFILES[profile] || VOICE_PROFILES.valeria),
      ...overrides,
    };
    const response = await fetch(`${apiBase}/api/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: voice.languageCode, name: voice.name },
        audioConfig: {
          audioEncoding: "MP3",
          pitch: voice.pitch || 0,
          speakingRate: voice.speakingRate || 1.0,
        },
      }),
    });
    if (!response.ok) return;
    const data = await response.json();
    if (data.audioContent) audioCache.set(profile, text, data.audioContent);
  } catch {}
};

const warmupTts = () => {
  const apiBase =
    import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";
  if (apiBase) __testBackend(apiBase);
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.getVoices();
  }
};

export {
  __backendReachable,
  __testBackend,
  API_BASE_URL,
  prefetchTts,
  warmupTts,
};
