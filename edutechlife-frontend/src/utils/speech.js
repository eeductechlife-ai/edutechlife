const VOICE_PROFILES = {
  valeria: {
    languageCode: 'es-US',
    name: 'es-US-Standard-B',
    pitch: 0,
    speakingRate: 0.95,
    volumeGainDb: 2.5
  },
  valerio: {
    languageCode: 'es-US',
    name: 'es-US-Studio-B',
    pitch: -2.0,
    speakingRate: 0.9,
    volumeGainDb: 3.0
  },
  sistema: {
    languageCode: 'es-US',
    name: 'es-US-Neural2-C',
    pitch: 0,
    speakingRate: 1.0
  },
  nico: {
    languageCode: 'es-US',
    name: 'es-US-Standard-B',
    pitch: 0,
    speakingRate: 1.0
  },
  nico_premium: {
    languageCode: 'es-US',
    name: 'es-US-Neural2-B',
    pitch: 0,
    speakingRate: 1.05,
    volumeGainDb: 3.0,
    effectsProfileId: ['telephony-class-application']
  },
  nico_authority: {
    languageCode: 'es-US',
    name: 'es-US-Standard-B',
    pitch: 0,
    speakingRate: 1.05,
    volumeGainDb: 2.5
  },
  valentina: {
    languageCode: 'es-US',
    name: 'es-US-Journey-F',
    pitch: 0,
    speakingRate: 0.95,
    volumeGainDb: 2.5,
    effectsProfileId: ['telephony-class-application']
  },
  valentina_child: {
    languageCode: 'es-US',
    name: 'es-US-Journey-F',
    pitch: 0,
    speakingRate: 0.85,
    volumeGainDb: 3.0,
    effectsProfileId: ['telephony-class-application']
  },
  valentina_teen: {
    languageCode: 'es-US',
    name: 'es-US-Journey-F',
    pitch: 0,
    speakingRate: 1.0,
    volumeGainDb: 2.0,
    effectsProfileId: ['telephony-class-application']
  },
  dani: {
    languageCode: 'es-US',
    name: 'es-US-Journey-F',
    pitch: 0,
    speakingRate: 0.9,
    volumeGainDb: 2.5,
    effectsProfileId: ['telephony-class-application']
  }
};

