import { useState, useRef, useCallback, useEffect } from 'react';

const MAX_NO_SPEECH_RETRIES = 3;

export function useValerioVoice(isOpen, onTranscript) {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState('');
  const userCancelRef = useRef(false);
  const recognitionRef = useRef(null);
  const accumulatedRef = useRef('');
  const noSpeechRetryRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasAPI = !!window.SpeechRecognition || !!window.webkitSpeechRecognition;
    setSpeechSupported(hasAPI);
    if (!hasAPI) {
      setSpeechError('Tu navegador no soporta reconocimiento de voz');
    }
  }, []);

  useEffect(() => {
    if (!isOpen && recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
      try { recognitionRef.current.stop(); } catch (e) {}
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, [isOpen]);

  const startRecognition = useCallback(() => {
    setSpeechError('');
    userCancelRef.current = false;
    noSpeechRetryRef.current = 0;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Tu navegador no soporta reconocimiento de voz');
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-CO';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError('');
      };

      recognition.onresult = (event) => {
        let newText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          newText += event.results[i][0].transcript;
        }
        onTranscript((accumulatedRef.current + ' ' + newText).trim());
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
          const isHTTP = window.location.protocol !== 'https:';
          if (isHTTP) {
            setSpeechError('Se requiere una conexión segura (HTTPS) para usar el micrófono. Activa SSL en edutechlife.co');
          } else {
            setSpeechError('Permiso de micrófono denegado. Permite el acceso en la configuración del navegador.');
          }
          setIsListening(false);
          recognitionRef.current = null;
        } else if (event.error === 'no-speech') {
          if (!userCancelRef.current && noSpeechRetryRef.current < MAX_NO_SPEECH_RETRIES) {
            noSpeechRetryRef.current += 1;
            setTimeout(() => {
              if (!userCancelRef.current) {
                try {
                  const r = new SpeechRecognition();
                  r.lang = 'es-CO';
                  r.continuous = true;
                  r.interimResults = true;
                  r.maxAlternatives = 1;
                  r.onstart = recognition.onstart;
                  r.onresult = recognition.onresult;
                  r.onend = recognition.onend;
                  r.onerror = recognition.onerror;
                  r.start();
                  recognitionRef.current = r;
                } catch (e) {
                  setIsListening(false);
                  recognitionRef.current = null;
                }
              }
            }, 100);
          } else {
            setSpeechError('No se detectó audio. Verifica tu micrófono e intenta de nuevo.');
            setIsListening(false);
            recognitionRef.current = null;
            noSpeechRetryRef.current = 0;
          }
        } else if (event.error === 'aborted') {
        } else {
          setSpeechError('Error: ' + event.error);
          setIsListening(false);
          recognitionRef.current = null;
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      setSpeechError('Error al iniciar reconocimiento: ' + e.message);
      setIsListening(false);
    }
  }, [onTranscript]);

  const stopRecognition = useCallback(() => {
    userCancelRef.current = true;
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
      try { recognitionRef.current.stop(); } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    setSpeechError('');
  }, []);

  const toggleVoice = useCallback(() => {
    if (isListening) {
      stopRecognition();
    } else {
      accumulatedRef.current = '';
      startRecognition();
    }
  }, [isListening, startRecognition, stopRecognition]);

  return {
    isListening,
    speechSupported,
    speechError,
    toggleVoice,
    stopRecognition,
    setSpeechError,
  };
}
