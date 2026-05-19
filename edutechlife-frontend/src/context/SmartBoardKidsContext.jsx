import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import useSmartBoardSync from '../hooks/useSmartBoardSync';

// ==========================================
// SmartBoard Kids Context - Dashboard para niños 8-16 años
// ==========================================
const SmartBoardKidsContext = createContext();

const LS_PREFIX = 'edutechlife_';

const getLocalStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(`${LS_PREFIX}${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(`${LS_PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // localStorage lleno, ignorar
  }
};

export const useSmartBoardKids = () => {
  const context = useContext(SmartBoardKidsContext);
  if (!context) {
    throw new Error('useSmartBoardKids must be used within SmartBoardKidsProvider');
  }
  return context;
};

export const SmartBoardKidsProvider = ({ children }) => {
  const { loadData, saveData, mergeWithLocal, userId, isLoading: syncLoading, isConnected } = useSmartBoardSync();
  const syncTimeoutRef = useRef(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // ==================== ALL STATE (initialized with defaults) ====================
  const [daniChatHistory, setDaniChatHistory] = useState([]);
  const [daniMood, setDaniMood] = useState('happy');
  const [studentMoodHistory, setStudentMoodHistory] = useState([]);
  const [academicTopics, setAcademicTopics] = useState([]);
  const [conversationCount, setConversationCount] = useState(0);
  const [studentAge, setStudentAge] = useState(null);
  const [vakResult, setVakResult] = useState(null);
  const [vakRecommendations, setVakRecommendations] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [unlockedRewards, setUnlockedRewards] = useState([]);

  const sessionStartRef = useRef(new Date());
  const [totalActiveMinutes, setTotalActiveMinutes] = useState(0);

  const [sessions, setSessions] = useState([]);
  const [streak, setStreak] = useState({ current: 0, longest: 0, lastActive: null });
  const [streakLog, setStreakLog] = useState([]);
  const [subjectTime, setSubjectTime] = useState({});
  const currentSessionRef = useRef(null);

  const [calendarEvents, setCalendarEvents] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  const [newsItems, setNewsItems] = useState([
    {
      id: 1,
      title: '¿Sabías que la IA puede ayudarte a estudiar?',
      summary: 'La inteligencia artificial está cambiando la forma en que aprendemos. ¡Descubre cómo!',
      category: 'IA',
      ageRange: '8-16',
      date: '2026-05-04',
      readTime: '2 min',
      icon: '🤖',
    },
    {
      id: 2,
      title: 'Nuevas herramientas STEAM para tu colegio',
      summary: 'Proyectos de ciencia, tecnología, ingeniería, arte y matemáticas que puedes hacer en casa.',
      category: 'STEAM',
      ageRange: '8-16',
      date: '2026-05-03',
      readTime: '3 min',
      icon: '🔬',
    },
    {
      id: 3,
      title: 'Consejos de Dani: Cómo organizar tu tiempo',
      summary: 'Tips sencillos para que cumplas con tus tareas y tengas tiempo para jugar.',
      category: 'Tips',
      ageRange: '8-16',
      date: '2026-05-02',
      readTime: '2 min',
      icon: '⏰',
    },
  ]);
  const [readNews, setReadNews] = useState([]);

  const [missions, setMissions] = useState([
    { id: 1, title: 'Completa tu Diagnóstico VAK', description: 'Descubre cómo aprendes mejor', icon: '🧠', xp: 100, completed: false },
    { id: 2, title: 'Sube tu primera actividad', description: 'Comparte un trabajo con Dani', icon: '📤', xp: 50, completed: false },
    { id: 3, title: 'Habla con Dani 5 veces', description: 'Haz preguntas a tu tutor virtual', icon: '💬', xp: 75, completed: false },
    { id: 4, title: 'Agrega 3 eventos al calendario', description: 'Organiza tu semana de estudio', icon: '📅', xp: 60, completed: false },
    { id: 5, title: 'Gana 500 puntos', description: 'Acumula puntos canjeables por premios', icon: '💎', xp: 200, completed: false },
    { id: 6, title: 'Lee 3 noticias tech', description: 'Mantente al día con la tecnología', icon: '📰', xp: 80, completed: false },
  ]);
  const [subjects, setSubjects] = useState([
    { id: 'matematicas', name: 'Matemáticas', icon: '🔢', progress: 0, color: '#4DA8C4' },
    { id: 'lenguaje', name: 'Lenguaje', icon: '📖', progress: 0, color: '#66CCCC' },
    { id: 'ciencias', name: 'Ciencias', icon: '🔬', progress: 0, color: '#FFD166' },
    { id: 'historia', name: 'Historia', icon: '🏛️', progress: 0, color: '#FF6B9D' },
    { id: 'ingles', name: 'Inglés', icon: '🌎', progress: 0, color: '#B2D8E5' },
    { id: 'arte', name: 'Arte', icon: '🎨', progress: 0, color: '#004B63' },
  ]);

  const [uploadedActivities, setUploadedActivities] = useState([]);
  const [analyzedActivities, setAnalyzedActivities] = useState([]);
  const [documentForDani, setDocumentForDani] = useState(null);

  const [darkMode, setDarkMode] = useState(false);
  const [avatarAnimado, setAvatarAnimado] = useState(false);
  const [fondoGalaxia, setFondoGalaxia] = useState(false);
  const [lastUnlockedReward, setLastUnlockedReward] = useState(null);

  // ==================== LOAD DATA FROM LOCALSTORAGE + SUPABASE ====================
  useEffect(() => {
    if (!userId || dataLoaded || syncLoading) return;

    const loadAllData = async () => {
      const localData = {
        daniChatHistory: getLocalStorage(`dani_chat_${userId}`, []),
        studentMoodHistory: getLocalStorage(`mood_history_${userId}`, []),
        academicTopics: getLocalStorage(`academic_topics_${userId}`, []),
        conversationCount: getLocalStorage(`conversation_count_${userId}`, 0),
        studentAge: getLocalStorage(`age_${userId}`, null),
        totalPoints: getLocalStorage(`points_${userId}`, 0),
        pointsHistory: getLocalStorage(`points_history_${userId}`, []),
        unlockedRewards: getLocalStorage(`rewards_${userId}`, []),
        totalActiveMinutes: getLocalStorage(`minutes_${userId}`, 0),
        sessions: getLocalStorage(`sessions_${userId}`, []),
        streak: getLocalStorage(`streak_${userId}`, { current: 0, longest: 0, lastActive: null }),
        streakLog: getLocalStorage(`streak_log_${userId}`, []),
        subjectTime: getLocalStorage(`subject_time_${userId}`, {}),
        calendarEvents: getLocalStorage(`calendar_${userId}`, []),
        readNews: getLocalStorage(`read_news_${userId}`, []),
        missions: getLocalStorage(`missions_${userId}`, []),
        subjects: getLocalStorage(`subjects_${userId}`, []),
        uploadedActivities: getLocalStorage(`activities_${userId}`, []),
        analyzedActivities: getLocalStorage(`analyzed_${userId}`, []),
        darkMode: getLocalStorage(`dark_mode_${userId}`, false),
        avatarAnimado: getLocalStorage(`avatar_animado_${userId}`, false),
        fondoGalaxia: getLocalStorage(`fondo_galaxia_${userId}`, false),
        vakResult: getLocalStorage(`vak_${userId}`, null),
      };

      // Load from Supabase
      let merged = localData;
      if (navigator.onLine) {
        const remoteData = await loadData();
        if (remoteData) {
          merged = mergeWithLocal(localData, remoteData);
        }
      }

      // Apply merged data to state
      setDaniChatHistory(merged.daniChatHistory || []);
      setStudentMoodHistory(merged.studentMoodHistory || []);
      setAcademicTopics(merged.academicTopics || []);
      setConversationCount(merged.conversationCount || 0);
      setStudentAge(merged.studentAge || null);
      setTotalPoints(merged.totalPoints || 0);
      setPointsHistory(merged.pointsHistory || []);
      setUnlockedRewards(merged.unlockedRewards || []);
      setTotalActiveMinutes(merged.totalActiveMinutes || 0);
      setSessions(merged.sessions || []);
      setStreak(merged.streak || { current: 0, longest: 0, lastActive: null });
      setStreakLog(merged.streakLog || []);
      setSubjectTime(merged.subjectTime || {});
      setCalendarEvents(merged.calendarEvents || []);
      setReadNews(merged.readNews || []);
      if (merged.missions?.length) setMissions(merged.missions);
      if (merged.subjects?.length) setSubjects(merged.subjects);
      setUploadedActivities(merged.uploadedActivities || []);
      setAnalyzedActivities(merged.analyzedActivities || []);
      setDarkMode(!!merged.darkMode);
      setAvatarAnimado(!!merged.avatarAnimado);
      setFondoGalaxia(!!merged.fondoGalaxia);
      if (merged.vakResult) setVakResult(merged.vakResult);

      // Sync local->remote if remote was empty
      if (!remoteData && navigator.onLine) {
        saveData(merged);
      }

      setDataLoaded(true);
    };

    loadAllData();
  }, [userId, syncLoading]);

  // ==================== EARN POINTS FOR ACTIVE MINUTES ====================
  useEffect(() => {
    if (!dataLoaded) return;
    const interval = setInterval(() => {
      const minutes = Math.floor((new Date() - sessionStartRef.current) / 1000 / 60);
      if (minutes > 0 && minutes !== totalActiveMinutes) {
        const newMinutes = totalActiveMinutes + 1;
        setTotalActiveMinutes(newMinutes);
        addPoints(1, 'Minuto activo en dashboard');
        sessionStartRef.current = new Date();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [totalActiveMinutes, dataLoaded]);

  // ==================== SESSION TRACKING ====================
  useEffect(() => {
    if (!dataLoaded) return;
    const session = {
      id: Date.now(),
      start: new Date(),
      date: new Date().toISOString().split('T')[0],
      subject: null,
    };
    currentSessionRef.current = session;
    return () => {
      if (currentSessionRef.current) {
        const ended = {
          ...currentSessionRef.current,
          end: new Date(),
          duration: Math.floor((new Date() - new Date(currentSessionRef.current.start)) / 1000 / 60),
        };
        setSessions(prev => [...prev, ended]);
      }
    };
  }, [userId, dataLoaded]);

  // ==================== TRACK DAILY STREAK ====================
  useEffect(() => {
    if (!dataLoaded) return;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    setStreak(prev => {
      if (prev.lastActive === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newCurrent = prev.lastActive === yesterday ? prev.current + 1 : 1;
      return {
        current: newCurrent,
        longest: Math.max(newCurrent, prev.longest),
        lastActive: today,
      };
    });
    setStreakLog(prev => {
      if (prev.some(entry => entry.date === today)) return prev;
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const newEntry = { date: today, timestamp: now.toISOString(), hour: `${hours}:${minutes}` };
      return [...prev, newEntry].slice(-90);
    });
  }, [userId, dataLoaded]);

  const trackSubjectTime = useCallback((subjectId, minutes) => {
    setSubjectTime(prev => ({ ...prev, [subjectId]: (prev[subjectId] || 0) + minutes }));
  }, []);

  // ==================== APPLY REWARD EFFECTS ====================
  useEffect(() => {
    if (!dataLoaded) return;
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode, dataLoaded]);

  // ==================== SYNC TO LOCALSTORAGE + SUPABASE ====================
  useEffect(() => {
    if (!dataLoaded || !userId) return;

    setLocalStorage(`dani_chat_${userId}`, daniChatHistory);
    setLocalStorage(`mood_history_${userId}`, studentMoodHistory);
    setLocalStorage(`academic_topics_${userId}`, academicTopics);
    setLocalStorage(`conversation_count_${userId}`, conversationCount);
    setLocalStorage(`age_${userId}`, studentAge);
    setLocalStorage(`vak_${userId}`, vakResult);
    setLocalStorage(`points_${userId}`, totalPoints);
    setLocalStorage(`points_history_${userId}`, pointsHistory);
    setLocalStorage(`rewards_${userId}`, unlockedRewards);
    setLocalStorage(`minutes_${userId}`, totalActiveMinutes);
    setLocalStorage(`sessions_${userId}`, sessions);
    setLocalStorage(`streak_${userId}`, streak);
    setLocalStorage(`streak_log_${userId}`, streakLog);
    setLocalStorage(`subject_time_${userId}`, subjectTime);
    setLocalStorage(`calendar_${userId}`, calendarEvents);
    setLocalStorage(`read_news_${userId}`, readNews);
    setLocalStorage(`missions_${userId}`, missions);
    setLocalStorage(`subjects_${userId}`, subjects);
    setLocalStorage(`activities_${userId}`, uploadedActivities);
    setLocalStorage(`analyzed_${userId}`, analyzedActivities);
    setLocalStorage(`dark_mode_${userId}`, darkMode);
    setLocalStorage(`avatar_animado_${userId}`, avatarAnimado);
    setLocalStorage(`fondo_galaxia_${userId}`, fondoGalaxia);

    // Debounced sync to Supabase
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      saveData({
        daniChatHistory, studentMoodHistory, academicTopics, conversationCount,
        studentAge, vakResult, totalPoints, pointsHistory, unlockedRewards,
        totalActiveMinutes, sessions, streak, streakLog, subjectTime,
        calendarEvents, readNews, missions, subjects,
        uploadedActivities, analyzedActivities,
        darkMode, avatarAnimado, fondoGalaxia,
      });
    }, 2000);
  }, [
    userId, daniChatHistory, studentMoodHistory, academicTopics, conversationCount,
    studentAge, vakResult, totalPoints, pointsHistory, unlockedRewards,
    totalActiveMinutes, sessions, streak, streakLog, subjectTime,
    calendarEvents, readNews, missions, subjects,
    uploadedActivities, analyzedActivities,
    darkMode, avatarAnimado, fondoGalaxia,
  ]);

  // ==================== ACTIONS ====================
  const addPoints = useCallback((points, reason) => {
    setTotalPoints(prev => prev + points);
    setPointsHistory(prev => [
      ...prev,
      { points, reason, timestamp: new Date() },
    ]);
  }, []);

  const completeMission = useCallback((missionId) => {
    setMissions(prev => prev.map(m =>
      m.id === missionId && !m.completed
        ? { ...m, completed: true }
        : m
    ));
    const mission = missions.find(m => m.id === missionId);
    if (mission && !mission.completed) {
      addPoints(mission.xp, `Misión completada: ${mission.title}`);
    }
  }, [missions, addPoints]);

  const unlockReward = useCallback((reward) => {
    setUnlockedRewards(prev => [...prev, reward.id]);
    addPoints(-reward.cost, `Canjeó recompensa: ${reward.name}`);
    setLastUnlockedReward(reward);
    setTimeout(() => setLastUnlockedReward(null), 4000);

    // Apply reward effects
    if (reward.id === 1) setDarkMode(true);
    if (reward.id === 2) setAvatarAnimado(true);
    if (reward.id === 3) setFondoGalaxia(true);
  }, [addPoints]);

  const addDaniMessage = useCallback((message) => {
    setDaniChatHistory(prev => [...prev, {
      role: message.role,
      text: message.text,
      timestamp: new Date(),
    }]);
    if (message.role === 'user') {
      setConversationCount(prev => prev + 1);
    }
  }, []);

  const recordMoodInference = useCallback((mood, confidence, context) => {
    const entry = { mood, confidence, context, date: new Date() };
    setStudentMoodHistory(prev => [...prev, entry].slice(-30));
  }, []);

  const trackAcademicTopic = useCallback((topic) => {
    if (!topic) return;
    setAcademicTopics(prev => {
      const existing = prev.find(t => t.topic === topic);
      return existing
        ? prev.map(t => t.topic === topic ? { ...t, count: t.count + 1, lastAsked: new Date() } : t)
        : [...prev, { topic, count: 1, lastAsked: new Date() }];
    });
  }, []);

  const buildDaniContext = useCallback(() => {
    const now = new Date();
    const fecha = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const hora = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const todayStr = now.toISOString().split('T')[0];

    const todayEvents = calendarEvents.filter(e => e.date === todayStr);
    const pendingMissions = missions.filter(m => !m.completed);

    const lastMoods = studentMoodHistory.slice(-5).map(m =>
      `${m.mood}${m.confidence > 0.7 ? ' (alta confianza)' : ''}`
    ).join(', ');

    const recentTopics = academicTopics.slice(-5).map(t => t.topic).join(', ');

    const subjectsStr = subjects.map(s => `${s.name}${s.progress ? ` (${s.progress}%)` : ''}`).join(', ');

    let context = `INFORMACIÓN DEL ESTUDIANTE:\n`;
    context += `- Fecha: ${fecha}\n`;
    context += `- Hora: ${hora}\n`;
    context += `- Edad del estudiante: ${studentAge || 'No especificada'}\n`;
    context += `- Puntos acumulados: ${totalPoints}\n`;
    context += `- Racha: ${streak.current} días${streak.current > 0 ? ' 🔥' : ''}\n`;
    context += `- Conversaciones con Dani: ${conversationCount + 1}\n`;

    if (vakResult) {
      context += `- Perfil VAK: ${vakResult.predominantStyle}\n`;
      context += `  Visual: ${vakResult.scores.visual}% | Auditivo: ${vakResult.scores.auditivo}% | Kinestésico: ${vakResult.scores.kinestesico}%\n`;
    } else {
      context += `- Perfil VAK: Aún no diagnosticado\n`;
    }

    if (subjectsStr) context += `- Materias: ${subjectsStr}\n`;
    if (pendingMissions.length > 0) context += `- Misiones pendientes: ${pendingMissions.length}\n`;
    if (todayEvents.length > 0) context += `- Eventos de hoy: ${todayEvents.map(e => e.title).join(', ')}\n`;
    if (lastMoods) context += `- Estados de ánimo inferidos recientes: ${lastMoods}\n`;
    if (recentTopics) context += `- Temas académicos consultados: ${recentTopics}\n`;

    return context;
  }, [vakResult, totalPoints, streak, calendarEvents, studentMoodHistory, academicTopics, userId, conversationCount, missions, subjects]);

  const setVakResultAndRecommendations = useCallback((result) => {
    setVakResult(result);
    // Generate recommendations based on VAK result
    if (result) {
      const recommendations = [];
      const dominantStyle = result.predominantStyle;
      
      if (dominantStyle === 'visual') {
        recommendations.push(
          { type: 'activity', name: 'Mapas mentales', description: 'Crea mapas conceptuales de tus materias' },
          { type: 'activity', name: 'Infografías', description: 'Dibuja resúmenes visuales' },
          { type: 'resource', name: 'Videos educativos', description: 'Aprende con contenido visual' },
        );
      } else if (dominantStyle === 'auditivo') {
        recommendations.push(
          { type: 'activity', name: 'Explicar a otros', description: 'Enseña lo que aprendiste' },
          { type: 'activity', name: 'Podcasts educativos', description: 'Escucha contenido académico' },
          { type: 'resource', name: 'Audiolibros', description: 'Lee con tus oídos' },
        );
      } else if (dominantStyle === 'kinestesico') {
        recommendations.push(
          { type: 'activity', name: 'Experimentos prácticos', description: 'Aprende haciendo' },
          { type: 'activity', name: 'Role-playing', description: 'Actúa situaciones de aprendizaje' },
          { type: 'resource', name: 'Manipulativos', description: 'Usa objetos para aprender' },
        );
      }
      
      setVakRecommendations(recommendations);
      addPoints(300, 'Completó diagnóstico VAK');
    }
  }, [addPoints]);

  const addCalendarEvent = useCallback((event) => {
    setCalendarEvents(prev => [...prev, { ...event, id: Date.now() }]);
  }, []);

  const addUploadedActivity = useCallback((activity) => {
    setUploadedActivities(prev => [...prev, { ...activity, id: Date.now(), uploadedAt: new Date() }]);
    addPoints(50, 'Subió actividad académica');
  }, [addPoints]);

  const addAnalyzedActivity = useCallback((analysis) => {
    setAnalyzedActivities(prev => [analysis, ...prev].slice(-20));
    addPoints(100, 'Actividad analizada por Dani');
  }, [addPoints]);

  const markNewsAsRead = useCallback((newsId) => {
    setReadNews(prev => [...prev, newsId]);
  }, []);

  // ==================== VALUE ====================
  const value = {
    // Dani
    daniChatHistory,
    daniMood,
    setDaniMood,
    addDaniMessage,
    studentMoodHistory,
    academicTopics,
    conversationCount,
    recordMoodInference,
    trackAcademicTopic,
    buildDaniContext,

    // Student
    studentAge,
    setStudentAge,
    
    // VAK
    vakResult,
    vakRecommendations,
    setVakResultAndRecommendations,
    
    // Points
    totalPoints,
    pointsHistory,
    unlockedRewards,
    addPoints,
    unlockReward,
    
    // Rewards effects
    darkMode,
    setDarkMode,
    avatarAnimado,
    fondoGalaxia,
    lastUnlockedReward,
    
    // Time
    totalActiveMinutes,
    
    // Session tracking
    sessions,
    streak,
    streakLog,
    subjectTime,
    trackSubjectTime,
    
    // Calendar
    calendarEvents,
    upcomingDeadlines,
    addCalendarEvent,
    
    // News
    newsItems,
    readNews,
    markNewsAsRead,
    
    // Activities
    uploadedActivities,
    addUploadedActivity,
    analyzedActivities,
    addAnalyzedActivity,
    documentForDani,
    setDocumentForDani,

    // Missions & Subjects
    missions,
    subjects,
    completeMission,
  };

  return (
    <SmartBoardKidsContext.Provider value={value}>
      {children}
    </SmartBoardKidsContext.Provider>
  );
};