const VOICE_FALLBACKS = {
  valeria: [
    { languageCode: 'es-US', name: 'es-US-Journey-F', pitch: 0, speakingRate: 0.95 },
    { languageCode: 'es-US', name: 'es-US-Neural2-C', pitch: 0, speakingRate: 1.0 },
    { languageCode: 'es-ES', name: 'es-ES-Neural2-A', pitch: 0, speakingRate: 0.95 }
  ],
  valerio: [
    { languageCode: 'es-US', name: 'es-US-Neural2-C', pitch: -2.0, speakingRate: 0.9, volumeGainDb: 3.0 },
    { languageCode: 'es-US', name: 'es-US-Wavenet-C', pitch: -1.5, speakingRate: 0.9, volumeGainDb: 2.5 },
    { languageCode: 'es-US', name: 'es-US-Neural2-D', pitch: -1.0, speakingRate: 0.95, volumeGainDb: 2.5 },
    { languageCode: 'es-CO', name: 'es-CO-Neural2-B', pitch: -1.0, speakingRate: 0.9, volumeGainDb: 2.5 }
  ],
  nico: [
    { languageCode: 'es-US', name: 'es-US-Neural2-B', pitch: 0, speakingRate: 1.0 },
    { languageCode: 'es-US', name: 'es-US-Neural2-A', pitch: 0, speakingRate: 1.0 },
    { languageCode: 'es-US', name: 'es-US-Neural2-C', pitch: 0, speakingRate: 1.0 },
    { languageCode: 'es-ES', name: 'es-ES-Neural2-B', pitch: 0, speakingRate: 1.0 },
  ],
  nico_premium: [
    { languageCode: 'es-US', name: 'es-US-Neural2-B', pitch: 0, speakingRate: 1.05 },
    { languageCode: 'es-US', name: 'es-US-Neural2-A', pitch: 0, speakingRate: 1.05 },
    { languageCode: 'es-US', name: 'es-US-Neural2-C', pitch: 0, speakingRate: 1.05 },
  ],
  valentina: [
    { languageCode: 'es-US', name: 'es-US-Journey-F', pitch: 0, speakingRate: 0.95 },
    { languageCode: 'es-US', name: 'es-US-Neural2-C', pitch: 0, speakingRate: 1.0 },
    { languageCode: 'es-ES', name: 'es-ES-Neural2-A', pitch: 0, speakingRate: 0.95 }
  ],
  valentina_child: [
    { languageCode: 'es-US', name: 'es-US-Journey-F', pitch: 0, speakingRate: 0.85 },
    { languageCode: 'es-US', name: 'es-US-Neural2-C', pitch: 0, speakingRate: 0.9 },
    { languageCode: 'es-ES', name: 'es-ES-Neural2-A', pitch: 0, speakingRate: 0.85 }
  ],
  valentina_teen: [
    { languageCode: 'es-US', name: 'es-US-Journey-F', pitch: 0, speakingRate: 1.0 },
    { languageCode: 'es-US', name: 'es-US-Neural2-C', pitch: 0, speakingRate: 1.1 },
    { languageCode: 'es-ES', name: 'es-ES-Neural2-A', pitch: 0, speakingRate: 1.0 }
  ],
  dani: [
    { languageCode: 'es-US', name: 'es-US-Journey-F', pitch: 0, speakingRate: 0.9 },
    { languageCode: 'es-US', name: 'es-US-Neural2-C', pitch: 0, speakingRate: 0.95 },
    { languageCode: 'es-CO', name: 'es-CO-Standard-A', pitch: 0, speakingRate: 0.9 },
    { languageCode: 'es-ES', name: 'es-ES-Neural2-A', pitch: 0, speakingRate: 0.9 }
  ]
};

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';

window.__voiceDebug = { lastVoice: null, lastProfile: null, lastPitch: null, path: null };
let __backendReachable = null; // null=unknown, true/false

