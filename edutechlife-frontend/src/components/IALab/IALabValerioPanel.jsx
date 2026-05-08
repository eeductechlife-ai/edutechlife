import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import ValerioAvatar from '../ValerioAvatar';
import { useIALabContext } from '../../context/IALabContext';
import { speakTextConversational, stopSpeech } from '../../utils/speech';
import { callDeepseek } from '../../utils/api';
import COURSE_KNOWLEDGE from './constants/courseKnowledge';

/**
 * Componente premium para panel de coach IA Valerio
 * Sistema de asistencia inteligente con voz y animaciones
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado de apertura del panel
 * @param {Function} props.onClose - Handler para cerrar panel
 */
const IALabValerioPanel = ({ isOpen, onClose }) => {
    const { 
        activeMod, 
        modules,
        userProgress,
        completedModules,
        user
    } = useIALabContext();

    const [valerioState, setValerioState] = useState('idle');
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(true);
    const [speechError, setSpeechError] = useState('');
    const [quickActions, setQuickActions] = useState([]);
    const welcomeSpokenRef = useRef(false);
    const userCancelRef = useRef(false);
    const recognitionRef = useRef(null);
    const accumulatedRef = useRef('');
    const studentName = user?.firstName || user?.full_name || '';

    // Módulo actual
    const currentModule = modules.find(m => m.id === activeMod);
    const userLevel = completedModules.length;

    // Detener audio cuando se cierra el panel
    useEffect(() => {
        if (!isOpen) {
            stopSpeech();
            setValerioState('idle');
        }
        return () => {
            stopSpeech();
        };
    }, [isOpen]);

    // Detectar soporte de reconocimiento de voz al montar
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const hasAPI = !!window.SpeechRecognition || !!window.webkitSpeechRecognition;
        setSpeechSupported(hasAPI);
        if (!hasAPI) {
            setSpeechError('Tu navegador no soporta reconocimiento de voz');
        }
    }, []);

    // Inicializar acciones rápidas basadas en contexto
    useEffect(() => {
        const actions = [
            {
                id: 'explain_topic',
                label: 'Explicar tema actual',
                icon: 'fa-book',
                prompt: `Explica el tema principal del módulo "${currentModule?.title}" de manera clara y concisa.`
            },
            {
                id: 'give_example',
                label: 'Dar ejemplo práctico',
                icon: 'fa-lightbulb',
                prompt: `Proporciona un ejemplo práctico relacionado con "${currentModule?.challenge || 'ingeniería de prompts'}".`
            },
            {
                id: 'help_challenge',
                label: 'Ayuda con desafío',
                icon: 'fa-puzzle-piece',
                prompt: `¿Cómo puedo abordar el desafío "${currentModule?.challenge}" de manera efectiva?`
            },
            {
                id: 'study_tips',
                label: 'Consejos de estudio',
                icon: 'fa-graduation-cap',
                prompt: `Dame consejos de estudio para el módulo "${currentModule?.title}" (nivel ${userLevel < 3 ? 'principiante' : userLevel < 6 ? 'intermedio' : 'avanzado'}).`
            }
        ];
        setQuickActions(actions);
    }, [currentModule, userLevel]);

    // Prompt base de Valerio (identidad y personalidad)
    const PROMPT_VALERIO_DOCENTE = `Eres Valerio, el coach de IA de Edutechlife. 

IDENTIDAD:
- Eres un Psicólogo Experto en Metodología VAK del programa Edutechlife
- Tienes más de 10 años de experiencia con estudiantes 
- Eres un experto en coaching educativo con IA
- Voz: Español colombiano, cálido y cercano

PERSONALIDAD:
- Cálido, cercano y motivador como un entrenador personal
- Explica conceptos complejos de manera simple y con ejemplos prácticos
- Detecta el estado emocional del estudiante y adapta tu respuesta
- Usa un lenguaje claro, positivo y constructivo
- Siempre relaciona tus respuestas con el contenido del curso IALab

INSTRUCCIONES:
1. Responde usando el contenido del módulo que te proporciono abajo como contexto
2. Sé específico: menciona nombres de temas, videos y recursos disponibles
3. Si preguntan sobre un tema, explícalo usando los conceptos del módulo
4. Recomienda videos, PDFs u OVAs específicos del módulo según la duda
5. Si no sabes algo, dilo honestamente y sugiere revisar el material
6. Responde en español, máximo 3 párrafos
7. Sé cálido y motivador, como un coach personal
8. Usa el nombre del estudiante de forma natural y esporádica. No lo repitas en cada respuesta ni de forma forzada. Úsalo como lo haría un coach real: para dar apertura, reconocer un logro, o generar cercanía cuando sea pertinente.`;

    const buildValerioSystemPrompt = () => {
        // Solo incluir el contenido del módulo actual (no los 5 módulos)
        const currentModuleId = currentModule?.id || 1;
        const currentModuleData = COURSE_KNOWLEDGE.find(m => m.id === currentModuleId);
        
        const moduleContent = currentModuleData 
            ? JSON.stringify(currentModuleData, null, 2)
            : 'No hay información del módulo disponible.';
        
        return `${PROMPT_VALERIO_DOCENTE}

## MÓDULO ACTUAL DEL ESTUDIANTE:
${moduleContent}

## CONTEXTO DEL ESTUDIANTE:
Nombre: ${studentName || 'Estudiante'}
Nivel: ${userLevel < 3 ? 'Principiante' : userLevel < 6 ? 'Intermedio' : 'Avanzado'}
Módulos completados: ${completedModules.length}`;
    };

    // Generar respuesta mock de respaldo (cuando la API no está disponible)
    const generateFallbackResponse = (inputText) => {
        const text = inputText.toLowerCase();
        
        if (text.includes('explic') || text.includes('qué es')) {
            const topicList = currentModule?.topics?.join(', ') || 'conceptos clave de IA';
            return `¡Claro que sí! Vamos a verlo con calma.

Estamos en el módulo de ${currentModule?.title || 'este tema'}, donde exploramos ${topicList}. La idea es que entiendas cómo funciona cada concepto y por qué es importante, no solo que lo memorices.

Como vas en nivel ${userLevel < 3 ? 'principiante' : userLevel < 6 ? 'intermedio' : 'avanzado'}, te sugiero ${userLevel < 3 ? 'empezar por lo básico: familiarízate con los fundamentos y practica con ejemplos sencillos' : userLevel < 6 ? 'profundizar en las técnicas intermedias y aplicarlas a casos reales' : 'explorar las aplicaciones avanzadas. Estás en un nivel donde puedes innovar y optimizar'}.

Dime, ¿hay algo en particular de este tema que te gustaría que te explique con más detalle?`;
        }
        
        if (text.includes('ejemplo') || text.includes('cómo hacer')) {
            return `Buena pregunta, me encanta que quieras ver esto en acción.

Pensemos en el desafío de este módulo: ${currentModule?.challenge || 'crear algo práctico con lo aprendido'}. Una forma de abordarlo es así:

Primero, pregúntate: ¿qué quiero lograr exactamente? Tener claro el objetivo es clave. Luego, piensa en el rol que necesitas que la IA asuma y dale contexto suficiente para que entienda tu situación.

¿Vas viendo por dónde va la cosa? Si quieres, podemos construir un ejemplo juntos paso a paso.`;
        }

        return `Entiendo tu pregunta sobre "${inputText}". Déjame pensar cómo puedo ayudarte mejor con eso.

Considerando que estás en ${currentModule?.title || 'este módulo'}, te sugiero que revises el material que ya tienes disponible, porque allí encuentras las bases para responder tu duda. Luego, practica con ejemplos relacionados — la práctica es la que realmente fija los conceptos.

¿Te gustaría que te explique algún concepto en particular o prefieres un ejemplo práctico relacionado con tu pregunta? Lo que más te sirva, aquí estoy para eso.`;
    };

    // Inicializar mensaje de bienvenida (solo primera vez en la cuenta)
    useEffect(() => {
        if (isOpen && !welcomeSpokenRef.current) {
            welcomeSpokenRef.current = true;

            const WELCOME_KEY = 'ialab_valerio_welcomed';
            const alreadyWelcomed = localStorage.getItem(WELCOME_KEY);

            if (!alreadyWelcomed) {
                localStorage.setItem(WELCOME_KEY, 'true');

                const welcomeMessage = `¡Hola${studentName ? ', ' + studentName : ''}! Qué gusto tenerte por acá. Soy Valerio, tu coach, y veo que estás en el módulo "${currentModule?.title}" — ¡qué tema tan interesante!

No importa si esto es nuevo para ti, estamos en nivel ${userLevel < 3 ? 'principiante' : userLevel < 6 ? 'intermedio' : 'avanzado'}, y lo iremos descubriendo juntos.

Pregúntame lo que quieras: explicarte un tema, darte un ejemplo, ayudarte con el desafío, o simplemente conversar sobre lo que estás aprendiendo. ¿Por dónde te gustaría empezar?`;
            
                setMessage(welcomeMessage);
                setConversation([{
                    id: 'welcome',
                    type: 'valerio',
                    content: welcomeMessage,
                    timestamp: new Date().toISOString()
                }]);
                
                setValerioState('speaking');
                speakTextConversational(welcomeMessage, 'valerio', () => {
                    setValerioState('idle');
                });
            } else {
                const shortGreeting = userLevel < 3 ? 'Listo, ¿en qué te ayudo?' : 'Aquí estoy, ¿qué necesitas?';
                setValerioState('speaking');
                speakTextConversational(shortGreeting, 'valerio', () => setValerioState('idle'));
            }
        }
    }, [isOpen]);

    // Procesar entrada del usuario
    const processUserInput = useCallback(async (inputText) => {
        if (!inputText.trim() || isProcessing) return;

        setIsProcessing(true);
        setValerioState('thinking');
        
        // Agregar mensaje del usuario a la conversación
        const userMessage = {
            id: `user_${Date.now()}`,
            type: 'user',
            content: inputText,
            timestamp: new Date().toISOString()
        };
        
        setConversation(prev => [...prev, userMessage]);
        setUserInput('');

        try {
            // Construir prompt del sistema con contexto del curso
            const systemPrompt = buildValerioSystemPrompt();

            // Llamar a DeepSeek con timeout de 10 segundos
            const response = await Promise.race([
                callDeepseek(inputText, systemPrompt, false),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('timeout')), 10000)
                )
            ]);

            // Validar respuesta
            if (!response || response.length < 10) {
                throw new Error('Respuesta vacía o muy corta');
            }

            // Agregar respuesta a la conversación
            const valerioMessage = {
                id: `valerio_${Date.now()}`,
                type: 'valerio',
                content: response,
                timestamp: new Date().toISOString()
            };
            
            setConversation(prev => [...prev, valerioMessage]);
            setMessage(response);
            
            // Hablar la respuesta
            setValerioState('speaking');
            speakTextConversational(response, 'valerio', () => setValerioState('idle'));

        } catch (error) {
            console.warn('⚠️ API DeepSeek no disponible, usando respuesta local:', error.message);
            
            // Fallback: generar respuesta local
            const fallbackResponse = generateFallbackResponse(inputText);
            
            const valerioMessage = {
                id: `valerio_${Date.now()}`,
                type: 'valerio',
                content: fallbackResponse,
                timestamp: new Date().toISOString()
            };
            
            setConversation(prev => [...prev, valerioMessage]);
            setMessage(fallbackResponse);
            
            setValerioState('speaking');
            speakTextConversational(fallbackResponse, 'valerio', () => setValerioState('idle'));
        } finally {
            setIsProcessing(false);
        }
    }, [currentModule, userLevel, isProcessing]);

    // Handler para acción rápida
    const handleQuickAction = (action) => {
        processUserInput(action.prompt);
    };

    // Handler para enviar mensaje
    const handleSendMessage = () => {
        if (userInput.trim()) {
            processUserInput(userInput);
        }
    };

    // Handler para teclado (Enter para enviar)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Handler para entrada por voz (implementación directa, sin depender de speech.js)
    const handleVoiceInput = () => {
        if (isListening) {
            userCancelRef.current = true;
            if (recognitionRef.current) {
                try { recognitionRef.current.abort(); } catch (e) {}
                try { recognitionRef.current.stop(); } catch (e) {}
                recognitionRef.current = null;
            }
            setIsListening(false);
            setSpeechError('');
            return;
        }

        setSpeechError('');
        userCancelRef.current = false;
        accumulatedRef.current = userInput;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSpeechError('Tu navegador no soporta reconocimiento de voz');
            setSpeechSupported(false);
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognition.lang = 'es-CO';
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                setIsListening(true);
                setSpeechError('');
            };

            recognition.onresult = (event) => {
                let newText = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    newText += event.results[i][0].transcript;
                }
                const combined = (accumulatedRef.current + ' ' + newText).trim();
                setUserInput(combined);
            };

            recognition.onend = () => {
                setIsListening(false);
                recognitionRef.current = null;
            };

            recognition.onerror = (event) => {
                if (event.error === 'not-allowed') {
                    const isHTTP = window.location.protocol !== 'https:';
                    if (isHTTP) {
                        setSpeechError('Se requiere una conexión segura (HTTPS) para usar el micrófono. Activa SSL en edutechlife.co');
                    } else {
                        setSpeechError('Permiso de micrófono denegado. Permite el acceso en la configuración del navegador.');
                    }
                    setIsListening(false);
                    recognitionRef.current = null;
                } else if (event.error === 'no-speech') {
                    if (!userCancelRef.current) {
                        setTimeout(() => {
                            if (!userCancelRef.current) {
                                try {
                                    const r = new SpeechRecognition();
                                    r.lang = 'es-CO';
                                    r.continuous = true;
                                    r.interimResults = true;
                                    r.maxAlternatives = 1;
                                    r.onstart = recognition.onstart;
                                    r.onresult = recognition.onresult;
                                    r.onend = recognition.onend;
                                    r.onerror = recognition.onerror;
                                    r.start();
                                    recognitionRef.current = r;
                                } catch (e) {
                                    setIsListening(false);
                                    recognitionRef.current = null;
                                }
                            }
                        }, 100);
                    }
                } else if (event.error === 'aborted') {
                } else {
                    setSpeechError('Error: ' + event.error);
                    setIsListening(false);
                    recognitionRef.current = null;
                }
            };

            recognition.start();
            recognitionRef.current = recognition;
        } catch (e) {
            setSpeechError('Error al iniciar reconocimiento: ' + e.message);
            setIsListening(false);
        }
    };

    // Limpiar reconocimiento al cerrar
    useEffect(() => {
        if (!isOpen && recognitionRef.current) {
            try { recognitionRef.current.abort(); } catch (e) {}
            try { recognitionRef.current.stop(); } catch (e) {}
            recognitionRef.current = null;
            setIsListening(false);
        }
    }, [isOpen]);

    // Limpiar conversación
    const handleClearConversation = () => {
        if (confirm('¿Estás seguro de que quieres limpiar la conversación?')) {
            setConversation([]);
            setMessage('');
        }
    };

    // Render mensaje de conversación
    const renderMessage = (msg) => {
        const isUser = msg.type === 'user';
        const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
            <div
                key={msg.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
                <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                        isUser
                            ? 'bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white'
                            : 'bg-white border border-slate-200 shadow-sm'
                    }`}
                >
                    <div className="flex items-start gap-3">
                        {!isUser && (
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#004B63] to-[#00BCD4] flex items-center justify-center text-white text-xs font-bold">
                                    V
                                </div>
                            </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium opacity-80">
                                    {isUser ? 'Tú' : 'Valerio'}
                                </span>
                                <span className="text-xs opacity-60">{time}</span>
                            </div>
                            
                            <div className={`prose prose-sm max-w-none ${
                                isUser ? 'text-white' : 'text-[#00374A]'
                            }`}>
                                {msg.content.split('\n').map((line, i) => (
                                    <p key={i} className="mb-2 last:mb-0">
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </div>
                        
                        {isUser && (
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold">
                                    Tú
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-end justify-end">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Panel principal */}
            <div className="relative w-full max-w-md h-[90vh] bg-white rounded-t-2xl shadow-2xl flex flex-col z-10">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <ValerioAvatar 
                                state={valerioState}
                                size={48}
                                onStateChange={setValerioState}
                            />
                            <div>
                                <h2 className="text-xl font-bold">Valerio - Coach de IA</h2>
                                <p className="text-sm opacity-90">
                                    Módulo: {currentModule?.title}
                                </p>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => { stopSpeech(); onClose(); }}
                            className="text-white hover:text-slate-200 transition-colors p-2 rounded-lg hover:bg-white/10"
                            aria-label="Cerrar panel"
                        >
                            <Icon name="fa-xmark" className="text-xl" />
                        </button>
                    </div>
                    
                    {/* Estado actual */}
                    <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                                valerioState === 'idle' ? 'bg-emerald-400' :
                                valerioState === 'thinking' ? 'bg-purple-400' :
                                valerioState === 'speaking' ? 'bg-cyan-400' :
                                'bg-blue-400'
                            }`} />
                            <span>
                                {valerioState === 'idle' ? 'Listo para ayudarte' :
                                 valerioState === 'thinking' ? 'Pensando...' :
                                 valerioState === 'speaking' ? 'Hablando...' :
                                 'Escuchando...'}
                            </span>
                        </div>
                        <div className="h-4 w-px bg-white/30" />
                        <div className="flex items-center gap-2">
                            <Icon name="fa-layer-group" className="text-xs" />
                            <span>Nivel {userLevel < 3 ? 'Principiante' : userLevel < 6 ? 'Intermedio' : 'Avanzado'}</span>
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    {/* Acciones rápidas */}
                    <div className="p-4 border-b border-slate-100">
                        <h3 className="text-sm font-medium text-slate-600 mb-3">Acciones rápidas</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {quickActions.map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => handleQuickAction(action)}
                                    disabled={isProcessing}
                                    className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm text-slate-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Icon name={action.icon} className="text-[#00BCD4]" />
                                    <span className="text-left">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Área de conversación */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {conversation.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-center p-8">
                                <div>
                                    <div className="w-16 h-16 bg-gradient-to-r from-[#004B63]/10 to-[#00BCD4]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Icon name="fa-comments" className="text-[#00BCD4] text-2xl" />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#00374A] mb-2">
                                        ¡Hablemos sobre {currentModule?.title}!
                                    </h3>
                                    <p className="text-slate-600">
                                        Pregúntame lo que necesites sobre el módulo actual o selecciona una acción rápida.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {conversation.map(renderMessage)}
                                
                                {isProcessing && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-slate-200 rounded-2xl p-4 max-w-[80%]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#004B63] to-[#00BCD4] flex items-center justify-center text-white text-xs font-bold">
                                                    V
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Input de mensaje */}
                    <div className="border-t border-slate-200 p-4">
                        <div className="flex items-end gap-3">
                            <div className="flex-1">
                                <textarea
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={`Pregunta a Valerio sobre ${currentModule?.title}...`}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent text-[#00374A] placeholder-slate-400 resize-none min-h-[60px] max-h-[120px]"
                                    disabled={isProcessing}
                                    rows={2}
                                />
                                <div className="flex items-center justify-between mt-2">
                                    <div className="text-xs text-slate-500">
                                        Presiona Enter para enviar, Shift+Enter para nueva línea
                                    </div>
                                    <button
                                        onClick={handleClearConversation}
                                        className="text-xs text-slate-500 hover:text-red-500 transition-colors"
                                        disabled={conversation.length === 0}
                                    >
                                        <Icon name="fa-trash" className="mr-1" /> Limpiar
                                    </button>
                                 </div>
                             </div>
                             
                             {speechError && (
                                 <div className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                     <Icon name="fa-triangle-exclamation" className="text-xs" />
                                     {speechError}
                                 </div>
                             )}
                             
                             {speechSupported && (
                             <button
                                 onClick={handleVoiceInput}
                                 disabled={isProcessing}
                                 className={`w-10 h-10 rounded-xl transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                                     isListening
                                         ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse'
                                         : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-[#004B63]'
                                 }`}
                                 aria-label={isListening ? 'Detener grabación' : 'Preguntar por voz'}
                                 title={isListening ? 'Detener grabación' : 'Preguntar por voz'}
                             >
                                 <Icon name={isListening ? "fa-microphone-slash" : "fa-microphone"} className="text-sm" />
                             </button>
                             )}
                            
                            <button
                                onClick={handleSendMessage}
                                disabled={isProcessing || !userInput.trim()}
                                className="w-12 h-12 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white rounded-xl hover:shadow-[0_0_15px_rgba(0,188,212,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                aria-label="Enviar mensaje"
                            >
                                {isProcessing ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Icon name="fa-paper-plane" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IALabValerioPanel;