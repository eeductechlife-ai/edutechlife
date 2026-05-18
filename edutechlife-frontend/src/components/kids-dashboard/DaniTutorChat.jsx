import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { callDeepseek } from '../../utils/api';
import { PROMPT_DANI_EXPERTO, PROMPT_TUTOR_TAREAS } from '../../constants/prompts';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';
import { speakTextConversational, stopSpeech } from '../../utils/speech';
import DaniAvatar3D from './DaniAvatar3D';

// ==========================================
// Dani Avatar Component
// ==========================================
const DaniAvatar = memo(({ mood, isTyping, isSpeaking }) => (
  <DaniAvatar3D mood={mood} isTyping={isTyping} isSpeaking={isSpeaking} size="md" />
));

DaniAvatar.displayName = 'DaniAvatar';

// ==========================================
// Message Bubble Component
// ==========================================
const MessageBubble = memo(({ message, isDani, darkMode }) => {
  const time = new Date(message.timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const relativeTime = getRelativeTime(message.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isDani ? 'justify-start' : 'justify-end'} mb-4`}
    >
      {isDani && (
        <div className="mr-3 mt-1 flex-shrink-0">
          <DaniAvatar mood="happy" isTyping={false} />
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
          isDani
            ? darkMode
              ? 'bg-[#1E293B] border border-[#334155] text-[#E2E8F0] rounded-tl-md'
              : 'bg-white border border-[#E2E8F0] text-[#004B63] rounded-tl-md'
            : 'bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] text-white rounded-tr-md'
        } shadow-sm`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <p className={`text-[10px] mt-1 ${isDani ? 'text-[#64748B]' : 'text-white/70'}`}>
          {relativeTime}
        </p>
      </div>
    </motion.div>
  );
});

MessageBubble.displayName = 'MessageBubble';

