class VoiceEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.recognition = null;
    this.currentVoice = null;
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
    
    this.initVoices();
    this.initRecognition();
  }

  calculateSpeechDuration(text) {
    const cleanText = text.replace(/[#*`_~🎉🎯💡✨👏👍🎨🎧🎮🎬📚©®™°•↑↓→←↔↕]/g, '');
    const charsPerSecond = 15;
    const baseTime = 500;
    return Math.max(1500, baseTime + (cleanText.length / charsPerSecond) * 1000);
  }

  clearListenTimeout() {
    if (this.listenTimeout) {
      clearTimeout(this.listenTimeout);
      this.listenTimeout = null;
    }
  }

  initVoices() {
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      this.currentVoice = this.selectBestVoice(voices);
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  selectBestVoice(voices) {
    const priorityList = [
      { lang: 'es-CO', name: ['Google'] },
      { lang: 'es-MX', name: ['Google'] },
      { lang: 'es-AR', name: ['Google'] },
      { lang: 'es', name: ['Google', 'female', 'Female'] },
      { lang: 'es', name: ['Laura', 'Sofia', 'Carmen', 'Lucia', 'Sabina'] },
      { lang: 'es-ES', name: ['Google'] },
      { lang: 'es', name: ['Google'] },
      { lang: 'es', name: [] },
    ];

    for (const criteria of priorityList) {
      const found = voices.find(v => {
        const langMatch = v.lang.startsWith(criteria.lang) || criteria.lang === 'es';
        const nameMatch = criteria.name.length === 0 || 
          criteria.name.some(n => v.name.includes(n));
        return langMatch && nameMatch && !v.name.includes('Male');
      });
      if (found) return found;
    }

    return voices[0] || null;
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition not supported');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'es-CO';
    this.recognition.continuous = true;
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

  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (this.isSpeaking) {
        this.synth.cancel();
      }

      const { rate = 1.0, pitch = 1.05, volume = 1.0 } = options;
      
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

      const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
      const filteredSentences = sentences.map(s => s.trim()).filter(s => s.length > 0);

      if (filteredSentences.length === 0) {
        filteredSentences.push(cleanText);
      }

      let currentIndex = 0;

      const speakNext = () => {
        if (currentIndex >= filteredSentences.length) {
          this.isSpeaking = false;
          if (this.onSpeakEnd) this.onSpeakEnd();
          resolve();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(filteredSentences[currentIndex]);
        
        if (this.currentVoice) {
          utterance.voice = this.currentVoice;
        }
        
        utterance.lang = 'es';
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        utterance.onend = () => {
          currentIndex++;
          if (currentIndex < filteredSentences.length) {
            setTimeout(speakNext, 60);
          } else {
            this.isSpeaking = false;
            if (this.onSpeakEnd) this.onSpeakEnd();
            resolve();
          }
        };

        utterance.onerror = (e) => {
          console.error('TTS error:', e);
          this.isSpeaking = false;
          if (this.onSpeakEnd) this.onSpeakEnd();
          resolve();
        };

        this.synth.speak(utterance);
      };

      if (this.synth.getVoices().length === 0) {
        this.synth.addEventListener('voiceschanged', () => {
          this.currentVoice = this.selectBestVoice(this.synth.getVoices());
          setTimeout(speakNext, 50);
        }, { once: true });
      } else {
        setTimeout(speakNext, 50);
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
    this.synth.cancel();
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
    voiceEngineInstance = new VoiceEngine();
  }
  return voiceEngineInstance;
}

export const voiceEngine = getVoiceEngine();

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
