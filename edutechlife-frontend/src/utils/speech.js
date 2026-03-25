const VOICE_PROFILES = {
  valeria: { languageCode: 'es-US', name: 'es-US-Neural2-A', pitch: 1.2, speakingRate: 1.05 },
  valerio: { languageCode: 'es-US', name: 'es-US-Neural2-B', pitch: -2.0, speakingRate: 1.0 },
  sistema: { languageCode: 'es-US', name: 'es-US-Neural2-C', pitch: 0, speakingRate: 1.0 },
  nico: { languageCode: 'es-US', name: 'es-US-Neural2-B', pitch: 0.0, speakingRate: 1.0 }
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

  try {
    console.log("Perfil de voz:", profile);
    console.log("Voice config:", voice);

    // Usar API key directamente (la API de TTS funciona mejor así)
    const response = await fetch(`${GOOGLE_TTS_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: { text: text },
        voice: { 
          languageCode: voice.languageCode, 
          name: voice.name 
        },
        audioConfig: { 
          audioEncoding: 'MP3', 
          pitch: voice.pitch || 0, 
          speakingRate: voice.speakingRate || 1.0 
        }
      })
    });

    const data = await response.json();
    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (data.error) {
      console.error("Error de Google TTS:", data.error);
      if (onEndCallback) onEndCallback();
      return;
    }

    if (data.audioContent) {
      console.log("Audio recibido, creando elemento de audio...");
      currentAudio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      
      currentAudio.onended = handleEnd;
      currentAudio.onerror = (e) => {
        console.error("Error reproduciendo audio:", e);
        cleanup();
        if (onEndCallback) onEndCallback();
      };
      
      await currentAudio.play();
      console.log("¡Audio reproduciéndose!");
    } else {
      console.error("No se recibió audio");
      if (onEndCallback) onEndCallback();
    }
  } catch (error) {
    console.error("Error en speakTextConversational:", error);
    cleanup();
    if (onEndCallback) onEndCallback();
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
