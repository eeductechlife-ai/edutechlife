const VOICE_PROFILES = {
  valeria: { languageCode: 'es-US', name: 'es-US-Neural2-A', pitch: 1.2, speakingRate: 1.05 },
  valerio: { languageCode: 'es-US', name: 'es-US-Neural2-B', pitch: -2.0, speakingRate: 1.0 },
  sistema: { languageCode: 'es-US', name: 'es-US-Neural2-C', pitch: 0, speakingRate: 1.0 },
  nico: { languageCode: 'es-US', name: 'es-US-Neural2-B', pitch: 0, speakingRate: 1.0 }
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
    // Obtener token fresco del backend
    console.log("Obteniendo token del backend...");
    let accessToken;
    
    try {
      const tokenRes = await fetch(`${API_BASE_URL}/api/voice-token`);
      if (!tokenRes.ok) throw new Error('Failed to get token');
      const tokenData = await tokenRes.json();
      accessToken = tokenData.access_token;
      console.log("Token obtenido correctamente");
    } catch (tokenError) {
      console.error("Error obteniendo token del backend:", tokenError);
      if (onEndCallback) onEndCallback();
      return;
    }

    // Usar Google Cloud TTS API estándar
    const response = await fetch(`${GOOGLE_TTS_URL}?key=${accessToken}`, {
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
          pitch: voice.pitch, 
          speakingRate: voice.speakingRate 
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Error de Google TTS:", data.error);
      if (onEndCallback) onEndCallback();
      return;
    }

    if (data.audioContent) {
      currentAudio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      currentAudio.onended = handleEnd;
      currentAudio.onerror = () => {
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
