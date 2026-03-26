import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Brain, Mic, MicOff, Volume2, VolumeX, Send, Sparkles, X, Loader2, Copy, PlayCircle, Bot, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import useConversationMemory from '../../hooks/useConversationMemory';
import { callDeepseek } from '../../utils/api';
import { speakTextConversational, stopSpeech } from '../../utils/speech';
import { createSpeechRecognition, checkSpeechRecognitionSupport, requestMicrophonePermission, getSpeechRecognitionStatus } from '../../utils/speechRecognition.enhanced';

const PROMPT_NICO_SOPORTE = `Eres NICO - Agente de Soporte Premium de EdutechLife.

## IDENTIDAD Y ROL
Eres el asistente virtual oficial de EdutechLife. Tu MISIÓN es resolver TODAS las dudas de los usuarios sobre:
- Metodología VAK (Visual, Auditivo, Kinestésico)
- Programas STEM/STEAM (Ciencia, Tecnología, Ingeniería, Matemáticas)
- Servicios de tutoría y acompañamiento académico
- Bienestar emocional y apoyo psicológico
- Proceso de inscripción y planes disponibles
- Horarios, ubicaciones y modalidades (presencial/en línea/híbrido)

## REGLAS DE ACTUACIÓN
1. Responde en Español Latino de forma NATURAL y CONCISA (máx 2-3 oraciones)
2. Si no sabes algo, sé honesto y ofrece buscar la información
3. Usa el nombre del usuario si lo conoces
4. Solo solicita datos de contacto si hay interés real en inscribirse
5. Si el usuario pregunta sobre temas NO relacionados con EdutechLife, redirige amablemente: "Solo puedo ayudarte con información sobre EdutechLife. ¿En qué puedo ayudarte?"

## INFO CLAVE
- Servicios: Clases particulares, tutoring, programas STEM, apoyo emocional
- Modalidades: Presencial, en línea e híbrido
- Edades: Niños (5-11), Adolescentes (12-17), Adultos
- Primera clase: Sin costo / Prueba gratuita
- Contacto: WhatsApp disponible para consultas rápidas

NICO - EdutechLife. Aquí para ayudarte con alegría.`;

