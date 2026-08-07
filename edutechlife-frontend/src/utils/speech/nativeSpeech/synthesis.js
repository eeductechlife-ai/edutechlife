import { ensureUserInteraction } from "./constants.js";
import { VOICE_PROFILES, VOICE_FALLBACKS } from "../voiceProfiles.js";
import { audioCache } from "../audioCache.js";
import {
  __backendReachable,
  __testBackend,
  API_BASE_URL,
} from "../googleTtsClient.js";

const debugLog = (...args) => {
  if (import.meta.env.VITE_DEBUG_LOGGING) console.log(...args);
};

let currentAudio = null;
let safetyTimeout = null;
let isSpeaking = false;
let ttsGeneration = 0;
let currentTtsGeneration = 0;

const speakTextConversational = async (
  text,
  profile = "valeria",
  overrides = {},
  onEndCallback,
  onPermissionError,
  onStartCallback,
) => {
  const gen = ++ttsGeneration;
  currentTtsGeneration = gen;

  if (isSpeaking) {
    stopSpeech();
  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (safetyTimeout) {
    clearTimeout(safetyTimeout);
    safetyTimeout = null;
  }

  const isDev =
    import.meta.env.DEV ||
    (typeof window !== "undefined" && window.location.hostname === "localhost");
  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    (isDev ? "http://localhost:3001" : "https://edutechlife-api.vercel.app");
  const voice = VOICE_PROFILES[profile] || VOICE_PROFILES.valeria;

  const cleanup = () => {
    isSpeaking = false;
    if (safetyTimeout) {
      clearTimeout(safetyTimeout);
      safetyTimeout = null;
    }
    currentAudio = null;
  };

  const handleEnd = () => {
    cleanup();
    if (onEndCallback) onEndCallback();
  };

  isSpeaking = true;

  safetyTimeout = setTimeout(() => {
    cleanup();
    if (onEndCallback) onEndCallback();
  }, 30000);

  const toBrowserPitch = (googlePitch) => {
    const clamped = Math.max(-20, Math.min(20, googlePitch || 0));
    return Math.max(0.5, Math.min(1.5, 1.0 + clamped / 40));
  };

  const useNativeSpeech = async () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      cleanup();
      if (onEndCallback) onEndCallback();
      return false;
    }

    debugLog(
      `🎤 VOZ NATIVA ACTIVADA (backends no disponibles, perfil="${profile}")`,
    );
    await ensureUserInteraction();

    return new Promise((resolve) => {
      const doSpeak = (voicesList) => {
        try {
          window.speechSynthesis.cancel();

          const spanishVoices = voicesList.filter(
            (v) => v.lang && v.lang.startsWith("es"),
          );
          debugLog(
            `🎤 VOCES NATIVAS: ${voicesList.length} total, ${spanishVoices.length} español`,
          );
          spanishVoices.forEach((v) =>
            debugLog(`   → ${v.name} (${v.lang})`),
          );

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "es-MX";
          utterance.rate = Math.min(1.0, voice.speakingRate || 0.9);
          utterance.volume = 1.0;
          const isMaleProfile = [
            "valerio",
            "nico",
            "nico_premium",
            "nico_authority",
          ].includes(profile);

          const isMaleName = (name) => {
            const femaleKeywords = [
              "Paulina",
              "Monica",
              "Sabina",
              "Helena",
              "Laura",
              "Sofia",
              "Valentina",
              "Daniela",
              "Camila",
              "Lucia",
              "Sandy",
              "Shelley",
              "Grandma",
              "Microsoft Sabina",
              "Microsoft Helena",
              "Microsoft Laura",
              "Microsoft Paulina",
              "Microsoft Monica",
              "Microsoft Sabina Desktop",
              "Zira",
              "Susan",
              "Hazel",
              "Google US English",
              "Google UK English Female",
            ];
            const maleKeywords = [
              "Jorge",
              "Andres",
              "Carlos",
              "Pablo",
              "Santiago",
              "Microsoft Carlos",
              "Microsoft Pablo",
              "Microsoft Santiago",
              "Microsoft Jorge",
              "Microsoft Andres",
              "Microsoft Felipe",
              "David",
              "James",
              "Google UK English Male",
              "Google US English Male",
              "Microsoft David Desktop",
              "Microsoft Mark",
              "Rocko",
              "Eddy",
              "Reed",
            ];
            if (maleKeywords.some((k) => name.includes(k))) return true;
            if (femaleKeywords.some((k) => name.includes(k))) return false;
            return !femaleKeywords.some((k) =>
              ["A", "D", "F", "H", "J"].some((e) => name.endsWith(e)),
            );
          };

          const latinRegions = ["es-MX", "es-US", "es-CO", "es-419", "es-ES"];
          const latinMatch = (v) => latinRegions.some((r) => v.lang === r);

          const priority = [
            ...(isMaleProfile
              ? [
                  (v) =>
                    isMaleName(v.name) &&
                    latinMatch(v) &&
                    (v.name.includes("Microsoft") ||
                      v.name.includes("Carlos") ||
                      v.name.includes("Jorge")),
                  (v) => isMaleName(v.name) && latinMatch(v),
                ]
              : [
                  (v) =>
                    !isMaleName(v.name) &&
                    latinMatch(v) &&
                    (v.name.includes("Microsoft") || v.name.includes("Google")),
                  (v) => !isMaleName(v.name) && latinMatch(v),
                ]),
            (v) => latinMatch(v),
            (v) => v.lang.startsWith("es"),
            ...(isMaleProfile
              ? [(v) => isMaleName(v.name)]
              : [(v) => !isMaleName(v.name)]),
            (v) => true,
          ];

          let bestVoice = null;
          for (const matcher of priority) {
            bestVoice = voicesList.find(matcher);
            if (bestVoice) break;
          }

          if (bestVoice) {
            utterance.voice = bestVoice;
            utterance.pitch = toBrowserPitch(voice.pitch);
            window.__voiceDebug = {
              lastVoice: bestVoice.name,
              lastProfile: profile,
              lastPitch: "nativo",
              path: "native-fallback",
              backendReachable: __backendReachable,
            };
            debugLog(
              `🎤 VOZ [NATIVA] → ${bestVoice.name} (${bestVoice.lang}) rate:${utterance.rate}`,
            );
          } else {
            window.__voiceDebug = {
              lastVoice: "default",
              lastProfile: profile,
              lastPitch: "nativo",
              path: "native-fallback",
              backendReachable: __backendReachable,
            };
            console.warn(`🎤 VOZ [NATIVA] → default`);
          }

          utterance.onend = () => {
            handleEnd();
            resolve(true);
          };
          utterance.onstart = () => {
            if (onStartCallback) onStartCallback();
          };
          utterance.onerror = (event) => {
            console.error("❌ Error voz nativa:", event.error);
            cleanup();
            if (onEndCallback) onEndCallback();
            resolve(false);
          };

          window.speechSynthesis.speak(utterance);
          isSpeaking = true;
        } catch (e) {
          console.error("❌ Error en voz nativa:", e);
          cleanup();
          if (onEndCallback) onEndCallback();
          resolve(false);
        }
      };

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        doSpeak(voices);
        return;
      }

      let resolved = false;
      const onVoicesChanged = () => {
        if (resolved) return;
        resolved = true;
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak(window.speechSynthesis.getVoices());
      };
      window.speechSynthesis.onvoiceschanged = onVoicesChanged;
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          window.speechSynthesis.onvoiceschanged = null;
          doSpeak([]);
        }
      }, 2000);
    });
  };

  let gotAudio = false;

  const cachedAudio = audioCache.get(profile, text);
  if (cachedAudio) {
    gotAudio = true;
    currentAudio = new Audio(`data:audio/mp3;base64,${cachedAudio}`);
    currentAudio.volume = 1.0;
    currentAudio.onended = handleEnd;
    currentAudio.onplay = () => {
      if (onStartCallback) onStartCallback();
    };
    currentAudio.onerror = (e) => {
      console.error("Error reproduciendo audio cacheado:", e);
      cleanup();
      if (onEndCallback) onEndCallback();
    };
    try {
      await ensureUserInteraction();
      await currentAudio.play();
    } catch (playError) {
      if (playError.name === "NotAllowedError") {
        cleanup();
        await useNativeSpeech();
        return;
      }
      throw playError;
    }
    return;
  }

  const rawBackends = [...new Set([apiBase, API_BASE_URL])].filter(Boolean);
  const backends = [];
  for (const url of rawBackends) {
    if (
      url.startsWith("http://localhost") ||
      url.startsWith("http://127.0.0.1")
    ) {
      const reachable = await __testBackend(url);
      if (!reachable) {
        debugLog(`🎤 Backend local ${url} no disponible, saltando...`);
        continue;
      }
    }
    backends.push(url);
  }
  if (backends.length === 0) {
    backends.push(...rawBackends);
  }

  const voiceFallbacks = VOICE_FALLBACKS[profile] || [];

  for (const currentApi of backends) {
    if (gotAudio) break;
    debugLog(
      `🎤 SPEECH: perfil="${profile}", voz="${voice.name}", api="${currentApi}"`,
    );

    for (const voiceOption of [voice, ...voiceFallbacks]) {
      try {
        const response = await fetch(`${currentApi}/api/tts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: (() => {
            const c = new AbortController();
            setTimeout(() => c.abort(), 20000);
            return c.signal;
          })(),
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode: voiceOption.languageCode,
              name: voiceOption.name,
            },
            audioConfig: {
              audioEncoding: "MP3",
              pitch: voiceOption.pitch || 0,
              speakingRate: voiceOption.speakingRate || 1.0,
              ...(voiceOption.effectsProfileId
                ? { effectsProfileId: voiceOption.effectsProfileId }
                : {}),
            },
          }),
        });

        if (!response.ok) {
          console.warn(
            `⚠️ TTS error HTTP ${response.status} en ${currentApi}, saltando backend...`,
          );
          break;
        }

        const data = await response.json();

        if (data.audioContent) {
          audioCache.set(profile, text, data.audioContent);
          const bytes = atob(data.audioContent).length;
          window.__voiceDebug = {
            lastVoice: voiceOption.name,
            lastProfile: profile,
            lastPitch: voiceOption.pitch,
            lastSpeakingRate: voiceOption.speakingRate,
            path: "google-tts",
            backendReachable: true,
            api: currentApi,
            cacheSize: audioCache.size,
          };
          debugLog(
            `🎤 VOZ ACTIVA [GOOGLE TTS] → ${voiceOption.name} (pitch:${voiceOption.pitch}, rate:${voiceOption.speakingRate}, profile:${profile}, size:${(bytes / 1024).toFixed(0)}KB, cache:${audioCache.size})`,
          );
          if (gen !== currentTtsGeneration) {
            cleanup();
            return;
          }
          gotAudio = true;
          currentAudio = new Audio(
            `data:audio/mp3;base64,${data.audioContent}`,
          );
          currentAudio.volume = 1.0;
          currentAudio.onended = handleEnd;
          currentAudio.onplay = () => {
            if (onStartCallback) onStartCallback();
          };
          currentAudio.onerror = (e) => {
            console.error("Error reproduciendo audio:", e);
            cleanup();
            if (onEndCallback) onEndCallback();
          };
          try {
            await ensureUserInteraction();
            await currentAudio.play();
          } catch (playError) {
            if (playError.name === "NotAllowedError") {
              console.warn(
                "⚠️ Autoplay bloqueado por el navegador. Usando voz nativa...",
              );
              cleanup();
              await useNativeSpeech();
              return;
            }
            throw playError;
          }
          return;
        }
      } catch (voiceError) {
        if (voiceError.name === "NotAllowedError") {
          console.warn(
            "⚠️ Audio bloqueado por el navegador (requiere gesto del usuario)",
          );
          if (onPermissionError) onPermissionError(voiceError.message);
          cleanup();
          if (onEndCallback) onEndCallback();
          return;
        }
        if (
          voiceError.name === "TypeError" ||
          voiceError.message?.includes("Failed to fetch") ||
          voiceError.message?.includes("NetworkError")
        ) {
          window.__voiceDebug = {
            path: "network-error",
            api: currentApi,
            voice: voiceOption.name,
            error: voiceError.message,
            code: voiceError.code,
          };
          console.warn(
            `⚠️ Backend ${currentApi} no disponible, probando siguiente...`,
          );
          break;
        }
        if (
          voiceError.name === "AbortError" ||
          voiceError.message?.includes("aborted")
        ) {
          window.__voiceDebug = {
            path: "timeout",
            api: currentApi,
            voice: voiceOption.name,
            timeout: 20000,
          };
          console.warn(
            `⚠️ TTS timeout (20s) en ${currentApi} para ${voiceOption.name}, probando siguiente...`,
          );
          continue;
        }
        console.warn(
          `⚠️ TTS fallback: ${voiceOption.name} (${voiceError.message || voiceError})`,
        );
        continue;
      }
    }
  }

  if (!gotAudio) {
    if (gen !== currentTtsGeneration) {
      cleanup();
      return;
    }
    try {
      await useNativeSpeech();
    } catch (e) {
      cleanup();
      if (onEndCallback) onEndCallback();
    }
  }
};

const stopSpeech = () => {
  isSpeaking = false;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (safetyTimeout) {
    clearTimeout(safetyTimeout);
    safetyTimeout = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

export { speakTextConversational, stopSpeech };
