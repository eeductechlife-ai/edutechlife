const VOICE_PROFILES = {
  valeria: { languageCode: 'es-US', name: 'es-US-Neural2-B', pitch: 0, speakingRate: 1.0 },
  valerio: { languageCode: 'es-US', name: 'es-US-Neural2-B', pitch: 0, speakingRate: 1.0 },
  sistema: { languageCode: 'es-US', name: 'es-US-Neural2-C', pitch: 0, speakingRate: 1.0 },
  nico: { languageCode: 'es-US', name: 'es-US-Neural2-B', pitch: 0, speakingRate: 1.0 },
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
  }
};

const VOICE_FALLBACKS = {
  valeria: [
    { languageCode: 'es-US', name: 'es-US-Neural2-B', pitch: 0, speakingRate: 1.0 },
    { languageCode: 'es-US', name: 'es-US-Journey-F', pitch: 0.0, speakingRate: 1.0 },
    { languageCode: 'es-ES', name: 'es-ES-Neural2-A', pitch: 0.0, speakingRate: 1.0 }
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
  ]
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://edutechlife-q3blvmkur-eeductechlife-ais-projects.vercel.app';
const GOOGLE_TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

let currentAudio = null;
let safetyTimeout = null;

export const speakTextConversational = async (text, profile = 'valeria', onEndCallback) => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (safetyTimeout) {
    clearTimeout(safetyTimeout);
    safetyTimeout = null;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_TTS_API_KEY;
  const voice = VOICE_PROFILES[profile] || VOICE_PROFILES.valeria;

  const cleanup = () => {
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

  safetyTimeout = setTimeout(() => {
    cleanup();
    if (onEndCallback) onEndCallback();
  }, 15000);

  // Función para usar voz nativa del sistema (fallback)
  const useNativeSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.error('❌ SpeechSynthesis no está disponible en este navegador');
      cleanup();
      if (onEndCallback) onEndCallback();
      return false;
    }

    try {
      console.log('📢 Usando voz nativa del sistema (Fallback)');
      
      // Cancelar cualquier síntesis en curso
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-CO';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => {
        console.log('✅ Voz nativa completada');
        handleEnd();
      };
      
      utterance.onerror = (event) => {
        console.error('❌ Error en voz nativa:', event.error);
        cleanup();
        if (onEndCallback) onEndCallback();
      };
      
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (nativeError) {
      console.error('❌ Error al usar voz nativa:', nativeError);
      cleanup();
      if (onEndCallback) onEndCallback();
      return false;
    }
  };

  // Validación de API Key
  if (!apiKey || apiKey.trim() === '') {
    console.warn('⚠️ API Key de Google TTS no configurada, usando voz nativa');
    useNativeSpeech();
    return;
  }

  try {
    console.log("Perfil de voz:", profile);
    console.log("Voice config:", voice);

    const voiceFallacks = VOICE_FALLBACKS[profile] || [];
    let lastError = null;

    for (const voiceOption of [voice, ...voiceFallacks]) {
      try {
        const response = await fetch(`${GOOGLE_TTS_URL}?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            input: { text: text },
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

        const data = await response.json();
        
        if (data.error) {
          window.alert('🚨 ERROR GOOGLE TTS: ' + data.error.message);
          console.warn('Voice failed...', data.error.message);
          lastError = data.error;
          continue;
        }

        if (data.audioContent) {
          console.log(`Audio received with voice: ${voiceOption.name}`);
          console.log('✅ Audio de Google recibido');
          currentAudio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
          currentAudio.volume = 1.0;
          
          currentAudio.onended = handleEnd;
          currentAudio.onerror = (e) => {
            console.error("Error reproduciendo audio:", e);
            cleanup();
            if (onEndCallback) onEndCallback();
          };
          
          await currentAudio.play();
          console.log("¡Audio reproduciéndose!");
          return;
        }
      } catch (voiceError) {
        window.alert('🚨 ERROR DE CONEXIÓN: ' + voiceError.message);
        console.warn('Error with voice...', voiceError);
        lastError = voiceError;
        continue;
      }
    }

    console.error("All voice options failed:", lastError);
    
    // Intentar con voz nativa como último recurso
    console.log('🔄 Todas las voces de Google fallaron, intentando con voz nativa...');
    const nativeSuccess = useNativeSpeech();
    
    if (!nativeSuccess && onEndCallback) {
      onEndCallback();
    }
  } catch (error) {
    console.error("Error en speakTextConversational:", error);
    
    // Intentar con voz nativa como último recurso
    console.log('🔄 Error en Google TTS, intentando con voz nativa...');
    const nativeSuccess = useNativeSpeech();
    
    if (!nativeSuccess) {
      cleanup();
      if (onEndCallback) onEndCallback();
    }
  }
};

export const stopSpeech = () => {
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

export const iniciarReconocimiento = (setQ, onFinalResult, setIsListening) => {
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
