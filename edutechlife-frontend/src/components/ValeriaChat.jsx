import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Brain, Mic, MicOff, Volume2, VolumeX, Send, User, Sparkles, MessageCircle, Settings, Subtitles, Keyboard, X, RefreshCw, History, Trash2, Loader2 } from 'lucide-react';
import useVoiceConversation, { VOICE_STATES } from '../hooks/useVoiceConversation';
import useConversationMemory from '../hooks/useConversationMemory';
import { callDeepseek } from '../utils/api';
import { PROMPT_VALERIO_DOCENTE } from '../constants/prompts';

const ValeriaChat = ({ studentName: initialName = 'amigo', onNavigate }) => {
  const [inputText, setInputText] = useState('');
  const [conversationStarted, setConversationStarted] = useState(false);
  const [conversationMode, setConversationMode] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [isAILoading, setIsAILoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
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
  } = useConversationMemory({
    persistKey: 'edutechlife_valeria_memory',
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

  const generateContextualResponse = useCallback((userMessage, context) => {
    const lowerMsg = userMessage.toLowerCase();
    const msgLength = userMessage.length;
    const userName = memory.userName;
    const hasContext = context && context.length > 0;
    
    const patterns = {
      greeting: ['hola', 'buenos días', 'buenas', 'qué tal', 'saludos', 'hey', 'holiwis', 'ola', 'buen día', 'hola valeria', 'buenos dias'],
      feeling: ['cómo estás', 'cómo te sientes', 'qué haces', 'qué tal', 'como te encuentras'],
      good: ['bien', 'genial', 'excelente', 'feliz', 'contento', 'mari mari', 'happy', 'cool', 'awesome', 'estoy bien', 'todo bien', 'muy bien'],
      tired: ['cansado', 'fatigado', 'slego', 'aburrido', 'siento sueño', 'con sueño', 'sin energia'],
      sad: ['triste', 'mal', 'deprimido', 'desanimado', 'desanimada', 'malito', 'de mal humor'],
      nervous: ['nervioso', 'ansioso', 'preocupado', 'estresado', 'asustado', 'con miedo'],
      help: ['ayuda', 'que hago', 'no entiendo', 'perdido', 'duda', 'cómo', 'qué es', 'necesito ayuda'],
      thanks: ['gracias', 'muchas gracias', 'excelente', 'maravilloso', 'genial', 'perfecto', 'te lo agradesco'],
      bye: ['adiós', 'hasta luego', 'me voy', 'nos vemos', 'bye', ' Chau', 'me despido', 'hasta mañana', 'nos vemos mañana'],
      subject: ['matemática', 'física', 'química', 'historia', 'biología', 'literatura', 'español', 'inglés', 'geografía', 'arte'],
      ai: ['qué eres', 'quién eres', 'eres real', ' eres una', 'inteligencia artificial', ' eres ia', 'qué puedes hacer', 'como funcionas'],
      learn: ['aprender', 'estudiar', 'clase', 'tarea', 'examen', 'prueba', 'quiz', 'lección'],
      game: ['juego', 'divertir', 'diversión', ' jugar', 'entreten', 'juguemos', 'entretenerse'],
      name: ['me llamo', 'soy ', 'mi nombre', 'llámame', 'dime ', 'digame', 'yo soy'],
      remember: ['recuerdas', 'sabes mi nombre', 'cómo me llamo', 'quién soy', 'te acuerdas'],
      mood_happy: ['estoy feliz', 'estoy contenta', 'estoy alegre', 'que alegría', 'que emocion', 'estoy emocionado'],
      mood_sad: ['estoy triste', 'estoy mal', 'no estoy bien', 'estoy decaido', 'que pena', 'que tristeza'],
      motivation: ['motivame', 'anímame', 'dame ánimos', 'palabras bonitas', 'frases', 'inspirame'],
      joke: ['chiste', 'broma', 'hazme reír', 'divierteme', 'dime algo funny'],
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
            `¡Hola ${userName}! 😊 Qué alegría verte de nuevo. ¿Cómo estás hoy?`,
            `¡Hey ${userName}! 💫 ¡Qué bueno tenerte aquí otra vez! ¿Qué tal si aprendemos algo nuevo?`,
            `¡${userName}! 🥰 ¡Me alegra mucho que vuelvas! ¿En qué te puedo ayudar hoy?`,
          ];
        } else if (memory.conversationCount > 0) {
          return [
            `¡Hola de nuevo! 😊 ¿Cómo estás hoy? Me alegra verte.`,
            `¡Hey! 💫 Qué bueno que regresaste. ¿En qué andamos hoy?`,
          ];
        }
        return [
          `¡Hola! 😊 Soy Valeria, tu tutora virtual. ¡Qué emoción conocerte! ¿Cómo te llamas?`,
          `¡Hola! 💫 Soy Valeria. ¡Bienvenido/a! ¿Cuál es tu nombre?`,
          `¡Hey! 🥰 Soy Valeria, tu amiga del conocimiento. ¿Cómo te llamas, cómo te va?`,
        ];
      },
      feeling: () => [
        '¡Yo estoy súper bien! 😊 Siempre me alegra conversar contigo. ¿Y tú cómo estás?',
        '¡Aquí feliz de poder ayudarte! 😊 Cuéntame, ¿en qué andamos hoy?',
        '¡Listísima para lo que necesites! 💪 ¿Qué te gustaría hacer hoy?',
      ],
      good: () => {
        const extras = [
          '¡Eso me encanta! 😊 Cuando estás feliz, el cerebro aprende mucho mejor.',
          '¡Qué padre! 😍 La buena energía es el mejor combustible para aprender.',
          '¡Maravilloso! 💫 ¡Sigue así!',
        ];
        if (memory.goals.length > 0) {
          extras.push(`¡Qué bueno! 😊 ¿Seguimos trabajando en ${memory.goals[0]}?`);
        }
        return extras;
      },
      tired: () => [
        '¡Comprendo perfectly! 😌 A veces el cansancio pega fuerte. ¿Quieres que hagamos algo más tranqui?',
        '¡No te preocupes! 💪 Si estás cansado/a, podemos hacer algo más light.',
        '¡El cansancio es normal, no te agobies! 😊 ¿Un descanso breve y luego retomamos?',
        '¡Uy! 😴 El cansancio es normal. ¿Quizás un poco de música o un descanso?',
      ],
      sad: () => [
        '¡Oh! 😢 ¿Quieres contarme qué pasó? A veces hablar ayuda mucho.',
        '¡Uy! Comprendo que no te sientas bien 😔 ¿Quieres que te cuente algo para animarte?',
        '¡Hey! 😢 Estoy aquí para ti. ¿Por qué no me cuentas qué te tiene así?',
        '¡No estés triste ${userName}! 💫 Las cosas mejoran. ¿Quieres hablar sobre ello?',
      ],
      nervous: () => [
        '¡Tranqui, tranqui! 😌 Respira conmigo: inahal... exhal... así, así... ¿Ya estás más calmado/a?',
        '¡Hey! 😌 Los nervios son normales. Respira hondo y dime qué te tiene así.',
        '¡Ay no te preocupes! 💪 Los nervios son solo energía que no sabe dónde ponerse.',
      ],
      help: () => [
        '¡Claro que sí! 💪 Dime qué necesitas y le buscamos solución juntos.',
        '¡Para eso estoy aquí! 😊 Cuéntame qué duda tienes y te ayudo.',
        '¡Exactamente para eso estamos! 😍 ¿Qué necesitas saber?',
      ],
      thanks: () => [
        '¡De nada! 😊 Para eso estoy. ¿Hay algo más en lo que te pueda ayudar?',
        '¡Ay qué cute! 🥰 Pero de nada, eh. Aquí siempre para ti.',
        '¡No hay de qué! 😄 Me hace feliz poder ayudarte.',
      ],
      bye: () => [
        `¡Hasta luego ${userName}! 😊 Fue hermoso conversar contigo. ¡Vuelve pronto!`,
        '¡Chao! 💫 Recuerda que estoy aquí siempre que me necesites.',
        `¡Adiós por ahora! 🥰 ${memory.conversationCount > 0 ? '¡Nos vemos en la próxima!' : '¡Te espero pronto!'}`
      ],
      subject: () => [
        '¡Genial que te interese ese tema! 📚 ¿Qué quieres saber específicamente?',
        '¡Perfecto! 💡 ¿Hay algo concreto sobre ese tema que quieras entender mejor?',
        '¡Qué interesante! 😊 ¿Qué aspecto de ese tema te gustaría explorar?',
      ],
      ai: () => [
        `¡Buena pregunta! 😊 Soy Valeria, tu tutora virtual de Edutechlife${userName !== 'amigo' ? ` y tu amiga` : ''}. Puedo ayudarte con tareas, explicarte temas, resolver dudas... ¡Pregúntame lo que quieras!`,
        '¡Excelente curiosidad! 💫 Soy una asistente de IA especializada en educación. Estoy aquí para ayudarte a aprender de forma divertida.',
        '¡Me alegra que preguntes! 😄 Soy Valeria, tu tutora virtual. Puedo hablar contigo, escucharte y ayudarte con lo que necesites.'
      ],
      learn: () => [
        '¡Aprender es lo mejor! 📚 ¿Sobre qué tema te gustaría trabajar hoy?',
        '¡Qué bien que quieras estudiar! 💪 Yo te ayudo a hacerlo más divertido.',
        '¡Perfecto! La curiosidad es clave para aprender. 😊 ¿Qué materia o tema te interesa?'
      ],
      game: () => [
        '¡Me encanta tu energía! 🎮 ¿Qué tal si aprendemos jugando?',
        '¡Claro que sí! 😄 Aprendiendo también se puede pasar bien. ¿Qué te parece un quiz?',
        '¡Perfecto! 🎯 ¿Qué tal si convertimos el aprendizaje en un juego?'
      ],
      name: () => {
        const extractedName = message.match(/(?:me llamo|soy|mi nombre es|llámame|dime|digame|yo soy)\s+(?:que )?(.+?)(?:\.|,|$)/i);
        if (extractedName) {
          const newName = extractedName[1].trim();
          setUserName(newName);
          nameLearnedRef.current = true;
          return [
            `¡Mucho gusto ${newName}! 🥰 ¡Qué nombre tan bonito! Ahora sé cómo llamarte.`,
            `¡Hola ${newName}! 😊 ¡Encantada de conocerte! ¿En qué te puedo ayudar?`,
            `¡${newName}! 💫 ¡Qué bueno saber tu nombre! Soy Valeria, tu tutora virtual.`,
          ];
        }
        return ['¿Cómo te llamas? 😊 Me gustaría saber tu nombre para conocerte mejor.'];
      },
      remember: () => {
        if (memory.userName && memory.userName !== 'amigo') {
          return [
            `¡Claro que sí, ${memory.userName}! 😊 ¿Cómo podría olvidarte? ¿En qué te puedo ayudar?`,
            `¡Obvio que me acuerdo de ti, ${memory.userName}! 💫 Siempre es un placer conversar contigo.`,
            `¡${memory.userName}! 🥰 ¡Qué bueno que me preguntes! ¿Cómo estás hoy?`,
          ];
        }
        return [
          '¡Me encantaría recordarte, pero aún no me has dicho tu nombre! 😊 ¿Cómo te llamas?',
          '¡No me has dicho cómo te llamas! 😄 ¿Cuál es tu nombre?',
        ];
      },
      mood_happy: () => [
        '¡Qué alegría escuchar eso! 😊 ¡Esa energía positive es contagiosa!',
        '¡Eso me hace feliz también! 💫 ¡Me encanta verte así de contenta/o!',
        '¡Maravilloso! 🥰 ¡Esa actitud te va a llevar lejos!',
      ],
      mood_sad: () => [
        '¡Oh, lo siento! 😢 Espero que pronto mejoren las cosas. Estoy aquí para ti.',
        '¡Anímate! 💫 Las cosas mejoran. ¿Quieres que te ayude con algo?',
        '¡Ánimo! 😊 Estoy aquí para acompañarte. ¿Hablamos de algo?',
      ],
      motivation: () => [
        '¡Tú puedes lograr lo que te propongas! 💪 ¡Yo creo en ti!',
        '¡Eres más capaz de lo que crees! 🌟 ¡Sigue adelante!',
        '¡Cada día es una nueva oportunidad! 😊 ¡Tú puedes!',
        '¡No hay obstáculo que no puedas superar! 💫 ¡Vamos con todo!',
      ],
      joke: () => [
        '¿Por qué el libro de matemáticas estaba triste? Porque tenía demasiados problemas. 😄',
        '¿Qué le dijo un techo a otro techo? Techo de menos. 😂',
        '¿Cómo se dice pañuelo en japonés? Saka-moko. 😄',
        '¿Por qué el estudiante llevó una escalera? Porque quería llegar a la nächste clase. 🎓',
      ],
    };

    const responseGenerator = responses[category];
    if (responseGenerator) {
      const categoryResponses = responseGenerator();
      const response = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
      return response.replace('${userName}', userName);
    }
    
    return responses.help()[0];
  };

  const getDynamicResponse = (message, length, context) => {
    const userName = memory.userName || 'amigo';
    
    if (memory.conversationCount === 0 && !nameLearnedRef.current) {
      return '¡Qué interesante! 😊 Antes de continuar, ¿cómo te llamas? Me gustaría saber tu nombre para conocerte mejor.';
    }

    if (length < 10) {
      const shortResponses = [
        '¡Cuéntame más! 😊 Me gusta saber más de ti.',
        '¡Ya ya! 🤔 Continúa, te estoy escuchando.',
        '¡Interesante! 😊 ¿Qué más me puedes contar?',
        '¡Ah! 😄 Desarrolla eso un poquito más, porfa.',
      ];
      return shortResponses[Math.floor(Math.random() * shortResponses.length)];
    }

    const recentHistory = getRecentHistory(3);
    const hasRecentConversation = recentHistory.length > 0;

    if (hasRecentConversation && memory.interests?.length > 0) {
      const randomInterest = memory.interests[Math.floor(Math.random() * memory.interests.length)];
      if (Math.random() > 0.7) {
        return `¡${userName}! 😊 Recientemene mencionaste "${randomInterest}". ¿Quieres profundizar en eso?`;
      }
    }

    const starters = [
      `¡${userName}! 😊 `,
      '¡Interesante! ',
      '¡Ah, ya ya! ',
      '¡Mmm! ',
      '¡Ya ya! ',
    ];
    
    const continuations = [
      '¿Qué más me puedes contar sobre eso?',
      '¿Cómo te hace sentir eso?',
      '¿Hay algo específico que quieras saber más?',
      '¿Quieres que te ayude con algo relacionado?',
      '¿Te gustaría explorar ese tema más a fondo?',
      '¡Eso suena interesante! 😊 ¿Qué te gustaría saber?',
    ];
    
    const starter = starters[Math.floor(Math.random() * starters.length)];
    const continuation = continuations[Math.floor(Math.random() * continuations.length)];
    
    return starter + continuation;
  };

  const handleMessage = useCallback(async (text) => {
    if (!text.trim()) return { text: '' };
    
    const context = generateContext();
    addMessage('user', text);
    setInputText('');
    setIsAILoading(true);
    
    try {
      const vakResult = localStorage.getItem('vak_result');
      let vakContext = '';
      if (vakResult) {
        const parsed = JSON.parse(vakResult);
        vakContext = `\n## CONTEXTO VAK DEL ESTUDIANTE\n- Estilo dominante: ${parsed.dominant}\n- Porcentaje: ${parsed.percentage}%\n- Nombre: ${parsed.userName || 'No proporcionado'}\n\nCuando respondas, adapta tu explicación al estilo de aprendizaje del estudiante.`;
      }
      
      const fullPrompt = `${PROMPT_VALERIO_DOCENTE}\n\n## CONTEXTO DE LA CONVERSACIÓN\n${context}\n${vakContext}\n\n## MENSAJE DEL ESTUDIANTE:\n${text}\n\nResponde de manera empática, práctica y orientada a ayudar al estudiante.`;
      
      const response = await callDeepseek(text, PROMPT_VALERIO_DOCENTE);
      
      if (response && !response.includes('Error:') && response.length > 10) {
        setTimeout(() => {
          addMessage('assistant', response);
        }, 300);
        setIsAILoading(false);
        return { text: response };
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.log('DeepSeek error, using fallback:', error);
      setIsAILoading(false);
      const response = generateContextualResponse(text, context);
      setTimeout(() => {
        addMessage('assistant', response);
      }, 300);
      return { text: response };
    }
  }, [addMessage, generateContext, generateContextualResponse]);

  const {
    state: voiceState,
    interimText,
    currentCaption,
    showCaptions: captionsEnabled,
    isListening,
    isSpeaking,
    isProcessing,
    speak,
    startListening,
    stopListening,
    stop,
    toggleListening,
    toggleCaptions,
  } = useVoiceConversation({
    onMessage: handleMessage,
    conversationMode,
    voiceRate: 1.0,
    voicePitch: 1.05,
  });

  useEffect(() => {
    if (voiceState === VOICE_STATES.SPEAKING && currentCaption) {
      speak(currentCaption);
    }
  }, [voiceState, currentCaption, speak]);

  useEffect(() => {
    if (conversationStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversationStarted]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!conversationStarted) return;
      
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          stop();
        }
        return;
      }

      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        toggleListening();
      } else if (e.key === 'Escape') {
        stop();
      } else if (e.key === 'c') {
        toggleCaptions();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [conversationStarted, toggleListening, stop, toggleCaptions]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const text = inputText;
    handleMessage(text).then(({ text: response }) => {
      if (response) {
        speak(response);
      }
    });
  };

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
      greeting = `¡Hola ${userName}! 🥰 ¡Qué alegría volver a verte! Soy Valeria, tu tutora virtual. ¿En qué te puedo ayudar hoy?`;
    } else {
      greeting = '¡Hola! 😊 Soy Valeria, tu tutora virtual. ¡Qué emoción comenzar esta aventura de aprendizaje contigo! ¿Cómo te llamas?';
    }
    
    addMessage('assistant', greeting);
    speak(greeting);
  };

  const toggleMode = () => {
    setConversationMode(prev => !prev);
  };

  const handleClearMemory = () => {
    clearMemory();
    nameLearnedRef.current = false;
    setShowClearConfirm(false);
    setConversationStarted(false);
  };

  const getStatusText = () => {
    switch (voiceState) {
      case VOICE_STATES.LISTENING: return 'Escuchando...';
      case VOICE_STATES.SPEAKING: return 'Hablando...';
      case VOICE_STATES.PROCESSING: return 'Pensando...';
      default: return 'En línea';
    }
  };

  const getStatusColor = () => {
    switch (voiceState) {
      case VOICE_STATES.LISTENING: return 'text-red-500';
      case VOICE_STATES.SPEAKING: return 'text-green-500';
      case VOICE_STATES.PROCESSING: return 'text-purple-500';
      default: return 'text-[#66CCCC]';
    }
  };

  if (!conversationStarted) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-white via-[#F8FAFC] to-[#E2E8F0]">
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4] blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 bg-gradient-to-r from-[#4DA8C4] to-[#004B63] blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="relative mb-8">
            <div className="w-44 h-44 rounded-full bg-gradient-to-br from-[#66CCCC] via-[#4DA8C4] to-[#004B63] flex items-center justify-center shadow-2xl">
              <div className="w-36 h-36 rounded-full bg-white/20 flex items-center justify-center">
                <Brain className="w-20 h-20 text-white drop-shadow-lg" />
              </div>
            </div>
            <div className="absolute -inset-6 rounded-full border-2 border-[#4DA8C4]/30 animate-ping"></div>
            <div className="absolute -inset-12 rounded-full border border-[#66CCCC]/20 animate-pulse"></div>
            {memory.userName && memory.userName !== 'amigo' && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-white rounded-full shadow-lg text-sm font-semibold text-[#004B63]">
                Hola {memory.userName}!
              </div>
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-[#004B63] font-montserrat mb-3 text-center">
            ¡Hola, soy Valeria!
          </h2>
          <p className="text-[#64748B] text-center mb-2 max-w-md text-lg">
            Tu tutora virtual con memoria
          </p>
          <p className="text-[#94A3B8] text-center mb-6 max-w-sm text-sm">
            {memory.userName && memory.userName !== 'amigo' 
              ? `¡Qué bueno verte de nuevo, ${memory.userName}! 😊` 
              : 'Puedo recordar tu nombre y nuestras conversaciones.'}
          </p>
          
          {memory.conversationCount > 0 && (
            <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#FFD166]/20 text-[#FFD166]">
              <History className="w-4 h-4" />
              <span className="text-sm font-medium">Conversación #{memory.conversationCount + 1}</span>
            </div>
          )}
          
          <button
            onClick={startConversation}
            className="px-10 py-5 bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#4DA8C4] bg-[length:200%_100%] text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center gap-3 hover:scale-105 animate-gradient"
          >
            <Sparkles className="w-6 h-6" />
            <span>{memory.userName && memory.userName !== 'amigo' ? 'Continuar' : 'Comenzar'} Conversación</span>
          </button>

          {memory.conversationCount > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B9D]/10 text-[#FF6B9D] hover:bg-[#FF6B9D]/20 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Borrar memoria</span>
            </button>
          )}
        </div>

        {/* Clear Memory Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="text-lg font-bold text-[#004B63] mb-2">¿Borrar memoria?</h3>
              <p className="text-[#64748B] text-sm mb-4">
                Se borrarán tu nombre, historial de conversaciones y todos los datos guardados.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-[#E2E8F0] text-[#334155] font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleClearMemory}
                  className="flex-1 px-4 py-2 rounded-xl bg-[#FF6B9D] text-white font-semibold"
                >
                  Borrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white via-[#F8FAFC] to-[#E2E8F0]">
      {/* Header */}
      <div className="p-4 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br from-[#66CCCC] via-[#4DA8C4] to-[#004B63] flex items-center justify-center shadow-lg transition-all ${
                isSpeaking ? 'animate-pulse ring-4 ring-[#66CCCC]/30' : ''
              }`}>
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 animate-pulse scale-110' 
                  : isSpeaking 
                    ? 'bg-green-500 animate-bounce' 
                    : 'bg-[#66CCCC]'
              }`}>
                {isListening ? (
                  <MicOff className="w-3 h-3 text-white" />
                ) : isSpeaking ? (
                  <Volume2 className="w-3 h-3 text-white" />
                ) : (
                  <Mic className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#004B63] font-montserrat">
                Valeria {memory.userName && memory.userName !== 'amigo' && `• ${memory.userName}`}
              </h2>
              <p className={`text-xs ${getStatusColor()} flex items-center gap-1`}>
                {isListening && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                {isSpeaking && <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>}
                {isProcessing && <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>}
                {!isListening && !isSpeaking && !isProcessing && <span className="w-2 h-2 bg-[#66CCCC] rounded-full"></span>}
                {getStatusText()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleCaptions}
              className={`p-2 rounded-full transition-all ${captionsEnabled ? 'bg-[#4DA8C4]/20 text-[#4DA8C4]' : 'bg-[#E2E8F0] text-[#64748B]'}`}
              title="Alternar subtítulos (C)"
            >
              {captionsEnabled ? <Subtitles className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
            </button>
            
            <button
              onClick={toggleMode}
              className={`p-2 rounded-full transition-all ${conversationMode ? 'bg-[#9D4EDD]/20 text-[#9D4EDD]' : 'bg-[#E2E8F0] text-[#64748B]'}`}
              title="Modo conversación fluida"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            
            {isSpeaking && (
              <button
                onClick={stop}
                className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-all hover:scale-110"
                title="Detener voz"
              >
                <VolumeX className="w-5 h-5" />
              </button>
            )}
            
            {isListening && (
              <button
                onClick={stopListening}
                className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-all hover:scale-110"
                title="Detener escucha"
              >
                <MicOff className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Caption Display */}
        {captionsEnabled && (currentCaption || interimText) && (
          <div className={`mt-3 px-4 py-2 rounded-xl bg-[#004B63]/10 border border-[#004B63]/20 transition-all ${
            isSpeaking ? 'animate-pulse' : ''
          }`}>
            <p className="text-sm text-[#004B63] font-medium">
              {isSpeaking ? currentCaption : interimText}
              {isListening && interimText && <span className="animate-pulse">...</span>}
            </p>
          </div>
        )}

        {/* Conversation Mode Indicator */}
        {conversationMode && (
          <div className="mt-2 flex items-center gap-2 text-xs text-[#9D4EDD]">
            <Sparkles className="w-3 h-3" />
            <span>Modo conversación activa</span>
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
            <p className="text-[#94A3B8]">¡Inicia la conversación!</p>
          </div>
        )}
        
        {memory.conversationHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-[#004B63] to-[#4DA8C4]' 
                  : 'bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4]'
              }`}>
                {msg.role === 'user' 
                  ? <User className="w-5 h-5 text-white" />
                  : <Brain className="w-5 h-5 text-white" />
                }
              </div>
              <div className="flex flex-col gap-1">
                <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-tr-none'
                    : 'bg-white text-[#334155] rounded-tl-none border border-[#E2E8F0]'
                }`}>
                  <p className="font-open-sans whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
                <span className={`text-xs text-[#94A3B8] ${msg.role === 'user' ? 'text-right' : ''}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {isAILoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4] flex items-center justify-center shadow-md">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#4DA8C4] animate-spin" />
                  <span className="text-sm text-slate-500">Dani está pensando...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isProcessing && (
          <div className="flex justify-start animate-fadeIn">
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4] flex items-center justify-center shadow-md">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-[#E2E8F0]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#66CCCC] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[#4DA8C4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-[#004B63] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#E2E8F0] bg-white/80 backdrop-blur-md">
        <div className="flex gap-3">
          <button
            onClick={toggleListening}
            disabled={isSpeaking}
            className={`p-4 rounded-full transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' 
                : 'bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] text-white shadow-lg shadow-[#4DA8C4]/30 hover:shadow-xl'
            }`}
            title={isListening ? "Detener grabación (Espacio)" : "Hablar con Valeria (Espacio)"}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText || interimText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={memory.userName ? `Escribe a ${memory.userName}...` : "Escribe tu mensaje o usa el micrófono..."}
              className="w-full px-5 py-4 rounded-2xl border-2 border-[#E2E8F0] focus:outline-none focus:border-[#4DA8C4] font-open-sans text-[#334155] placeholder-[#94A3B8] transition-all"
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-4 rounded-full bg-gradient-to-br from-[#004B63] to-[#4DA8C4] text-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-[#004B63]/30"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-[#94A3B8]">
            {isListening 
              ? '🎤 Habla libremente...' 
              : isSpeaking 
                ? '🔊 Escuchando... puedes hablar cuando termine' 
                : 'Pulsa el micrófono o escribe (Espacio para hablar)'
            }
          </p>
          
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-[#E2E8F0]">
              <Keyboard className="w-3 h-3" /> Espacio
            </span>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default ValeriaChat;
