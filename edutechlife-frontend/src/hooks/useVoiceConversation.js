import { useState, useEffect, useCallback, useRef } from 'react';
import voiceEngine from '../utils/voiceEngine';

export const VOICE_STATES = {
  IDLE: 'idle',
  LISTENING: 'listening',
  PROCESSING: 'processing',
  SPEAKING: 'speaking',
};

export function useVoiceConversation(options = {}) {
  const { 
    onMessage, 
    autoStart = false,
    conversationMode = false,
    voiceRate = 1.0,
    voicePitch = 1.05,
  } = options;

  const [state, setState] = useState(VOICE_STATES.IDLE);
  const [interimText, setInterimText] = useState('');
  const [currentCaption, setCurrentCaption] = useState('');
  const [showCaptions, setShowCaptions] = useState(true);
  const [error, setError] = useState(null);
  
  const isProcessingRef = useRef(false);
  const conversationModeRef = useRef(conversationMode);

  useEffect(() => {
    conversationModeRef.current = conversationMode;
    
    if (conversationMode) {
      voiceEngine.setConversationMode(true);
    } else {
      voiceEngine.setConversationMode(false);
    }
  }, [conversationMode]);

  useEffect(() => {
    voiceEngine.onSpeakStart = () => {
      setState(VOICE_STATES.SPEAKING);
    };

    voiceEngine.onSpeakEnd = () => {
      setState(VOICE_STATES.IDLE);
      setCurrentCaption('');

      if (conversationModeRef.current && !isProcessingRef.current) {
        setTimeout(() => {
          setState(VOICE_STATES.LISTENING);
          voiceEngine.startListening();
        }, 300);
      }
    };

    voiceEngine.onListeningStart = () => {
      setState(VOICE_STATES.LISTENING);
      setError(null);
    };

    voiceEngine.onListeningEnd = () => {
      if (state !== VOICE_STATES.PROCESSING) {
        setState(VOICE_STATES.IDLE);
      }
    };

    voiceEngine.onInterimResult = (text) => {
      setInterimText(text);
    };

    voiceEngine.onFinalResult = (text) => {
      setInterimText('');
      handleUserSpeech(text);
    };

    voiceEngine.onError = (errorType) => {
      setError(errorType);
      setState(VOICE_STATES.IDLE);
    };

    return () => {
      voiceEngine.onSpeakStart = null;
      voiceEngine.onSpeakEnd = null;
      voiceEngine.onListeningStart = null;
      voiceEngine.onListeningEnd = null;
      voiceEngine.onInterimResult = null;
      voiceEngine.onFinalResult = null;
      voiceEngine.onError = null;
    };
  }, []);

  const handleUserSpeech = useCallback(async (text) => {
    if (!text.trim() || isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    setState(VOICE_STATES.PROCESSING);
    voiceEngine.stopListening();

    try {
      if (onMessage) {
        const response = await onMessage(text);
        
        if (response && response.text) {
          setCurrentCaption(response.text);
          await voiceEngine.speak(response.text, {
            rate: voiceRate,
            pitch: voicePitch,
          });
        }
      }
    } catch (err) {
      console.error('Error processing message:', err);
      setError('Error al procesar mensaje');
    } finally {
      isProcessingRef.current = false;
    }
  }, [onMessage, voiceRate, voicePitch]);

  const speak = useCallback(async (text) => {
    if (!text) return;
    
    setCurrentCaption(text);
    await voiceEngine.speak(text, {
      rate: voiceRate,
      pitch: voicePitch,
    });
  }, [voiceRate, voicePitch]);

  const startListening = useCallback(() => {
    if (state === VOICE_STATES.SPEAKING) return;
    
    setError(null);
    voiceEngine.startListening();
  }, [state]);

  const stopListening = useCallback(() => {
    voiceEngine.stopListening();
    setState(VOICE_STATES.IDLE);
    setInterimText('');
  }, []);

  const stop = useCallback(() => {
    voiceEngine.stop();
    setState(VOICE_STATES.IDLE);
    setCurrentCaption('');
    setInterimText('');
  }, []);

  const toggleListening = useCallback(() => {
    if (state === VOICE_STATES.LISTENING) {
      stopListening();
    } else if (state !== VOICE_STATES.SPEAKING) {
      startListening();
    }
  }, [state, startListening, stopListening]);

  const toggleConversationMode = useCallback(() => {
    const newMode = !conversationModeRef.current;
    voiceEngine.setConversationMode(newMode);
    return newMode;
  }, []);

  const toggleCaptions = useCallback(() => {
    setShowCaptions(prev => !prev);
  }, []);

  return {
    state,
    interimText,
    currentCaption,
    showCaptions,
    error,
    isListening: state === VOICE_STATES.LISTENING,
    isSpeaking: state === VOICE_STATES.SPEAKING,
    isProcessing: state === VOICE_STATES.PROCESSING,
    speak,
    startListening,
    stopListening,
    stop,
    toggleListening,
    toggleConversationMode: () => toggleConversationMode(),
    toggleCaptions,
  };
}

export default useVoiceConversation;