const __testBackend = async (apiBase) => {
  if (__backendReachable !== null) return __backendReachable;
  try {
    const r = await fetch(`${apiBase}/api/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
    __backendReachable = r.ok;
  } catch (e) {
    __backendReachable = false;
  }
  return __backendReachable;
};

class AudioCache {
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.accessOrder = [];
  }

  get(profile, text) {
    const key = `${profile}:${text}`;
    const entry = this.cache.get(key);
    if (!entry) return null;
    const idx = this.accessOrder.indexOf(key);
    if (idx > -1) {
      this.accessOrder.splice(idx, 1);
      this.accessOrder.push(key);
    }
    return entry.audioContent;
  }

  set(profile, text, audioContent) {
    const key = `${profile}:${text}`;
    if (this.cache.has(key)) {
      const idx = this.accessOrder.indexOf(key);
      if (idx > -1) this.accessOrder.splice(idx, 1);
    }
    if (this.accessOrder.length >= this.maxSize) {
      const oldest = this.accessOrder.shift();
      this.cache.delete(oldest);
    }
    this.cache.set(key, { audioContent, timestamp: Date.now() });
    this.accessOrder.push(key);
  }

  get size() {
    return this.cache.size;
  }

  clear() {
    this.cache.clear();
    this.accessOrder = [];
  }
}

const audioCache = new AudioCache(50);

let userInteracted = false;
let pendingSpeakQueue = [];

function ensureUserInteraction() {
  if (userInteracted) return Promise.resolve();
  if (typeof navigator !== 'undefined' && !/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    userInteracted = true;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    pendingSpeakQueue.push(resolve);
    if (pendingSpeakQueue.length === 1) {
      const handler = () => {
        userInteracted = true;
        const queue = pendingSpeakQueue.slice();
        pendingSpeakQueue.length = 0;
        queue.forEach(r => r());
        document.removeEventListener('click', handler, true);
        document.removeEventListener('touchstart', handler, true);
        document.removeEventListener('keydown', handler, true);
      };
      document.addEventListener('click', handler, true);
      document.addEventListener('touchstart', handler, true);
      document.addEventListener('keydown', handler, true);
    }
  });
}

let currentAudio = null;
let safetyTimeout = null;
let isSpeaking = false;
let ttsGeneration = 0;
let currentTtsGeneration = 0;

const speakTextConversational = async (text, profile = 'valeria', onEndCallback, onPermissionError) => {
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

  const isDev = import.meta.env.DEV || typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const apiBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || (isDev ? 'http://localhost:3001' : 'https://edutechlife-api.vercel.app');
  window.__voiceDebug = { apiBase, profile, isDev, backendVars: { VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL, VITE_API_URL: import.meta.env.VITE_API_URL } };
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

  // Helper to map Google TTS pitch (-20..20 semitones) to browser SpeechSynthesis pitch (0..2)
  const toBrowserPitch = (googlePitch) => {
    const clamped = Math.max(-20, Math.min(20, googlePitch || 0));
    return Math.max(0.5, Math.min(1.5, 1.0 + clamped / 40));
  };

  const useNativeSpeech = async () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      cleanup();
      if (onEndCallback) onEndCallback();
      return false;
    }

    console.log(`🎤 VOZ NATIVA ACTIVADA (backends no disponibles, perfil="${profile}")`);
    await ensureUserInteraction();

    return new Promise((resolve) => {
      const doSpeak = (voicesList) => {
        try {
          window.speechSynthesis.cancel();

          const spanishVoices = voicesList.filter(v => v.lang && v.lang.startsWith('es'));
          console.log(`🎤 VOCES NATIVAS: ${voicesList.length} total, ${spanishVoices.length} español`);
          spanishVoices.forEach(v => console.log(`   → ${v.name} (${v.lang})`));

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'es-MX';
          utterance.rate = Math.min(0.9, voice.speakingRate || 0.85);
          utterance.volume = 1.0;
          const isMaleProfile = ['valerio', 'nico', 'nico_premium', 'nico_authority'].includes(profile);

          const isMaleName = (name) => {
            const femaleKeywords = ['Paulina', 'Monica', 'Sabina', 'Helena', 'Laura', 'Sofia',
              'Valentina', 'Daniela', 'Camila', 'Lucia', 'Sandy', 'Shelley', 'Grandma',
              'Microsoft Sabina', 'Microsoft Helena', 'Microsoft Laura', 'Microsoft Paulina',
              'Microsoft Monica', 'Microsoft Sabina Desktop', 'Zira', 'Susan', 'Hazel',
              'Google US English', 'Google UK English Female'];
            const maleKeywords = ['Jorge', 'Andres', 'Carlos', 'Pablo', 'Santiago',
              'Microsoft Carlos', 'Microsoft Pablo', 'Microsoft Santiago',
              'Microsoft Jorge', 'Microsoft Andres', 'Microsoft Felipe',
              'David', 'James', 'Google UK English Male', 'Google US English Male',
              'Microsoft David Desktop', 'Microsoft Mark', 'Rocko', 'Eddy', 'Reed'];
            if (maleKeywords.some(k => name.includes(k))) return true;
            if (femaleKeywords.some(k => name.includes(k))) return false;
            return !femaleKeywords.some(k => ['A', 'D', 'F', 'H', 'J'].some(e => name.endsWith(e)));
          };

          const latinRegions = ['es-MX', 'es-US', 'es-CO', 'es-419', 'es-ES'];
          const latinMatch = (v) => latinRegions.some(r => v.lang === r);

          const priority = [
            ...(isMaleProfile ? [
              (v) => isMaleName(v.name) && latinMatch(v) && (v.name.includes('Microsoft') || v.name.includes('Carlos') || v.name.includes('Jorge')),
              (v) => isMaleName(v.name) && latinMatch(v),
            ] : [
              (v) => !isMaleName(v.name) && latinMatch(v) && (v.name.includes('Microsoft') || v.name.includes('Google')),
              (v) => !isMaleName(v.name) && latinMatch(v),
            ]),
            (v) => latinMatch(v),
            (v) => v.lang.startsWith('es'),
            ...(isMaleProfile ? [(v) => isMaleName(v.name)] : [(v) => !isMaleName(v.name)]),
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
              lastVoice: bestVoice.name, lastProfile: profile,
              lastPitch: 'nativo', path: 'native-fallback',
              backendReachable: __backendReachable
            };
            console.log(`🎤 VOZ [NATIVA] → ${bestVoice.name} (${bestVoice.lang}) rate:${utterance.rate}`);
          } else {
            window.__voiceDebug = {
              lastVoice: 'default', lastProfile: profile,
              lastPitch: 'nativo', path: 'native-fallback',
              backendReachable: __backendReachable
            };
            console.warn(`🎤 VOZ [NATIVA] → default`);
          }

          utterance.onend = () => { handleEnd(); resolve(true); };
          utterance.onerror = (event) => {
            console.error('❌ Error voz nativa:', event.error);
            cleanup();
            if (onEndCallback) onEndCallback();
            resolve(false);
          };

          window.speechSynthesis.speak(utterance);
          isSpeaking = true;
        } catch (e) {
          console.error('❌ Error en voz nativa:', e);
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
    window.__voiceDebug = { path: 'from-cache', profile, cacheSize: audioCache.size };
    currentAudio = new Audio(`data:audio/mp3;base64,${cachedAudio}`);
    currentAudio.volume = 1.0;
    currentAudio.onended = handleEnd;
    currentAudio.onerror = (e) => {
      console.error("Error reproduciendo audio cacheado:", e);
      cleanup();
      if (onEndCallback) onEndCallback();
    };
    try {
      await ensureUserInteraction();
      await currentAudio.play();
    } catch (playError) {
      if (playError.name === 'NotAllowedError') {
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
    if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) {
      const reachable = await __testBackend(url);
      if (!reachable) {
        console.log(`🎤 Backend local ${url} no disponible, saltando...`);
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
    console.log(`🎤 SPEECH: perfil="${profile}", voz="${voice.name}", api="${currentApi}"`);

    for (const voiceOption of [voice, ...voiceFallbacks]) {
      try {
        const response = await fetch(`${currentApi}/api/tts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(20000),
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode: voiceOption.languageCode,
              name: voiceOption.name
            },
            audioConfig: {
              audioEncoding: 'MP3',
              pitch: voiceOption.pitch || 0,
              speakingRate: voiceOption.speakingRate || 1.0,
              ...(voiceOption.effectsProfileId ? { effectsProfileId: voiceOption.effectsProfileId } : {})
            }
          })
        });

        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          window.__voiceDebug = { path: 'http-error', status: response.status, api: currentApi, voice: voiceOption.name, response: errText.substring(0, 200) };
          console.warn(`⚠️ TTS error HTTP ${response.status} en ${currentApi}, saltando backend...`, errText.substring(0, 200));
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
            path: 'google-tts',
            backendReachable: true,
            api: currentApi,
            cacheSize: audioCache.size
          };
        console.log(`🎤 VOZ ACTIVA [GOOGLE TTS] → ${voiceOption.name} (pitch:${voiceOption.pitch}, rate:${voiceOption.speakingRate}, profile:${profile}, size:${(bytes/1024).toFixed(0)}KB, cache:${audioCache.size})`);
        if (gen !== currentTtsGeneration) {
          cleanup();
          return;
        }
        gotAudio = true;
        currentAudio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
          currentAudio.volume = 1.0;
          currentAudio.onended = handleEnd;
          currentAudio.onerror = (e) => {
            console.error("Error reproduciendo audio:", e);
            cleanup();
            if (onEndCallback) onEndCallback();
          };
          try {
            await ensureUserInteraction();
            await currentAudio.play();
          } catch (playError) {
            if (playError.name === 'NotAllowedError') {
              console.warn('⚠️ Autoplay bloqueado por el navegador. Usando voz nativa...');
              cleanup();
              await useNativeSpeech();
              return;
            }
            throw playError;
          }
          return;
        }
      } catch (voiceError) {
        if (voiceError.name === 'NotAllowedError') {
          console.warn('⚠️ Audio bloqueado por el navegador (requiere gesto del usuario)');
          if (onPermissionError) onPermissionError(voiceError.message);
          cleanup();
          if (onEndCallback) onEndCallback();
          return;
        }
        if (voiceError.name === 'TypeError' || voiceError.message?.includes('Failed to fetch') || voiceError.message?.includes('NetworkError')) {
          window.__voiceDebug = { path: 'network-error', api: currentApi, voice: voiceOption.name, error: voiceError.message, code: voiceError.code };
          console.warn(`⚠️ Backend ${currentApi} no disponible, probando siguiente...`);
          break;
        }
        if (voiceError.name === 'AbortError' || voiceError.message?.includes('aborted')) {
          window.__voiceDebug = { path: 'timeout', api: currentApi, voice: voiceOption.name, timeout: 20000 };
          console.warn(`⚠️ TTS timeout (20s) en ${currentApi} para ${voiceOption.name}, probando siguiente...`);
          break;
        }
        console.warn(`⚠️ TTS fallback: ${voiceOption.name} (${voiceError.message || voiceError})`);
        continue;
      }
    }
  }

  if (!gotAudio) {
    window.__voiceDebug = { ...window.__voiceDebug, path: window.__voiceDebug?.path || 'fallback-native', allBackendsExhausted: true, profile };
    if (gen !== currentTtsGeneration) {
      cleanup();
      return;
    }
    await useNativeSpeech();
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
  // También detener la síntesis de voz nativa si está activa
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

let recognitionInstance = null;

const iniciarReconocimiento = (setQ, onFinalResult, setIsListening) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('SpeechRecognition no disponible');
    return;
  }

  if (recognitionInstance) {
    try {
      recognitionInstance.stop();
    } catch (e) {}
  }

  recognitionInstance = new SpeechRecognition();
  recognitionInstance.lang = 'es-CO';
  recognitionInstance.continuous = false;
  recognitionInstance.interimResults = true;
  recognitionInstance.maxAlternatives = 1;

  let finalTranscript = '';

  recognitionInstance.onstart = () => {
    setIsListening(true);
  };

  recognitionInstance.onresult = (event) => {
    let interim = '';
    for (let i = 0; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += ' ' + transcript.trim();
      } else {
        interim += transcript;
      }
    }
    setQ(finalTranscript + ' ' + interim);
  };

  recognitionInstance.onend = () => {
    setIsListening(false);
    if (finalTranscript.trim()) {
      onFinalResult(finalTranscript.trim());
    }
    recognitionInstance = null;
  };

  recognitionInstance.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    setIsListening(false);
    recognitionInstance = null;
  };

  try {
    recognitionInstance.start();
  } catch (e) {
    console.error('Error starting recognition:', e);
    setIsListening(false);
  }
};

