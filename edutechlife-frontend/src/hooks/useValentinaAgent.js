import { useState, useEffect, useCallback, useRef } from 'react';
import { speakTextConversational } from '../utils/speech';
import { 
  getAgeGroup,
  VALENTINA_MESSAGES,
  VALERIA_EXPRESSIONS,
  getProgressMessage,
  getMoodFeedback
} from '../utils/valentinaMessages';

/**
 * Hook para manejar el agente Valeria - Psicóloga Educativa VAK
 * Sistema conversacional completo con expresiones visuales
 */
export default function useValentinaAgent(options = {}) {
  const {
    studentName = '',
    studentAge = 12,
    phase = 'intro',
    currentQuestion = 0,
    totalQuestions = 10,
    diagnosis = null,
    enabled = true
  } = options;

  // Estados de Valeria
  const [valentinaMode, setValentinaMode] = useState(enabled);
  const [isValentinaSpeaking, setIsValentinaSpeaking] = useState(false);
  const [valeriaExpression, setValeriaExpression] = useState('neutral');
  const [volume, setVolume] = useState(1.0);

  // Referencias
  const isMountedRef = useRef(true);
  const currentAudioRef = useRef(null);
  const speakingPromiseRef = useRef(null);

  // Efecto de limpieza
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  // Sincronizar estado de voz
  useEffect(() => {
    setValentinaMode(enabled);
  }, [enabled]);

  /**
   * Función helper para delay
   */
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * Hablar como Valeria - versión mejorada
   */
  const speakAsValentina = useCallback(async (text) => {
    if (!text || !isMountedRef.current || !valentinaMode) return;
    
    // Si ya está hablando, esperar a que termine
    if (isValentinaSpeaking) {
      try {
        await speakingPromiseRef.current;
      } catch (e) {
        // Ignorar errores de promesas anteriores
      }
    }
    
    speakingPromiseRef.current = new Promise(async (resolve) => {
      try {
        setIsValentinaSpeaking(true);
        
        const { speakAsValentina: valSpeak } = await import('../utils/speech');
        
        await new Promise((resolveSpeech) => {
          valSpeak(text, parseInt(studentAge) || 12, () => {
            resolveSpeech();
          });
        });
        
      } catch (error) {
        console.warn('Error al hablar como Valeria:', error);
      } finally {
        if (isMountedRef.current) {
          setIsValentinaSpeaking(false);
        }
        resolve();
      }
    });
    
    await speakingPromiseRef.current;
  }, [valentinaMode, studentAge]);

  /**
   * Detener el habla actual
   */
  const stopSpeaking = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setIsValentinaSpeaking(false);
    speakingPromiseRef.current = null;
  }, []);

  /**
   * Establecer volumen de Valeria
   */
  const setValeriaVolume = useCallback((v) => {
    setVolume(Math.max(0, Math.min(1, v)));
  }, []);

  /**
   * Toggle modo Valeria
   */
  const toggleValentinaMode = useCallback(() => {
    const newMode = !valentinaMode;
    setValentinaMode(newMode);
    if (!newMode) {
      stopSpeaking();
    }
    return newMode;
  }, [valentinaMode, stopSpeaking]);

  // ==================== MÉTODOS CONVERSACIONALES ====================

  /**
   * Explicar el diagnóstico (al inicio)
   */
  const explainDiagnosis = useCallback(async () => {
    if (!isMountedRef.current || !valentinaMode) return;
    
    const ageGroup = getAgeGroup(parseInt(studentAge) || 12);
    const message = VALENTINA_MESSAGES[ageGroup].welcome();
    setValeriaExpression('excited');
    await speakAsValentina(message);
    setValeriaExpression('neutral');
  }, [speakAsValentina, valentinaMode, studentAge]);

  /**
   * Solicitar nombre al usuario
   */
  const askForName = useCallback(async () => {
    if (!isMountedRef.current || !valentinaMode) return;
    
    setValeriaExpression('curious');
    const ageGroup = getAgeGroup(parseInt(studentAge) || 12);
    const message = VALENTINA_MESSAGES[ageGroup].askName();
    await speakAsValentina(message);
    setValeriaExpression('neutral');
  }, [speakAsValentina, valentinaMode, studentAge]);

  /**
   * Confirmar nombre y solicitar edad
   */
  const confirmNameAndAskAge = useCallback(async (name) => {
    if (!isMountedRef.current || !valentinaMode) return;
    
    const ageGroup = getAgeGroup(parseInt(studentAge) || 12);
    const confirmMsg = VALENTINA_MESSAGES[ageGroup].confirmName(name);
    
    setValeriaExpression('happy');
    await speakAsValentina(confirmMsg);
    setValeriaExpression('thinking');
    await delay(1500);
    
    const askAgeMsg = VALENTINA_MESSAGES[ageGroup].askAge(name);
    await speakAsValentina(askAgeMsg);
    setValeriaExpression('neutral');
  }, [speakAsValentina, valentinaMode, studentAge]);

  /**
   * Confirmar edad y solicitar email
   */
  const confirmAgeAndAskEmail = useCallback(async (name, age) => {
    if (!isMountedRef.current || !valentinaMode) return;
    
    const ageGroup = getAgeGroup(age);
    const confirmMsg = VALENTINA_MESSAGES[ageGroup].confirmAge(name, age);
    
    setValeriaExpression('proud');
    await speakAsValentina(confirmMsg);
    setValeriaExpression('thinking');
    await delay(1500);
    
    const askEmailMsg = VALENTINA_MESSAGES[ageGroup].askEmail();
    await speakAsValentina(askEmailMsg);
    setValeriaExpression('neutral');
  }, [speakAsValentina, valentinaMode]);

  /**
   * Confirmar email y solicitar teléfono
   */
  const confirmEmailAndAskPhone = useCallback(async () => {
    if (!isMountedRef.current || !valentinaMode) return;
    
    setValeriaExpression('happy');
    await speakAsValentina("¡Perfecto! Tu correo está guardado.");
    setValeriaExpression('curious');
    await delay(1500);
    
    await speakAsValentina("¿Y tu número de teléfono?");
    setValeriaExpression('neutral');
  }, [speakAsValentina, valentinaMode]);

  /**
   * Confirmar teléfono y solicitar estado de ánimo
   */
  const confirmPhoneAndAskMood = useCallback(async (name) => {
    if (!isMountedRef.current || !valentinaMode) return;
    
    setValeriaExpression('happy');
    await speakAsValentina("¡Listo! Ya tengo tus datos.");
    setValeriaExpression('excited');
    await delay(1500);
    
    const ageGroup = getAgeGroup(parseInt(studentAge) || 12);
    const askMoodMsg = VALENTINA_MESSAGES[ageGroup].askMood(name);
    await speakAsValentina(askMoodMsg);
    setValeriaExpression('neutral');
  }, [speakAsValentina, valentinaMode, studentAge]);

  /**
   * Retroalimentar estado de ánimo - INMEDIATO
   */
  const giveMoodFeedback = useCallback(async (mood, name) => {
    if (!isMountedRef.current || !valentinaMode) return;
    
    const age = parseInt(studentAge) || 12;
    const feedback = getMoodFeedback(mood, name, age);
    
    const expressionMap = {
      happy: 'happy',
      excited: 'excited',
      calm: 'calm',
      curious: 'curious',
      tired: 'neutral',
      stressed: 'concerned',
      neutral: 'neutral'
    };
    setValeriaExpression(expressionMap[mood] || 'neutral');
    await speakAsValentina(feedback);
    setValeriaExpression('neutral');
  }, [speakAsValentina, valentinaMode, studentAge]);

  /**
   * Transición al diagnóstico
   */
  const transitionToTest = useCallback(async (name) => {
    if (!isMountedRef.current || !valentinaMode) return;
    
    const ageGroup = getAgeGroup(parseInt(studentAge) || 12);
    const transitionMsg = VALENTINA_MESSAGES[ageGroup].transitionToTest(name);
    
    setValeriaExpression('excited');
    await speakAsValentina(transitionMsg);
    setValeriaExpression('neutral');
  }, [speakAsValentina, valentinaMode, studentAge]);

  /**
   * Iniciar secuencia completa de bienvenida
   * @param {function} onComplete - Callback opcional que se ejecuta cuando termina la secuencia
   */
  const startWelcomeSequence = useCallback(async (onComplete) => {
    if (!isMountedRef.current || !valentinaMode) return;
    
    await explainDiagnosis();
    await delay(2000);
    await askForName();
    
    // Ejecutar callback si se proporcionó
    if (onComplete && typeof onComplete === 'function') {
      onComplete();
    }
  }, [explainDiagnosis, askForName, valentinaMode]);

  // ==================== MÉTODOS DEL DIAGNÓSTICO ====================

  /**
   * Leer pregunta completa con opciones
   */
  const readQuestionWithOptions = useCallback(async (questionText, options, currentNum, total) => {
    if (!isMountedRef.current || !valentinaMode) return;
    
    setValeriaExpression('thinking');
    const message = VALENTINA_MESSAGES.all.readQuestion(currentNum, total, questionText, options);
    await speakAsValentina(message);
    setValeriaExpression('neutral');
  }, [speakAsValentina, valentinaMode]);

  /**
   * Dar aliento después de respuesta
   */
  const giveEncouragement = useCallback(async () => {
    if (!isMountedRef.current || !valentinaMode) return;
    
    setValeriaExpression('encouraging');
    const encouragement = VALENTINA_MESSAGES.all.encouragement(studentName || '', parseInt(studentAge) || 12);
    await speakAsValentina(encouragement);
    setValeriaExpression('neutral');
  }, [speakAsValentina, valentinaMode, studentName, studentAge]);

  /**
   * Dar aliento SIN mencionar nombre (para usar en cada pregunta)
   */
  const giveEncouragementNoName = useCallback(async () => {
    if (!isMountedRef.current || !valentinaMode) return;
    
    setValeriaExpression('encouraging');
    const encouragements = [
      "¡Muy bien! Continúa así.",
      "¡Excelente elección!",
      "¡Perfecto! Sigue adelante.",
      "¡Muy bien! Estás haciendo un gran trabajo.",
      "¡Excelente! Sigamos.",
      "¡Perfecto! Vamos con la siguiente."
    ];
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    await speakAsValentina(randomEncouragement);
    setValeriaExpression('neutral');
  }, [speakAsValentina, valentinaMode]);

  /**
   * Mensaje de progreso cada 3 preguntas
   */
  const giveProgressUpdate = useCallback(async () => {
    if (!isMountedRef.current || !valentinaMode) return;
    if (currentQuestion < 3 || currentQuestion >= 9) return;
    
    setValeriaExpression('proud');
    const age = parseInt(studentAge) || 12;
    const message = getProgressMessage(studentName || '', currentQuestion + 1, totalQuestions, age);
    
    if (message) {
      await speakAsValentina(message);
    }
    setValeriaExpression('neutral');
  }, [speakAsValentina, valentinaMode, currentQuestion, studentName, studentAge, totalQuestions]);

  /**
   * Anunciar resultados
   */
  const announceResults = useCallback(async () => {
    if (!isMountedRef.current || !valentinaMode || !diagnosis) return;
    
    const styleDetails = diagnosis.styleDetails || {};
    const age = parseInt(studentAge) || 12;
    const ageGroup = getAgeGroup(age);
    
    const resultsMessage = VALENTINA_MESSAGES[ageGroup].results(
      studentName || 'Estudiante',
      diagnosis.predominantStyle || 'visual',
      diagnosis.percentage || 0,
      styleDetails.description || 'procesa información de forma única'
    );
    
    setValeriaExpression('celebrating');
    await delay(1500);
    await speakAsValentina(resultsMessage);
    setValeriaExpression('happy');
  }, [speakAsValentina, valentinaMode, diagnosis, studentName, studentAge]);

  /**
   * Anunciar fin del diagnóstico
   */
  const announceTestEnd = useCallback(async () => {
    if (!isMountedRef.current || !valentinaMode) return;
    setValeriaExpression('proud');
    await speakAsValentina("¡Excelente! Has completado todas las preguntas del diagnóstico. Ahora voy a analizar tus respuestas...");
    setValeriaExpression('neutral');
  }, [speakAsValentina, valentinaMode]);

  /**
   * Despedida final
   */
  const farewell = useCallback(async () => {
    if (!isMountedRef.current || !valentinaMode) return;
    setValeriaExpression('happy');
    const farewellMsg = VALENTINA_MESSAGES.all.finalFarewell(studentName || '');
    await speakAsValentina(farewellMsg);
    setValeriaExpression('neutral');
  }, [speakAsValentina, valentinaMode, studentName]);

  // ==================== RETORNO ====================
  return {
    valentinaMode,
    isValentinaSpeaking,
    valeriaExpression,
    volume,
    setValeriaVolume,
    speakAsValentina,
    stopSpeaking,
    toggleValentinaMode,
    
    // Métodos conversacionales
    startWelcomeSequence,
    explainDiagnosis,
    askForName,
    confirmNameAndAskAge,
    confirmAgeAndAskEmail,
    confirmEmailAndAskPhone,
    confirmPhoneAndAskMood,
    giveMoodFeedback,
    transitionToTest,
    
    // Métodos del diagnóstico
    readQuestionWithOptions,
    giveEncouragement,
    giveEncouragementNoName,
    giveProgressUpdate,
    announceResults,
    announceTestEnd,
    farewell
  };
}
