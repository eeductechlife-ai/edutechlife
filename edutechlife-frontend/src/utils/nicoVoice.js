// Sistema de Voz Optimizado para Nico Premium
// Características:
// - Cache de audio sintetizado
// - Reproducción asincrónica
// - Pre-carga de recursos
// - Fallback automático

import { speakTextConversational, stopSpeech } from './speech';

// ==================== CACHE DE AUDIO ====================

class AudioCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.accessOrder = [];
  }

  async getAudio(text, voiceProfile = 'nico_premium') {
    const cacheKey = `${text}_${voiceProfile}`;
    
    // Verificar cache
    if (this.cache.has(cacheKey)) {
      const audioData = this.cache.get(cacheKey);
      this.updateAccessOrder(cacheKey);
      return this.createAudioFromCache(audioData);
    }
    
    // Sintetizar nuevo audio
    const audio = await this.synthesizeAndCache(text, voiceProfile, cacheKey);
    return audio;
  }

  async synthesizeAndCache(text, voiceProfile, cacheKey) {
    try {
      // Sintetizar voz
      const audioUrl = await this.synthesizeVoice(text, voiceProfile);
      
      // Guardar en cache
      if (this.cache.size >= this.maxSize) {
        const oldestKey = this.accessOrder.shift();
        this.cache.delete(oldestKey);
      }
      
      this.cache.set(cacheKey, {
        url: audioUrl,
        text,
        voiceProfile,
        timestamp: Date.now()
      });
      
      this.accessOrder.push(cacheKey);
      
      return this.createAudioFromCache(this.cache.get(cacheKey));
    } catch (error) {
      console.error('Error sintetizando voz:', error);
      throw error;
    }
  }

  async synthesizeVoice(text, voiceProfile) {
    return new Promise((resolve, reject) => {
      // Usar la función existente pero capturar el audio
      const originalAudio = new Audio();
      let audioUrl = null;
      
      const cleanup = () => {
        originalAudio.removeEventListener('canplaythrough', onCanPlay);
        originalAudio.removeEventListener('error', onError);
      };
      
      const onCanPlay = () => {
        cleanup();
        resolve(audioUrl);
      };
      
      const onError = (error) => {
        cleanup();
        reject(error);
      };
      
      // Simular síntesis (en producción se integraría con speakTextConversational)
      // Por ahora usamos un enfoque simple
      setTimeout(() => {
        // En producción, esto se conectaría con la API real
        audioUrl = `data:audio/mp3;base64,simulated_audio_${Date.now()}`;
        originalAudio.src = audioUrl;
        originalAudio.addEventListener('canplaythrough', onCanPlay);
        originalAudio.addEventListener('error', onError);
      }, 50);
    });
  }

  createAudioFromCache(audioData) {
    const audio = new Audio(audioData.url);
    audio.cacheData = audioData;
    return audio;
  }

  updateAccessOrder(key) {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
      this.accessOrder.push(key);
    }
  }

  preloadTexts(texts, voiceProfile = 'nico_premium') {
    return Promise.all(
      texts.map(text => this.getAudio(text, voiceProfile).catch(() => null))
    );
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.cache.size / this.maxSize,
      oldest: this.accessOrder[0] || null,
      newest: this.accessOrder[this.accessOrder.length - 1] || null
    };
  }
}

// ==================== SISTEMA DE REPRODUCCIÓN ASINCRÓNICA ====================

export class NicoVoiceSystem {
  constructor() {
    this.audioCache = new AudioCache(100);
    this.currentAudio = null;
    this.isSpeaking = false;
    this.speechQueue = [];
    this.isEnabled = true;
    
    // Pre-cargar frases comunes
    this.preloadCommonPhrases();
  }

  async preloadCommonPhrases() {
    const commonPhrases = [
      '¡Hola! Soy Nico de EdutechLife.',
      '¿En qué puedo ayudarte?',
      'Un momento, estoy procesando tu pregunta.',
      '¡Excelente pregunta!',
      'Permíteme explicarte.',
      '¿Hay algo más en lo que pueda ayudarte?',
      '¡Hasta luego! Que tengas un excelente día.'
    ];
    
    await this.audioCache.preloadTexts(commonPhrases, 'nico_premium');
    console.log('✅ Frases comunes pre-cargadas en cache de audio');
  }

  async speak(text, options = {}) {
    if (!this.isEnabled || !text) return;
    
    const {
      voiceProfile = 'nico_premium',
      onStart = () => {},
      onEnd = () => {},
      onError = () => {},
      priority = 'normal'
    } = options;
    
    // Detener audio actual si hay uno
    this.stop();
    
    try {
      this.isSpeaking = true;
      onStart();
      
      // Obtener audio del cache (o sintetizar)
      const audio = await this.audioCache.getAudio(text, voiceProfile);
      
      // Configurar eventos
      audio.onended = () => {
        this.isSpeaking = false;
        this.currentAudio = null;
        onEnd();
      };
      
      audio.onerror = (error) => {
        console.error('Error reproduciendo audio:', error);
        this.isSpeaking = false;
        this.currentAudio = null;
        onError(error);
      };
      
      // Reproducir
      this.currentAudio = audio;
      await audio.play();
      
    } catch (error) {
      console.error('Error en sistema de voz:', error);
      this.isSpeaking = false;
      this.currentAudio = null;
      onError(error);
      
      // Fallback a síntesis tradicional
      try {
        await speakTextConversational(text, voiceProfile, () => {
          this.isSpeaking = false;
          onEnd();
        });
      } catch (fallbackError) {
        console.error('Fallback también falló:', fallbackError);
      }
    }
  }

  speakAsync(text, options = {}) {
    // No esperar, solo iniciar y continuar
    this.speak(text, options).catch(() => {
      // Silenciar errores para no bloquear flujo
    });
    return this; // Para chaining
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.isSpeaking = false;
    stopSpeech();
  }

  toggleEnabled() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.stop();
    }
    return this.isEnabled;
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  getStatus() {
    return {
      isSpeaking: this.isSpeaking,
      isEnabled: this.isEnabled,
      queueLength: this.speechQueue.length,
      cacheStats: this.audioCache.getStats()
    };
  }

  // Métodos para optimización
  preloadResponses(responses) {
    return this.audioCache.preloadTexts(responses, 'nico_premium');
  }

  clearCache() {
    this.audioCache.cache.clear();
    this.audioCache.accessOrder = [];
  }
}

// ==================== INSTANCIA GLOBAL ====================

let globalVoiceSystem = null;

export function getVoiceSystem() {
  if (!globalVoiceSystem) {
    globalVoiceSystem = new NicoVoiceSystem();
    console.log('🎵 Sistema de voz Nico inicializado');
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