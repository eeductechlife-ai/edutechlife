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
    this.autoRestartListening = false;
    this.silenceTimer = null;
    this.silenceThreshold = 1500;
    
    this.initVoices();
    this.initRecognition();
  }

  initVoices() {
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      this.currentVoice = this.selectBestVoice(voices);
      
      if (!this.currentVoice && voices.length > 0) {
        const spanish = voices.filter(v => v.lang.includes('es') && !v.lang.includes('US'));
        this.currentVoice = spanish[0] || voices[0];
      }
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
    this.recognition.restartInMS = 10000;

    let finalTranscript = '';
    let silenceTimer = null;

    this.recognition.onstart = () => {
      this.isListening = true;
      finalTranscript = '';
      if (this.onListeningStart) this.onListeningStart();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onListeningEnd) this.onListeningEnd();
      
      if (this.conversationMode && this.autoRestartListening && !this.isSpeaking) {
        setTimeout(() => this.startListening(), 500);
      }
      
      if (finalTranscript.trim()) {
        if (this.onFinalResult) this.onFinalResult(finalTranscript.trim());
      }
      finalTranscript = '';
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += ' ' + transcript.trim();
          if (silenceTimer) clearTimeout(silenceTimer);
          silenceTimer = setTimeout(() => {
            this.recognition?.stop();
          }, this.silenceThreshold);
        } else {
          interimTranscript += transcript;
        }
      }
      
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
        this.stop();
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
            setTimeout(speakNext, 80);
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
    
    try {
      this.recognition.start();
    } catch (e) {
      console.error('Recognition start error:', e);
    }
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
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
    this.autoRestartListening = enabled;
  }

  setVoice(voiceName) {
    const voices = this.synth.getVoices();
    this.currentVoice = voices.find(v => 
      v.name.toLowerCase().includes(voiceName.toLowerCase())
    ) || this.currentVoice;
  }

  getAvailableVoices() {
    return this.synth.getVoices().filter(v => v.lang.includes('es'));
  }

  destroy() {
    this.stop();
    this.setConversationMode(false);
    if (this.recognition) {
      this.recognition.abort();
    }
  }
}

export const voiceEngine = new VoiceEngine();

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

export function getAvailableVoices() {
  return voiceEngine.getAvailableVoices();
}

export default voiceEngine;
