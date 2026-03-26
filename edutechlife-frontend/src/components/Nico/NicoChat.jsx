import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Brain, Mic, MicOff, Volume2, VolumeX, Send, Sparkles, X, Loader2, Copy, PlayCircle, Bot, MessageCircle } from 'lucide-react';
import useConversationMemory from '../../hooks/useConversationMemory';
import { callDeepseek } from '../../utils/api';
import { speakTextConversational } from '../../utils/speech';
import { checkSpeechRecognitionSupport } from '../../utils/speechRecognition';

const PROMPT_NICO_SOPORTE = `Eres NICO - Agente de Soporte Premium de EdutechLife.

## IDENTIDAD YROL
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
  const [conversationMode, setConversationMode] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [micPermissionError, setMicPermissionError] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const nameLearnedRef = useRef(false);
  const recognitionRef = useRef(null);

  const {
    memory,
    setUserName,
    processMessage,
    incrementConversationCount,
    generateContext,
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
    setIsProcessing(true);
    
    try {
      const response = await callDeepseek(text, PROMPT_NICO_SOPORTE);
      
      if (response && !response.includes('Error:') && response.length > 10) {
        addMessage('assistant', response);
        setIsAILoading(false);
        setIsProcessing(false);
        
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
      setIsProcessing(false);
      
      const response = generateContextualResponse(text);
      addMessage('assistant', response);
      
      return { text: response };
    }
  }, [addMessage, generateContextualResponse, learnFromUser, isAudioEnabled]);

  const speakWithNicoVoice = useCallback((text) => {
    if (!text) return;
    setIsSpeaking(true);
    speakTextConversational(text, 'nico', () => {
      setIsSpeaking(false);
    });
  }, []);

  const stopSpeaking = useCallback(() => {
    speakTextConversational.stop?.();
    setIsSpeaking(false);
  }, []);

  const startListening = useCallback(() => {
    if (!checkSpeechRecognitionSupport()) {
      setMicPermissionError('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'es-ES';
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.maxAlternatives = 1;

    let finalTranscript = '';
    let lastResultIndex = 0;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setMicPermissionError('');
    };

    recognitionRef.current.onresult = (event) => {
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
      
      setInterimText(finalTranscript + ' ' + interim);
      setInputText(finalTranscript + ' ' + interim);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      setInterimText('');
      
      if (finalTranscript.trim()) {
        setMessageCount(prev => prev + 1);
        handleMessage(finalTranscript.trim());
      }
      finalTranscript = '';
      lastResultIndex = 0;
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setInterimText('');
      
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setMicPermissionError('Por favor, permite el acceso al micrófono en tu navegador');
      }
    };

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsListening(false);
    }
  }, [handleMessage]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
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

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || isProcessing) return;
    
    setMessageCount(prev => prev + 1);
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

  if (!conversationStarted) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-[#0A1628] via-[#0F2847] to-[#0A1628]">
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4] blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 bg-gradient-to-r from-[#4DA8C4] to-[#004B63] blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="relative mb-8">
            <div className="w-44 h-44 rounded-[2rem] bg-gradient-to-br from-[#66CCCC] via-[#4DA8C4] to-[#004B63] flex items-center justify-center shadow-2xl border-2 border-[#66CCCC]/30">
              <div className="w-36 h-36 rounded-[1.5rem] bg-white/10 flex items-center justify-center">
                <Bot className="w-20 h-20 text-white" />
              </div>
            </div>
            <div className="absolute -inset-6 rounded-[3rem] border-2 border-[#4DA8C4]/30 animate-ping"></div>
            <div className="absolute -inset-12 rounded-[3.5rem] border border-[#66CCCC]/20 animate-pulse"></div>
            {memory.userName && memory.userName !== 'amigo' && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#004B63] rounded-full shadow-lg text-sm font-semibold text-white">
                Hola {memory.userName}!
              </div>
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-white font-montserrat mb-3 text-center">
            NICO - Soporte
          </h2>
          <p className="text-[#66CCCC] text-center mb-2 max-w-md text-lg">
            Tu asistente virtual de EdutechLife
          </p>
          <p className="text-[#4DA8C4] text-center mb-6 max-w-sm text-sm">
            {memory.userName && memory.userName !== 'amigo' 
              ? `¡Qué bueno verte de nuevo, ${memory.userName}! 😊` 
              : 'Puedo ayudarte con información sobre nuestros servicios.'}
          </p>
          
          {memory.conversationCount > 0 && (
            <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#004B63]/30 text-[#66CCCC] border border-[#4DA8C4]/30">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Conversación #{memory.conversationCount + 1}</span>
            </div>
          )}
          
          <button
            onClick={startConversation}
            className="px-10 py-5 bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#4DA8C4] bg-[length:200%_100%] text-white rounded-[2rem] font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center gap-3 hover:scale-105"
          >
            <Sparkles className="w-6 h-6" />
            <span>{memory.userName && memory.userName !== 'amigo' ? 'Continuar' : 'Comenzar'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#0A1628] via-[#0F2847] to-[#0A1628] border border-[#4DA8C4]/30 rounded-[2rem] shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-[#4DA8C4]/30 bg-gradient-to-r from-[#004B63]/50 to-[#0A1628]/80 backdrop-blur-md rounded-t-[2rem]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-[#66CCCC] via-[#4DA8C4] to-[#004B63] flex items-center justify-center shadow-lg transition-all ${
                isSpeaking ? 'animate-pulse ring-4 ring-[#66CCCC]/30' : ''
              }`}>
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 animate-pulse scale-110' 
                  : isSpeaking 
                    ? 'bg-green-500 animate-bounce' 
                    : isProcessing
                      ? 'bg-yellow-400 animate-pulse'
                      : 'bg-[#66CCCC]'
              }`}>
                {isListening ? (
                  <MicOff className="w-3 h-3 text-white" />
                ) : isSpeaking ? (
                  <Volume2 className="w-3 h-3 text-white" />
                ) : isProcessing ? (
                  <Loader2 className="w-3 h-3 text-white animate-spin" />
                ) : (
                  <Bot className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-montserrat">
                NICO - Soporte {memory.userName && memory.userName !== 'amigo' && `• ${memory.userName}`}
              </h2>
              <p className={`text-xs ${getStatusColor()} flex items-center gap-1`}>
                {isListening && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                {isSpeaking && <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>}
                {isProcessing && <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>}
                {!isListening && !isSpeaking && !isProcessing && <span className="w-2 h-2 bg-[#66CCCC] rounded-full"></span>}
                {getStatusText()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`p-2 rounded-xl transition-all ${isAudioEnabled ? 'bg-[#4DA8C4]/30 text-[#66CCCC] border border-[#66CCCC]/50' : 'bg-[#0A1628]/50 text-[#4DA8C4]'}`}
              title={isAudioEnabled ? 'Audio activado' : 'Audio desactivado'}
            >
              {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-2 rounded-xl bg-red-500/30 text-red-400 hover:bg-red-500/50 transition-all hover:scale-110 border border-red-500/50"
                title="Detener voz"
              >
                <VolumeX className="w-5 h-5" />
              </button>
            )}
            
            {isListening && (
              <button
                onClick={stopListening}
                className="p-2 rounded-xl bg-red-500/30 text-red-400 hover:bg-red-500/50 transition-all hover:scale-110 border border-red-500/50"
                title="Detener escucha"
              >
                <MicOff className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {micPermissionError && (
          <div className="mt-2 text-xs text-red-400 bg-red-500/20 px-3 py-1 rounded-lg">
            {micPermissionError}
          </div>
        )}
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {memory.conversationHistory.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[#4DA8C4]">¡Inicia la conversación!</p>
          </div>
        )}
        
        {memory.conversationHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn group`}
          >
            <div className="relative flex gap-2 max-w-[85%]">
              <div className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex gap-1">
                {msg.role === 'assistant' && (
                  <>
                    {isAudioEnabled && (
                      <button
                        onClick={() => handlePlayMessage(msg.content, index)}
                        className="p-1.5 rounded-full bg-[#004B63]/50 hover:bg-[#4DA8C4]/50 text-[#66CCCC] transition-all"
                      >
                        {playingMessageId === index ? <VolumeX className="w-3 h-3" /> : <PlayCircle className="w-3 h-3" />}
                      </button>
                    )}
                    <button
                      onClick={() => handleCopyMessage(msg.content)}
                      className="p-1.5 rounded-full bg-[#004B63]/50 hover:bg-[#4DA8C4]/50 text-[#66CCCC] transition-all"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
              
              {msg.role === 'assistant' ? (
                <div className="self-start max-w-[85%] p-4 rounded-[1.5rem] rounded-tl-none bg-gradient-to-br from-[#004B63]/60 to-[#0A1628] border border-[#4DA8C4]/40 shadow-lg">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-white font-medium">{msg.content}</p>
                </div>
              ) : (
                <div className="self-end max-w-[85%] p-4 rounded-[1.5rem] rounded-tr-none bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#4DA8C4] bg-[length:200%_100%] text-[#0A1628] font-bold shadow-lg border border-[#66CCCC]/30">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isAILoading && (
          <div className="self-start max-w-[85%]">
            <div className="p-4 rounded-[1.5rem] rounded-tl-none bg-gradient-to-br from-[#004B63]/60 to-[#0A1628] border border-[#4DA8C4]/40 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[#66CCCC] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-[#66CCCC] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-[#66CCCC] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="text-xs text-[#66CCCC] font-medium">Nico está procesando...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#4DA8C4]/30 bg-gradient-to-t from-[#004B63]/40 to-[#0A1628] rounded-b-[2rem]">
        <div className="flex gap-3 items-center">
          <button
            onClick={toggleListening}
            disabled={isSpeaking || isProcessing}
            className={`p-3 rounded-[1.5rem] transition-all hover:scale-105 disabled:opacity-50 ${isListening ? 'bg-cyan-400 text-white animate-pulse shadow-lg shadow-cyan-400/50' : 'bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#4DA8C4] bg-[length:200%_100%] text-white shadow-lg shadow-[#4DA8C4]/30'}`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <div className="flex-1 bg-[#0A1628]/80 border border-[#4DA8C4]/40 rounded-[1.5rem] px-5 py-3">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Escuchando..." : isProcessing ? "Procesando..." : "Escribe tu mensaje..."}
              disabled={isProcessing}
              className="w-full bg-transparent text-white placeholder-[#66CCCC] focus:outline-none focus:border-[#4DA8C4]/50 text-sm disabled:opacity-50"
            />
            {isListening && interimText && (
              <div className="text-sm text-[#66CCCC] opacity-70 mt-1 animate-pulse">
                {interimText}
              </div>
            )}
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isProcessing}
            className="p-3 rounded-[1.5rem] bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#4DA8C4] bg-[length:200%_100%] text-white transition-all hover:scale-105 disabled:opacity-50 shadow-lg shadow-[#4DA8C4]/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NicoChat;
