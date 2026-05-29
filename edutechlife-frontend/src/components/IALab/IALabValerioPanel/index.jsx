import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useIALabProgressContext, useIALabUIContext } from '../../../context/IALabContext';
import { useIALabStore } from '../../../store/ialabStore';
import { speakTextConversational, stopSpeech } from '../../../utils/speech';
import { callDeepseek } from '../../../utils/api';
import COURSE_KNOWLEDGE from '../constants/courseKnowledge';
import useFocusTrap from '../../../hooks/useFocusTrap';
import { useValerioVoice } from './useValerioVoice';
import { useTranslation } from '../../../i18n/I18nProvider';
import ValerioPanelHeader from './ValerioPanelHeader';
import ValerioQuickActions from './ValerioQuickActions';
import ValerioConversationArea from './ValerioConversationArea';
import ValerioChatInput from './ValerioChatInput';

const VALERIO_MEMORY_KEY = 'ialab_valerio_conversation';

const PROMPT_VALERIO_DOCENTE_ES = `Eres Valerio, el coach de IA de Edutechlife.

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

const PROMPT_VALERIO_DOCENTE_EN = `You are Valerio, the AI coach from Edutechlife.

IDENTITY:
- You are an Expert Psychologist in VAK Methodology from the Edutechlife program
- You have over 10 years of experience with students
- You are an expert in educational coaching with AI

PERSONALITY:
- Warm, approachable and motivating like a personal trainer
- Explain complex concepts simply with practical examples
- Detect the student's emotional state and adapt your response
- Use clear, positive and constructive language
- Always relate your answers to the IALab course content

INSTRUCTIONS:
1. Answer using the module content provided below as context
2. Be specific: mention topic names, videos and available resources
3. If asked about a topic, explain it using the module concepts
4. Recommend specific videos, PDFs or OVAs from the module based on the question
5. If you don't know something, say so honestly and suggest reviewing the material
6. Respond in English, maximum 3 paragraphs
7. Be warm and motivating, like a personal coach
8. Use the student's name naturally and sparingly. Do not repeat it in every answer or force it. Use it as a real coach would: to open a conversation, acknowledge an achievement, or create rapport when appropriate.`;

