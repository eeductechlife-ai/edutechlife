import { useState, useRef, useCallback, useEffect } from 'react';

export default function useFlashcardSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  const speak = useCallback((text, onEnd) => {
    if (!('speechSynthesis' in window)) return;
    stop();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-US';
    utterance.rate = 0.9;
    utterance.pitch = 0;
    utterance.volume = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => { setSpeaking(false); onEnd?.(); };
    utterance.onerror = () => { setSpeaking(false); onEnd?.(); };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [stop]);

  useEffect(() => {
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, []);

  return { speak, stop, speaking, supported };
}