const stopRecognition = () => {
  if (recognitionInstance) {
    try {
      recognitionInstance.stop();
    } catch (e) {}
    recognitionInstance = null;
  }
};

/**
 * Función específica para hablar como Valentina
 * @param {string} text - Texto a hablar
 * @param {number} age - Edad del usuario (6-17)
 * @param {function} onEndCallback - Callback al terminar
 * @returns {Promise} - Promesa del speech
 */
export const speakAsValentina = async (text, age = 12, onEndCallback, onPermissionError) => {
  // Determinar perfil de voz según edad
  let profile = 'valentina'; // Default (11-14 años)
  
  if (age >= 6 && age <= 10) {
    profile = 'valentina_child'; // Niños
  } else if (age >= 15 && age <= 17) {
    profile = 'valentina_teen'; // Adolescentes
  }
  
  return await speakTextConversational(text, profile, onEndCallback, onPermissionError);
};

/**
 * Obtener configuración de voz para Valentina según edad
 * @param {number} age - Edad del usuario
 * @returns {object} - Configuración de voz
 */
export const getValentinaVoiceConfig = (age = 12) => {
  if (age >= 6 && age <= 10) {
    return {
      profile: 'valentina_child',
      rate: 0.9,
      pitch: 0.3,
      description: 'Voz amigable para niños'
    };
  } else if (age >= 11 && age <= 14) {
    return {
      profile: 'valentina',
      rate: 1.0,
      pitch: 0.2,
      description: 'Voz profesional estándar'
    };
  } else if (age >= 15 && age <= 17) {
    return {
      profile: 'valentina_teen',
      rate: 1.1,
      pitch: 0.1,
      description: 'Voz profesional para adolescentes'
    };
  }
  
  // Default
  return {
    profile: 'valentina',
    rate: 1.0,
    pitch: 0.2,
    description: 'Voz profesional estándar'
  };
};