const IALabValerioPanel = ({ isOpen, onClose }) => {
  const { t, locale } = useTranslation();
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

  const voice = useValerioVoice(isOpen, setUserInput, locale);

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
    const isEn = locale === 'en';
    const actions = [
      {
        id: 'explain_topic',
        label: t('ialab.valerio.quick_explain_topic'),
        icon: 'fa-book',
        prompt: isEn ? `Explain the main topic of the "${currentModule?.title}" module clearly and concisely.` : `Explica el tema principal del módulo "${currentModule?.title}" de manera clara y concisa.`
      },
      {
        id: 'give_example',
        label: t('ialab.valerio.quick_give_example'),
        icon: 'fa-lightbulb',
        prompt: isEn ? `Provide a practical example related to "${currentModule?.challenge || 'prompt engineering'}".` : `Proporciona un ejemplo práctico relacionado con "${currentModule?.challenge || 'ingeniería de prompts'}".`
      },
      {
        id: 'help_challenge',
        label: t('ialab.valerio.quick_help_challenge'),
        icon: 'fa-puzzle-piece',
        prompt: isEn ? `How can I effectively approach the "${currentModule?.challenge}" challenge?` : `¿Cómo puedo abordar el desafío "${currentModule?.challenge}" de manera efectiva?`
      },
      {
        id: 'study_tips',
        label: t('ialab.valerio.quick_study_tips'),
        icon: 'fa-graduation-cap',
        prompt: isEn ? `Give me study tips for the "${currentModule?.title}" module (level ${userLevel < 3 ? 'beginner' : userLevel < 6 ? 'intermediate' : 'advanced'}).` : `Dame consejos de estudio para el módulo "${currentModule?.title}" (nivel ${userLevel < 3 ? 'principiante' : userLevel < 6 ? 'intermedio' : 'avanzado'}).`
      }
    ];
    setQuickActions(actions);
  }, [currentModule, userLevel, locale]);

  const buildValerioSystemPrompt = () => {
    const isEn = locale === 'en';
    const currentModuleId = currentModule?.id || 1;
    const currentModuleData = COURSE_KNOWLEDGE.find(m => m.id === currentModuleId);
    const moduleContent = currentModuleData
      ? JSON.stringify(currentModuleData, null, 2)
      : isEn ? 'No module information available.' : 'No hay información del módulo disponible.';

    const prompt = isEn ? PROMPT_VALERIO_DOCENTE_EN : PROMPT_VALERIO_DOCENTE_ES;

    return `${prompt}

## ${isEn ? 'CURRENT STUDENT MODULE' : 'MÓDULO ACTUAL DEL ESTUDIANTE'}:
${moduleContent}

## ${isEn ? 'STUDENT CONTEXT' : 'CONTEXTO DEL ESTUDIANTE'}:
${isEn ? 'Name' : 'Nombre'}: ${studentName || (isEn ? 'Student' : 'Estudiante')}
${isEn ? 'Level' : 'Nivel'}: ${userLevel < 3 ? (isEn ? 'Beginner' : 'Principiante') : userLevel < 6 ? (isEn ? 'Intermediate' : 'Intermedio') : (isEn ? 'Advanced' : 'Avanzado')}
${isEn ? 'Completed modules' : 'Módulos completados'}: ${completedModules.length}`;
  };

  const generateFallbackResponse = (inputText, locale) => {
    const isEn = locale === 'en';
    const text = inputText.toLowerCase();

    if (text.includes('explic') || text.includes('qu') || text.includes('what') || text.includes('explain') || text.includes('how')) {
      const topicList = currentModule?.topics?.join(', ') || (isEn ? 'key AI concepts' : 'conceptos clave de IA');
      if (isEn) {
        return `Of course! Let's take it step by step.

We are in the ${currentModule?.title || 'this topic'} module, where we explore ${topicList}. The idea is to understand how each concept works and why it matters, not just memorize it.

Since you are at ${userLevel < 3 ? 'beginner' : userLevel < 6 ? 'intermediate' : 'advanced'} level, I suggest you ${userLevel < 3 ? 'start with the basics: get familiar with the fundamentals and practice with simple examples' : userLevel < 6 ? 'dive deeper into intermediate techniques and apply them to real cases' : 'explore advanced applications. You are at a level where you can innovate and optimize'}.

Tell me, is there anything specific about this topic you would like me to explain in more detail?`;
      }
      return `¡Claro que sí! Vamos a verlo con calma.

Estamos en el módulo de ${currentModule?.title || 'este tema'}, donde exploramos ${topicList}. La idea es que entiendas cómo funciona cada concepto y por qué es importante, no solo que lo memorices.

Como vas en nivel ${userLevel < 3 ? 'principiante' : userLevel < 6 ? 'intermedio' : 'avanzado'}, te sugiero ${userLevel < 3 ? 'empezar por lo básico: familiarízate con los fundamentos y practica con ejemplos sencillos' : userLevel < 6 ? 'profundizar en las técnicas intermedias y aplicarlas a casos reales' : 'explorar las aplicaciones avanzadas. Estás en un nivel donde puedes innovar y optimizar'}.

Dime, ¿hay algo en particular de este tema que te gustaría que te explique con más detalle?`;
    }

    if (text.includes('ejemplo') || text.includes('example') || text.includes('cómo') || text.includes('how to')) {
      if (isEn) {
        return `Great question, I love that you want to see this in action.

Let's think about this module's challenge: ${currentModule?.challenge || 'creating something practical with what you have learned'}. One way to approach it is:

First, ask yourself: what exactly do I want to achieve? Having a clear goal is key. Then, think about the role you need the AI to take on and give it enough context to understand your situation.

Are you seeing where this is going? If you want, we can build an example together step by step.`;
      }
      return `Buena pregunta, me encanta que quieras ver esto en acción.

Pensemos en el desafío de este módulo: ${currentModule?.challenge || 'crear algo práctico con lo aprendido'}. Una forma de abordarlo es así:

Primero, pregúntate: ¿qué quiero lograr exactamente? Tener claro el objetivo es clave. Luego, piensa en el rol que necesitas que la IA asuma y dale contexto suficiente para que entienda tu situación.

¿Vas viendo por dónde va la cosa? Si quieres, podemos construir un ejemplo juntos paso a paso.`;
    }

    if (isEn) {
      return `I understand your question about "${inputText}". Let me think about how I can best help you with that.

Considering you are in ${currentModule?.title || 'this module'}, I suggest you review the material you already have available, as it contains the foundations to answer your question. Then, practice with related examples — practice is what really solidifies concepts.

Would you like me to explain a specific concept or would you prefer a practical example related to your question? Whatever works best for you, I am here for that.`;
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
        const welcomeMessage = locale === 'en'
          ? `Hello${studentName ? ', ' + studentName : ''}! Great to have you here. I am Valerio, your coach, and I see you are in the "${currentModule?.title}" module — what an interesting topic!

No matter if this is new to you, you are at ${userLevel < 3 ? 'beginner' : userLevel < 6 ? 'intermediate' : 'advanced'} level, and we will discover it together.

Ask me anything: explain a topic, give you an example, help you with the challenge, or just chat about what you are learning. Where would you like to start?`
          : `¡Hola${studentName ? ', ' + studentName : ''}! Qué gusto tenerte por acá. Soy Valerio, tu coach, y veo que estás en el módulo "${currentModule?.title}" — ¡qué tema tan interesante!

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
        const shortGreeting = userLevel < 3 ? t('ialab.valerio.short_greeting_low') : t('ialab.valerio.short_greeting_high');
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
      const fallbackResponse = generateFallbackResponse(inputText, locale);

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

  if (!currentModule) {
    return (
      <div className="fixed inset-0 z-[90] flex items-end justify-end">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md h-[90vh] bg-white rounded-t-2xl shadow-2xl flex flex-col items-center justify-center p-8 z-10">
          <div className="w-12 h-12 border-2 border-petroleum/30 border-t-petroleum rounded-full animate-spin mb-4" />
          <p className="text-slate-500 text-sm font-medium">{t('ialab.valerio.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={focusTrapRef} className="fixed inset-0 z-[90] flex items-end justify-end" role="dialog" aria-modal="true" aria-label={t('ialab.valerio.panel_aria')}>
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        aria-label={t('ialab.valerio.close_aria')}
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
