// Sistema de Voz Optimizado para Nico Premium
// Usa el sistema de cache de speech.js que tiene cache LRU real + autoplay handling

import { speakTextConversational, stopSpeech } from './speech';

export class NicoVoiceSystem {
  constructor() {
    this.isSpeaking = false;
    this.isEnabled = true;
  }

  async speak(text, options = {}) {
    if (!this.isEnabled || !text) return;

    const {
      voiceProfile = 'nico_premium',
      onStart = () => {},
      onEnd = () => {},
      onError = () => {}
    } = options;

    this.stop();

    this.isSpeaking = true;
    onStart();

    try {
      await speakTextConversational(text, voiceProfile, () => {
        this.isSpeaking = false;
        onEnd();
      });
    } catch (error) {
      console.error('Error en sistema de voz:', error);
      this.isSpeaking = false;
      onError(error);
    }
  }

  speakAsync(text, options = {}) {
    this.speak(text, options).catch(() => {});
    return this;
  }

  stop() {
    this.isSpeaking = false;
    stopSpeech();
  }

  toggleEnabled() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) this.stop();
    return this.isEnabled;
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (!enabled) this.stop();
  }

  getStatus() {
    return {
      isSpeaking: this.isSpeaking,
      isEnabled: this.isEnabled
    };
  }
}

// ==================== INSTANCIA GLOBAL ====================

let globalVoiceSystem = null;

export function getVoiceSystem() {
  if (!globalVoiceSystem) {
    globalVoiceSystem = new NicoVoiceSystem();

  }
  return globalVoiceSystem;
}

export function initializeVoiceSystem() {
  const system = getVoiceSystem();
  return system;
}

// ==================== FUNCIONES DE CONVENIENCIA ====================

export async function speakWithNico(text, options = {}) {
  const system = getVoiceSystem();
  return system.speak(text, options);
}

export function speakWithNicoAsync(text, options = {}) {
  const system = getVoiceSystem();
  return system.speakAsync(text, options);
}

export function stopNicoVoice() {
  const system = getVoiceSystem();
  system.stop();
}

export function toggleNicoVoice() {
  const system = getVoiceSystem();
  return system.toggleEnabled();
}

export function setNicoVoiceEnabled(enabled) {
  const system = getVoiceSystem();
  system.setEnabled(enabled);
}

export function getNicoVoiceStatus() {
  const system = getVoiceSystem();
  return system.getStatus();
}

// ==================== INICIALIZACIÓN AUTOMÁTICA ====================

// Inicializar cuando se importa el módulo
if (typeof window !== 'undefined') {
  setTimeout(() => {
    initializeVoiceSystem();
  }, 1000); // Inicializar después de 1 segundo
}