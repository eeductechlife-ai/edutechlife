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
    return saved ? JSON.parse(saved) : [
      {
        role: 'assistant',
        text: '¡Hola! Soy Dani, tu tutor virtual. ¿En qué te puedo ayudar hoy? 😊',
        timestamp: new Date(),
      },
    ];
  });
  const [daniMood, setDaniMood] = useState('happy'); // happy, thinking, explaining, empathetic

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

  // ==================== PERSISTENCE ====================
  useEffect(() => {
    localStorage.setItem(`edutechlife_dani_chat_${userId}`, JSON.stringify(daniChatHistory));
  }, [daniChatHistory, userId]);

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

  // ==================== ACTIONS ====================
  const addPoints = useCallback((points, reason) => {
    setTotalPoints(prev => prev + points);
    setPointsHistory(prev => [
      ...prev,
      { points, reason, timestamp: new Date() },
    ]);
  }, []);

  const unlockReward = useCallback((rewardId) => {
    setUnlockedRewards(prev => [...prev, rewardId]);
    addPoints(-rewardId.cost, `Canjeó recompensa: ${rewardId.name}`);
  }, [addPoints]);

  const addDaniMessage = useCallback((message) => {
    setDaniChatHistory(prev => [...prev, {
      role: message.role,
      text: message.text,
      timestamp: new Date(),
    }]);
  }, []);

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
    
    // Time
    totalActiveMinutes,
    
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
  };

  return (
    <SmartBoardKidsContext.Provider value={value}>
      {children}
    </SmartBoardKidsContext.Provider>
  );
};
