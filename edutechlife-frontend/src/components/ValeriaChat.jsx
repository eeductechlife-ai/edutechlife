import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Loader2, Copy, PlayCircle, X, MessageCircle } from 'lucide-react';
import useVoiceConversation, { VOICE_STATES } from '../hooks/useVoiceConversation';
import useConversationMemory from '../hooks/useConversationMemory';
import useLeadManagement from '../hooks/useLeadManagement';
import { callDeepseek } from '../utils/api';
import { PROMPT_NICO_SOPORTE } from '../constants/prompts';
import { speakTextConversational } from '../utils/speech';

const ValeriaChat = ({ studentName: initialName = 'amigo', onNavigate }) => {
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [greetingSent, setGreetingSent] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [leadData, setLeadData] = useState({
    nombre: null,
    telefono: null,
    email: null,
    motivo: null,
    stage: 'inicio',
  });
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [currentLeadId, setCurrentLeadId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const nameLearnedRef = useRef(false);

  const {
    memory,
    setUserName,
    processMessage,
    incrementConversationCount,
    generateContext,
    getRecentHistory,
    clearMemory,
    learnFromUser,
    updateUserContext,
  } = useConversationMemory({
    persistKey: 'edutechlife_nico_memory',
    maxHistoryLength: 200,
    maxFactsLength: 500,
  });

  const {
    createLead,
    addMessageToLead,
  } = useLeadManagement();

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

  const generateContextualResponse = useCallback((userMessage, context) => {
    const lowerMsg = userMessage.toLowerCase();
    const msgLength = userMessage.length;
    const userName = memory.userName;
    
    const patterns = {
      greeting: ['hola', 'buenos días', 'buenas', 'qué tal', 'saludos', 'hey', 'holiwis', 'ola', 'buen día', 'hola nico', 'buenos dias'],
      feeling: ['cómo estás', 'cómo te sientes', 'qué haces', 'qué tal', 'como te encuentra'],
      good: ['bien', 'genial', 'excelente', 'feliz', 'contento', 'happy', 'cool', 'awesome', 'estoy bien', 'todo bien', 'muy bien'],
      tired: ['cansado', 'fatigado', 'aburrido', 'siento sueño', 'con sueño', 'sin energia'],
      sad: ['triste', 'mal', 'deprimido', 'desanimado', 'desanimada', 'malito', 'de mal humor'],
      nervous: ['nervioso', 'ansioso', 'preocupado', 'estresado', 'asustado', 'con miedo'],
      help: ['ayuda', 'que hago', 'no entiendo', 'perdido', 'duda', 'cómo', 'qué es', 'necesito ayuda'],
      thanks: ['gracias', 'muchas gracias', 'excelente', 'maravilloso', 'genial', 'perfecto', 'te lo agradesco'],
      bye: ['adiós', 'hasta luego', 'me voy', 'nos vemos', 'bye', ' Chau', 'me despedida', 'hasta mañana'],
      subject: ['matemática', 'física', 'química', 'historia', 'biología', 'literatura', 'español', 'inglés', 'geografía', 'arte'],
      ai: ['qué eres', 'quién eres', 'eres real', 'inteligencia artificial', 'qué puedes hacer', 'como funcionas'],
      learn: ['aprender', 'estudiar', 'clase', 'tarea', 'examen', 'prueba', 'quiz', 'lección'],
      name: ['me llamo', 'soy', 'mi nombre', 'llámame', 'dime', 'yo soy'],
      remember: ['recuerdas', 'sabes mi nombre', 'cómo me llamo', 'quién soy', 'te acuerdas'],
      motivation: ['motivame', 'anímame', 'dame ánimos', 'palabras bonitas', 'frases', 'inspirame'],
      schedule: ['horario', 'horarios', 'abren', 'cierran', 'a qué hora', 'cuando abren', 'cuando cierran', 'atención'],
      location: ['dónde están', 'ubicación', 'dirección', 'direccion', 'donde queda', 'cómo llego', 'sucursal', 'sede'],
      prices: ['precio', 'precios', 'cuánto cuesta', 'cuanto sale', 'cuánto vale', 'inversión', 'costo', 'plan', 'planes', 'paquete'],
      noMore: ['no', 'nada', 'eso es todo', 'eso sería todo', 'no gracias', 'no necesito nada', 'ya no', 'eso', 'ya está', 'ya me voy', 'nada más', 'nada más gracias', 'eso es todo'],
    };

    for (const [key, keywords] of Object.entries(patterns)) {
      if (keywords.some(k => lowerMsg.includes(k))) {
        return getResponseByCategory(key, lowerMsg, msgLength, context);
      }
    }
    
    return getDynamicResponse(lowerMsg, msgLength, context);
  }, [memory.userName]);

  const getResponseByCategory = (category, message, length, context) => {
    const userName = memory.userName || 'amigo';
    const responses = {
      greeting: () => {
        if (memory.conversationCount > 0 && userName !== 'amigo') {
          return [
            `¡Hola ${userName}! Qué alegría verte de nuevo. ¿Cómo estás hoy?`,
            `¡Hey ${userName}! Qué bueno tenerte aquí otra vez.`,
            `¡${userName}! Me alegra mucho que vuelvas.`,
          ];
        } else if (memory.conversationCount > 0) {
          return [
            `¡Hola de nuevo! ¿Cómo estás hoy?`,
            `¡Hey! Qué bueno que regresaste.`,
          ];
        }
        return [
          `¡Hola! Soy Nico, tu agente de atención de Edutechlife. ¿En qué te puedo ayudar?`,
          `¡Hola! Soy Nico. ¿Cómo te llamas?`,
        ];
      },
      feeling: () => [
        '¡Yo estoy bien! ¿Y tú cómo estás?',
        '¡Aquí feliz de poder ayudarte! ¿Qué necesitas?',
      ],
      good: () => ['¡Eso me encanta!', '¡Qué bueno!', '¡Perfecto!'],
      tired: () => ['Comprendo. ¿Quieres que hagamos algo más tranquilo?'],
      sad: () => ['¿Quieres contarme qué pasó?', 'Estoy aquí para ti.'],
      nervous: () => ['Tranquilo/a. Respira y cuéntame qué te tiene así.'],
      help: () => ['¡Claro que sí! Dime qué necesitas.', 'Para eso estoy aquí.'],
      thanks: () => [
        '¡De nada! 😊 ¿Qué más te gustaría saber?',
        '¡Para eso estoy! ¿Hay algo más que te interese?',
        '¡Con gusto! ¿Qué más quieres saber de EdutechLife?',
      ],
      bye: () => [`¡Hasta luego! Que te vaya muy bien. Vuelve cuando quieras 😊`, '¡Chao! Aquí estaré si me necesitas.'],
      noMore: ['no', 'nada', 'eso es todo', 'eso sería todo', 'no gracias', 'no necesito nada', 'ya no', 'eso', 'ya está', 'ya me voy'],
      subject: () => ['¡Genial! ¿Qué quieres saber específicamente?', 'Perfecto. ¿Hay algo concreto?'],
      ai: () => [
        `¡Buena pregunta! Soy Nico, tu agente de atención de Edutechlife. Puedo ayudarte con lo que necesites.`,
        'Soy el agente de atención de Edutechlife. Estoy aquí para ayudarte.',
      ],
      learn: () => ['¡Aprender es lo mejor! ¿Sobre qué tema te gustaría trabajar?', '¿Qué materia o tema te interesa?'],
      name: () => {
        const extractedName = message.match(/(?:me llamo|soy|mi nombre es|llámame|dime|yo soy)\s+(?:que )?(.+?)(?:\.|,|$)/i);
        if (extractedName) {
          const newName = extractedName[1].trim();
          setUserName(newName);
          nameLearnedRef.current = true;
          return [
            `¡Mucho gusto ${newName}! 😊 Ahora sé cómo llamarte.`,
            `¡Hola ${newName}! Encantado de conocerte.`,
          ];
        }
        return ['¿Cómo te llamas? Si prefieres no compartirlo, no hay problema 😊'];
      },
      remember: () => {
        if (memory.userName && memory.userName !== 'amigo') {
          return [`¡Claro que sí, ${memory.userName}! ¿En qué te puedo ayudar?`];
        }
        return ['Aún no me has dicho tu nombre. ¿Cómo te llamas?'];
      },
      motivation: () => [
        '¡Tú puedes lograr lo que te propongas!',
        '¡Eres más capaz de lo que crees!',
      ],
      schedule: () => [
        'Estamos de L a V de 9am a 6pm. ¿Te interesa agendar una cita?',
        'Nuestro horario es lunes a viernes 9am-6pm. ¿Te puedo ayudar en algo más?',
      ],
      location: () => [
        'Estamos en Ciudad de México. ¿Quieres que un asesor te dé la dirección exacta?',
        'Tenemos sede en CDMX. ¿Te gustaría que te mandemos la ubicación por WhatsApp?',
      ],
      prices: () => [
        'Tenemos varios planes según tus necesidades. ¿Me das tu contacto para que un asesor te informe?',
        'Los precios varían según el programa. ¿Quieres que un asesor te llame con los detalles?',
      ],
      noMore: () => [
        '¡Perfecto! 😊 Que te vaya muy bien. Cualquier duda, aquí estaré.',
        '¡Genial! Fue un placer ayudarte. ¡Hasta pronto! 👋',
        '¡Perfecto! Cualquier cosa, mándame mensaje cuando quieras. ¡ Chao! 😊',
      ],
    };

    const responseGenerator = responses[category];
    if (responseGenerator) {
      const categoryResponses = responseGenerator();
      return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }
    
    return responses.help()[0];
  };

  const getDynamicResponse = (message, length, context) => {
    const userName = memory.userName || 'amigo';
    
    if (memory.conversationCount === 0 && !nameLearnedRef.current) {
      return '¿Cómo te llamas? Me gustaría saberte llamar por tu nombre.';
    }

    if (length < 10) {
      return '¡Cuéntame más! ¿Qué más me puedes contar?';
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
    
    const context = generateContext();
    addMessage('user', text);
    setInputText('');
    setIsAILoading(true);
    
    try {
      const response = await callDeepseek(text, PROMPT_NICO_SOPORTE);
      
      if (response && !response.includes('Error:') && response.length > 10) {
        addMessage('assistant', response);
        setIsAILoading(false);
        
        learnFromUser(text, 'user_message');
        
        return { text: response };
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      setIsAILoading(false);
      const response = generateContextualResponse(text, context);
      addMessage('assistant', response);
      
      return { text: response };
    }
  }, [addMessage, generateContext, generateContextualResponse, learnFromUser]);

  const {
    state: voiceState,
    interimText,
    currentCaption,
    isListening,
    isSpeaking,
    isProcessing,
    speak,
    startListening,
    stopListening,
    stop,
    toggleListening,
  } = useVoiceConversation({
    onMessage: handleMessage,
    conversationMode: false,
    voiceRate: 1.05,
    voicePitch: 1.0,
    voiceProfile: 'nico',
  });

  useEffect(() => {
    if (voiceState === VOICE_STATES.SPEAKING && currentCaption && isAudioEnabled) {
      speak(currentCaption);
    }
  }, [voiceState, currentCaption, speak, isAudioEnabled]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim()) return;
    
    const text = inputText;
    
    const datosExtraidos = extraerDatosDelMensaje(text);
    if (datosExtraidos.nombre) {
      setLeadData(prev => ({ ...prev, nombre: datosExtraidos.nombre }));
    }
    if (datosExtraidos.telefono) {
      setLeadData(prev => ({ ...prev, telefono: datosExtraidos.telefono }));
    }
    if (datosExtraidos.email) {
      setLeadData(prev => ({ ...prev, email: datosExtraidos.email }));
    }
    if (datosExtraidos.motivo) {
      setLeadData(prev => ({ ...prev, motivo: datosExtraidos.motivo }));
    }
    
    setMessageCount(prev => prev + 1);
    
    const currentLeadData = {
      nombre: datosExtraidos.nombre ? datosExtraidos.nombre : leadData.nombre,
      telefono: datosExtraidos.telefono ? datosExtraidos.telefono : leadData.telefono,
      email: datosExtraidos.email ? datosExtraidos.email : leadData.email,
      motivo: leadData.motivo,
      stage: leadData.stage,
    };
    
    const needsMoreData = shouldAskForData(text, currentLeadData, memory.conversationHistory[memory.conversationHistory.length - 1]?.content);
    const dataRequestResponse = getRespuestaSolicitudDatos(currentLeadData);
    
    if (needsMoreData && dataRequestResponse) {
      const { text: response } = await handleMessage(text);
      
      if (response && isAudioEnabled) {
        speak(response);
      }
      
      setTimeout(() => {
        addMessage('assistant', dataRequestResponse);
        if (isAudioEnabled) {
          speak(dataRequestResponse);
        }
      }, 600);
      
      return;
    }
    
    if (currentLeadData.nombre && currentLeadData.telefono && currentLeadData.motivo && currentLeadData.stage !== 'cerrado') {
      const finalLead = {
        nombre: currentLeadData.nombre,
        telefono: currentLeadData.telefono,
        email: currentLeadData.email || '',
        motivo: currentLeadData.motivo,
        stage: 'cerrado',
        createdAt: new Date().toISOString(),
        source: 'Nico Chat',
      };
      createLead(finalLead);
      setLeadData(prev => ({ ...prev, stage: 'cerrado' }));
    }
    
    const { text: response } = await handleMessage(text);
  }, [inputText, leadData, memory.conversationHistory, handleMessage, addMessage, createLead]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const detectarIntentVenta = (texto) => {
    const keywords = [
      'precio', 'cuánto cuesta', 'precios', 'cuanto sale', 'inversión',
      'comprar', 'suscribirme', 'suscribirme', 'quiero entrar',
      'servicios', 'planes', 'paquetes', 'tienen cursos', 'ofrecen',
      'cómo funciona', 'quiero saber más', 'más información',
      'matrícula', 'inscripción', 'costo', 'valor'
    ];
    const lowerTexto = texto.toLowerCase();
    return keywords.some(k => lowerTexto.includes(k));
  };

  const extraerDatosDelMensaje = (texto) => {
    const datos = {};
    const lowerTexto = texto.toLowerCase();
    
    const nombreMatch = texto.match(/(?:me llamo|soy|llamo)\s+([A-Za-zÁ-Úá-ú]+)/i);
    if (nombreMatch) {
      datos.nombre = nombreMatch[1];
    }

    const telefonoMatch = texto.match(/(\+?\d{10,15})/);
    if (telefonoMatch) {
      datos.telefono = telefonoMatch[1];
    }

    const emailMatch = texto.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
      datos.email = emailMatch[0];
    }

    const motivoKeywords = ['porque', 'para', 'me interesa', 'necesito', 'quiero', 'mi objetivo', 'mi meta', 'busco', 'me gustaría', 'tengo interés'];
    if (motivoKeywords.some(kw => lowerTexto.includes(kw)) && texto.length > 20) {
      datos.motivo = texto.substring(0, 200);
    }

    return datos;
  };

  const getRespuestaSolicitudDatos = (leadData) => {
    if (!leadData.nombre && memory.conversationCount < 3) {
      return "Por cierto, ¿cómo te llamas? Me gusta saber a quién le hablo 😊";
    }
    if (!leadData.telefono) {
      return `${leadData.nombre}, ¿me das tu WhatsApp para enviarte info y que un asesor te contacte?`;
    }
    if (!leadData.motivo) {
      return "¿Cuál es tu principal interés? Así te paso la mejor info.";
    }
    return null;
  };

  const shouldAskForData = (texto, leadData, mensajeAnterior) => {
    if (leadData.stage === 'cerrado') return false;
    if (leadData.motivo && leadData.nombre && leadData.telefono) {
      if (leadData.stage !== 'cerrado') {
        setLeadData(prev => ({ ...prev, stage: 'cerrado' }));
        if (currentLeadId) {
          const finalLead = {
            ...leadData,
            messages: [...memory.conversationHistory, { role: 'user', content: texto }]
          };
          createLead(finalLead);
        }
      }
      return false;
    }
    return detectarIntentVenta(texto);
  };

  const sendGreeting = useCallback(() => {
    if (!greetingSent) {
      incrementConversationCount();
      const userName = memory.userName;
      const greeting = userName && userName !== 'amigo'
        ? `¡Hola! 😊 ¿Cómo estás? Soy Nico, tu asistente de EdutechLife. ¿En qué te puedo ayudar?`
        : '¡Hola! 😊 ¿Cómo estás? Soy Nico, tu asistente de EdutechLife. ¿En qué te puedo ayudar?';
      
      addMessage('assistant', greeting);
      setGreetingSent(true);
      
      if (isAudioEnabled) {
        setTimeout(() => speak(greeting), 500);
      }
    }
  }, [greetingSent, memory.userName, addMessage, incrementConversationCount, isAudioEnabled, speak]);

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handlePlayMessage = (text, index) => {
    if (!isAudioEnabled) return;
    if (playingMessageId === index) {
      setPlayingMessageId(null);
      return;
    }
    setPlayingMessageId(index);
    speakTextConversational(text, 'nico', () => {
      setPlayingMessageId(null);
    });
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setTimeout(() => {
      sendGreeting();
    }, 300);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[10000]">
      {/* LANZADOR - Burbuja Flotante cuando está cerrado */}
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4DA8C4] via-[#66CCCC] to-[#004B63] bg-[length:200%_100%] shadow-[0_0_20px_rgba(77,168,196,0.6)] flex items-center justify-center transition-all duration-300 hover:scale-110 animate-pulse border-2 border-[#66CCCC]/50"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </button>
      )}

      {/* CHAT ABIERTO - Dark Glassmorphism Premium */}
      {isOpen && (
        <div className="w-[380px] h-[600px] flex flex-col bg-gradient-to-b from-[#0A1628] to-[#004B63] backdrop-blur-2xl border border-[#4DA8C4]/50 rounded-[2rem] shadow-[0_0_40px_rgba(0,75,99,0.5)] z-[10000] overflow-hidden transition-all duration-300 ease-in-out">
          
          {/* Header Corporativo */}
          <div className="px-5 py-4 border-b border-[#4DA8C4]/40 flex items-center justify-between bg-gradient-to-r from-[#004B63]/80 to-[#0A1628]/80">
              <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4DA8C4] via-[#66CCCC] to-[#004B63] flex items-center justify-center text-[#0A1628] font-bold shadow-lg shadow-[#4DA8C4]/30 border-2 border-[#66CCCC]/50">
                N
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">
                  NICO Soporte Corporativo
                </h3>
                <p className="text-[#66CCCC] text-[10px] flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-[#66CCCC] animate-pulse'}`}></span>
                  {isListening ? 'Escuchando' : isSpeaking ? 'Hablando' : isProcessing ? 'Pensando' : 'En línea'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {/* Interruptor Maestro de Audio */}
              <button
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className={`p-1.5 rounded-full transition-all ${isAudioEnabled ? 'bg-[#4DA8C4] text-white shadow-lg' : 'bg-[#0A1628]/50 text-[#66CCCC] hover:text-white hover:bg-[#4DA8C4]'}`}
                title={isAudioEnabled ? 'Audio Activado - Nico hablará' : 'Audio Desactivado'}
              >
                {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              
              {isSpeaking && isAudioEnabled && (
                <button onClick={stop} className="p-1.5 rounded-full bg-red-500 text-white shadow-lg">
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              )}
              
              {isListening && (
                <button onClick={stopListening} className="p-1.5 rounded-full bg-red-500 text-white shadow-lg">
                  <MicOff className="w-3.5 h-3.5" />
                </button>
              )}
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  setGreetingSent(false);
                }}
                className="p-1.5 rounded-full bg-[#0A1628]/50 text-[#66CCCC] hover:text-white hover:bg-[#4DA8C4] transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin">
            {memory.conversationHistory.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#004B63]/30 border border-[#4DA8C4]/30">
                  <Loader2 className="w-4 h-4 animate-spin text-[#66CCCC]" />
                  <span className="text-[#66CCCC] text-xs font-medium">Conectando con Nico...</span>
                </div>
              </div>
            ) : (
              memory.conversationHistory.map((msg, index) => (
                <div key={index} className={msg.role === 'user' ? 'self-end max-w-[85%]' : 'self-start max-w-[85%]'}>
                  {msg.role === 'assistant' && (
                    <div className="self-start max-w-[85%] p-4 rounded-2xl rounded-tl-none bg-gradient-to-br from-[#004B63]/60 to-[#0A1628] border border-[#4DA8C4]/40 shadow-lg relative group">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-white font-medium">{msg.content}</p>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        {isAudioEnabled && (
                          <button onClick={() => handlePlayMessage(msg.content, index)} className="p-1 rounded-full bg-[#4DA8C4]/40 hover:bg-[#4DA8C4]/60 text-[#66CCCC]">
                            {playingMessageId === index ? <VolumeX className="w-3 h-3" /> : <PlayCircle className="w-3 h-3" />}
                          </button>
                        )}
                        <button onClick={() => handleCopyMessage(msg.content)} className="p-1 rounded-full bg-[#4DA8C4]/40 hover:bg-[#4DA8C4]/60 text-[#66CCCC]">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {msg.role === 'user' && (
                    <div className="self-end max-w-[85%] p-4 rounded-2xl rounded-tr-none bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#4DA8C4] bg-[length:200%_100%] text-[#0A1628] font-bold shadow-lg border border-[#66CCCC]/30">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isAILoading && (
              <div className="self-start max-w-[85%]">
                <div className="p-4 rounded-2xl rounded-tl-none bg-gradient-to-br from-[#004B63]/60 to-[#0A1628] border border-[#4DA8C4]/40 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#66CCCC]" />
                    <span className="text-xs text-[#66CCCC] font-medium">Nico está escribiendo...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Siempre visible */}
          <div className="p-4 border-t border-[#4DA8C4]/30 bg-gradient-to-t from-[#004B63]/40 to-[#0A1628] flex gap-3 items-center">
            <button
              onClick={toggleListening}
              disabled={isSpeaking}
              className={`p-3 rounded-full transition-all hover:scale-105 disabled:opacity-50 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#4DA8C4] bg-[length:200%_100%] text-white shadow-lg shadow-[#4DA8C4]/30'}`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <div className="flex-1 bg-[#0A1628]/80 border border-[#4DA8C4]/40 rounded-full px-5 py-3">
              <input
                ref={inputRef}
                type="text"
                value={inputText || interimText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje..."
                className="w-full bg-transparent text-white placeholder-[#66CCCC] focus:outline-none focus:border-[#4DA8C4]/50 text-sm"
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="p-3 rounded-full bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#4DA8C4] bg-[length:200%_100%] text-white transition-all hover:scale-105 disabled:opacity-50 shadow-lg shadow-[#4DA8C4]/30"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValeriaChat;
