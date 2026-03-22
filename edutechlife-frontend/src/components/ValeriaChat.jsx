import React, { useEffect, useRef, useState } from 'react';
import { Brain, Mic, MicOff, Volume2, MessageCircle, Sparkles, Send, User } from 'lucide-react';
import { speakTextConversational, iniciarReconocimiento } from '../utils/speech';

const ValeriaChat = ({ studentName = 'amigo', onNavigate }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola mi amor! ¿Cómo estás el día de hoy? 😊' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);
  const [conversationActive, setConversationActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (voiceMode && conversationActive && !isSpeaking) {
      setTimeout(() => startListening(), 500);
    }
  }, [messages, voiceMode]);

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content, timestamp: new Date() }]);
    
    if (role === 'assistant' && voiceMode) {
      speakMessage(content);
    }
  };

  const speakMessage = (text) => {
    setIsSpeaking(true);
    speakTextConversational(text, () => {
      setIsSpeaking(false);
    });
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const startListening = () => {
    if (!voiceMode || isSpeaking) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'es-CO';
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    let finalTranscript = '';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (finalTranscript.trim()) {
        handleUserResponse(finalTranscript);
      }
    };

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      setInputText(finalTranscript || interimTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Recognition error:', event.error);
      setIsListening(false);
    };

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error('Recognition start error:', e);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleUserResponse = (text) => {
    if (!text.trim()) return;
    
    addMessage('user', text);
    stopSpeaking();
    
    const lowerText = text.toLowerCase();
    
    const responses = [
      {
        patterns: ['hola', 'buenos días', 'buenas', 'qué tal', 'saludos'],
        response: getGreeting()
      },
      {
        patterns: ['bien', 'genial', 'excelente', 'feliz', 'contento', 'mari mari'],
        response: getHappyResponse()
      },
      {
        patterns: ['cansado', 'fatigado', 'slego', 'aburrido', 'triste'],
        response: getTiredResponse()
      },
      {
        patterns: ['nervioso', 'ansioso', 'preocupado', 'estresado'],
        response: getNervousResponse()
      },
      {
        patterns: ['ayuda', 'que hago', 'no entiendo', 'perdido', 'duda'],
        response: getHelpResponse()
      },
      {
        patterns: ['gracias', 'muchas gracias', 'excelente', 'maravilloso'],
        response: getThanksResponse()
      }
    ];

    let foundResponse = null;
    for (const item of responses) {
      if (item.patterns.some(p => lowerText.includes(p))) {
        foundResponse = item.response;
        break;
      }
    }

    if (!foundResponse) {
      foundResponse = getCuriousResponse(text);
    }

    setTimeout(() => {
      addMessage('assistant', foundResponse);
    }, 800);
  };

  const getGreeting = () => {
    const greetings = [
      `¡Qué alegría verte por aquí, ${studentName}! 🥰 Me tiene súper contenta de que estés conmigo hoy. ¿En qué te puedo ayudar?`,
      `¡Hola mi cielito! ¿Cómo amaneciste? 😊 Yo estoy aquí lista para ayudarte en lo que necesites.`,
      `¡Hey, qué高兴 de verte! 😊 ¿Cómo estás el día de hoy? Cuéntame qué tienes en mente.`,
      `¡Buenas, buenas! ¿Qué tal estás? Yo aquí lista para lo que necesites. 💪`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const getHappyResponse = () => {
    const responses = [
      '¡Eso me encanta oír! 😊 Cuando estás happy así, el cerebro aprende mucho mejor. ¡Qué bueno! ¿En qué andamos hoy?',
      '¡Qué padre! La buena energía es el mejor combustible para aprender. 🚀 ¿Qué te trae por aquí hoy?',
      '¡Maravilloso! 😍 Me alegra un montón que estés así. Cuéntame, ¿qué te gustaría hacer hoy?',
      '¡Eso es súper cool! 💪 Con esa actitud vamos a lograr cosas increíbles. ¿Qué tienes en mente?'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getTiredResponse = () => {
    const responses = [
      '¡Uy, comprendo perfectly! A veces el cansancio pega fuerte. 😌 ¿Quieres que hagamos algo bien tranqui?',
      'Bueno, bueno, el cansancio es normal mi amor. 💪 Descansemos un poquito y luego retomamos con todo.',
      '¡No te preocupes! Si estás cansado, podemos hacer algo más light. ¿Qué tal si conversamos un rato?',
      '¡Ah! El cansancio... A todos nos pasa. 😌 ¿Qué te parece si hablamos un poco? Así descansas la mente.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getNervousResponse = () => {
    const responses = [
      '¡Tranqui, tranqui! 😌 Respira conmigo: inahal... exhal... así, así... ¿Ya estás más calmado? Todo va a estar bien.',
      '¡Hey! Los nervios son normales, mi amor. 😊 Respira hondo y dime qué te tiene así. Estamos juntos en esto.',
      '¡Ay no te preocupes! 😌 Yo estoy aquí para ayudarte. Los nervios son solo energía que no sabe dónde ponerse. ¿Qué tal si conversamos?'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getHelpResponse = () => {
    const responses = [
      '¡Claro que sí! 💪 Aquí estoy yo para ayudarte en lo que sea. Dime qué necesitas y le buscamos solución juntos.',
      '¡Para eso estoy aquí! 😊 Cuéntame qué es lo que necesitas y te ayudo con mucho gusto.',
      '¡Exactamente para eso estamos! 😍 Cuéntame qué duda tienes que yo te ayudo con todo el corazón.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getThanksResponse = () => {
    const responses = [
      '¡De nada, mi amor! 😊 Para eso estamos. ¿Hay algo más en lo que te pueda ayudar?',
      '¡Ay, qué cute! 🥰 Pero de nada, eh. Aquí estoy para ti siempre. ¿Qué más necesitas?',
      '¡No hay de qué! 😄 Me hace feliz poder ayudarte. ¿En qué más te puedo echar la mano?'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getCuriousResponse = (text) => {
    const responses = [
      `¡Interesante! 😊 Cuéntame más sobre eso que dices. Me tiene curiosa...`,
      `¡Ah, qué cool! 😍 Desarrolla eso un poquito más, porfa. Me gusta saber más de ti.`,
      `¡Mmm, ya ya! 😊 Explícame mejor qué quieres decir con eso. Así te puedo ayudar mejor.`,
      `¡Órale! 😄 Eso me llama la atención. Cuéntame más, más, más...`,
      `¡Ajá! Ya ya... 🤔 Y eso cómo te hace sentir? Es importante entenderte bien.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    handleUserResponse(inputText);
    setInputText('');
    stopListening();
  };

  const toggleVoiceMode = () => {
    setVoiceMode(prev => !prev);
    setConversationActive(!voiceMode);
    
    if (voiceMode) {
      stopSpeaking();
      stopListening();
    } else {
      addMessage('assistant', '¡Perfecto! Ya activé el modo voz. 🎤 Ya puedes hablarme libremente y yo te responderé en voz alta. ¡Vamos!');
    }
  };

  const startConversation = () => {
    setConversationActive(true);
    setVoiceMode(true);
    addMessage('assistant', `¡Hola! Soy Valeria, tu tutora virtual. 🥰 Estoy aquí para ayudarte en lo que necesites. ¿Cómo te sientes hoy?`);
  };

  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListening();
    };
  }, []);

  if (!conversationActive) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-white to-[#F8FAFC]">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="relative mb-8">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#66CCCC] via-[#4DA8C4] to-[#004B63] flex items-center justify-center shadow-2xl">
              <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                <Brain className="w-16 h-16 text-white" />
              </div>
            </div>
            <div className="absolute -inset-4 rounded-full border-2 border-[#4DA8C4]/30 animate-ping"></div>
            <div className="absolute -inset-8 rounded-full border border-[#66CCCC]/20 animate-pulse"></div>
          </div>
          
          <h2 className="text-2xl font-bold text-[#004B63] font-montserrat mb-2">
            Valeria AI
          </h2>
          <p className="text-[#64748B] text-center mb-8 max-w-sm">
            Tu tutora virtual. Puedo hablar contigo, escucharte y ayudarte con cualquier duda que tengas.
          </p>
          
          <button
            onClick={startConversation}
            className="px-8 py-4 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
          >
            <MessageCircle className="w-6 h-6" />
            <span>Hablar con Valeria</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-[#F8FAFC]">
      {/* Header */}
      <div className="p-4 border-b border-[#E2E8F0] bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4] flex items-center justify-center ${isSpeaking ? 'animate-pulse' : ''}`}>
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div 
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  isListening ? 'bg-red-500 animate-pulse' : isSpeaking ? 'bg-green-500 animate-bounce' : 'bg-[#66CCCC]'
                }`}
              >
                {isListening ? <MicOff className="w-3 h-3 text-white" /> : isSpeaking ? <Volume2 className="w-3 h-3 text-white" /> : <Mic className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#004B63] font-montserrat">Valeria</h2>
              <p className="text-xs text-[#64748B]">
                {isListening ? 'Escuchando...' : isSpeaking ? 'Hablando...' : 'En línea'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={toggleVoiceMode}
              className={`p-2 rounded-full transition-colors ${
                voiceMode ? 'bg-[#4DA8C4] text-white' : 'bg-[#E2E8F0] text-[#64748B]'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-[#004B63] to-[#4DA8C4]' 
                  : 'bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4]'
              }`}>
                {msg.role === 'user' 
                  ? <User className="w-4 h-4 text-white" />
                  : <Brain className="w-4 h-4 text-white" />
                }
              </div>
              <div>
                <div className={`rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white'
                    : 'bg-[#F1F5F9] text-[#334155]'
                }`}>
                  <p className="font-open-sans whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isListening && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4] flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="bg-[#F1F5F9] rounded-2xl px-4 py-3">
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
      <div className="p-4 border-t border-[#E2E8F0] bg-white">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={voiceMode ? "Oprime el micrófono para hablar..." : "Escribe tu mensaje..."}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] font-open-sans"
              disabled={voiceMode}
            />
            {voiceMode && (
              <button
                onClick={isListening ? stopListening : startListening}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-[#4DA8C4]/10 text-[#4DA8C4] hover:bg-[#4DA8C4]/20'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
          </div>
          {!voiceMode && (
            <button
              onClick={handleSendMessage}
              className="px-6 py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>
        {voiceMode && (
          <p className="text-xs text-center text-[#64748B] mt-2">
            {isListening ? '🎤 Te escucho... habla libremente' : isSpeaking ? '🔊 Valeria está hablando...' : 'Pulsa el micrófono o espera a que Valeria termine de hablar'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ValeriaChat;
