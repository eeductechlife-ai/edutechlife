import { useState, useCallback, useRef } from 'react';
import { detectInterest } from '../utils/leads';

const useLeadCaptureLogic = (options = {}) => {
  const {
    minMessagesBeforeAsk = 3,
    maxMessagesBeforeForce = 8,
    interestThreshold = 0.7,
    cooldownAfterAsk = 5 // mensajes de cooldown después de preguntar
  } = options;

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadCaptureContext, setLeadCaptureContext] = useState(null);
  const [lastAskMessageCount, setLastAskMessageCount] = useState(0);
  
  const messageCountRef = useRef(0);
  const interestScoreRef = useRef(0);
  const conversationHistoryRef = useRef([]);

  // Palabras clave que indican interés en dar información
  const CONTACT_TRIGGERS = [
    'precio', 'cuesta', 'cuánto', 'cuanto', 'cotización',
    'inscribir', 'matricular', 'comprar', 'adquirir',
    'contactar', 'asesor', 'llamar', 'whatsapp',
    'clase prueba', 'clase gratuita', 'demo', 'prueba',
    'información', 'detalles', 'horarios', 'disponibilidad'
  ];

  // Palabras que indican resistencia a dar información
  const RESISTANCE_TRIGGERS = [
    'después', 'luego', 'más tarde', 'ahora no',
    'solo información', 'solo pregunto', 'solo curiosidad',
    'no teléfono', 'no número', 'privacidad', 'no ahora'
  ];

  const analyzeMessage = useCallback((message, role) => {
    if (role !== 'user') return;

    const lowerMessage = message.toLowerCase();
    
    // Incrementar contador de mensajes
    messageCountRef.current++;
    conversationHistoryRef.current.push({ message, role, timestamp: Date.now() });

    // Detectar interés general
    const interest = detectInterest(message);
    if (interest) {
      interestScoreRef.current = Math.min(1, interestScoreRef.current + 0.3);
    }

    // Verificar triggers de contacto
    const hasContactTrigger = CONTACT_TRIGGERS.some(trigger => 
      lowerMessage.includes(trigger)
    );

    // Verificar resistencia
    const hasResistance = RESISTANCE_TRIGGERS.some(trigger =>
      lowerMessage.includes(trigger)
    );

    // Ajustar score basado en triggers
    if (hasContactTrigger) {
      interestScoreRef.current = Math.min(1, interestScoreRef.current + 0.2);
    }

    if (hasResistance) {
      interestScoreRef.current = Math.max(0, interestScoreRef.current - 0.3);
      // Resetear lastAsk si hay resistencia
      setLastAskMessageCount(messageCountRef.current);
    }

    // Extraer posible interés específico
    let detectedInterest = '';
    if (lowerMessage.includes('programación') || lowerMessage.includes('codigo') || lowerMessage.includes('scratch') || lowerMessage.includes('python')) {
      detectedInterest = 'programacion';
    } else if (lowerMessage.includes('robótica') || lowerMessage.includes('robotica') || lowerMessage.includes('lego') || lowerMessage.includes('arduino')) {
      detectedInterest = 'robotica';
    } else if (lowerMessage.includes('vak') || lowerMessage.includes('estilo aprendizaje') || lowerMessage.includes('visual auditivo')) {
      detectedInterest = 'vak';
    } else if (lowerMessage.includes('tutoría') || lowerMessage.includes('tutoria') || lowerMessage.includes('clases') || lowerMessage.includes('refuerzo')) {
      detectedInterest = 'tutoria';
    } else if (lowerMessage.includes('emocional') || lowerMessage.includes('bienestar') || lowerMessage.includes('psicológico') || lowerMessage.includes('psicologico')) {
      detectedInterest = 'bienestar';
    }

    // Extraer posible edad mencionada
    let detectedAge = '';
    const ageMatch = message.match(/(\d+)\s*(años|año|anos|ano|years|year)/i);
    if (ageMatch) {
      detectedAge = `${ageMatch[1]} años`;
    }

    return {
      hasContactTrigger,
      hasResistance,
      detectedInterest,
      detectedAge,
      currentScore: interestScoreRef.current,
      messageCount: messageCountRef.current
    };
  }, []);

  const shouldShowLeadForm = useCallback((analysis, userName = '') => {
    // No mostrar si ya se está mostrando
    if (showLeadForm) return false;

    const { 
      hasContactTrigger, 
      hasResistance, 
      currentScore, 
      messageCount,
      detectedInterest,
      detectedAge
    } = analysis;

    // Condición 1: Resistencia explícita - no mostrar
    if (hasResistance) {
      return false;
    }

    // Condición 2: Muy pocos mensajes - esperar
    if (messageCount < minMessagesBeforeAsk) {
      return false;
    }

    // Condición 3: Cooldown después de última pregunta
    const messagesSinceLastAsk = messageCount - lastAskMessageCount;
    if (messagesSinceLastAsk < cooldownAfterAsk && lastAskMessageCount > 0) {
      return false;
    }

    // Condición 4: Trigger directo de contacto + buen score
    if (hasContactTrigger && currentScore >= interestThreshold * 0.8) {
      return true;
    }

    // Condición 5: Score alto y mensajes suficientes
    if (currentScore >= interestThreshold && messageCount >= minMessagesBeforeAsk) {
      return true;
    }

    // Condición 6: Muchos mensajes sin preguntar (force ask)
    if (messageCount >= maxMessagesBeforeForce && messagesSinceLastAsk >= cooldownAfterAsk) {
      return true;
    }

    return false;
  }, [showLeadForm, minMessagesBeforeAsk, maxMessagesBeforeForce, interestThreshold, cooldownAfterAsk, lastAskMessageCount]);

  const prepareLeadContext = useCallback((analysis, userName, memoryContext = {}) => {
    const { detectedInterest, detectedAge } = analysis;
    
    // Usar interés detectado o de memoria
    const interest = detectedInterest || memoryContext.primaryInterest || '';
    
    // Construir contexto para el formulario
    const context = {
      userName: userName || memoryContext.userName || '',
      userInterest: interest,
      userAge: detectedAge || memoryContext.userAge || '',
      conversationSummary: conversationHistoryRef.current.slice(-5).map(m => m.message).join(' | '),
      triggerReason: analysis.hasContactTrigger ? 'contact_trigger' : 
                    analysis.currentScore >= interestThreshold ? 'high_interest' : 
                    'message_count',
      timestamp: new Date().toISOString()
    };

    setLeadCaptureContext(context);
    return context;
  }, [interestThreshold]);

  const showForm = useCallback((context) => {
    setShowLeadForm(true);
    setLeadCaptureContext(context);
    // Registrar que acabamos de preguntar
    setLastAskMessageCount(messageCountRef.current);
  }, []);

  const hideForm = useCallback(() => {
    setShowLeadForm(false);
    setLeadCaptureContext(null);
  }, []);

  const handleLeadSaved = useCallback((leadData) => {
    console.log('✅ Lead guardado:', leadData);
    // Resetear scores después de guardar lead exitosamente
    interestScoreRef.current = 0;
    // No resetear messageCount para mantener contexto
    hideForm();
    
    return leadData;
  }, [hideForm]);

  const getStats = useCallback(() => ({
    messageCount: messageCountRef.current,
    interestScore: interestScoreRef.current,
    showLeadForm,
    lastAskMessageCount,
    conversationLength: conversationHistoryRef.current.length
  }), [showLeadForm, lastAskMessageCount]);

  return {
    // Estado
    showLeadForm,
    leadCaptureContext,
    
    // Funciones principales
    analyzeMessage,
    shouldShowLeadForm,
    prepareLeadContext,
    showForm,
    hideForm,
    handleLeadSaved,
    
    // Utilidades
    getStats,
    
    // Datos de análisis
    messageCount: messageCountRef.current,
    interestScore: interestScoreRef.current
  };
};

export default useLeadCaptureLogic;