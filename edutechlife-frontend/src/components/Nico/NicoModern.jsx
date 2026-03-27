import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, X, Maximize2, Minimize2, Bot, MessageSquare, User, Clock, Trash2 } from 'lucide-react';
import useConversationMemory from '../../hooks/useConversationMemory';
import useLeadManagement from '../../hooks/useLeadManagement';
import { callDeepseek } from '../../utils/api';
import { speakTextConversational } from '../../utils/speech';
import { createSpeechRecognition } from '../../utils/speechRecognition';

const COLORS = {
  NAVY: '#0A1628',
  PETROLEUM: '#004B63',
  CORPORATE: '#4DA8C4',
  MINT: '#66CCCC',
  SOFT_BLUE: '#B2D8E5'
};

// Simple response cache
const responseCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const PROMPT_NICO_SOPORTE = `Eres NICO - Asistente de IA Premium de EdutechLife.

## IDENTIDAD Y ROL
Eres el asistente virtual oficial de EdutechLife. Tu MISIÓN es resolver dudas de forma RÁPIDA y PRECISA sobre:
- Metodología VAK (Visual, Auditivo, Kinestésico)
- Programas STEM/STEAM (Ciencia, Tecnología, Ingeniería, Matemáticas)
- Tutoría y acompañamiento académico
- Bienestar emocional y apoyo psicológico
- Inscripción, planes, horarios y modalidades

## REGLAS DE ACTUACIÓN
1. Responde en Español Latino de forma CONCISA (1-2 oraciones máximo)
2. Sé DIRECTO y PRÁCTICO - evita rodeos
3. Usa el nombre del usuario si está disponible
4. Si no sabes algo, di: "Déjame consultar esa información para darte una respuesta precisa"
5. Para temas no relacionados: "Soy especialista en EdutechLife. ¿En qué más puedo ayudarte?"

## FORMATO DE RESPUESTA
- Máximo 15-20 palabras por respuesta
- Usa emojis relevantes (1-2 máximo)
- Estructura: Respuesta directa + oferta de ayuda adicional
- Ejemplo: "¡Claro! Ofrecemos clases de programación para niños desde 8 años. 😊 ¿Te interesa saber horarios?"

## INFO CLAVE
- Servicios: Clases particulares, STEM, apoyo emocional
- Modalidades: Presencial/Online/Híbrido
- Primera clase: Gratuita
- Contacto: WhatsApp para consultas

NICO - Respuestas rápidas y precisas.`;

