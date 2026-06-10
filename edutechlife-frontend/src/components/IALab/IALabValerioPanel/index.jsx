import React, { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types';;
import { motion } from 'framer-motion';
import { useIALabProgressContext, useIALabUIContext } from '../../../context/IALabContext';
import { useIALabStore } from '../../../store/ialabStore';
import { speakTextConversational, stopSpeech } from '../../../utils/speech';
import { callDeepseek } from '../../../utils/api';

import SectionErrorBoundary from '../SectionErrorBoundary';
import { useValerioVoice } from './useValerioVoice';
import { useTranslation } from '../../../i18n/I18nProvider';
import ValerioPanelHeader from './ValerioPanelHeader';
import ValerioQuickActions from './ValerioQuickActions';
import ValerioConversationArea from './ValerioConversationArea';
import ValerioChatInput from './ValerioChatInput';
import { buildValerioSystemPrompt, generateFallbackResponse, buildContextualWelcome } from './valerioPrompts'

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



  useEffect(() => {
    if (isOpen && !welcomeSpokenRef.current) {
      welcomeSpokenRef.current = true;
      const alreadyWelcomed = useIALabStore.getState().getValerioWelcomed();

      if (!alreadyWelcomed) {
        useIALabStore.getState().setValerioWelcomed();
        const welcomeMessage = buildContextualWelcome({ locale, studentName, currentModule, userLevel, activeMod });

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
      const systemPrompt = buildValerioSystemPrompt({ locale, currentModule, modules, studentName, userLevel, completedModules, t });
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
      const fallbackResponse = generateFallbackResponse(inputText, locale, { currentModule, userLevel });

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
    <div className="fixed right-0 top-0 bottom-0 z-[90] flex flex-col" role="dialog" aria-label={t('ialab.valerio.panel_aria')} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}>
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