// ==========================================
// Quick Action Buttons
// ==========================================
const QuickActions = memo(({ onAction, darkMode }) => {
  const actions = [
    { icon: '📚', label: 'Ayuda con tarea', value: 'ayuda_tarea' },
    { icon: '💭', label: 'Dime algo motivador', value: 'motivame' },
    { icon: '🎯', label: 'Mi estilo VAK', value: 'vak_estrategias' },
    { icon: '📅', label: 'Qué debo hacer hoy', value: 'que_hacer_hoy' },
    { icon: '🧠', label: 'Explícame un tema', value: 'explicar_tema' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 px-4 pb-3"
    >
      {actions.map((action) => (
        <motion.button
          key={action.value}
          onClick={() => onAction(action.value)}
          className={`px-3 py-2 border rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm ${
            darkMode
              ? 'bg-[#1E293B] border-[#334155] text-[#94A3B8] hover:bg-[#334155]'
              : 'bg-white border-[#E2E8F0] text-[#004B63] hover:bg-[#4DA8C4]/10 hover:border-[#4DA8C4]/30'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
});

QuickActions.displayName = 'QuickActions';

// ==========================================
// Suggested Topics Chip
// ==========================================
const RecentTopics = memo(({ topics, onTopicClick, darkMode }) => {
  if (!topics || topics.length === 0) return null;
  return (
    <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
      {topics.slice(-5).map(t => (
        <motion.button
          key={t.topic}
          onClick={() => onTopicClick(t.topic)}
          className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
            darkMode
              ? 'bg-[#1E293B] border-[#334155] text-[#94A3B8] hover:bg-[#334155]'
              : 'bg-[#B2D8E5]/30 border-[#B2D8E5] text-[#004B63] hover:bg-[#B2D8E5]/50'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t.icon || '📌'} {t.topic}
        </motion.button>
      ))}
    </div>
  );
});

RecentTopics.displayName = 'RecentTopics';

// ==========================================
// Utility: Mood detection from text
// ==========================================
function inferMoodFromText(text) {
  const t = text.toLowerCase();
  if (/triste|mal|aburrido|cansado|desanimado|no puedo|difícil|frustrado|pesado|agotado/i.test(t))
    return { mood: 'triste', confidence: 0.7 };
  if (/feliz|genial|excelente|logré|entendí|me encantó|gracias|increíble|contento|alegre|wow|divertido/i.test(t))
    return { mood: 'feliz', confidence: 0.8 };
  if (/enojado|molesto|rabia|no quiero|fastidio|harto|basta|me enfada|irritado/i.test(t))
    return { mood: 'enojado', confidence: 0.7 };
  if (/nervioso|miedo|preocupado|ansioso|qué pasa si|temor|asustado|estrés|estresado/i.test(t))
    return { mood: 'ansioso', confidence: 0.7 };
  if (/confundido|no entiendo|qué significa|cómo es|no sé|duda|complicado|lío|enredado/i.test(t))
    return { mood: 'confundido', confidence: 0.6 };
  return null;
}

function getRelativeTime(timestamp) {
  const now = new Date();
  const msgTime = new Date(timestamp);
  const diffMs = now - msgTime;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'ahora';
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `hace ${diffHours}h`;
  return msgTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

// ==========================================
// Utility: Extract academic topic
// ==========================================
const SUBJECT_KEYWORDS = [
  { topic: 'Matemáticas', keywords: ['matemáticas', 'mate', 'álgebra', 'cálculo', 'geometría', 'trigonometría', 'ecuación', 'ecuaciones', 'fracciones', 'números', 'suma', 'resta', 'multiplicación', 'división', 'porcentaje', 'estadística'], icon: '📐' },
  { topic: 'Lenguaje', keywords: ['lenguaje', 'español', 'lectura', 'gramática', 'literatura', 'poesía', 'cuento', 'novela', 'escritura', 'ortografía', 'redacción', 'ensayo'], icon: '📖' },
  { topic: 'Ciencias', keywords: ['ciencias', 'biología', 'química', 'física', 'naturaleza', 'ecología', 'célula', 'organismo', 'experimento', 'reacción', 'energía', 'fuerza'], icon: '🔬' },
  { topic: 'Historia', keywords: ['historia', 'geografía', 'sociales', 'política', 'civilización', 'antiguo', 'revolución', 'cultura', 'mapa', 'país', 'continente'], icon: '🌍' },
  { topic: 'Inglés', keywords: ['inglés', 'idioma', 'vocabulario', 'grammar', 'verbos', 'pronunciación'], icon: '🇬🇧' },
  { topic: 'Arte', keywords: ['arte', 'música', 'dibujo', 'pintura', 'escultura', 'teatro', 'danza', 'color'], icon: '🎨' },
  { topic: 'Tecnología', keywords: ['tecnología', 'computación', 'programación', 'robótica', 'código', 'algoritmo', 'internet', 'computador', 'software'], icon: '💻' },
];

function extractTopic(text) {
  const t = text.toLowerCase();
  for (const subject of SUBJECT_KEYWORDS) {
    for (const kw of subject.keywords) {
      if (t.includes(kw)) return subject;
    }
  }
  return null;
}

// ==========================================
// Main Dani Tutor Chat Component
// ==========================================
const DaniTutorChat = memo(({ isOpen, onClose, activeTab }) => {
  const {
    daniChatHistory,
    addDaniMessage,
    daniMood,
    setDaniMood,
    vakResult,
    totalPoints,
    streak,
    buildDaniContext,
    recordMoodInference,
    trackAcademicTopic,
    academicTopics,
    studentMoodHistory,
    conversationCount,
    darkMode,
    calendarEvents,
    documentForDani,
    setDocumentForDani,
  } = useSmartBoardKids();

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    const saved = localStorage.getItem('edutechlife_dani_voice');
    return saved !== null ? saved === 'true' : true;
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceBlocked, setVoiceBlocked] = useState(false);
  const messagesEndRef = useRef(null);
  const hasSentWelcome = useRef(false);
  const isSpeakingRef = useRef(false);
  const speechPrimed = useRef(false);

  // ==========================================
  // Rich contextual welcome builder
  // ==========================================
  const buildRichWelcome = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? '¡Buenos días' : hour < 18 ? '¡Buenas tardes' : '¡Buenas noches';

    const parts = [];

    // 1. Greeting
    parts.push(`${greeting}! Soy Dani, tu mentor virtual.`);

    // 2. Streak
    if (streak.current >= 5) {
      parts.push(`Llevas ${streak.current} días seguidos, ¡qué impresionante! 🔥`);
    } else if (streak.current >= 2) {
      parts.push(`Ya llevas ${streak.current} días de racha, ¡sigue así!`);
    }

    // 3. Current tab context
    const tabMessages = {
      misiones: 'Veo que estabas viendo tus misiones.',
      materias: 'Estabas repasando tus materias.',
      actividades: 'Estabas en la sección de actividades.',
      calendario: 'Estabas viendo tu calendario.',
      puntos: 'Estabas revisando tus puntos y recompensas.',
      noticias: 'Estabas leyendo las noticias tech.',
      vak: 'Estabas en tu perfil VAK.',
      inicio: '',
      dani: '',
    };
    const tabContext = tabMessages[activeTab] || '';
    if (tabContext) parts.push(tabContext);

    // 4. Pending missions (read from localStorage directly)
    const savedMissions = localStorage.getItem('edutechlife_missions');
    if (savedMissions) {
      try {
        const allMissions = JSON.parse(savedMissions);
        const pending = allMissions.filter(m => !m.completed);
        if (pending.length > 0) {
          const names = pending.slice(0, 3).map(m => `"${m.title}"`).join(', ');
          const missionText = pending.length === 1
            ? `Tienes 1 misión pendiente: ${names}.`
            : `Tienes ${pending.length} misiones pendientes: ${names}${pending.length > 3 ? ' y más.' : '.'}`;
          parts.push(missionText);
          parts.push('¿Quieres que empecemos con alguna?');
        }
      } catch (e) {}
    }

    // 5. Low-progress subjects (only if missions weren't mentioned)
    if (!parts.some(p => p.includes('misiones'))) {
      const savedSubjects = localStorage.getItem('edutechlife_subjects');
      if (savedSubjects) {
        try {
          const allSubjects = JSON.parse(savedSubjects);
          const lowProgress = allSubjects.filter(s => s.progress > 0 && s.progress < 50);
          if (lowProgress.length > 0) {
            const names = lowProgress.slice(0, 3).map(s => `${s.name} (${s.progress}%)`).join(', ');
            parts.push(`Noté que ${names} necesitan un poco más de práctica. ¿Quieres repasar algún tema en específico?`);
          }
        } catch (e) {}
      }
    }

    // 6. VAK not completed
    if (!vakResult) {
      parts.push('¿Sabías que aún no has descubierto tu estilo de aprendizaje? Podemos hacer el diagnóstico VAK ahora mismo 🧠');
    }

    // 7. Today's events
    const todayStr = now.toISOString().split('T')[0];
    const todayEvents = calendarEvents.filter(e => e.date === todayStr);
    if (todayEvents.length > 0) {
      const eventNames = todayEvents.map(e => e.title).join(', ');
      parts.push(`Hoy tienes agendado: ${eventNames}. ¿Cómo te sientes al respecto?`);
    }

    // 8. Final question if none was asked yet
    if (!parts.some(p => p.includes('¿'))) {
      parts.push('¿En qué te gustaría que te ayude hoy? 😊');
    }

    return parts.join(' ');
  }, [streak, vakResult, calendarEvents, activeTab]);

  // Persist voice preference
  useEffect(() => {
    localStorage.setItem('edutechlife_dani_voice', voiceEnabled);
  }, [voiceEnabled]);

  // Stop speech when chat closes
  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    }
    return () => {
      stopSpeech();
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    };
  }, [isOpen]);

  const retrySpeech = useCallback(() => {
    setVoiceBlocked(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
      window.speechSynthesis.cancel();
      speechPrimed.current = true;
    }
  }, []);

  const toggleVoice = useCallback(() => {
    if (isSpeaking) stopSpeech();
    setVoiceEnabled(prev => !prev);
    setVoiceBlocked(false);
  }, [isSpeaking]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [daniChatHistory]);

  // Force voice enabled every time chat opens
  useEffect(() => {
    if (isOpen) {
      setVoiceEnabled(true);
      localStorage.setItem('edutechlife_dani_voice', 'true');
    }
  }, [isOpen]);

  // Prime SpeechSynthesis immediately (required by Chrome)
  useEffect(() => {
    if (!isOpen || speechPrimed.current) return;
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('');
        utterance.volume = 0;
        utterance.text = '';
        window.speechSynthesis.speak(utterance);
        window.speechSynthesis.cancel();
        speechPrimed.current = true;
      }
    } catch (e) {
      // Silently fail — priming is best-effort
    }
  }, [isOpen]);

  // Proactive contextual welcome every time chat opens
  useEffect(() => {
    if (!isOpen || hasSentWelcome.current) return;
    hasSentWelcome.current = true;
    setIsTyping(true);
    setDaniMood('thinking');

    const welcomeText = buildRichWelcome();

    const showWelcome = () => {
      setIsTyping(false);
      setDaniMood('happy');
      addDaniMessage({ role: 'assistant', text: welcomeText });
      setIsSpeaking(true);
      isSpeakingRef.current = true;
      speakTextConversational(welcomeText, 'dani', () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
      }, (err) => {
        if (err && err.includes('bloqueado')) {
          setVoiceBlocked(true);
        }
      });
    };

    // Short delay so the typing indicator is visible
    const timeout = setTimeout(showWelcome, 300);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  const handleSendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', text: text.trim(), timestamp: new Date() };
    addDaniMessage(userMessage);
    setInputText('');
    setIsTyping(true);
    setDaniMood('thinking');

    try {
      // Use document analysis context if available
      const hasDocumentContext = !!documentForDani;
      const systemPrompt = hasDocumentContext ? PROMPT_TUTOR_TAREAS : PROMPT_DANI_EXPERTO;

      // Build context info string
      let contextInfo = buildDaniContext();

      // Inject document analysis if present
      if (hasDocumentContext) {
        contextInfo += `\n\n## ANÁLISIS DE DOCUMENTO DEL ESTUDIANTE\n`;
        contextInfo += `Título: ${documentForDani.title || 'Documento'}\n`;
        contextInfo += `Materia: ${documentForDani.subject || 'General'}\n`;
        contextInfo += `Resumen: ${documentForDani.summary || ''}\n`;
        contextInfo += `Fortalezas: ${documentForDani.strengths?.join(', ') || ''}\n`;
        contextInfo += `Áreas de mejora: ${documentForDani.improvements?.join(', ') || ''}\n`;
        contextInfo += `Puntuación: ${documentForDani.score}/100\n`;
        contextInfo += `Dificultad: ${documentForDani.difficulty || 'N/A'}\n`;
        contextInfo += `\nPreguntas guía para la tutoría:\n${documentForDani.tutoringQuestions?.map((q, i) => `${i + 1}. ${q}`).join('\n') || ''}\n`;
        contextInfo += `\nIMPORTANTE: El estudiante acaba de subir este documento. Usa el análisis para guiar la tutoría. Pregúntale qué parte quiere mejorar o qué no entiende.`;
      }

      // Build messages array for API
      const messages = [
        { role: 'system', content: systemPrompt },
      ];

      // Add context as a separate user message (not system, to keep it fresh)
      if (contextInfo) {
        messages.push({
          role: 'user',
          content: `[INFORMACIÓN DEL ESTUDIANTE - USA ESTO PARA PERSONALIZAR TU RESPUESTA]\n${contextInfo}\n\nNota: Esta información se actualiza en cada mensaje. No la repitas textualmente en tu respuesta, úsala para adaptar tu tono y sugerencias.`,
        });
      }

      // Add chat history (last 15 messages for token efficiency)
      const history = daniChatHistory.slice(-15).map(msg => ({
        role: msg.role,
        content: msg.text,
      }));
      messages.push(...history);

      // Add current user message
      messages.push({ role: 'user', content: userMessage.text });

      // Clear document context after first use
      if (hasDocumentContext) {
        setDocumentForDani(null);
      }

      const response = await callDeepseek(messages, {
        temperature: 0.7,
        maxTokens: 800,
      });

      setDaniMood('explaining');
      addDaniMessage({ role: 'assistant', text: response });

      // Speak response aloud if voice is enabled
      if (voiceEnabled) {
        const cleanText = response.replace(/[😊🔥🧠🎉💙📚💭🌟📅💬🎯🤔📖🔬🌍🎨💻🤖⭐💎📰✨]/g, '').trim();
        if (cleanText.length > 0) {
          setIsSpeaking(true);
          isSpeakingRef.current = true;
          speakTextConversational(cleanText, 'dani', () => {
            setIsSpeaking(false);
            isSpeakingRef.current = false;
          }, (err) => {
            if (err && err.includes('bloqueado')) {
              setVoiceBlocked(true);
            }
          });
        }
      }

      // Auto-detect mood from user message
      const mood = inferMoodFromText(userMessage.text);
      if (mood) {
        recordMoodInference(mood.mood, mood.confidence, userMessage.text.substring(0, 100));
      }

      // Track academic topic
      const subject = extractTopic(userMessage.text);
      if (subject) {
        trackAcademicTopic(subject.topic);
      }
    } catch (error) {
      console.error('Error calling Dani:', error);
      const errorMsg = error.message?.includes('400') ? 'El servidor no entendió el mensaje. ¿Puedes intentar de nuevo?' :
                       error.message?.includes('500') ? 'El servidor está teniendo problemas. Vuelve a intentar en un momento.' :
                       error.message?.includes('timeout') || error.message?.includes('Tiempo de espera') ? 'La respuesta tardó demasiado. ¿Puedes repetirlo?' :
                       'Ups, tuve un problema de conexión. ¿Puedes intentar de nuevo? 🙏';
      addDaniMessage({
        role: 'assistant',
        text: errorMsg,
      });
    } finally {
      setIsTyping(false);
      setDaniMood('happy');
    }
  }, [addDaniMessage, buildDaniContext, daniChatHistory, recordMoodInference, trackAcademicTopic, setDaniMood, voiceEnabled, setVoiceBlocked]);

  const handleQuickAction = useCallback((action) => {
    const now = new Date();
    const hour = now.getHours();
    const timeOfDay = hour < 12 ? 'hoy' : hour < 18 ? 'esta tarde' : 'esta noche';

    const actionMessages = {
      'ayuda_tarea': `Dani, necesito ayuda con mi tarea. ¿Me puedes explicar paso a paso y darme estrategias según mi estilo de aprendizaje?`,
      'motivame': `Dani, necesito que me motives un poco. ¿Qué me dirías para seguir adelante con mis estudios ${timeOfDay}?`,
      'vak_estrategias': `Dani, recuérdame cuál es mi estilo VAK y dame estrategias concretas para estudiar mejor`,
      'que_hacer_hoy': `Dani, ¿qué me recomiendas hacer ${timeOfDay} para ser productivo en mis estudios?`,
      'explicar_tema': `Dani, explícame un tema académico interesante de forma fácil y divertida`,
    };

    handleSendMessage(actionMessages[action] || action);
  }, [handleSendMessage]);

  const handleTopicClick = useCallback((topic) => {
    handleSendMessage(`Dani, explícame sobre ${topic}, quiero entenderlo bien`);
  }, [handleSendMessage]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end justify-end p-4 md:p-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`w-full max-w-md h-[600px] rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border ${
            darkMode ? 'bg-[#0F172A] border-[#334155]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <DaniAvatar mood={daniMood} isTyping={isTyping} isSpeaking={isSpeaking} />
              <div>
                <h3 className="text-white font-bold text-lg">Dani</h3>
                <p className="text-white/80 text-xs">
                  {isSpeaking ? 'Hablando...' : isTyping ? 'Escribiendo...' : 'Tu mentor virtual'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {conversationCount > 0 && (
                <div className="bg-white/15 rounded-full px-2.5 py-1 text-white text-[10px] font-medium">
                  💬 {conversationCount}
                </div>
              )}
              <motion.button
                onClick={toggleVoice}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all relative ${
                  voiceEnabled
                    ? 'bg-white/30 text-white hover:bg-white/40'
                    : 'bg-white/10 text-white/50 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={
                  voiceBlocked ? 'Voz bloqueada por el navegador — toca para re-intentar' :
                  voiceEnabled ? 'Desactivar voz' : 'Activar voz'
                }
              >
                {voiceBlocked ? '🔇' : voiceEnabled ? '🔊' : '🔇'}
                {voiceBlocked && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                )}
              </motion.button>
              {streak.current > 0 && (
                <div className="bg-white/20 rounded-full px-3 py-1 text-white text-xs font-bold flex items-center gap-1">
                  🔥 {streak.current}
                </div>
              )}
            </div>
          </div>

          {/* Mood bar — subtle indicator of recent detected moods */}
          {studentMoodHistory.length > 0 && (
            <div className={`flex gap-1 px-4 py-1.5 border-b ${
              darkMode ? 'border-[#334155] bg-[#0F172A]' : 'border-[#E2E8F0] bg-white/50'
            }`}>
              <span className="text-[10px] text-[#64748B] mr-1">Estado:</span>
              {studentMoodHistory.slice(-5).map((m, i) => (
                <span
                  key={i}
                  className={`text-xs ${
                    m.mood === 'feliz' ? 'text-green-500' :
                    m.mood === 'triste' ? 'text-blue-400' :
                    m.mood === 'enojado' ? 'text-red-400' :
                    m.mood === 'ansioso' ? 'text-amber-400' :
                    'text-[#64748B]'
                  }`}
                >
                  {m.mood === 'feliz' ? '😊' :
                   m.mood === 'triste' ? '😢' :
                   m.mood === 'enojado' ? '😤' :
                   m.mood === 'ansioso' ? '😰' :
                   m.mood === 'confundido' ? '🤔' : '💭'}
                </span>
              ))}
            </div>
          )}

          {/* Document Context Banner */}
          {documentForDani && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-4 mt-2 px-3 py-2 bg-gradient-to-r from-[#4DA8C4]/10 to-[#66CCCC]/10 border border-[#4DA8C4]/30 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">📄</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#004B63] truncate">
                    Analizando: {documentForDani.title || 'Documento'}
                  </p>
                  <p className="text-[10px] text-[#64748B]">
                    Puntuación: {documentForDani.score}/100 • {documentForDani.subject}
                  </p>
                </div>
                <button
                  onClick={() => setDocumentForDani(null)}
                  className="text-[#64748B] hover:text-[#004B63] text-xs"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}

          {/* Messages Container */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-2 ${
            darkMode ? 'scrollbar-thin scrollbar-thumb-[#334155]' : ''
          }`}>
            {daniChatHistory.map((msg, index) => (
              <MessageBubble
                key={index}
                message={msg}
                isDani={msg.role === 'assistant'}
                darkMode={darkMode}
              />
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-4"
              >
                <div className={`rounded-2xl rounded-tl-md px-4 py-3 shadow-sm ${
                  darkMode ? 'bg-[#1E293B] border border-[#334155]' : 'bg-white border border-[#E2E8F0]'
                }`}>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-[#4DA8C4] rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <QuickActions onAction={handleQuickAction} darkMode={darkMode} />

          {/* Recent Topics */}
          <RecentTopics
            topics={academicTopics.filter(t => t.count > 0)}
            onTopicClick={handleTopicClick}
            darkMode={darkMode}
          />

          {/* Input Area */}
          <div className={`p-4 border-t ${
            darkMode ? 'bg-[#0F172A] border-[#334155]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder="Pregúntale a Dani..."
                className={`flex-1 px-4 py-3 rounded-full text-sm focus:outline-none focus:border-[#4DA8C4] placeholder-[#64748B] ${
                  darkMode
                    ? 'bg-[#1E293B] border border-[#334155] text-[#E2F0FF] focus:border-[#4DA8C4]'
                    : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#004B63]'
                }`}
              />
              <motion.button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isTyping}
                className="w-12 h-12 bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] text-white rounded-full flex items-center justify-center disabled:opacity-50 shadow-lg flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

DaniTutorChat.displayName = 'DaniTutorChat';

export default DaniTutorChat;
