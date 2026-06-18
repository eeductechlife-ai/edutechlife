import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useIALabProgressContext, useIALabUIContext } from '../../../context/IALabContext';
import { useIALabStore } from '../../../store/ialabStore';
import { speakTextConversational, stopSpeech, prefetchTts } from '../../../utils/speech';
import { cleanTextForTTS } from '../../../utils/textCleaner';
import { callDeepseekStream } from '../../../utils/api';

import SectionErrorBoundary from '../SectionErrorBoundary';
import { useValerioVoice } from './useValerioVoice';
import { useTranslation } from '../../../i18n/I18nProvider';
import ValerioPanelHeader from './ValerioPanelHeader';
import ValerioQuickActions from './ValerioQuickActions';
import ValerioConversationArea from './ValerioConversationArea';
import ValerioChatInput from './ValerioChatInput';
import { buildValerioSystemPrompt, generateFallbackResponse, buildContextualWelcome } from './valerioPrompts'
import { startSession, endSession, updateSession } from '../../../services/valerioMemory'

const VALERIO_MEMORY_KEY = 'ialab_valerio_conversation';

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
  const [streamingMessage, setStreamingMessage] = useState('');
  const [quickActions, setQuickActions] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const welcomeSpokenRef = useRef(false);
  const abortRef = useRef(null);
  const warmupDoneRef = useRef(false);
  const firstChunkRef = useRef(false);
  const ttsQueueRef = useRef([]);
  const ttsPlayingRef = useRef(false);
  const pendingSentenceRef = useRef('');

  const studentName = user?.firstName || user?.full_name || '';
  const currentModule = modules.find(m => m.id === activeMod);
  const userLevel = completedModules.length;
  const conversationRef = useRef(conversation);
  conversationRef.current = conversation;

  const voice = useValerioVoice(isOpen, setUserInput, locale);

  const systemPrompt = useMemo(() =>
    buildValerioSystemPrompt({ locale, currentModule, modules, studentName, userLevel, completedModules, t }),
    [locale, currentModule?.id, studentName, userLevel, completedModules?.length]
  );

  const processTtsQueue = useCallback(() => {
    if (ttsPlayingRef.current || ttsQueueRef.current.length === 0) return;
    ttsPlayingRef.current = true;
    const text = ttsQueueRef.current.shift();
    speakTextConversational(cleanTextForTTS(text), 'valerio', () => {
      ttsPlayingRef.current = false;
      if (ttsQueueRef.current.length === 0) {
        setValerioState('idle');
      }
      processTtsQueue();
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      startSession(activeMod);
      if (!warmupDoneRef.current) {
        warmupDoneRef.current = true;
        const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://edutechlife-backend.onrender.com';
        fetch(`${baseUrl}/api/chat/stream`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: 'ping' }],
            temperature: 0.5,
            maxTokens: 10,
          }),
          signal: AbortSignal.timeout(12000),
        }).then(r => r.body?.cancel?.()).catch(() => {});
        fetch(`${baseUrl}/api/tts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text: 'Hola' },
            voice: { languageCode: 'es-US', name: 'es-US-Neural2-C' },
            audioConfig: { audioEncoding: 'MP3' }
          }),
          signal: AbortSignal.timeout(12000),
        }).then(r => r.body?.cancel?.()).catch(() => {});
        const OVA_INTRO_TEXTS = {
          1: { es: 'Bienvenido al desafío de Prompt Engineering. Aquí pondrás a prueba todo lo aprendido sobre la creación de prompts efectivos.', en: 'Welcome to the Prompt Engineering challenge. Here you will test everything you learned about creating effective prompts.' },
          2: { es: 'Bienvenido al desafío de ChatGPT. Aquí aprenderás a crear tu propio GPT personalizado.', en: 'Welcome to the ChatGPT challenge. You will create your own custom GPT.' },
          3: { es: 'Bienvenido al desafío de Gemini. Te convertirás en un investigador digital.', en: 'Welcome to the Gemini challenge. You will become a digital researcher.' },
          4: { es: 'Bienvenido al desafío de NotebookLM. Aprenderás a curar información y crear un podcast académico.', en: 'Welcome to the NotebookLM challenge. You will curate information and create an academic podcast.' },
          5: { es: 'Bienvenido al desafío de Ética en IA. Analizarás un caso real de sesgo algorítmico.', en: 'Welcome to the AI Ethics challenge. You will analyze a real case of algorithmic bias.' }
        };
        const moduleTexts = OVA_INTRO_TEXTS[activeMod];
        if (moduleTexts) {
          prefetchTts(moduleTexts.es, 'valerio');
          if (locale !== 'es') prefetchTts(moduleTexts.en, 'valerio');
        }
        prefetchTts(locale === 'en' ? 'Read the instructions carefully and complete each step. Good luck!' : 'Lee las instrucciones cuidadosamente y completa cada paso. ¡Buena suerte!', 'sistema');
      }
    } else {
      warmupDoneRef.current = false;
      welcomeSpokenRef.current = false;
      ttsQueueRef.current = [];
      ttsPlayingRef.current = false;
      pendingSentenceRef.current = '';
      endSession(conversationRef.current);
      stopSpeech();
      setValerioState('idle');
    }
    return () => {
      ttsQueueRef.current = [];
      ttsPlayingRef.current = false;
      pendingSentenceRef.current = '';
      endSession(conversationRef.current);
      stopSpeech();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://edutechlife-backend.onrender.com';
    const interval = setInterval(() => {
      fetch(`${baseUrl}/api/health`, { method: 'GET', signal: AbortSignal.timeout(5000) }).catch(() => {});
    }, 180000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    try { localStorage.setItem(VALERIO_MEMORY_KEY, JSON.stringify(conversation)); }
    catch { /* ignore */ }
    if (conversation.length > 0) {
      updateSession({ messageCount: conversation.length });
    }
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



  useEffect(() => {
    if (isOpen && !welcomeSpokenRef.current) {
      welcomeSpokenRef.current = true;
      setValerioState('speaking');

      const alreadyWelcomed = useIALabStore.getState().getValerioWelcomed();
      if (!alreadyWelcomed) {
        useIALabStore.getState().setValerioWelcomed();
        const introGreeting = locale === 'en'
          ? 'Hello! I am Valerio, how can I help you?'
          : '¡Hola! Soy Valerio, ¿en qué puedo ayudarte?';
        speakTextConversational(introGreeting, 'valerio', () => setValerioState('idle'));
        const welcomeMessage = buildContextualWelcome({ locale, studentName, currentModule, userLevel, activeMod });
        setMessage(welcomeMessage);
        setConversation([{
          id: 'welcome',
          type: 'valerio',
          content: welcomeMessage,
          timestamp: new Date().toISOString()
        }]);
      } else {
        const greeting = studentName
          ? (locale === 'en' ? `Hello ${studentName}! How can I help you?` : `¡Hola ${studentName}! ¿En qué puedo ayudarte?`)
          : (locale === 'en' ? 'Hello! How can I help you?' : '¡Hola! ¿En qué puedo ayudarte?');
        speakTextConversational(greeting, 'valerio', () => setValerioState('idle'));
      }
    }
  }, [isOpen]);

  const processUserInput = useCallback(async (inputText) => {
    if (!inputText.trim() || isProcessing) return;

    setIsProcessing(true);
    setValerioState('thinking');
    setStreamingMessage('');
    ttsQueueRef.current = [];
    ttsPlayingRef.current = false;
    pendingSentenceRef.current = '';
    stopSpeech();

    const userMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputText,
      timestamp: new Date().toISOString()
    };

    setConversation(prev => [...prev, userMessage]);
    setUserInput('');

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationRef.current.map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
      { role: 'user', content: inputText }
    ];

    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    try {
      firstChunkRef.current = false;
      pendingSentenceRef.current = '';
      let fullResponse = '';
      await callDeepseekStream(
        messages,
        { temperature: 0.7, maxTokens: 2000 },
        false,
        (chunk) => {
          fullResponse += chunk;
          if (!firstChunkRef.current && chunk.trim()) {
            firstChunkRef.current = true;
            setValerioState('speaking');
          }
          setStreamingMessage(fullResponse);

          pendingSentenceRef.current += chunk;
          while (true) {
            const match = pendingSentenceRef.current.match(/[.!?…](?:\s|$|[\n\r])/);
            if (!match) break;
            const endIdx = match.index + 1;
            const sentence = pendingSentenceRef.current.slice(0, endIdx).trim();
            pendingSentenceRef.current = pendingSentenceRef.current.slice(endIdx + match[0].length);
            if (sentence.length >= 5) {
              ttsQueueRef.current.push(sentence);
              processTtsQueue();
            }
          }
        }
      );

      clearTimeout(timeoutId);

      if (fullResponse.length < 5) {
        throw new Error('Respuesta vacía o muy corta');
      }

      const remaining = pendingSentenceRef.current.trim();
      if (remaining.length > 3) {
        ttsQueueRef.current.push(remaining);
        processTtsQueue();
      }

      const valerioMessage = {
        id: `valerio_${Date.now()}`,
        type: 'valerio',
        content: fullResponse,
        timestamp: new Date().toISOString()
      };

      setConversation(prev => [...prev, valerioMessage]);
      setMessage(fullResponse);
      setStreamingMessage('');
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        if (import.meta.env.DEV) console.warn('⚠️ Timeout al contactar DeepSeek');
      } else {
        if (import.meta.env.DEV) console.warn('⚠️ API DeepSeek no disponible:', error.message);
      }

      const fallbackResponse = generateFallbackResponse(inputText, locale, { currentModule, userLevel });

      const valerioMessage = {
        id: `valerio_${Date.now()}`,
        type: 'valerio',
        content: fallbackResponse,
        timestamp: new Date().toISOString()
      };

      setConversation(prev => [...prev, valerioMessage]);
      setMessage(fallbackResponse);
      setStreamingMessage('');

      speakTextConversational(cleanTextForTTS(fallbackResponse), 'valerio', () => setValerioState('idle'));
    } finally {
      setIsProcessing(false);
      abortRef.current = null;
    }
  }, [currentModule, userLevel, isProcessing, locale, studentName, completedModules, t, systemPrompt]);

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
    if (abortRef.current) abortRef.current.abort();
    setShowClearConfirm(true);
  };

  const confirmClearConversation = () => {
    setConversation([]);
    setMessage('');
    setStreamingMessage('');
    setShowClearConfirm(false);
    try { localStorage.removeItem(VALERIO_MEMORY_KEY); } catch { /* ignore */ }
  };

  const cancelClearConversation = () => {
    setShowClearConfirm(false);
  };

  if (!isOpen) return null;

  if (!currentModule) {
    return (
      <div className="fixed right-0 top-0 bottom-0 z-[90] flex flex-col">
        <div className="relative w-[380px] max-md:w-[85vw] h-full bg-white shadow-2xl flex flex-col items-center justify-center p-8 z-10">
          <div className="w-12 h-12 border-2 border-petroleum/30 border-t-petroleum rounded-full animate-spin mb-4" />
          <p className="text-slate-500 text-sm font-medium">{t('ialab.valerio.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <SectionErrorBoundary name="ValerioPanel">
    <div className="fixed right-0 top-0 bottom-0 z-[90] flex flex-col" role="dialog" aria-label={t('ialab.valerio.panel_aria')} onKeyDown={(e) => { if (e.key === 'Escape') { stopSpeech(); onClose(); } }}>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-[380px] max-md:w-[85vw] h-full bg-white shadow-2xl flex flex-col z-10"
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
            streamingMessage={streamingMessage}
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
    </SectionErrorBoundary>
  );
};


IALabValerioPanel.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default IALabValerioPanel;