const findBestSpanishVoice = (profile = 'valerio') => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  const spanishVoices = voices.filter(v => v.lang && v.lang.startsWith('es'));
  const isMaleProfile = ['valerio', 'nico', 'nico_premium', 'nico_authority'].includes(profile);

  const maleKeywords = ['Jorge', 'Andres', 'Carlos', 'Pablo', 'Santiago',
    'Microsoft Carlos', 'Microsoft Pablo', 'Microsoft Santiago',
    'Microsoft Jorge', 'Microsoft Andres', 'Microsoft Felipe',
    'David', 'James', 'Google UK English Male', 'Google US English Male',
    'Microsoft David Desktop', 'Microsoft Mark', 'Rocko', 'Eddy', 'Reed'];
  const femaleKeywords = ['Paulina', 'Monica', 'Sabina', 'Helena', 'Laura', 'Sofia',
    'Valentina', 'Daniela', 'Camila', 'Lucia', 'Sandy', 'Shelley', 'Grandma',
    'Microsoft Sabina', 'Microsoft Helena', 'Microsoft Laura', 'Microsoft Paulina',
    'Microsoft Monica', 'Microsoft Sabina Desktop', 'Zira', 'Susan', 'Hazel',
    'Google US English', 'Google UK English Female'];

  const isMaleName = (name) => {
    if (maleKeywords.some(k => name.includes(k))) return true;
    if (femaleKeywords.some(k => name.includes(k))) return false;
    return !femaleKeywords.some(k => ['A', 'D', 'F', 'H', 'J'].some(e => name.endsWith(e)));
  };

  const latinRegions = ['es-MX', 'es-US', 'es-CO', 'es-419', 'es-ES'];
  const latinMatch = (v) => latinRegions.some(r => v.lang === r);

  const priority = [
    ...(isMaleProfile ? [
      (v) => isMaleName(v.name) && latinMatch(v) && (v.name.includes('Microsoft') || v.name.includes('Carlos') || v.name.includes('Jorge')),
      (v) => isMaleName(v.name) && latinMatch(v),
    ] : [
      (v) => !isMaleName(v.name) && latinMatch(v) && (v.name.includes('Microsoft') || v.name.includes('Google')),
      (v) => !isMaleName(v.name) && latinMatch(v),
    ]),
    (v) => latinMatch(v),
    (v) => v.lang.startsWith('es'),
    ...(isMaleProfile ? [(v) => isMaleName(v.name)] : [(v) => !isMaleName(v.name)]),
    (v) => true,
  ];

  for (const matcher of priority) {
    const found = voices.find(matcher);
    if (found) return found;
  }
  return null;
};

export const speakValerioSentence = (text, onEnd) => {
  try {
    window.speechSynthesis.cancel();
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        speakValerioSentence(text, onEnd);
      };
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.rate = 0.9;
    const bestVoice = findBestSpanishVoice('valerio');
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.pitch = 0.95;
    }
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => onEnd && onEnd();
    window.speechSynthesis.speak(utterance);
  } catch {}
};

export const fireConfetti = (opts) => import('canvas-confetti').then(m => m.default(opts));

export { speakTextConversational, stopSpeech, iniciarReconocimiento, stopRecognition, audioCache, VOICE_PROFILES };
