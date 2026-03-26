export const createSpeechRecognition = (options = {}) => {
  const {
    onStart = () => {},
    onResult = () => {},
    onEnd = () => {},
    onError = () => {},
    lang = 'es-ES',
  } = options;

  const SpeechRecognition = typeof window !== 'undefined' 
    ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
    : null;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = lang;
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  let finalTranscript = '';
  let lastResultIndex = 0;

  recognition.onstart = () => {
    onStart();
  };

  recognition.onresult = (event) => {
    let interim = '';
    
    for (let i = lastResultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += ' ' + transcript.trim();
      } else {
        interim += transcript;
      }
    }
    lastResultIndex = event.results.length;
    
    onResult(finalTranscript + ' ' + interim, finalTranscript.trim());
  };

  recognition.onend = () => {
    onEnd(finalTranscript.trim());
    finalTranscript = '';
    lastResultIndex = 0;
  };

  recognition.onerror = (event) => {
    onError(event.error);
  };

  const start = () => {
    try {
      recognition.start();
    } catch (e) {
      console.error('Error starting recognition:', e);
    }
  };

  const stop = () => {
    try {
      recognition.stop();
    } catch (e) {}
  };

  return {
    start,
    stop,
    recognition,
  };
};

export const checkSpeechRecognitionSupport = () => {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};