const NicoChat = ({ studentName: initialName = 'amigo', onNavigate }) => {
  const [inputText, setInputText] = useState('');
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [micPermissionError, setMicPermissionError] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [speechStatus, setSpeechStatus] = useState({ supported: true, message: '' });
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const nameLearnedRef = useRef(false);
  const speechTimeoutRef = useRef(null);

  const {
    memory,
    setUserName,
    processMessage,
    incrementConversationCount,
    clearMemory,
    learnFromUser,
  } = useConversationMemory({
    persistKey: 'edutechlife_nico_memory',
    maxHistoryLength: 50,
  });

  useEffect(() => {
    if (memory.userName) {
      nameLearnedRef.current = true;
    }
    
    const status = getSpeechRecognitionStatus();
    setSpeechStatus(status);
  }, [memory.userName]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [memory.conversationHistory, scrollToBottom]);

  const addMessage = useCallback((role, content) => {
    processMessage(role, content);
  }, [processMessage]);

  const generateContextualResponse = useCallback((userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    const userName = memory.userName || 'amigo';
    
    const patterns = {
      greeting: ['hola', 'buenos días', 'buenas', 'qué tal', 'saludos', 'hey', 'holiwis', 'ola'],
      help: ['ayuda', 'que hago', 'no entiendo', 'perdido', 'duda', 'cómo', 'qué es'],
      thanks: ['gracias', 'muchas gracias', 'excelente', 'maravilloso'],
      bye: ['adiós', 'hasta luego', 'me voy', 'nos vemos', 'bye'],
      servicios: ['servicios', 'programas', 'cursos', 'clases', 'qué ofrecen'],
      precios: ['precio', 'precios', 'cuánto cuesta', 'cuanto sale', 'plan', 'planes'],
      vak: ['vak', 'estilo', 'aprendizaje', 'visual', 'auditivo', 'kinestésico'],
      stem: ['stem', 'steam', 'robótica', 'programación', 'tecnología', 'ciencia'],
      inscription: ['inscribir', 'matricular', 'comenzar', 'iniciar', 'cómo empiezo'],
      ubicacion: ['dónde están', 'ubicación', 'dirección', 'donde queda'],
      contacto: ['teléfono', 'whatsapp', 'llamar', 'escribir', 'contactar'],
    };

    for (const [key, keywords] of Object.entries(patterns)) {
      if (keywords.some(k => lowerMsg.includes(k))) {
        return getResponseByCategory(key, userName);
      }
    }

    return getDynamicResponse(userName);
  }, [memory.userName]);

  const getResponseByCategory = (category, userName) => {
    const responses = {
      greeting: () => {
        if (memory.conversationCount > 0 && userName !== 'amigo') {
          return `¡Hola ${userName}! Qué alegría verte de nuevo. ¿En qué te puedo ayudar?`;
        }
        return '¡Hola! Soy NICO - Soporte EdutechLife. ¿En qué te puedo ayudar?';
      },
      help: () => '¡Con gusto! Cuéntame qué necesitas y te ayudo. 😊',
      thanks: () => '¡De nada! 😊 ¿Hay algo más en lo que pueda ayudarte?',
      bye: () => '¡Hasta luego! 😊 Que te vaya muy bien. ¡Vuelve cuando quieras!',
      servicios: () => 'Ofrecemos: Clases particulares, Tutoring, Programas STEM, Apoyo emocional. ¿Cuál te interesa?',
      precios: () => '¡Tenemos planes para todos los presupuestos! ¿Cuál te interesa?',
      vak: () => '¡La metodología VAK identifica tu estilo de aprendizaje! Visual, Auditivo o Kinestésico. ¿Quieres hacer el diagnóstico gratuito?',
      stem: () => '¡Nuestros programas STEM incluyen robótica, programación y más! Son ideales para el futuro. ¿Te interesa alguno?',
      inscription: () => '¡Me alegra que quieras inscribirte! ¿Me das tus datos para contactarte? 😊',
      ubicacion: () => '¡Escríbenos al WhatsApp para más información! 📱',
      contacto: () => 'Escríbenos al WhatsApp: 55 1234 5678. ¡Respondemos rápido!',
    };

    return responses[category] ? responses[category]() : responses.help();
  };

  const getDynamicResponse = (userName) => {
    if (memory.conversationCount <= 1 && !nameLearnedRef.current) {
      return 'Por cierto, ¿cómo te llamas? Así te puedo llamar por tu nombre';
    }

    const followUps = [
      '¿Hay algo más que quieras saber de EdutechLife?',
      '¿Te interesa algo en específico?',
      '¿Qué más te gustaría saber?',
      '¿En qué más puedo ayudarte?',
    ];
    
    return followUps[Math.floor(Math.random() * followUps.length)];
  };

  const handleMessage = useCallback(async (text) => {
    if (!text.trim()) return { text: '' };
    
    addMessage('user', text);
    setInputText('');
    setIsAILoading(true);
    
    try {
      const response = await Promise.race([
        callDeepseek(text, PROMPT_NICO_SOPORTE),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('timeout')), 10000)
        )
      ]);
      
      if (response && !response.includes('Error:') && response.length > 10) {
        addMessage('assistant', response);
        setIsAILoading(false);
        
        learnFromUser(text, 'user_message');
        
        if (isAudioEnabled) {
          speakWithNicoVoice(response);
        }
        
        return { text: response };
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      setIsAILoading(false);
      
      const response = generateContextualResponse(text);
      addMessage('assistant', response);
      
      if (isAudioEnabled && !error.message.includes('timeout')) {
        speakWithNicoVoice(response);
      }
      
      return { text: response };
    }
  }, [addMessage, generateContextualResponse, learnFromUser, isAudioEnabled]);

  const speakWithNicoVoice = useCallback((text) => {
    if (!text || !isAudioEnabled) return;
    
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    
    setIsSpeaking(true);
    speakTextConversational(text, 'nico', () => {
      setIsSpeaking(false);
      speechTimeoutRef.current = null;
    });
    
    speechTimeoutRef.current = setTimeout(() => {
      setIsSpeaking(false);
      stopSpeech();
    }, 15000);
  }, [isAudioEnabled]);

  const stopSpeaking = useCallback(() => {
    stopSpeech();
    setIsSpeaking(false);
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }
  }, []);

  const startListening = useCallback(async () => {
    if (!speechStatus.supported) {
      setMicPermissionError(speechStatus.message);
      return;
    }

    if (recognitionRef.current?.isActive?.()) {
      recognitionRef.current.stop();
    }

    const permissionResult = await requestMicrophonePermission();
    if (!permissionResult.success) {
      setMicPermissionError(permissionResult.message);
      return;
    }

    recognitionRef.current = createSpeechRecognition({
      lang: 'es-CO',
      onStart: () => {
        setIsListening(true);
        setMicPermissionError('');
      },
      onResult: (fullText, finalText, hasFinal) => {
        setInterimText(fullText);
        setInputText(fullText);
        
        if (hasFinal && finalText) {
          setIsProcessing(true);
          handleMessage(finalText).finally(() => {
            setIsProcessing(false);
          });
          setIsListening(false);
          setInterimText('');
        }
      },
      onEnd: (finalText) => {
        setIsListening(false);
        setInterimText('');
        
        if (finalText && !isProcessing) {
          setIsProcessing(true);
          handleMessage(finalText).finally(() => {
            setIsProcessing(false);
          });
        }
      },
      onError: (error, message) => {
        console.error('Speech recognition error:', error, message);
        setIsListening(false);
        setInterimText('');
        setMicPermissionError(message || 'Error en el reconocimiento de voz');
      },
    });

    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  }, [handleMessage, speechStatus]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setInterimText('');
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    if (conversationStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversationStarted]);

  useEffect(() => {
    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopSpeech();
    };
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || isProcessing) return;
    
    await handleMessage(inputText);
    setInputText('');
  }, [inputText, isProcessing, handleMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startConversation = () => {
    setConversationStarted(true);
    incrementConversationCount();
    
    const userName = memory.userName;
    let greeting;
    
    if (userName && userName !== 'amigo') {
      greeting = `¡Hola ${userName}! Soy NICO - Soporte EdutechLife. ¿En qué te puedo ayudar?`;
    } else {
      greeting = '¡Hola! Soy NICO - Soporte EdutechLife. ¿En qué te puedo ayudar? ¿Cómo te llamas?';
    }
    
    addMessage('assistant', greeting);
    
    if (isAudioEnabled) {
      speakWithNicoVoice(greeting);
    }
  };

  const handleClearMemory = () => {
    clearMemory();
    nameLearnedRef.current = false;
    setShowClearConfirm(false);
    setConversationStarted(false);
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handlePlayMessage = (text, index) => {
    if (!isAudioEnabled) return;
    if (playingMessageId === index) {
      setPlayingMessageId(null);
      stopSpeaking();
      return;
    }
    setPlayingMessageId(index);
    speakTextConversational(text, 'nico', () => {
      setPlayingMessageId(null);
    });
  };

  const getStatusText = () => {
    if (isListening) return 'Escuchando...';
    if (isSpeaking) return 'Hablando...';
    if (isProcessing) return 'Escribiendo...';
    return 'En línea';
  };

  const getStatusColor = () => {
    if (isListening) return 'text-red-500';
    if (isSpeaking) return 'text-green-500';
    if (isProcessing) return 'text-yellow-400';
    return 'text-[#66CCCC]';
  };

  const getStatusIcon = useMemo(() => {
    if (isListening) return <Mic className="w-3 h-3 text-white" />;
    if (isSpeaking) return <Volume2 className="w-3 h-3 text-white" />;
    if (isProcessing) return <Loader2 className="w-3 h-3 text-white animate-spin" />;
    return <Bot className="w-3 h-3 text-white" />;
  }, [isListening, isSpeaking, isProcessing]);

  const getStatusDot = useMemo(() => {
    if (isListening) return 'bg-red-500 animate-pulse';
    if (isSpeaking) return 'bg-green-500 animate-bounce';
    if (isProcessing) return 'bg-yellow-400 animate-pulse';
    return 'bg-[#66CCCC]';
  }, [isListening, isSpeaking, isProcessing]);

  if (!conversationStarted) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-[#0A1628] via-[#0F2847] to-[#0A1628] backdrop-blur-xl border border-[#4DA8C4]/20 rounded-[2.5rem] shadow-2xl">
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-15 bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4] blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-15 bg-gradient-to-r from-[#4DA8C4] to-[#004B63] blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5 bg-gradient-to-r from-[#004B63] to-[#0A1628] blur-3xl"></div>
          </div>
          
          <div className="relative mb-8">
            <div className="w-48 h-48 rounded-[2.5rem] bg-gradient-to-br from-[#66CCCC] via-[#4DA8C4] to-[#004B63] flex items-center justify-center shadow-2xl border-2 border-[#66CCCC]/40 backdrop-blur-sm">
              <div className="w-40 h-40 rounded-[2rem] bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Bot className="w-24 h-24 text-white" />
              </div>
            </div>
            <div className="absolute -inset-6 rounded-[3.5rem] border-2 border-[#4DA8C4]/40 animate-ping opacity-30"></div>
            <div className="absolute -inset-12 rounded-[4rem] border border-[#66CCCC]/30 animate-pulse opacity-20"></div>
            {memory.userName && memory.userName !== 'amigo' && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 bg-gradient-to-r from-[#004B63] to-[#0A1628] rounded-full shadow-xl text-sm font-semibold text-white border border-[#66CCCC]/40 backdrop-blur-sm">
                ¡Hola {memory.userName}!
              </div>
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-white font-montserrat mb-3 text-center bg-gradient-to-r from-[#66CCCC] via-[#4DA8C4] to-[#66CCCC] bg-clip-text text-transparent">
            NICO - Soporte Premium
          </h2>
          <p className="text-[#66CCCC] text-center mb-2 max-w-md text-lg font-medium">
            Tu asistente virtual de EdutechLife
          </p>
          <p className="text-[#4DA8C4] text-center mb-6 max-w-sm text-sm">
            {memory.userName && memory.userName !== 'amigo' 
              ? `¡Qué bueno verte de nuevo, ${memory.userName}! 😊` 
              : 'Puedo ayudarte con información sobre nuestros servicios.'}
          </p>
          
          {memory.conversationCount > 0 && (
            <div className="flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#004B63]/40 to-[#0A1628]/40 text-[#66CCCC] border border-[#4DA8C4]/40 backdrop-blur-sm">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Conversación #{memory.conversationCount + 1}</span>
            </div>
          )}
          
          <button
            onClick={startConversation}
            className="px-12 py-5 bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#4DA8C4] bg-[length:200%_100%] text-white rounded-[2.5rem] font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 flex items-center gap-3 hover:scale-105 hover:bg-[length:100%_100%] animate-gradient-x border border-[#66CCCC]/50 backdrop-blur-sm"
          >
            <Sparkles className="w-6 h-6" />
            <span>{memory.userName && memory.userName !== 'amigo' ? 'Continuar Conversación' : 'Comenzar Ahora'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#0A1628]/95 via-[#0F2847]/95 to-[#0A1628]/95 backdrop-blur-xl border border-[#4DA8C4]/30 rounded-[2.5rem] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#4DA8C4]/30 bg-gradient-to-r from-[#004B63]/60 to-[#0A1628]/80 backdrop-blur-md rounded-t-[2.5rem]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-16 h-16 rounded-[2rem] bg-gradient-to-br from-[#66CCCC] via-[#4DA8C4] to-[#004B63] flex items-center justify-center shadow-xl border-2 border-[#66CCCC]/40 transition-all duration-300 ${
                isSpeaking ? 'animate-pulse ring-4 ring-[#66CCCC]/30' : ''
              }`}>
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 animate-pulse scale-110' 
                  : isSpeaking 
                    ? 'bg-green-500 animate-bounce' 
                    : isProcessing
                      ? 'bg-yellow-400 animate-pulse'
                      : 'bg-[#66CCCC]'
              }`}>
                {getStatusIcon}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-montserrat">
                NICO - Soporte Premium {memory.userName && memory.userName !== 'amigo' && <span className="text-[#66CCCC]">• {memory.userName}</span>}
              </h2>
              <p className={`text-sm ${getStatusColor()} flex items-center gap-2 mt-1`}>
                <span className={`w-2.5 h-2.5 rounded-full ${getStatusDot}`}></span>
                {getStatusText()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 ${
                isAudioEnabled 
                  ? 'bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white shadow-lg shadow-[#4DA8C4]/50' 
                  : 'bg-[#0A1628]/60 text-[#4DA8C4] border border-[#4DA8C4]/30'
              }`}
              title={isAudioEnabled ? 'Audio activado' : 'Audio desactivado'}
            >
              {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/50 hover:scale-110 transition-all duration-300 border border-red-400/50"
                title="Detener voz"
              >
                <VolumeX className="w-5 h-5" />
              </button>
            )}
            
            {isListening && (
              <button
                onClick={stopListening}
                className="p-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/50 hover:scale-110 transition-all duration-300 border border-red-400/50"
                title="Detener escucha"
              >
                <MicOff className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {micPermissionError && (
          <div className="mt-3 text-sm text-red-400 bg-gradient-to-r from-red-500/20 to-red-600/20 px-4 py-2 rounded-xl border border-red-500/30 flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4" />
            {micPermissionError}
            {!speechStatus.supported && (
              <button 
                onClick={() => window.open('https://www.google.com/chrome/', '_blank')}
                className="ml-auto text-xs text-red-300 hover:text-white underline"
              >
                Usar Chrome
              </button>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-[#4DA8C4]/50 scrollbar-track-transparent"
      >
        {memory.conversationHistory.length === 0 && (
          <div className="text-center py-10">
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#004B63]/30 to-[#0A1628]/30 border border-[#4DA8C4]/30">
              <Sparkles className="w-4 h-4 text-[#66CCCC]" />
              <p className="text-[#4DA8C4]">¡Inicia la conversación!</p>
            </div>
          </div>
        )}
        
        {memory.conversationHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn group`}
          >
            <div className="relative flex gap-2 max-w-[85%]">
              <div className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2 -left-12">
                {msg.role === 'assistant' && (
                  <>
                    {isAudioEnabled && (
                      <button
                        onClick={() => handlePlayMessage(msg.content, index)}
                        className="p-2 rounded-full bg-gradient-to-r from-[#004B63]/60 to-[#4DA8C4]/60 text-white hover:from-[#4DA8C4] hover:to-[#66CCCC] transition-all duration-300 shadow-lg hover:scale-110 border border-[#66CCCC]/30"
                      >
                        {playingMessageId === index ? <VolumeX className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                      </button>
                    )}
                    <button
                      onClick={() => handleCopyMessage(msg.content)}
                      className="p-2 rounded-full bg-gradient-to-r from-[#004B63]/60 to-[#4DA8C4]/60 text-white hover:from-[#4DA8C4] hover:to-[#66CCCC] transition-all duration-300 shadow-lg hover:scale-110 border border-[#66CCCC]/30"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              
              {msg.role === 'assistant' ? (
                <div className="self-start max-w-[85%] p-5 rounded-[2rem] rounded-tl-none bg-gradient-to-br from-[#004B63]/70 to-[#0A1628]/90 border border-[#4DA8C4]/50 shadow-xl backdrop-blur-sm">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-white font-medium">{msg.content}</p>
                </div>
              ) : (
                <div className="self-end max-w-[85%] p-5 rounded-[2rem] rounded-tr-none bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#4DA8C4] bg-[length:200%_100%] text-[#0A1628] font-bold shadow-xl border border-[#66CCCC]/50 animate-gradient-x">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isAILoading && (
          <div className="self-start max-w-[85%]">
            <div className="p-5 rounded-[2rem] rounded-tl-none bg-gradient-to-br from-[#004B63]/70 to-[#0A1628]/90 border border-[#4DA8C4]/50 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#66CCCC] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2.5 h-2.5 bg-[#66CCCC] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2.5 h-2.5 bg-[#66CCCC] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="text-sm text-[#66CCCC] font-medium">Nico está procesando tu mensaje...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 border-t border-[#4DA8C4]/30 bg-gradient-to-t from-[#004B63]/50 to-[#0A1628] rounded-b-[2.5rem]">
        <div className="flex gap-4 items-center">
          <button
            onClick={toggleListening}
            disabled={isSpeaking || isProcessing}
            className={`p-3.5 rounded-[2rem] transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
              isListening 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse shadow-xl shadow-red-500/50' 
                : 'bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#4DA8C4] bg-[length:200%_100%] text-white shadow-xl shadow-[#4DA8C4]/50 hover:bg-[length:100%_100%]'
            }`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          
          <div className="flex-1 bg-[#0A1628]/90 border border-[#4DA8C4]/50 rounded-[2rem] px-6 py-4 backdrop-blur-sm">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Escuchando..." : isProcessing ? "Procesando..." : "Escribe tu mensaje..."}
              disabled={isProcessing}
              className="w-full bg-transparent text-white placeholder-[#66CCCC]/70 focus:outline-none focus:border-none text-sm disabled:opacity-50"
            />
            {isListening && interimText && (
              <div className="text-sm text-[#66CCCC] opacity-80 mt-2 animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 bg-[#66CCCC] rounded-full animate-pulse"></span>
                {interimText}
              </div>
            )}
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isProcessing}
            className="p-3.5 rounded-[2rem] bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#4DA8C4] bg-[length:200%_100%] text-white transition-all duration-300 hover:scale-110 hover:bg-[length:100%_100%] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#4DA8C4]/50"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NicoChat;