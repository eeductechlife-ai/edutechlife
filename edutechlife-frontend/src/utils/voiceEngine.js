import { speakTextConversational, stopSpeech } from './speech';

const VOICE_PROFILES = {
  valeria: { languageCode: 'es-US', name: 'es-US-Neural2-A', pitch: 1.2, speakingRate: 1.05 },
  valerio: { languageCode: 'es-US', name: 'es-US-Neural2-B', pitch: -2.0, speakingRate: 1.0 },
  sistema: { languageCode: 'es-US', name: 'es-US-Neural2-C', pitch: 0, speakingRate: 1.0 }
};

class VoiceEngine {
  constructor() {
    if (typeof window === 'undefined') {
      return;
    }
    
    this.recognition = null;
    this.currentProfile = 'valeria';
    this.isSpeaking = false;
    this.isListening = false;
    this.onSpeakStart = null;
    this.onSpeakEnd = null;
    this.onListeningStart = null;
    this.onListeningEnd = null;
    this.onInterimResult = null;
    this.onFinalResult = null;
    this.onError = null;
    this.conversationMode = false;
    this.listenTimeout = null;
    this.maxListeningDuration = 15000;
    
    this.initRecognition();
  }

  clearListenTimeout() {
    if (this.listenTimeout) {
      clearTimeout(this.listenTimeout);
      this.listenTimeout = null;
    }
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition not supported');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'es-ES';
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    let finalTranscript = '';
    let lastResultIndex = 0;

    this.recognition.onstart = () => {
      this.isListening = true;
      finalTranscript = '';
      lastResultIndex = 0;
      if (this.onListeningStart) this.onListeningStart();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onListeningEnd) this.onListeningEnd();
      
      if (finalTranscript.trim()) {
        if (this.onFinalResult) this.onFinalResult(finalTranscript.trim());
      }
      finalTranscript = '';
      lastResultIndex = 0;
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = lastResultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += ' ' + transcript.trim();
        } else {
          interimTranscript += transcript;
        }
      }
      lastResultIndex = event.results.length;
      
      if (this.onInterimResult) {
        this.onInterimResult(finalTranscript + ' ' + interimTranscript);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
      if (this.onError) this.onError(event.error);
      
      if (event.error === 'no-speech' && finalTranscript.trim()) {
        if (this.onFinalResult) this.onFinalResult(finalTranscript.trim());
      }
    };
  }

  setVoiceProfile(profile) {
    if (VOICE_PROFILES[profile]) {
      this.currentProfile = profile;
    }
  }

  speak(text, options = {}) {
    return new Promise(async (resolve, reject) => {
      const profile = options.profile || this.currentProfile;
      
      const cleanText = text
        .replace(/[#*`_~🎉🎯💡✨👏👍🎨🎧🎮🎬📚©®™°•↑↓→←↔↕]/g, '')
        .replace(/\n+/g, ' ')
        .trim();

      if (!cleanText) {
        resolve();
        return;
      }

      this.isSpeaking = true;
      if (this.onSpeakStart) this.onSpeakStart();

      try {
        await speakTextConversational(cleanText, profile, () => {
          this.isSpeaking = false;
          if (this.onSpeakEnd) this.onSpeakEnd();
          resolve();
        });
      } catch (error) {
        console.error('TTS error:', error);
        this.isSpeaking = false;
        if (this.onSpeakEnd) this.onSpeakEnd();
        resolve();
      }
    });
  }

  startListening() {
    if (!this.recognition || this.isListening) return;
    
    this.clearListenTimeout();
    
    this.listenTimeout = setTimeout(() => {
      if (this.isListening) {
        this.stopListening();
        if (this.onError) {
          this.onError('no-speech');
        }
      }
    }, this.maxListeningDuration);
    
    try {
      this.recognition.start();
    } catch (e) {
      console.error('Recognition start error:', e);
      this.clearListenTimeout();
    }
  }

  stopListening() {
    this.clearListenTimeout();
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore if not started
      }
    }
    this.isListening = false;
    if (this.onListeningEnd) this.onListeningEnd();
  }

  stop() {
    stopSpeech();
    this.isSpeaking = false;
    if (this.onSpeakEnd) this.onSpeakEnd();
    this.stopListening();
  }

  setConversationMode(enabled) {
    this.conversationMode = enabled;
  }

  setMaxListeningDuration(ms) {
    this.maxListeningDuration = ms;
  }

  destroy() {
    this.clearListenTimeout();
    this.stop();
    this.setConversationMode(false);
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        // Ignore
      }
    }
  }
}

let voiceEngineInstance = null;

export function getVoiceEngine() {
  if (!voiceEngineInstance) {
    try {
      voiceEngineInstance = new VoiceEngine();
    } catch (e) {
      console.warn('VoiceEngine initialization failed:', e);
      return null;
    }
  }
  return voiceEngineInstance;
}

export const voiceEngine = {
  speak: async (text, options) => {
    const engine = getVoiceEngine();
    if (engine && typeof engine.speak === 'function') {
      return engine.speak(text, options);
    }
    return Promise.resolve();
  },
  startListening: () => {
    const engine = getVoiceEngine();
    if (engine && typeof engine.startListening === 'function') {
      engine.startListening();
    }
  },
  stopListening: () => {
    const engine = getVoiceEngine();
    if (engine && typeof engine.stopListening === 'function') {
      engine.stopListening();
    }
  },
  stop: () => {
    const engine = getVoiceEngine();
    if (engine && typeof engine.stop === 'function') {
      engine.stop();
    }
  },
  setConversationMode: (enabled) => {
    const engine = getVoiceEngine();
    if (engine && typeof engine.setConversationMode === 'function') {
      engine.setConversationMode(enabled);
    }
  },
  onSpeakStart: null,
  onSpeakEnd: null,
  onListeningStart: null,
  onListeningEnd: null,
  onInterimResult: null,
  onFinalResult: null,
  onError: null,
};

export function speakText(text, options = {}) {
  return voiceEngine.speak(text, options);
}

export function startListening() {
  voiceEngine.startListening();
}

export function stopListening() {
  voiceEngine.stopListening();
}

export function stopAll() {
  voiceEngine.stop();
}

export function setConversationMode(enabled) {
  voiceEngine.setConversationMode(enabled);
}

export default voiceEngine;
