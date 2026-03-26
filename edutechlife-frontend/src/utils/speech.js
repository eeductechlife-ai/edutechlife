const VOICE_PROFILES = {
  valeria: { languageCode: 'es-US', name: 'es-US-Chirp3-HD-Achernar', pitch: 1.2, speakingRate: 1.05 },
  valerio: { languageCode: 'es-US', name: 'es-US-Chirp3-HD-Achird', pitch: -2.0, speakingRate: 1.0 },
  sistema: { languageCode: 'es-US', name: 'es-US-Chirp3-HD-Algenib', pitch: 0, speakingRate: 1.0 },
  nico: { languageCode: 'es-US', name: 'es-US-Chirp3-HD-Achernar', pitch: 1.1, speakingRate: 1.08 },
  nico_premium: { 
    languageCode: 'es-US', 
    name: 'es-US-Chirp3-HD-Achernar',
    pitch: 1.1, 
    speakingRate: 1.08,
    volumeGainDb: 3.0,
    effectsProfileId: ['telephony-class-application']
  },
  nico_authority: {
    languageCode: 'es-US',
    name: 'es-US-Chirp3-HD-Achird',
    pitch: 0.9,
    speakingRate: 1.05,
    volumeGainDb: 2.5
  }
};

const VOICE_FALLBACKS = {
  nico: [
    { languageCode: 'es-US', name: 'es-US-Chirp3-HD-Achernar', pitch: 1.1, speakingRate: 1.08 },
    { languageCode: 'es-US', name: 'es-US-Chirp-HD-F', pitch: 1.0, speakingRate: 1.05 },
    { languageCode: 'es-US', name: 'es-US-Chirp-HD-D', pitch: 0.9, speakingRate: 1.0 },
    { languageCode: 'es-ES', name: 'es-ES-Chirp3-HD-F', pitch: 1.0, speakingRate: 1.05 },
  ],
  nico_premium: [
    { languageCode: 'es-US', name: 'es-US-Chirp3-HD-Achernar', pitch: 1.1, speakingRate: 1.08 },
    { languageCode: 'es-US', name: 'es-US-Chirp3-HD-Achird', pitch: 0.9, speakingRate: 1.05 },
    { languageCode: 'es-US', name: 'es-US-Chirp-HD-F', pitch: 1.0, speakingRate: 1.05 },
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
          console.warn(`Voice ${voiceOption.name} failed, trying fallback...`, data.error.message);
          lastError = data.error;
          continue;
        }

        if (data.audioContent) {
          console.log(`Audio received with voice: ${voiceOption.name}`);
          currentAudio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
          
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
        console.warn(`Error with voice ${voiceOption.name}:`, voiceError);
        lastError = voiceError;
        continue;
      }
    }

    console.error("All voice options failed:", lastError);
    if (onEndCallback) onEndCallback();
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
