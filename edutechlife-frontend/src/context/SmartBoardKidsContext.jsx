import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

// ==========================================
// SmartBoard Kids Context - Dashboard para niños 8-16 años
// ==========================================
const SmartBoardKidsContext = createContext();

export const useSmartBoardKids = () => {
  const context = useContext(SmartBoardKidsContext);
  if (!context) {
    throw new Error('useSmartBoardKids must be used within SmartBoardKidsProvider');
  }
  return context;
};

export const SmartBoardKidsProvider = ({ children, userId = 'student' }) => {
  // ==================== DANI TUTOR STATE ====================
  const [daniChatHistory, setDaniChatHistory] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_dani_chat_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [daniMood, setDaniMood] = useState('happy'); // happy, thinking, explaining, empathetic
  const [studentMoodHistory, setStudentMoodHistory] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_mood_history_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [academicTopics, setAcademicTopics] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_academic_topics_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [conversationCount, setConversationCount] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_conversation_count_${userId}`);
    return saved ? parseInt(saved, 10) : 0;
  });

  // ==================== VAK STATE ====================
  const [vakResult, setVakResult] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_vak_${userId}`);
    return saved ? JSON.parse(saved) : null;
  });
  const [vakRecommendations, setVakRecommendations] = useState([]);

  // ==================== POINTS & REWARDS STATE ====================
  const [totalPoints, setTotalPoints] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_points_${userId}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [pointsHistory, setPointsHistory] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_points_history_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [unlockedRewards, setUnlockedRewards] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_rewards_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  // ==================== ACTIVE MINUTES TRACKER ====================
  const sessionStartRef = useRef(new Date());
  const [totalActiveMinutes, setTotalActiveMinutes] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_minutes_${userId}`);
    return saved ? parseInt(saved, 10) : 0;
  });

  // Earn points for every minute active in dashboard
  useEffect(() => {
    const interval = setInterval(() => {
      const minutes = Math.floor((new Date() - sessionStartRef.current) / 1000 / 60);
      if (minutes > 0 && minutes !== totalActiveMinutes) {
        const newMinutes = totalActiveMinutes + 1;
        setTotalActiveMinutes(newMinutes);
        addPoints(1, 'Minuto activo en dashboard');
        sessionStartRef.current = new Date();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [totalActiveMinutes]);

  // ==================== SESSION TRACKING ====================
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_sessions_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_streak_${userId}`);
    return saved ? JSON.parse(saved) : { current: 0, longest: 0, lastActive: null };
  });
  const [streakLog, setStreakLog] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_streak_log_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [subjectTime, setSubjectTime] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_subject_time_${userId}`);
    return saved ? JSON.parse(saved) : {};
  });
  const currentSessionRef = useRef(null);

  // Start session on mount
  useEffect(() => {
    const session = {
      id: Date.now(),
      start: new Date(),
      date: new Date().toISOString().split('T')[0],
      subject: null,
    };
    currentSessionRef.current = session;
    return () => {
      // End session on unmount
      if (currentSessionRef.current) {
        const ended = {
          ...currentSessionRef.current,
          end: new Date(),
          duration: Math.floor((new Date() - new Date(currentSessionRef.current.start)) / 1000 / 60),
        };
        setSessions(prev => {
          const updated = [...prev, ended];
          localStorage.setItem(`edutechlife_sessions_${userId}`, JSON.stringify(updated));
          return updated;
        });
      }
    };
  }, [userId]);

  // Track daily streak
  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    setStreak(prev => {
      if (prev.lastActive === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newCurrent = prev.lastActive === yesterday ? prev.current + 1 : 1;
      const newStreak = {
        current: newCurrent,
        longest: Math.max(newCurrent, prev.longest),
        lastActive: today,
      };
      localStorage.setItem(`edutechlife_streak_${userId}`, JSON.stringify(newStreak));
      return newStreak;
    });
    setStreakLog(prev => {
      if (prev.some(entry => entry.date === today)) return prev;
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const newEntry = { date: today, timestamp: now.toISOString(), hour: `${hours}:${minutes}` };
      const updated = [...prev, newEntry].slice(-90);
      localStorage.setItem(`edutechlife_streak_log_${userId}`, JSON.stringify(updated));
      return updated;
    });
  }, [userId]);

  const trackSubjectTime = useCallback((subjectId, minutes) => {
    setSubjectTime(prev => {
      const updated = { ...prev, [subjectId]: (prev[subjectId] || 0) + minutes };
      localStorage.setItem(`edutechlife_subject_time_${userId}`, JSON.stringify(updated));
      return updated;
    });
  }, [userId]);

  // ==================== CALENDAR STATE ====================
  const [calendarEvents, setCalendarEvents] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_calendar_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  // ==================== NEWS STATE ====================
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
  const [readNews, setReadNews] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_read_news_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  // ==================== ACTIVITY UPLOAD STATE ====================
  const [uploadedActivities, setUploadedActivities] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_activities_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  // ==================== ANALYZED ACTIVITIES STATE ====================
  const [analyzedActivities, setAnalyzedActivities] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_analyzed_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [documentForDani, setDocumentForDani] = useState(null);

  // ==================== PERSISTENCE ====================
  useEffect(() => {
    localStorage.setItem(`edutechlife_dani_chat_${userId}`, JSON.stringify(daniChatHistory));
  }, [daniChatHistory, userId]);

  useEffect(() => {
    localStorage.setItem(`edutechlife_mood_history_${userId}`, JSON.stringify(studentMoodHistory));
  }, [studentMoodHistory, userId]);

  useEffect(() => {
    localStorage.setItem(`edutechlife_academic_topics_${userId}`, JSON.stringify(academicTopics));
  }, [academicTopics, userId]);

  useEffect(() => {
    localStorage.setItem(`edutechlife_conversation_count_${userId}`, conversationCount.toString());
  }, [conversationCount, userId]);

  useEffect(() => {
    localStorage.setItem(`edutechlife_vak_${userId}`, JSON.stringify(vakResult));
  }, [vakResult, userId]);

  useEffect(() => {
    localStorage.setItem(`edutechlife_points_${userId}`, totalPoints.toString());
  }, [totalPoints, userId]);

  useEffect(() => {
    localStorage.setItem(`edutechlife_points_history_${userId}`, JSON.stringify(pointsHistory));
  }, [pointsHistory, userId]);

  useEffect(() => {
    localStorage.setItem(`edutechlife_rewards_${userId}`, JSON.stringify(unlockedRewards));
  }, [unlockedRewards, userId]);

  useEffect(() => {
    localStorage.setItem(`edutechlife_calendar_${userId}`, JSON.stringify(calendarEvents));
  }, [calendarEvents, userId]);

  useEffect(() => {
    localStorage.setItem(`edutechlife_read_news_${userId}`, JSON.stringify(readNews));
  }, [readNews, userId]);

  useEffect(() => {
    localStorage.setItem(`edutechlife_minutes_${userId}`, totalActiveMinutes.toString());
  }, [totalActiveMinutes, userId]);

  useEffect(() => {
    localStorage.setItem(`edutechlife_activities_${userId}`, JSON.stringify(uploadedActivities));
  }, [uploadedActivities, userId]);

  useEffect(() => {
    localStorage.setItem(`edutechlife_analyzed_${userId}`, JSON.stringify(analyzedActivities));
  }, [analyzedActivities, userId]);

  useEffect(() => {
    localStorage.setItem(`edutechlife_streak_log_${userId}`, JSON.stringify(streakLog));
  }, [streakLog, userId]);

  // ==================== REWARD EFFECTS STATE ====================
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_dark_mode_${userId}`);
    return saved === 'true';
  });
  const [avatarAnimado, setAvatarAnimado] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_avatar_animado_${userId}`);
    return saved === 'true';
  });
  const [fondoGalaxia, setFondoGalaxia] = useState(() => {
    const saved = localStorage.getItem(`edutechlife_fondo_galaxia_${userId}`);
    return saved === 'true';
  });
  const [lastUnlockedReward, setLastUnlockedReward] = useState(null);

  // Apply reward effects when unlocked
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem(`edutechlife_dark_mode_${userId}`, darkMode);
  }, [darkMode, userId]);

  useEffect(() => {
    localStorage.setItem(`edutechlife_avatar_animado_${userId}`, avatarAnimado);
  }, [avatarAnimado, userId]);

  useEffect(() => {
    localStorage.setItem(`edutechlife_fondo_galaxia_${userId}`, fondoGalaxia);
  }, [fondoGalaxia, userId]);

  // ==================== ACTIONS ====================
  const addPoints = useCallback((points, reason) => {
    setTotalPoints(prev => prev + points);
    setPointsHistory(prev => [
      ...prev,
      { points, reason, timestamp: new Date() },
    ]);
  }, []);

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
    setStudentMoodHistory(prev => {
      const updated = [...prev, entry].slice(-30);
      localStorage.setItem(`edutechlife_mood_history_${userId}`, JSON.stringify(updated));
      return updated;
    });
  }, [userId]);

  const trackAcademicTopic = useCallback((topic) => {
    if (!topic) return;
    setAcademicTopics(prev => {
      const existing = prev.find(t => t.topic === topic);
      const updated = existing
        ? prev.map(t => t.topic === topic ? { ...t, count: t.count + 1, lastAsked: new Date() } : t)
        : [...prev, { topic, count: 1, lastAsked: new Date() }];
      localStorage.setItem(`edutechlife_academic_topics_${userId}`, JSON.stringify(updated));
      return updated;
    });
  }, [userId]);

  const buildDaniContext = useCallback(() => {
    const now = new Date();
    const fecha = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const hora = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const todayStr = now.toISOString().split('T')[0];

    const todayEvents = calendarEvents.filter(e => e.date === todayStr);
    const savedMissions = localStorage.getItem(`edutechlife_missions`) || localStorage.getItem(`edutechlife_missions_${userId}`);
    const allMissions = savedMissions ? JSON.parse(savedMissions) : [];
    const pendingMissions = allMissions.filter(m => !m.completed);

    const lastMoods = studentMoodHistory.slice(-5).map(m =>
      `${m.mood}${m.confidence > 0.7 ? ' (alta confianza)' : ''}`
    ).join(', ');

    const recentTopics = academicTopics.slice(-5).map(t => t.topic).join(', ');

    const savedSubjects = localStorage.getItem(`edutechlife_subjects`) || localStorage.getItem(`edutechlife_subjects_${userId}`);
    const subjects = savedSubjects ? JSON.parse(savedSubjects) : [];
    const subjectsStr = subjects.map(s => `${s.name}${s.progress ? ` (${s.progress}%)` : ''}`).join(', ');

    let context = `INFORMACIÓN DEL ESTUDIANTE:\n`;
    context += `- Fecha: ${fecha}\n`;
    context += `- Hora: ${hora}\n`;
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
  }, [vakResult, totalPoints, streak, calendarEvents, studentMoodHistory, academicTopics, userId, conversationCount]);

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
    setAnalyzedActivities(prev => {
      const updated = [analysis, ...prev].slice(-20);
      localStorage.setItem(`edutechlife_analyzed_${userId}`, JSON.stringify(updated));
      return updated;
    });
    addPoints(100, 'Actividad analizada por Dani');
  }, [addPoints, userId]);

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
  };

  return (
    <SmartBoardKidsContext.Provider value={value}>
      {children}
    </SmartBoardKidsContext.Provider>
  );
};