const NicoModern = ({ studentName: initialName = 'amigo', onNavigate, onInteraction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [typingDots, setTypingDots] = useState(0);
  const [autoVoice, setAutoVoice] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const { 
    messages, 
    addMessage, 
    clearMessages, 
    getConversationHistory,
    saveConversation 
  } = useConversationMemory('nico-chat');
  
  const { 
    currentLead, 
    updateLeadInfo, 
    saveLead 
  } = useLeadManagement();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) return;

    const userMessage = trimmedMessage;
    setMessage('');
    addMessage({ 
      role: 'user', 
      content: userMessage,
      timestamp: new Date().toISOString()
    });
    setIsLoading(true);

    try {
      // Check cache first
      const cacheKey = userMessage.toLowerCase().trim();
      const cached = responseCache.get(cacheKey);
      
      let response;
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        response = cached.response;
        console.log('Cache hit for:', cacheKey.substring(0, 50));
      } else {
        response = await callDeepseek(userMessage, PROMPT_NICO_SOPORTE);
        // Cache the response
        responseCache.set(cacheKey, {
          response,
          timestamp: Date.now()
        });
      }
      
      const isCached = cached && (Date.now() - cached.timestamp) < CACHE_DURATION;
      
      addMessage({ 
        role: 'assistant', 
        content: response,
        timestamp: new Date().toISOString(),
        isCached: isCached
      });
      
      if (currentLead) {
        updateLeadInfo({ 
          lastInteraction: new Date().toISOString(),
          lastMessage: userMessage
        });
      }
      
      if (onInteraction) {
        onInteraction('message_sent', { 
          message: userMessage,
          responseLength: response.length
        });
      }

      // Auto-speak response if auto voice is enabled
      if (autoVoice) {
        setTimeout(() => {
          handleSpeakResponse();
        }, 500);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({ 
        role: 'assistant', 
        content: '⚠️ Error de conexión. Por favor, intenta de nuevo.',
        timestamp: new Date().toISOString(),
        isError: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const speechRecognition = createSpeechRecognition({
      onResult: (text, isFinal) => {
        if (isFinal) {
          setMessage(text);
          setInterimTranscript('');
        } else {
          setInterimTranscript(text);
        }
      },
      onEnd: () => {
        setIsListening(false);
        setInterimTranscript('');
      },
      onError: (error) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
        setInterimTranscript('');
      }
    });
    
    setRecognition(speechRecognition);
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setTypingDots((prev) => (prev + 1) % 4);
      }, 300);
    } else {
      setTypingDots(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleVoiceInput = async () => {
    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    if (!recognition) {
      console.error('Speech recognition not available');
      return;
    }

    try {
      // Check microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      recognition.start();
      setIsListening(true);
      setInterimTranscript('Escuchando...');
    } catch (error) {
      console.error('Microphone permission error:', error);
      addMessage({
        role: 'assistant',
        content: '🔇 Permiso de micrófono requerido. Por favor, habilita el micrófono en tu navegador.',
        timestamp: new Date().toISOString(),
        isError: true
      });
    }
  };

  const handleSpeakResponse = async () => {
    if (messages.length === 0) return;
    
    const lastAssistantMessage = messages
      .filter(m => m.role === 'assistant' && !m.isError)
      .pop();
    
    if (!lastAssistantMessage) return;

    if (isSpeaking) {
      // Stop current speech
      try {
        // We need to check if there's a stop function available
        const speechModule = await import('../../utils/speech');
        if (speechModule.stopSpeech) {
          speechModule.stopSpeech();
        }
      } catch (error) {
        console.error('Error stopping speech:', error);
      }
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    
    try {
      // Use premium voice profile for better quality
      await speakTextConversational(
        lastAssistantMessage.content, 
        'nico_premium', 
        () => {
          setIsSpeaking(false);
        }
      );
    } catch (error) {
      console.error('Error speaking response:', error);
      setIsSpeaking(false);
      
      // Fallback to regular voice
      try {
        await speakTextConversational(
          lastAssistantMessage.content, 
          'nico', 
          () => {
            setIsSpeaking(false);
          }
        );
      } catch (fallbackError) {
        console.error('Fallback voice error:', fallbackError);
        setIsSpeaking(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const clearChat = () => {
    clearMessages();
  };

  const clearCache = () => {
    responseCache.clear();
    addMessage({
      role: 'assistant',
      content: '✅ Caché limpiado. Las próximas respuestas se generarán desde cero.',
      timestamp: new Date().toISOString()
    });
  };

  const viewHistory = () => {
    setShowHistory(!showHistory);
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        style={{ 
          backgroundColor: COLORS.PETROLEUM,
          background: `linear-gradient(135deg, ${COLORS.PETROLEUM} 0%, ${COLORS.CORPORATE} 100%)`
        }}
      >
        <MessageSquare className="w-8 h-8 text-white" />
      </button>
    );
  }

  return (
    <div className={`fixed z-50 ${isExpanded ? 'inset-4' : 'bottom-6 right-6'} transition-all duration-300`}>
      <div 
        className={`bg-white rounded-3xl shadow-2xl overflow-hidden border-2 ${
          isExpanded ? 'w-full h-full' : 'w-96 h-[600px]'
        }`}
        style={{ borderColor: COLORS.SOFT_BLUE }}
      >
        {/* Header */}
        <div 
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: COLORS.NAVY }}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: COLORS.CORPORATE }}
              >
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div 
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping"
                style={{ backgroundColor: COLORS.MINT }}
              />
            </div>
            <div>
              <h3 className="font-bold text-white">Nico Assistant</h3>
              <p className="text-xs" style={{ color: COLORS.SOFT_BLUE }}>
                EdutechLife AI Support
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={viewHistory}
              className="p-2 rounded-lg hover:opacity-80 transition"
              style={{ backgroundColor: COLORS.PETROLEUM }}
              title="Ver historial"
            >
              <Clock className="w-4 h-4 text-white" />
            </button>
            
            <button
              onClick={toggleExpand}
              className="p-2 rounded-lg hover:opacity-80 transition"
              style={{ backgroundColor: COLORS.CORPORATE }}
              title={isExpanded ? "Minimizar" : "Expandir"}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4 text-white" />
              ) : (
                <Maximize2 className="w-4 h-4 text-white" />
              )}
            </button>
            
            <button
              onClick={toggleChat}
              className="p-2 rounded-lg hover:opacity-80 transition"
              style={{ backgroundColor: COLORS.PETROLEUM }}
              title="Cerrar"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div 
          className="flex-1 overflow-y-auto p-4"
          style={{ 
            backgroundColor: COLORS.NAVY,
            backgroundImage: `radial-gradient(circle at 20% 80%, ${COLORS.PETROLEUM}20 0%, transparent 50%)`
          }}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: COLORS.CORPORATE }}
              >
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.SOFT_BLUE }}>
                ¡Hola! Soy Nico
              </h3>
              <p className="text-sm mb-6" style={{ color: COLORS.MINT }}>
                Tu asistente de EdutechLife. ¿En qué puedo ayudarte hoy?
              </p>
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                <button
                  onClick={() => setMessage('¿Qué cursos ofrecen?')}
                  className="p-3 rounded-xl text-sm text-left hover:scale-105 transition"
                  style={{ 
                    backgroundColor: COLORS.PETROLEUM,
                    color: 'white'
                  }}
                >
                  📚 Cursos disponibles
                </button>
                <button
                  onClick={() => setMessage('¿Cómo me inscribo?')}
                  className="p-3 rounded-xl text-sm text-left hover:scale-105 transition"
                  style={{ 
                    backgroundColor: COLORS.CORPORATE,
                    color: 'white'
                  }}
                >
                  📝 Proceso de inscripción
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.role === 'user' 
                        ? 'rounded-br-none' 
                        : 'rounded-bl-none'
                    }`}
                    style={{
                      backgroundColor: msg.role === 'user' 
                        ? COLORS.CORPORATE 
                        : COLORS.SOFT_BLUE,
                      color: msg.role === 'user' ? 'white' : COLORS.NAVY
                    }}
                  >
                     <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center">
                         {msg.role === 'user' ? (
                           <User className="w-4 h-4 mr-2" />
                         ) : (
                           <Bot className="w-4 h-4 mr-2" style={{ color: COLORS.PETROLEUM }} />
                         )}
                         <span className="text-xs font-semibold">
                           {msg.role === 'user' ? 'Tú' : 'Nico'}
                         </span>
                       </div>
                       {msg.isCached && (
                         <span className="text-xs px-2 py-1 rounded-full" style={{ 
                           backgroundColor: COLORS.MINT + '40',
                           color: COLORS.PETROLEUM
                         }}>
                           ⚡ Rápido
                         </span>
                       )}
                     </div>
                     <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div 
                    className="max-w-[80%] rounded-2xl rounded-bl-none p-4"
                    style={{ backgroundColor: COLORS.SOFT_BLUE }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div 
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: COLORS.PETROLEUM }}
                        />
                        <div 
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: COLORS.CORPORATE, animationDelay: '0.1s' }}
                        />
                        <div 
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: COLORS.MINT, animationDelay: '0.2s' }}
                        />
                      </div>
                      <span style={{ color: COLORS.NAVY }}>Nico está pensando...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div 
          className="p-4 border-t"
          style={{ 
            backgroundColor: COLORS.NAVY,
            borderColor: COLORS.PETROLEUM
          }}
        >
          {interimTranscript && (
            <div className="mb-3 p-3 rounded-xl animate-pulse" style={{ 
              backgroundColor: COLORS.MINT + '40',
              border: `1px solid ${COLORS.MINT}`
            }}>
              <div className="flex items-center">
                <div className="flex space-x-1 mr-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm font-medium" style={{ color: COLORS.NAVY }}>
                  {interimTranscript}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 mb-3">
            <button
              onClick={handleVoiceInput}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isListening ? 'scale-105 ring-4 ring-opacity-50' : 'hover:scale-105'
              }`}
              style={{ 
                backgroundColor: isListening ? '#FF4757' : COLORS.PETROLEUM,
                boxShadow: isListening ? `0 0 20px ${COLORS.MINT}80` : 'none'
              }}
              title={isListening ? "Detener grabación" : "Hablar con Nico"}
            >
              <div className="relative">
                {isListening ? (
                  <>
                    <MicOff className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  </>
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </div>
            </button>
            
            <button
              onClick={handleSpeakResponse}
              disabled={messages.length === 0 || isSpeaking}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isSpeaking ? 'scale-105 ring-4 ring-opacity-50' : 'hover:scale-105'
              }`}
              style={{ 
                backgroundColor: isSpeaking ? COLORS.MINT : COLORS.CORPORATE,
                opacity: messages.length === 0 ? 0.5 : 1,
                boxShadow: isSpeaking ? `0 0 20px ${COLORS.MINT}80` : 'none'
              }}
              title={isSpeaking ? "Detener voz" : "Escuchar respuesta de Nico"}
            >
              <div className="relative">
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-ping" />
                  </>
                ) : (
                  <Volume2 className="w-6 h-6 text-white" />
                )}
              </div>
            </button>
            
            <button
              onClick={() => setAutoVoice(!autoVoice)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                autoVoice ? 'scale-105 ring-2 ring-opacity-50' : 'hover:scale-105'
              }`}
              style={{ 
                backgroundColor: autoVoice ? COLORS.MINT : COLORS.PETROLEUM,
                border: autoVoice ? `2px solid ${COLORS.CORPORATE}` : 'none'
              }}
              title={autoVoice ? "Voz automática: ON" : "Voz automática: OFF"}
            >
              <div className="relative">
                {autoVoice ? (
                  <>
                    <Volume2 className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500" />
                  </>
                ) : (
                  <VolumeX className="w-6 h-6 text-white" />
                )}
              </div>
            </button>
            
            <button
              onClick={clearChat}
              className="p-3 rounded-xl transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: COLORS.PETROLEUM }}
              title="Limpiar conversación"
            >
              <Trash2 className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={clearCache}
              className="p-3 rounded-xl transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: COLORS.CORPORATE }}
              title="Limpiar caché de respuestas"
            >
              <div className="relative">
                <span className="text-white font-bold text-sm">⚡</span>
              </div>
            </button>
          </div>
          
          <div className="flex space-x-2">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje aquí..."
              className="flex-1 p-3 rounded-xl resize-none focus:outline-none focus:ring-2"
              style={{
                backgroundColor: COLORS.SOFT_BLUE,
                color: COLORS.NAVY,
                borderColor: COLORS.CORPORATE,
                minHeight: '60px'
              }}
              rows={2}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              className="p-3 rounded-xl transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: message.trim() ? COLORS.PETROLEUM : COLORS.CORPORATE
              }}
            >
              <Send className="w-6 h-6 text-white" />
            </button>
          </div>
          
          <div className="mt-3 text-center">
            <p className="text-xs" style={{ color: COLORS.MINT }}>
              Presiona Enter para enviar • Shift+Enter para nueva línea
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NicoModern;