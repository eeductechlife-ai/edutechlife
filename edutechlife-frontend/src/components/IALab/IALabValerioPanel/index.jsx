import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useIALabProgressContext, useIALabUIContext } from '../../../context/IALabContext';
import { useIALabStore } from '../../../store/ialabStore';
import { speakTextConversational, stopSpeech } from '../../../utils/speech';
import { callDeepseek } from '../../../utils/api';
import COURSE_KNOWLEDGE from '../constants/courseKnowledge';
import useFocusTrap from '../../../hooks/useFocusTrap';
import { useValerioVoice } from './useValerioVoice';
import ValerioPanelHeader from './ValerioPanelHeader';
import ValerioQuickActions from './ValerioQuickActions';
import ValerioConversationArea from './ValerioConversationArea';
import ValerioChatInput from './ValerioChatInput';

const VALERIO_MEMORY_KEY = 'ialab_valerio_conversation';

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

const IALabValerioPanel = ({ isOpen, onClose }) => {
  const {
    activeMod, modules, completedModules
  } = useIALabProgressContext();

  const { user } = useIALabUIContext();

  const [valerioState, setValerioState] = useState('idle');
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState(() => {
    try {
      const saved = localStorage.getItem(VALERIO_MEMORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [quickActions, setQuickActions] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const welcomeSpokenRef = useRef(false);

  const studentName = user?.firstName || user?.full_name || '';
  const currentModule = modules.find(m => m.id === activeMod);
  const userLevel = completedModules.length;

  const voice = useValerioVoice(isOpen, setUserInput);

  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      setValerioState('idle');
    }
    return () => {
      stopSpeech();
    };
  }, [isOpen]);

  useEffect(() => {
    try { localStorage.setItem(VALERIO_MEMORY_KEY, JSON.stringify(conversation)); }
    catch { /* ignore */ }
  }, [conversation]);

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

  const buildValerioSystemPrompt = () => {
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

  useEffect(() => {
    if (isOpen && !welcomeSpokenRef.current) {
      welcomeSpokenRef.current = true;
      const alreadyWelcomed = useIALabStore.getState().getValerioWelcomed();

      if (!alreadyWelcomed) {
        useIALabStore.getState().setValerioWelcomed();
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

  const processUserInput = useCallback(async (inputText) => {
    if (!inputText.trim() || isProcessing) return;

    setIsProcessing(true);
    setValerioState('thinking');

    const userMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputText,
      timestamp: new Date().toISOString()
    };

    setConversation(prev => [...prev, userMessage]);
    setUserInput('');

    try {
      const systemPrompt = buildValerioSystemPrompt();
      const response = await Promise.race([
        callDeepseek(inputText, systemPrompt, false),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 10000)
        )
      ]);

      if (!response || response.length < 10) {
        throw new Error('Respuesta vacía o muy corta');
      }

      const valerioMessage = {
        id: `valerio_${Date.now()}`,
        type: 'valerio',
        content: response,
        timestamp: new Date().toISOString()
      };

      setConversation(prev => [...prev, valerioMessage]);
      setMessage(response);

      setValerioState('speaking');
      speakTextConversational(response, 'valerio', () => setValerioState('idle'));
    } catch (error) {
      console.warn('⚠️ API DeepSeek no disponible, usando respuesta local:', error.message);
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

  const handleQuickAction = (action) => {
    processUserInput(action.prompt);
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      processUserInput(userInput);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearConversation = () => {
    setShowClearConfirm(true);
  };

  const confirmClearConversation = () => {
    setConversation([]);
    setMessage('');
    setShowClearConfirm(false);
    try { localStorage.removeItem(VALERIO_MEMORY_KEY); } catch { /* ignore */ }
  };

  const cancelClearConversation = () => {
    setShowClearConfirm(false);
  };

  const focusTrapRef = useFocusTrap(isOpen);

  if (!isOpen) return null;

  return (
    <div ref={focusTrapRef} className="fixed inset-0 z-[90] flex items-end justify-end" role="dialog" aria-modal="true" aria-label="Panel de coach IA Valerio">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Cerrar panel"
      />

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.4 }}
        onDragEnd={(_, info) => { if (info.offset.y > 80) onClose(); }}
        className="relative w-full max-w-md h-[90vh] landscape:md:h-dvh bg-white rounded-t-2xl shadow-2xl flex flex-col z-10"
        role="document"
        style={{ willChange: 'transform' }}
      >
        <ValerioPanelHeader
          valerioState={valerioState}
          setValerioState={setValerioState}
          currentModule={currentModule}
          userLevel={userLevel}
          onClose={onClose}
        />

        <div className="flex-1 overflow-hidden flex flex-col">
          <ValerioQuickActions
            quickActions={quickActions}
            onAction={handleQuickAction}
            disabled={isProcessing}
          />

          <ValerioConversationArea
            conversation={conversation}
            isProcessing={isProcessing}
            moduleTitle={currentModule?.title}
          />

          <ValerioChatInput
            userInput={userInput}
            onInputChange={setUserInput}
            onKeyDown={handleKeyDown}
            onSend={handleSendMessage}
            onClear={handleClearConversation}
            onVoiceToggle={voice.toggleVoice}
            isProcessing={isProcessing}
            isListening={voice.isListening}
            speechSupported={voice.speechSupported}
            speechError={voice.speechError}
            showClearConfirm={showClearConfirm}
            onConfirmClear={confirmClearConversation}
            onCancelClear={cancelClearConversation}
            conversationLength={conversation.length}
            moduleTitle={currentModule?.title}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default IALabValerioPanel;
