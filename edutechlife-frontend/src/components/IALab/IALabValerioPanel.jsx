import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import ValerioAvatar from '../ValerioAvatar';
import { useIALabContext } from '../../context/IALabContext';

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
        completedModules
    } = useIALabContext();

    const [valerioState, setValerioState] = useState('idle');
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [quickActions, setQuickActions] = useState([]);

    // Módulo actual
    const currentModule = modules.find(m => m.id === activeMod);
    const userLevel = completedModules.length;

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

    // Inicializar mensaje de bienvenida
    useEffect(() => {
        if (isOpen && conversation.length === 0) {
            const welcomeMessage = `¡Hola! Qué gusto tenerte por acá. Soy Valerio, tu coach, y veo que estás en el módulo "${currentModule?.title}" — ¡qué tema tan interesante!

No importa si esto es nuevo para ti, estamos en nivel ${userLevel < 3 ? 'principiante' : userLevel < 6 ? 'intermedio' : 'avanzado'}, y lo iremos descubriendo juntos.

Pregúntame lo que quieras: explicarte un tema, darte un ejemplo, ayudarte con el desafío, o simplemente conversar sobre lo que estás aprendiendo. ¿Por dónde te gustaría empezar?`;
            
            setMessage(welcomeMessage);
            setConversation([{
                id: 'welcome',
                type: 'valerio',
                content: welcomeMessage,
                timestamp: new Date().toISOString()
            }]);
            
            // Hablar el mensaje de bienvenida
            if (window.valerioSpeak) {
                window.valerioSpeak(welcomeMessage);
                setValerioState('speaking');
            }
        }
    }, [isOpen, currentModule, userLevel, conversation.length]);

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
            // Simulación de respuesta de IA (en producción se conectaría a un modelo real)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Generar respuesta basada en el contexto
            let response = '';
            
            if (inputText.toLowerCase().includes('explic') || inputText.toLowerCase().includes('qué es')) {
                const topicList = currentModule?.topics?.join(', ') || 'conceptos clave de IA';
                response = `¡Claro que sí! Vamos a verlo con calma.

Estamos en el módulo de ${currentModule?.title || 'este tema'}, donde exploramos ${topicList}. La idea es que entiendas cómo funciona cada concepto y por qué es importante, no solo que lo memorices.

Como vas en nivel ${userLevel < 3 ? 'principiante' : userLevel < 6 ? 'intermedio' : 'avanzado'}, te sugiero ${userLevel < 3 ? 'empezar por lo básico: familiarízate con los fundamentos y practica con ejemplos sencillos. No te preocupes si al principio no sale perfecto, cada intento cuenta' : userLevel < 6 ? 'profundizar en las técnicas intermedias y aplicarlas a casos reales. Ya tienes una base sólida, ahora es momento de retarte un poco más' : 'explorar las aplicaciones avanzadas. Estás en un nivel donde puedes innovar y optimizar para obtener resultados profesionales'}.

Dime, ¿hay algo en particular de este tema que te gustaría que te explique con más detalle?`;
            } else if (inputText.toLowerCase().includes('ejemplo') || inputText.toLowerCase().includes('cómo hacer')) {
                response = `Buena pregunta, me encanta que quieras ver esto en acción.

Pensemos en el desafío de este módulo: ${currentModule?.challenge || 'crear algo práctico con lo aprendido'}. Una forma de abordarlo es así:

Primero, pregúntate: ¿qué quiero lograr exactamente? Tener claro el objetivo es clave. Luego, piensa en el rol que necesitas que la IA asuma y dale contexto suficiente para que entienda tu situación.

Un ejemplo concreto sería algo como: "Actúa como experto en ${currentModule?.topics?.[0] || 'ingeniería de prompts'} y ayúdame a resolver esto. Necesito una solución paso a paso que incluya análisis, implementación y consideraciones importantes."

¿Vas viendo por dónde va la cosa? Si quieres, podemos construir un ejemplo juntos paso a paso.`;
            } else if (inputText.toLowerCase().includes('desafío') || inputText.toLowerCase().includes('retro')) {
                response = `Entiendo, los desafíos a veces pueden parecer complicados al principio, pero tranquilo, vamos por partes.

Para el desafío de ${currentModule?.challenge || 'este módulo'}, te recomiendo esta estrategia:

Primero, tómate un momento para leer bien el enunciado y entender qué se pide exactamente. Luego, divide el problema en partes más pequeñas — es más fácil resolver varios pasos pequeños que uno gigante.

${userLevel < 3 ? 'Enfócate en comprender los conceptos básicos antes de intentar resolverlo todo. No hay prisa' : userLevel < 6 ? 'Prueba diferentes enfoques y compara resultados. La experimentación es tu mejor herramienta' : 'Busca optimizar no solo la solución sino también tu proceso. Piensa en escalabilidad y eficiencia'}.

Y recuerda: el objetivo real es aprender en el camino, no solo llegar al final. Cada intento, incluso si no sale perfecto, te está enseñando algo valioso. Cuéntame cómo te va y si te atascas en algún punto, aquí estoy.`;
            } else {
                response = `Entiendo tu pregunta sobre "${inputText}". Déjame pensar cómo puedo ayudarte mejor con eso.

Considerando que estás en ${currentModule?.title || 'este módulo'}, te sugiero que revises el material que ya tienes disponible, porque allí encuentras las bases para responder tu duda. Luego, practica con ejemplos relacionados — la práctica es la que realmente fija los conceptos.

Y si quieres, también puedes consultar con la comunidad del foro, a veces una perspectiva diferente es justo lo que necesitas.

¿Te gustaría que te explique algún concepto en particular o prefieres un ejemplo práctico relacionado con tu pregunta? Lo que más te sirva, aquí estoy para eso.`;
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
            if (window.valerioSpeak) {
                window.valerioSpeak(response);
                setValerioState('speaking');
            }

        } catch (error) {
            console.error('Error processing user input:', error);
            
            const errorMessage = {
                id: `error_${Date.now()}`,
                type: 'valerio',
                content: 'Lo siento, hubo un error procesando tu pregunta. Por favor, intenta nuevamente.',
                timestamp: new Date().toISOString()
            };
            
            setConversation(prev => [...prev, errorMessage]);
            setMessage('Lo siento, hubo un error procesando tu pregunta. Por favor, intenta nuevamente.');
        } finally {
            setIsProcessing(false);
            setTimeout(() => {
                if (valerioState === 'speaking') {
                    setValerioState('idle');
                }
            }, 3000);
        }
    }, [currentModule, userLevel, isProcessing, valerioState]);

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
                            onClick={onClose}
                            className="text-white hover:text-slate-200 transition-colors"
                            aria-label="Cerrar panel"
                        >
                            <Icon name="fa-times" className="text-xl" />
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