const VOICE_PROFILES = {
  valeria: { 
    languageCode: 'es-US', 
    name: 'es-US-Journey-F', 
    pitch: 0, // Journey no soporta pitch
    speakingRate: 0.95,
    volumeGainDb: 2.5
  },
  valerio: { 
    languageCode: 'es-US', 
    name: 'es-US-Neural2-B', 
    pitch: 0,
    speakingRate: 1.0,
    volumeGainDb: 2.5
  },
  sistema: { 
    languageCode: 'es-US', 
    name: 'es-US-Neural2-C', 
    pitch: 0, 
    speakingRate: 1.0 
  },
  nico: { 
    languageCode: 'es-US', 
    name: 'es-US-Neural2-B', 
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
    name: 'es-US-Neural2-B',
    pitch: 0,
    speakingRate: 1.05,
    volumeGainDb: 2.5
  },
  // Perfiles de voz para Valeria - Guía VAK (Journey-F - moderna y natural)
  valentina: {
    languageCode: 'es-US',
    name: 'es-US-Journey-F', // ✅ Voz femenina moderna Journey
    pitch: 0, // Journey no soporta pitch - establecido en 0
    speakingRate: 0.95,
    volumeGainDb: 2.5,
    effectsProfileId: ['telephony-class-application']
  },
  valentina_child: { // Para niños más pequeños (6-10 años)
    languageCode: 'es-US',
    name: 'es-US-Journey-F', // ✅ Journey - más amigable
    pitch: 0, // Journey no soporta pitch - establecido en 0
    speakingRate: 0.85, // Más lento para mejor comprensión
    volumeGainDb: 3.0,
    effectsProfileId: ['telephony-class-application']
  },
  valentina_teen: { // Para adolescentes (15-17 años)
    languageCode: 'es-US',
    name: 'es-US-Journey-F', // ✅ Journey
    pitch: 0, // Journey no soporta pitch
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
    { languageCode: 'es-US', name: 'es-US-Neural2-B', pitch: 0, speakingRate: 1.0 },
    { languageCode: 'es-US', name: 'es-US-Neural2-C', pitch: 0, speakingRate: 1.0 },
    { languageCode: 'es-ES', name: 'es-ES-Neural2-B', pitch: 0, speakingRate: 1.0 }
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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://edutechlife-q3blvmkur-eeductechlife-ais-projects.vercel.app';

let currentAudio = null;
let safetyTimeout = null;
let isSpeaking = false;

const speakTextConversational = async (text, profile = 'valeria', onEndCallback, onPermissionError) => {
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

  const apiBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001';
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

  // Función para usar voz nativa del sistema (fallback)
  const useNativeSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.error('❌ SpeechSynthesis no está disponible en este navegador');
      cleanup();
      if (onEndCallback) onEndCallback();
      return false;
    }

    try {

      // Cancelar cualquier síntesis en curso
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-CO';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => {

        handleEnd();
      };
      
      utterance.onerror = (event) => {
        console.error('❌ Error en voz nativa:', event.error);
        cleanup();
        if (onEndCallback) onEndCallback();
      };
      
      window.speechSynthesis.speak(utterance);
      isSpeaking = true;
      return true;
    } catch (nativeError) {
      console.error('❌ Error al usar voz nativa:', nativeError);
      cleanup();
      if (onEndCallback) onEndCallback();
      return false;
    }
  };

  const voiceFallacks = VOICE_FALLBACKS[profile] || [];
  let lastError = null;

  let gotAudio = false;
  for (const voiceOption of [voice, ...voiceFallacks]) {
    try {
      const response = await fetch(`${apiBase}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: voiceOption.languageCode,
            name: voiceOption.name
          },
          audioConfig: {
            audioEncoding: 'MP3',
            pitch: voiceOption.pitch || 0,
            speakingRate: voiceOption.speakingRate || 1.0
          }
        })
      });

      if (!response.ok) {
        console.warn('⚠️ TTS backend error, probando fallback de voz...');
        lastError = { message: `HTTP ${response.status}` };
        continue;
      }

      const data = await response.json();

      if (data.audioContent) {
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
          await currentAudio.play();
        } catch (playError) {
          if (playError.name === 'NotAllowedError') {
            console.warn('⚠️ Autoplay bloqueado por el navegador. Usando voz nativa...');
            cleanup();
            useNativeSpeech();
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
        lastError = voiceError;
        break;
      }
      console.warn('🚨 ERROR DE CONEXIÓN: ' + voiceError.message);
      console.warn('Voice option failed:', voiceError);
      lastError = voiceError;
      continue;
    }
  }

  if (!gotAudio) {
    console.error("All voice options failed:", lastError);
    const nativeSuccess = useNativeSpeech();
    if (!nativeSuccess && onEndCallback) {
      onEndCallback();
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

export { speakTextConversational, stopSpeech, iniciarReconocimiento, stopRecognition };
