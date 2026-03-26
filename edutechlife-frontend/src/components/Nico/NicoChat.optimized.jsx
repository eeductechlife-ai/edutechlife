import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Brain, Mic, MicOff, Volume2, VolumeX, Send, X, Loader2, Copy, PlayCircle, Bot, MessageCircle, AlertCircle, Zap, Database, Cpu } from 'lucide-react';
import useConversationMemory from '../../hooks/useConversationMemory';
import { callDeepseek } from '../../utils/api';
import { getNicoResponse, addResponseToCache } from '../../utils/nicoCache';
import { speakTextConversational, stopSpeech } from '../../utils/speech';
import { createSpeechRecognition, getSpeechRecognitionStatus, requestMicrophonePermission } from '../../utils/speechRecognition';
import { getVoiceSystem, speakWithNico, stopNicoVoice } from '../../utils/nicoVoice';

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

const NicoChatOptimized = ({ studentName: initialName = 'amigo', onNavigate }) => {
  const [inputText, setInputText] = useState('');
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [micPermissionError, setMicPermissionError] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [speechStatus, setSpeechStatus] = useState({ supported: true, message: '' });
  const [performanceMetrics, setPerformanceMetrics] = useState({
    cacheHit: false,
    responseTime: 0,
    cacheLevel: 0,
    backendTime: 0,
    voiceTime: 0
  });
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const nameLearnedRef = useRef(false);
  const responseStartTimeRef = useRef(null);

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
    
    return () => {
      stopNicoVoice();
    };
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

  const handleSendMessage = useCallback(async (message = inputText) => {
    if (!message.trim() || isProcessing) return;
    
    const userMessage = message.trim();
    setInputText('');
    setInterimText('');
    setIsProcessing(true);
    responseStartTimeRef.current = Date.now();
    
    addMessage('user', userMessage);
    
    const metrics = {
      cacheHit: false,
      responseTime: 0,
      cacheLevel: 0,
      backendTime: 0,
      voiceTime: 0
    };
    
    try {
      const startTime = Date.now();
      // Obtener historial reciente del usuario para pre-cache
      const userHistory = memory.conversationHistory
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .slice(-5); // Últimas 5 preguntas
      
      const cacheResult = await getNicoResponse(
        userMessage, 
        memory.userName || 'amigo',
        userHistory
      );
      const cacheTime = Date.now() - startTime;
      
      if (cacheResult.fromCache) {
        metrics.cacheHit = true;
        metrics.cacheLevel = cacheResult.cacheLevel;
        metrics.responseTime = cacheTime;
        
        // Respuesta instantánea de cache - no bloquear UI
        addMessage('assistant', cacheResult.response);
        setIsProcessing(false); // Liberar UI inmediatamente
        
        // Reproducción de voz en segundo plano (no bloqueante)
        if (isAudioEnabled) {
          setTimeout(async () => {
            const voiceStart = Date.now();
            await speakWithNico(cacheResult.response);
            metrics.voiceTime = Date.now() - voiceStart;
            setPerformanceMetrics(prev => ({ ...prev, voiceTime: metrics.voiceTime }));
          }, 0);
        }
        
        setPerformanceMetrics(metrics);
      } else {
        setIsAILoading(true);
        const backendStart = Date.now();
        
        // Respuesta de backend - mostrar indicador de carga
        let response;
        try {
          // Timeout agresivo para consultas complejas
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          );
          
          response = await Promise.race([
            callDeepseek(userMessage, PROMPT_NICO_SOPORTE),
            timeoutPromise
          ]);
          
          // Añadir respuesta al cache para futuras consultas
          addResponseToCache(
            userMessage, 
            response, 
            memory.userName || 'amigo'
          );
        } catch (error) {
          // Respuesta de fallback si timeout o error
          response = `Basándome en tu pregunta sobre "${userMessage}", te puedo decir que en EdutechLife combinamos la última tecnología educativa con bienestar emocional para ofrecer resultados transformadores. ¿Te gustaría que un asesor especializado te contacte con más detalles?`;
          
          // También cachear la respuesta de fallback
          addResponseToCache(
            userMessage, 
            response, 
            memory.userName || 'amigo'
          );
        }
        
        metrics.backendTime = Date.now() - backendStart;
        metrics.responseTime = Date.now() - startTime;
        
        addMessage('assistant', response);
        setIsAILoading(false);
        setIsProcessing(false); // Liberar UI
        
        // Reproducción de voz en segundo plano
        if (isAudioEnabled) {
          setTimeout(async () => {
            const voiceStart = Date.now();
            await speakWithNico(response);
            metrics.voiceTime = Date.now() - voiceStart;
            setPerformanceMetrics(prev => ({ ...prev, voiceTime: metrics.voiceTime }));
          }, 0);
        }
        
        setPerformanceMetrics(metrics);
      }
      
      incrementConversationCount();
      learnFromUser(userMessage);
      
    } catch (error) {
      console.error('Error processing message:', error);
      addMessage('assistant', 'Lo siento, hubo un error procesando tu mensaje. ¿Podrías intentarlo de nuevo?');
      setIsProcessing(false);
      setIsAILoading(false);
    }
  }, [inputText, isProcessing, isAudioEnabled, memory.userName, addMessage, incrementConversationCount, learnFromUser]);

  const toggleAudio = useCallback(async () => {
    if (isAudioEnabled) {
      setIsAudioEnabled(false);
      stopNicoVoice();
    } else {
      setIsAudioEnabled(true);
      // Reproducir último mensaje en segundo plano
      if (memory.conversationHistory.length > 0) {
        const lastMessage = memory.conversationHistory[memory.conversationHistory.length - 1];
        if (lastMessage.role === 'assistant') {
          setTimeout(() => speakWithNico(lastMessage.content), 0);
        }
      }
    }
  }, [isAudioEnabled, memory.conversationHistory]);

  const handleVoiceInput = useCallback(() => {
    if (!speechStatus.supported) {
      setMicPermissionError('El reconocimiento de voz no está disponible en este navegador.');
      return;
    }
    
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }
    
    requestMicrophonePermission()
      .then(granted => {
        if (!granted) {
          setMicPermissionError('Se requiere permiso de micrófono para usar el reconocimiento de voz.');
          return;
        }
        
        const recognition = createSpeechRecognition();
        recognitionRef.current = recognition;
        
        recognition.onstart = () => {
          setIsListening(true);
          setInterimText('');
          setMicPermissionError('');
        };
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInterimText(transcript);
          
          if (event.results[0].isFinal) {
            handleSendMessage(transcript);
            setIsListening(false);
          }
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setMicPermissionError('Permiso de micrófono denegado. Por favor, habilita el micrófono en la configuración de tu navegador.');
          }
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.start();
      })
      .catch(error => {
        console.error('Microphone permission error:', error);
        setMicPermissionError('Error al solicitar permiso de micrófono.');
      });
  }, [isListening, speechStatus.supported, handleSendMessage]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleClearConversation = useCallback(() => {
    clearMemory();
    setConversationStarted(false);
    setShowClearConfirm(false);
    stopNicoVoice();
  }, [clearMemory]);

  const handleCopyMessage = useCallback((text) => {
    navigator.clipboard.writeText(text);
  }, []);

  const handlePlayMessage = useCallback(async (text, messageId) => {
    if (playingMessageId === messageId) {
      stopNicoVoice();
      setPlayingMessageId(null);
    } else {
      setPlayingMessageId(messageId);
      // Reproducir en segundo plano
      setTimeout(async () => {
        await speakWithNico(text);
        setPlayingMessageId(null);
      }, 0);
    }
  }, [playingMessageId]);

  const handleStartConversation = useCallback(() => {
    if (!conversationStarted) {
      setConversationStarted(true);
      addMessage('assistant', `¡Hola ${initialName}! Soy NICO, tu asistente virtual de EdutechLife. ¿En qué puedo ayudarte hoy? 😊`);
      
      if (isAudioEnabled) {
        speakWithNico(`¡Hola ${initialName}! Soy NICO, tu asistente virtual de EdutechLife. ¿En qué puedo ayudarte hoy?`);
      }
    }
  }, [conversationStarted, initialName, addMessage, isAudioEnabled]);

  const quickResponses = useMemo(() => [
    { text: '¿Qué es la metodología VAK?', emoji: '🧠' },
    { text: '¿Qué servicios ofrece EdutechLife?', emoji: '🎓' },
    { text: '¿Tienen clases de programación?', emoji: '💻' },
    { text: '¿Cómo me inscribo?', emoji: '📝' },
    { text: '¿Tienen prueba gratuita?', emoji: '🎁' },
  ], []);

  const renderPerformanceMetrics = useMemo(() => {
    if (performanceMetrics.responseTime === 0) return null;
    
    return (
      <div className="performance-metrics">
        <div className="metric-item">
          <Zap size={14} />
          <span>{performanceMetrics.responseTime}ms</span>
        </div>
        <div className="metric-item">
          <Database size={14} />
          <span>L{performanceMetrics.cacheLevel}</span>
        </div>
        {performanceMetrics.backendTime > 0 && (
          <div className="metric-item">
            <Cpu size={14} />
            <span>{performanceMetrics.backendTime}ms</span>
          </div>
        )}
      </div>
    );
  }, [performanceMetrics]);

  return (
    <div className="nico-chat-optimized">
      <div className="chat-header">
        <div className="header-left">
          <Brain size={24} />
          <h2>NICO - Asistente Premium</h2>
          <span className="status-badge">
            {performanceMetrics.cacheHit ? '⚡ Instantáneo' : '🔄 Procesando'}
          </span>
        </div>
        <div className="header-right">
          {renderPerformanceMetrics}
          <button
            className="audio-toggle"
            onClick={toggleAudio}
            title={isAudioEnabled ? 'Desactivar voz' : 'Activar voz'}
          >
            {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </div>
      
      <div className="chat-container" ref={messagesContainerRef}>
        {!conversationStarted ? (
          <div className="welcome-screen">
            <div className="welcome-content">
              <div className="nico-avatar">
                <Bot size={64} />
                <div className="pulse-ring"></div>
              </div>
              <h1>¡Hola {initialName}! Soy NICO</h1>
              <p className="subtitle">Tu asistente virtual de EdutechLife</p>
              <p className="description">
                Estoy aquí para ayudarte con información sobre nuestra metodología VAK, 
                programas STEM, servicios de tutoría y mucho más.
              </p>
              <button className="start-button" onClick={handleStartConversation}>
                <MessageCircle size={20} />
                Comenzar conversación
              </button>
              
              <div className="quick-questions">
                <p>Preguntas frecuentes:</p>
                <div className="quick-buttons">
                  {quickResponses.map((item, index) => (
                    <button
                      key={index}
                      className="quick-button"
                      onClick={() => handleSendMessage(item.text)}
                    >
                      <span className="emoji">{item.emoji}</span>
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="messages">
              {memory.conversationHistory.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.role}`}
                >
                  <div className="message-header">
                    <div className="message-sender">
                      {message.role === 'user' ? (
                        <>
                          <div className="user-avatar">👤</div>
                          <span>{memory.userName || 'Tú'}</span>
                        </>
                      ) : (
                        <>
                          <div className="nico-avatar-small">
                            <Bot size={16} />
                          </div>
                          <span>NICO</span>
                        </>
                      )}
                    </div>
                    <div className="message-actions">
                      {message.role === 'assistant' && (
                        <>
                          <button
                            className="action-button"
                            onClick={() => handleCopyMessage(message.content)}
                            title="Copiar"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            className="action-button"
                            onClick={() => handlePlayMessage(message.content, index)}
                            title={playingMessageId === index ? 'Detener' : 'Escuchar'}
                          >
                            {playingMessageId === index ? (
                              <Loader2 size={14} className="spinning" />
                            ) : (
                              <PlayCircle size={14} />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="message-content">
                    {message.content}
                  </div>
                </div>
              ))}
              {interimText && (
                <div className="message user interim">
                  <div className="message-header">
                    <div className="message-sender">
                      <div className="user-avatar">👤</div>
                      <span>{memory.userName || 'Tú'}</span>
                    </div>
                  </div>
                  <div className="message-content">
                    {interimText}
                    <span className="typing-cursor"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {isAILoading && (
              <div className="thinking-indicator">
                <Loader2 size={20} className="spinning" />
                <span>NICO está pensando...</span>
              </div>
            )}
            
            <div className="input-area">
              <div className="input-container">
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isProcessing ? "Procesando..." : "Escribe tu mensaje aquí..."}
                  className={isProcessing ? "processing" : ""}
                  rows={3}
                />
                <div className="input-actions">
                  <button
                    className={`voice-button ${isListening ? 'listening' : ''} ${isProcessing ? 'processing' : ''}`}
                    onClick={handleVoiceInput}
                    disabled={!speechStatus.supported}
                    title={isListening ? 'Detener grabación' : 'Hablar con voz'}
                  >
                    {isListening ? (
                      <div className="pulse-animation">
                        <MicOff size={20} />
                      </div>
                    ) : (
                      <Mic size={20} />
                    )}
                  </button>
                  <button
                    className={`send-button ${isProcessing ? 'processing' : ''}`}
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim()}
                  >
                    {isProcessing ? (
                      <Loader2 size={20} className="spinning" />
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
              </div>
              
              {micPermissionError && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{micPermissionError}</span>
                </div>
              )}
              
              <div className="quick-responses-bottom">
                {quickResponses.map((item, index) => (
                  <button
                    key={index}
                    className={`quick-response-button ${isProcessing ? 'processing' : ''}`}
                    onClick={() => handleSendMessage(item.text)}
                  >
                    <span className="emoji">{item.emoji}</span>
                    {item.text}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="chat-footer">
        <div className="footer-left">
          <span className="conversation-count">
            {memory.conversationCount} mensajes
          </span>
        </div>
        <div className="footer-right">
          {conversationStarted && (
            <button
              className="clear-button"
              onClick={() => setShowClearConfirm(true)}
            >
              <X size={16} />
              Limpiar conversación
            </button>
          )}
        </div>
      </div>
      
      {showClearConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>¿Limpiar conversación?</h3>
            <p>Se borrará todo el historial de esta conversación.</p>
            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancelar
              </button>
              <button
                className="confirm-button"
                onClick={handleClearConversation}
              >
                Sí, limpiar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .nico-chat-optimized {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: linear-gradient(135deg, #0A1A2F 0%, #1A2B3C 100%);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: rgba(10, 26, 47, 0.95);
          border-bottom: 1px solid rgba(0, 212, 170, 0.2);
          backdrop-filter: blur(10px);
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .header-left h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #FFFFFF;
        }
        
        .status-badge {
          background: linear-gradient(135deg, #00D4AA, #8A2BE2);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .performance-metrics {
          display: flex;
          gap: 8px;
          background: rgba(0, 212, 170, 0.1);
          padding: 6px 12px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 170, 0.3);
        }
        
        .metric-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #00D4AA;
          font-size: 12px;
          font-weight: 500;
        }
        
        .audio-toggle {
          background: rgba(138, 43, 226, 0.2);
          border: 1px solid rgba(138, 43, 226, 0.4);
          color: #8A2BE2;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .audio-toggle:hover {
          background: rgba(138, 43, 226, 0.3);
          transform: scale(1.05);
        }
        
        .chat-container {
          flex: 1;
          overflow: hidden;
          position: relative;
        }
        
        .welcome-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 40px;
        }
        
        .welcome-content {
          text-align: center;
          max-width: 500px;
        }
        
        .nico-avatar {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, #00D4AA, #8A2BE2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .pulse-ring {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border: 2px solid rgba(0, 212, 170, 0.3);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        .welcome-content h1 {
          margin: 0 0 8px;
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #FFFFFF, #00D4AA);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .subtitle {
          margin: 0 0 16px;
          font-size: 18px;
          color: #8A2BE2;
          font-weight: 500;
        }
        
        .description {
          margin: 0 0 32px;
          color: #94A3B8;
          line-height: 1.6;
        }
        
        .start-button {
          background: linear-gradient(135deg, #00D4AA, #8A2BE2);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
          margin-bottom: 32px;
        }
        
        .start-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 212, 170, 0.3);
        }
        
        .quick-questions p {
          margin: 0 0 12px;
          color: #94A3B8;
          font-size: 14px;
        }
        
        .quick-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .quick-button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #E2E8F0;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .quick-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(0, 212, 170, 0.3);
        }
        
        .emoji {
          font-size: 16px;
        }
        
        .messages {
          padding: 24px;
          overflow-y: auto;
          height: calc(100% - 200px);
        }
        
        .message {
          margin-bottom: 20px;
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .message.user {
          text-align: right;
        }
        
        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .message-sender {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94A3B8;
          font-size: 14px;
          font-weight: 500;
        }
        
        .user-avatar {
          width: 24px;
          height: 24px;
          background: rgba(255, 107, 107, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
        
        .nico-avatar-small {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #00D4AA, #8A2BE2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .message-actions {
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        .message:hover .message-actions {
          opacity: 1;
        }
        
        .action-button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94A3B8;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .action-button:hover {
          background: rgba(0, 212, 170, 0.1);
          border-color: rgba(0, 212, 170, 0.3);
          color: #00D4AA;
        }
        
        .message-content {
          padding: 16px;
          border-radius: 12px;
          line-height: 1.6;
          word-wrap: break-word;
        }
        
        .message.user .message-content {
          background: rgba(0, 212, 170, 0.1);
          border: 1px solid rgba(0, 212, 170, 0.2);
          color: #E2E8F0;
          margin-left: auto;
          max-width: 80%;
        }
        
        .message.assistant .message-content {
          background: rgba(138, 43, 226, 0.1);
          border: 1px solid rgba(138, 43, 226, 0.2);
          color: #E2E8F0;
          margin-right: auto;
          max-width: 80%;
        }
        
        .message.interim .message-content {
          opacity: 0.7;
        }
        
        .typing-cursor {
          display: inline-block;
          width: 8px;
          height: 16px;
          background: #00D4AA;
          margin-left: 4px;
          animation: blink 1s infinite;
          vertical-align: middle;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .thinking-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px;
          color: #8A2BE2;
          font-weight: 500;
        }
        
        .spinning {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .input-area {
          padding: 20px 24px;
          background: rgba(10, 26, 47, 0.95);
          border-top: 1px solid rgba(0, 212, 170, 0.2);
          backdrop-filter: blur(10px);
        }
        
        .input-container {
          position: relative;
          margin-bottom: 12px;
        }
        
        textarea {
          width: 100%;
          padding: 16px 60px 16px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #E2E8F0;
          font-size: 14px;
          line-height: 1.5;
          resize: none;
          transition: all 0.2s;
        }
        
        textarea:focus {
          outline: none;
          border-color: #00D4AA;
          box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
        }
        
        textarea.processing {
          opacity: 0.8;
          background: rgba(0, 212, 170, 0.05);
          border-color: rgba(0, 212, 170, 0.3);
        }
        
        .input-actions {
          position: absolute;
          right: 12px;
          bottom: 12px;
          display: flex;
          gap: 8px;
        }
        
        .voice-button {
          background: rgba(138, 43, 226, 0.2);
          border: 1px solid rgba(138, 43, 226, 0.4);
          color: #8A2BE2;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .voice-button:hover:not(:disabled) {
          background: rgba(138, 43, 226, 0.3);
          transform: scale(1.05);
        }
        
        .voice-button.processing {
          opacity: 0.7;
          background: rgba(138, 43, 226, 0.1);
        }
        
        .voice-button.listening {
          background: rgba(255, 107, 107, 0.2);
          border-color: rgba(255, 107, 107, 0.4);
          color: #FF6B6B;
          animation: pulse 1.5s infinite;
        }
        
        .send-button {
          background: linear-gradient(135deg, #00D4AA, #8A2BE2);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .send-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0, 212, 170, 0.3);
        }
        
        .send-button.processing {
          opacity: 0.8;
          background: linear-gradient(135deg, rgba(0, 212, 170, 0.7), rgba(138, 43, 226, 0.7));
        }
        
        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #FF6B6B;
          font-size: 12px;
          margin-bottom: 12px;
        }
        
        .quick-responses-bottom {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .quick-response-button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #E2E8F0;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .quick-response-button:hover:not(:disabled) {
          background: rgba(0, 212, 170, 0.1);
          border-color: rgba(0, 212, 170, 0.3);
        }
        
        .quick-response-button.processing {
          opacity: 0.7;
          background: rgba(0, 212, 170, 0.05);
        }
        
        .chat-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          background: rgba(10, 26, 47, 0.8);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .conversation-count {
          color: #94A3B8;
          font-size: 12px;
        }
        
        .clear-button {
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          color: #FF6B6B;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .clear-button:hover {
          background: rgba(255, 107, 107, 0.2);
        }
        
        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .confirm-modal {
          background: #1A2B3C;
          border-radius: 12px;
          padding: 24px;
          max-width: 400px;
          width: 90%;
          border: 1px solid rgba(0, 212, 170, 0.2);
        }
        
        .confirm-modal h3 {
          margin: 0 0 12px;
          color: #FFFFFF;
          font-size: 18px;
        }
        
        .confirm-modal p {
          margin: 0 0 24px;
          color: #94A3B8;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        
        .cancel-button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #E2E8F0;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .cancel-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .confirm-button {
          background: linear-gradient(135deg, #FF6B6B, #FF4757);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .confirm-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
        }
      `}</style>
    </div>
  );
};

export default NicoChatOptimized;