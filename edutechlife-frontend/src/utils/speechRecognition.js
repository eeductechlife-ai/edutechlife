export const createSpeechRecognition = (options = {}) => {
  const {
    onStart = () => {},
    onResult = () => {},
    onEnd = () => {},
    onError = () => {},
    lang = 'es-CO',
    continuous = false,
    interimResults = true,
    maxAlternatives = 1,
  } = options;

  const SpeechRecognition = typeof window !== 'undefined' 
    ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
    : null;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = lang;
  recognition.continuous = continuous;
  recognition.interimResults = interimResults;
  recognition.maxAlternatives = maxAlternatives;

  let finalTranscript = '';
  let isActive = false;
  let silenceTimer = null;
  let errorCount = 0;
  const MAX_ERROR_COUNT = 3;

  const clearSilenceTimer = () => {
    if (silenceTimer) {
      clearTimeout(silenceTimer);
      silenceTimer = null;
    }
  };

  const resetSilenceTimer = () => {
    clearSilenceTimer();
    if (isActive) {
      silenceTimer = setTimeout(() => {
        if (isActive) {
          try {
            recognition.stop();
          } catch (e) {
            console.warn('Error stopping recognition after silence:', e);
          }
        }
      }, 5000); // Reducido de 10s a 5s para mayor velocidad
    }
  };

  recognition.onstart = () => {
    isActive = true;
    errorCount = 0;
    resetSilenceTimer();
    onStart();
  };

  recognition.onresult = (event) => {
    clearSilenceTimer();
    
    let interim = '';
    let hasFinal = false;
    let newFinalText = '';
    
    // Procesar TODOS los resultados desde el principio
    for (let i = 0; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0].transcript;
      
      if (result.isFinal) {
        // Para resultados finales, agregar al texto final
        newFinalText += (newFinalText ? ' ' : '') + transcript.trim();
        hasFinal = true;
      } else {
        // Para resultados interinos, agregar al texto temporal
        interim += transcript;
      }
    }
    
    // Si hay texto final nuevo, agregarlo al acumulado
    if (newFinalText) {
      finalTranscript += (finalTranscript ? ' ' : '') + newFinalText;
    }
    
    // Enviar el texto completo: acumulado final + interino actual
    const fullText = finalTranscript + (interim ? ' ' + interim : '');
    onResult(fullText, finalTranscript.trim(), hasFinal);
    
    if (!hasFinal) {
      resetSilenceTimer();
    }
  };

  recognition.onend = () => {
    clearSilenceTimer();
    isActive = false;
    const finalText = finalTranscript.trim();
    onEnd(finalText);
    finalTranscript = '';
  };

  recognition.onerror = (event) => {
    clearSilenceTimer();
    isActive = false;
    errorCount++;
    
    console.error('Speech recognition error:', event.error);
    
    if (errorCount >= MAX_ERROR_COUNT) {
      onError('max_errors_reached', 'Se alcanzó el máximo de errores. Por favor, intenta de nuevo.');
    } else {
      onError(event.error, getErrorMessage(event.error));
    }
  };

  const getErrorMessage = (error) => {
    switch (error) {
      case 'not-allowed':
      case 'permission-denied':
        return 'Por favor, permite el acceso al micrófono en tu navegador';
      case 'no-speech':
        return 'No se detectó voz. Por favor, habla más claro';
      case 'audio-capture':
        return 'No se pudo acceder al micrófono. Verifica tu dispositivo de audio';
      case 'network':
        return 'Error de red. Verifica tu conexión a internet';
      case 'service-not-allowed':
        return 'El servicio de reconocimiento de voz no está disponible';
      default:
        return 'Error en el reconocimiento de voz. Por favor, intenta de nuevo';
    }
  };

  const start = () => {
    if (isActive) {
      console.warn('Recognition already active');
      return;
    }
    
    try {
      recognition.start();
    } catch (e) {
      console.error('Error starting recognition:', e);
      onError('start_failed', 'No se pudo iniciar el reconocimiento de voz');
    }
  };

  const stop = () => {
    clearSilenceTimer();
    if (isActive) {
      try {
        recognition.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
    }
    isActive = false;
  };

  const abort = () => {
    clearSilenceTimer();
    if (isActive) {
      try {
        recognition.abort();
      } catch (e) {
        console.warn('Error aborting recognition:', e);
      }
    }
    isActive = false;
  };

  return {
    start,
    stop,
    abort,
    recognition,
    isActive: () => isActive,
  };
};

export const checkSpeechRecognitionSupport = () => {
  if (typeof window === 'undefined') return false;
  
  const hasSupport = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  
  if (!hasSupport) {
    console.warn('Speech Recognition API not supported in this browser');
  }
  
  return hasSupport;
};

export const requestMicrophonePermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return { success: true };
  } catch (error) {
    console.error('Microphone permission error:', error);
    return { 
      success: false, 
      error: error.name,
      message: getPermissionErrorMessage(error.name)
    };
  }
};

const getPermissionErrorMessage = (errorName) => {
  switch (errorName) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return 'Permiso de micrófono denegado. Por favor, habilítalo en la configuración de tu navegador';
    case 'NotFoundError':
      return 'No se encontró ningún micrófono disponible';
    case 'NotReadableError':
      return 'No se puede acceder al micrófono. Puede estar en uso por otra aplicación';
    case 'SecurityError':
      return 'El acceso al micrófono está bloqueado por razones de seguridad';
    default:
      return 'Error al acceder al micrófono';
  }
};

export const getSpeechRecognitionStatus = () => {
  const hasSupport = checkSpeechRecognitionSupport();
  
  if (!hasSupport) {
    return {
      supported: false,
      message: 'Tu navegador no soporta reconocimiento de voz. Usa Chrome, Edge o Safari.',
      canUse: false
    };
  }
  
  return {
    supported: true,
    message: 'Reconocimiento de voz disponible',
    canUse: true
  };
};