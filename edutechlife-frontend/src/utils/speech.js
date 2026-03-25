const VOICE_PROFILES = {
  valeria: { languageCode: 'es-US', name: 'es-US-Neural2-A', pitch: 1.2, speakingRate: 1.05 },
  valerio: { languageCode: 'es-US', name: 'es-US-Neural2-B', pitch: -2.0, speakingRate: 1.0 },
  sistema: { languageCode: 'es-US', name: 'es-US-Neural2-C', pitch: 0, speakingRate: 1.0 },
  nico: { languageCode: 'es-419', name: 'Umbriel', modelName: 'gemini-2.5-flash-tts', pitch: 0, speakingRate: 1.0 }
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://edutechlife-q3blvmkur-eeductechlife-ais-projects.vercel.app';
const GOOGLE_TTS_URL = 'https://us-central1-aiplatform.googleapis.com/v1/projects/995366752358/locations/us-central1/publishers/google/models/gemini-2.5-flash-tts:streamGenerateContent';

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
  if (!apiKey && profile !== 'nico') {
    console.error("Falta API Key de Google TTS");
    if (onEndCallback) onEndCallback();
    return;
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
    if (profile === 'nico' && voice.modelName) {
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

      const response = await fetch(GOOGLE_TTS_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text }] }],
          generationConfig: {
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: "Umbriel" } }
            }
          }
        })
      });

      const data = await response.json();
      console.log("Tipo de respuesta:", Array.isArray(data) ? "Array con " + data.length + " elementos" : "Objeto");
      
      // Ensamblar el audio de la respuesta (puede venir fragmentado)
      let audioChunks = [];
      if (Array.isArray(data)) {
        data.forEach(chunk => {
          const inlineData = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData;
          if (inlineData?.data) {
            // Convertimos cada pedazo de Base64 a un Uint8Array de inmediato
            const binaryString = atob(inlineData.data);
            const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0));
            audioChunks.push(bytes);
          }
        });
        console.log("Chunks de audio recibidos:", audioChunks.length);
      } else if (data.candidates && data.candidates[0].content.parts[0].inlineData) {
        const binaryString = atob(data.candidates[0].content.parts[0].inlineData.data);
        const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0));
        audioChunks.push(bytes);
      }
      
      if (audioChunks.length > 0) {
        // Calculamos el tamaño total y creamos un solo bloque de datos
        const totalLength = audioChunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const rawData = new Uint8Array(totalLength);
        let offset = 0;
        audioChunks.forEach(chunk => {
          rawData.set(chunk, offset);
          offset += chunk.length;
        });
        console.log("Audio ensamblado, tamaño total:", rawData.length);
        
        const wavHeader = new ArrayBuffer(44);
        const view = new DataView(wavHeader);
        view.setUint32(0, 0x52494646, false);
        view.setUint32(4, 36 + rawData.length, true);
        view.setUint32(8, 0x57415645, false);
        view.setUint32(12, 0x666d7420, false);
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, 24000, true);
        view.setUint32(28, 48000, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        view.setUint32(36, 0x64617461, false);
        view.setUint32(40, rawData.length, true);

        const blob = new Blob([wavHeader, rawData], { type: 'audio/wav' });
        currentAudio = new Audio(URL.createObjectURL(blob));
        
        currentAudio.onended = handleEnd;
        currentAudio.onerror = () => {
          cleanup();
          if (onEndCallback) onEndCallback();
        };

        await currentAudio.play();
        console.log("¡Nico está hablando!");
        return;
      } else {
        console.error("No se recibió audio de Google:", data);
        cleanup();
        if (onEndCallback) onEndCallback();
        return;
      }
    }

    // API estándar de Cloud TTS
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text: text },
        voice: { languageCode: voice.languageCode, name: voice.name },
        audioConfig: { audioEncoding: 'MP3', pitch: voice.pitch, speakingRate: voice.speakingRate }
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Error de Google TTS:", data.error);
      cleanup();
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
    } else {
      cleanup();
      if (onEndCallback) onEndCallback();
    }
  } catch (error) {
    console.error("Error crítico en speech.js:", error);
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
