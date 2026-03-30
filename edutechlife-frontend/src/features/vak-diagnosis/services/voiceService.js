class VoiceService {
  constructor() {
    this.synthesis = null;
    this.currentUtterance = null;
    this.queue = [];
    this.isSpeaking = false;
    this.isEnabled = false;
    this.voice = null;
    this.rate = 0.9;
    this.pitch = 1;
    this.volume = 1;
    this.lang = 'es-ES';
    
    this.init();
  }

  init() {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      
      // Cargar voces disponibles
      setTimeout(() => {
        this.loadVoices();
      }, 1000);
      
      // Manejar eventos de speech synthesis
      this.synthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
      
      return true;
    }
    return false;
  }

  loadVoices() {
    if (!this.synthesis) return;
    
    const voices = this.synthesis.getVoices();
    // Preferir voces en español
    const spanishVoices = voices.filter(voice => 
      voice.lang.startsWith('es') || voice.lang.includes('es')
    );
    
    if (spanishVoices.length > 0) {
      // Preferir voces femeninas en español
      const femaleSpanish = spanishVoices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('mujer') ||
        voice.name.toLowerCase().includes('español')
      );
      
      this.voice = femaleSpanish || spanishVoices[0];
    } else if (voices.length > 0) {
      this.voice = voices[0];
    }
  }

  speak(text, onStart, onEnd, onError) {
    if (!this.isEnabled || !this.synthesis || !text) {
      if (onEnd) onEnd();
      return;
    }

    // Cancelar speech actual si está hablando
    if (this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configurar utterance
    utterance.lang = this.lang;
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;
    
    if (this.voice) {
      utterance.voice = this.voice;
    }

    // Configurar event handlers
    utterance.onstart = () => {
      this.isSpeaking = true;
      this.currentUtterance = utterance;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
      
      // Procesar siguiente en la cola
      this.processQueue();
    };

    utterance.onerror = (event) => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      console.error('Error en speech synthesis:', event);
      if (onError) onError(event);
      
      // Procesar siguiente en la cola incluso con error
      this.processQueue();
    };

    // Hablar inmediatamente
    this.synthesis.speak(utterance);
  }

  speakWithQueue(text, priority = 'normal', onStart, onEnd, onError) {
    if (!this.isEnabled || !text) {
      if (onEnd) onEnd();
      return;
    }

    const item = {
      text,
      priority,
      onStart,
      onEnd,
      onError,
      timestamp: Date.now()
    };

    // Agregar a la cola según prioridad
    if (priority === 'high') {
      this.queue.unshift(item); // Alta prioridad al inicio
    } else {
      this.queue.push(item); // Prioridad normal al final
    }

    // Si no está hablando, procesar la cola
    if (!this.isSpeaking) {
      this.processQueue();
    }
  }

  processQueue() {
    if (this.queue.length === 0 || this.isSpeaking) return;

    const nextItem = this.queue.shift();
    this.speak(
      nextItem.text,
      nextItem.onStart,
      () => {
        if (nextItem.onEnd) nextItem.onEnd();
        this.processQueue();
      },
      nextItem.onError
    );
  }

  stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
    
    // Limpiar cola
    this.queue = [];
  }

  pause() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.synthesis && this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  setRate(rate) {
    this.rate = Math.max(0.1, Math.min(2, rate));
  }

  setPitch(pitch) {
    this.pitch = Math.max(0, Math.min(2, pitch));
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  setLanguage(lang) {
    this.lang = lang;
    this.loadVoices();
  }

  getVoices() {
    return this.synthesis ? this.synthesis.getVoices() : [];
  }

  isAvailable() {
    return !!this.synthesis;
  }

  clearQueue() {
    this.queue = [];
  }

  getQueueLength() {
    return this.queue.length;
  }

  isPaused() {
    return this.synthesis ? this.synthesis.paused : false;
  }
}

// Singleton instance
export const voiceService = new VoiceService();