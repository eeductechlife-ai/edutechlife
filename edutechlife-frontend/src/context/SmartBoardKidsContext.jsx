import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  DEFAULT_NEWS,
  DEFAULT_MISSIONS,
  DEFAULT_SUBJECTS,
} from "./smartBoardData";
import { getSubjectEmoji } from "../config/subjectMappings";
import {
  useSmartBoardPersistence,
  getLocalStorage,
  setLocalStorage,
} from "./useSmartBoardPersistence";
import { useSmartBoardActions } from "./useSmartBoardActions";
import {
  useStudentData,
  usePointsHistory,
  useAddPoints as useAddPointsMutation,
  useVAKResult,
  useSetVAKResult,
  useSessionCreate as useSessionCreateMutation,
  useAcademicContext,
  useAchievements,
  useLearningStreaks,
  useSmartboardSettings,
  useUpdateSettings,
  useTotalPoints,
  useSessionsData,
} from "../hooks/useSmartBoardSupabase";

export const SmartBoardKidsContext = createContext();

export const useSmartBoardKids = () => {
  const context = useContext(SmartBoardKidsContext);
  if (!context) {
    throw new Error(
      "useSmartBoardKids must be used within SmartBoardKidsProvider",
    );
  }
  return context;
};

export const SmartBoardKidsProvider = ({ children }) => {
  // Local state (for backward compatibility and instant UI updates)
  const [daniChatHistory, setDaniChatHistory] = useState([]);
  const [daniMood, setDaniMood] = useState("happy");
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
  const [streak, setStreak] = useState({
    current: 0,
    longest: 0,
    lastActive: null,
  });
  const [streakLog, setStreakLog] = useState([]);
  const [daniMemory, setDaniMemory] = useState({
    conversations: [],
    studentProfile: {
      communicationStyle: null,
      strengths: [],
      challenges: [],
      interests: [],
    },
    pendingTopics: [],
    interactionCount: 0,
    lastSessionSummary: null,
  });
  const [subjectTime, setSubjectTime] = useState({});
  const currentSessionRef = useRef(null);

  const [calendarEvents, setCalendarEvents] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  const [newsItems, setNewsItems] = useState(DEFAULT_NEWS);
  const [readNews, setReadNews] = useState([]);

  const [missions, setMissions] = useState(DEFAULT_MISSIONS);
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);

  const [uploadedActivities, setUploadedActivities] = useState([]);
  const [analyzedActivities, setAnalyzedActivities] = useState([]);
  const [documentForDani, setDocumentForDani] = useState(null);

  const [subscriptionTier, setSubscriptionTier] = useState(() =>
    getLocalStorage("subscription_tier", "basic"),
  );
  const [darkMode, setDarkMode] = useState(false);
  const [avatarAnimado, setAvatarAnimado] = useState(false);
  const [fondoGalaxia, setFondoGalaxia] = useState(false);
  const [lastUnlockedReward, setLastUnlockedReward] = useState(null);

  const [flashcardDecks, setFlashcardDecks] = useState([]);
  const [exams, setExams] = useState([]);
  const [examMaterials, setExamMaterials] = useState({});
  const [smartBookHistory, setSmartBookHistory] = useState([]);
  const [planCompletedActivities, setPlanCompletedActivities] = useState([]);
  // Active study loop: deck selected in Flashcards → used by Habla con Dani + Examen
  const [activeStudyDeck, setActiveStudyDeck] = useState(null); // { deckId, title, cards, topic }
  const [studentGrades, setStudentGrades] = useState([]);

  const syncTimeoutRef = useRef(null);

  // Supabase/React Query hooks
  const studentDataQuery = useStudentData();
  const pointsHistoryQuery = usePointsHistory();
  const vakResultQuery = useVAKResult();
  const sessionsDataQuery = useSessionsData();
  const achievementsQuery = useAchievements();
  const learningStreaksQuery = useLearningStreaks();
  const settingsQuery = useSmartboardSettings();
  const addPointsMutation = useAddPointsMutation();
  const setVAKMutation = useSetVAKResult();
  const sessionCreateMutation = useSessionCreateMutation();

  // Calculated total points from Supabase
  const supabaseTotalPoints = useTotalPoints();

  // Legacy persistence layer (kept for backward compatibility)
  const { dataLoaded, saveData, userId, isConnected, syncLoading } =
    useSmartBoardPersistence({
      setDaniChatHistory,
      setStudentMoodHistory,
      setAcademicTopics,
      setConversationCount,
      setStudentAge,
      setTotalPoints,
      setPointsHistory,
      setUnlockedRewards,
      setTotalActiveMinutes,
      setSessions,
      setStreak,
      setStreakLog,
      setDaniMemory,
      setSubjectTime,
      setCalendarEvents,
      setReadNews,
      setMissions,
      setSubjects,
      setUploadedActivities,
      setAnalyzedActivities,
      setDarkMode,
      setAvatarAnimado,
      setFondoGalaxia,
      setSubscriptionTier,
      setVakResult,
      setFlashcardDecks,
      setExams,
      setExamMaterials,
      setSmartBookHistory,
      setPlanCompletedActivities,
    });

  const actions = useSmartBoardActions({
    setTotalPoints,
    setPointsHistory,
    setMissions,
    missions,
    setUnlockedRewards,
    setLastUnlockedReward,
    setDarkMode,
    setAvatarAnimado,
    setFondoGalaxia,
    setConversationCount,
    setDaniChatHistory,
    setStudentMoodHistory,
    setAcademicTopics,
    setDaniMemory,
    setVakResult,
    setVakRecommendations,
    setCalendarEvents,
    setUploadedActivities,
    setAnalyzedActivities,
    setReadNews,
    daniMemory,
    studentMoodHistory,
    academicTopics,
    subjects,
    calendarEvents,
    studentAge,
    totalPoints,
    streak,
    conversationCount,
    vakResult,
    userId,
  });

  // Derive subject progress from scanned student grades (nota/5 × 100).
  // When grades exist, shows ALL scanned subjects (not just the 6 defaults).
  const subjectsWithGrades = useMemo(() => {
    if (!studentGrades?.length) return subjects;

    const norm = (s) =>
      (s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]/g, "");

    // Keywords to match each default subject against boletín subject names
    const KEYWORDS = {
      matematicas: ["matemat", "geometr", "algebra"],
      lenguaje: ["lengua", "lenguaj", "castellan", "lecto", "escritura"],
      ciencias: ["ciencia", "natur", "quimic", "biolog", "fisic"],
      historia: ["social", "histor", "civism", "ciudadan", "geograf"],
      ingles: ["ingles", "english"],
      arte: ["arte", "artist", "music"],
    };

    // Color palette for extra subjects not in the defaults
    const EXTRA_COLORS = [
      "#7C3AED", "#DB2777", "#0891B2", "#059669", "#D97706",
      "#DC2626", "#2563EB", "#65A30D", "#9333EA", "#C2410C",
    ];

    // Step 1: update the 6 default subjects with matching grade data
    const matchedGradeKeys = new Set();
    const updatedDefaults = subjects.map((subject) => {
      const keys = KEYWORDS[subject.id] || [norm(subject.name).slice(0, 5)];
      const match = studentGrades.find((g) => {
        const gn = norm(g.subject);
        return keys.some((k) => gn.includes(k));
      });
      if (!match) return subject;
      matchedGradeKeys.add(norm(match.subject));
      const progress = Math.min(100, Math.round((match.score / 5) * 100));
      return { ...subject, progress, gradeScore: match.score };
    });

    // Step 2: add extra subjects from the boletín that didn't match any default
    let colorIdx = 0;
    const extras = studentGrades
      .filter((g) => !matchedGradeKeys.has(norm(g.subject)))
      .map((g) => {
        const color = EXTRA_COLORS[colorIdx++ % EXTRA_COLORS.length];
        const progress = Math.min(100, Math.round((g.score / 5) * 100));
        return {
          id: norm(g.subject) || `extra_${colorIdx}`,
          name: g.subject,
          icon: getSubjectEmoji(g.subject),
          color,
          progress,
          gradeScore: g.score,
        };
      });

    return [...updatedDefaults, ...extras];
  }, [subjects, studentGrades]);

  const {
    addPoints,
    completeMission,
    unlockReward,
    addDaniMessage,
    recordMoodInference,
    trackAcademicTopic,
    updateDaniMemory,
    buildMemoryInjection,
    buildDaniContext,
    setVakResultAndRecommendations,
    addCalendarEvent,
    addUploadedActivity,
    addAnalyzedActivity,
    markNewsAsRead,
  } = actions;

  // Sync Supabase data to local state
  useEffect(() => {
    if (pointsHistoryQuery.data) {
      setPointsHistory(pointsHistoryQuery.data);
      const total = pointsHistoryQuery.data.reduce(
        (sum, entry) => sum + entry.points,
        0,
      );
      setTotalPoints(total);
    }
  }, [pointsHistoryQuery.data]);

  useEffect(() => {
    if (vakResultQuery.data) {
      setVakResult(vakResultQuery.data);
    }
  }, [vakResultQuery.data]);

  useEffect(() => {
    if (sessionsDataQuery.data) {
      setSessions(sessionsDataQuery.data);
    }
  }, [sessionsDataQuery.data]);

  useEffect(() => {
    if (learningStreaksQuery.data) {
      setStreak({
        current: learningStreaksQuery.data.current_streak || 0,
        longest: learningStreaksQuery.data.best_streak || 0,
        lastActive: learningStreaksQuery.data.last_activity_date,
      });
    }
  }, [learningStreaksQuery.data]);

  useEffect(() => {
    if (studentDataQuery.data) {
      setStudentAge(studentDataQuery.data.age);
      setSubscriptionTier(studentDataQuery.data.subscription_tier || "basic");
    }
  }, [studentDataQuery.data]);

  // Earn points for active minutes
  useEffect(() => {
    if (!dataLoaded) return;
    const interval = setInterval(() => {
      const minutes = Math.floor(
        (new Date() - sessionStartRef.current) / 1000 / 60,
      );
      if (minutes > 0 && minutes !== totalActiveMinutes) {
        setTotalActiveMinutes((prev) => prev + 1);
        addPoints(1, "Minuto activo en dashboard");
        sessionStartRef.current = new Date();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [totalActiveMinutes, dataLoaded]);

  // Session tracking
  useEffect(() => {
    if (!dataLoaded) return;
    const session = {
      id: Date.now(),
      start: new Date(),
      date: new Date().toISOString().split("T")[0],
      subject: null,
    };
    currentSessionRef.current = session;
    return () => {
      if (currentSessionRef.current) {
        const ended = {
          ...currentSessionRef.current,
          end: new Date(),
          duration: Math.floor(
            (new Date() - new Date(currentSessionRef.current.start)) /
              1000 /
              60,
          ),
        };
        setSessions((prev) => [...prev, ended]);
      }
    };
  }, [userId, dataLoaded]);

  // Daily streak
  useEffect(() => {
    if (!dataLoaded) return;
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    setStreak((prev) => {
      if (prev.lastActive === today) return prev;
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];
      const newCurrent = prev.lastActive === yesterday ? prev.current + 1 : 1;
      return {
        current: newCurrent,
        longest: Math.max(newCurrent, prev.longest),
        lastActive: today,
      };
    });
    setStreakLog((prev) => {
      if (prev.some((entry) => entry.date === today)) return prev;
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      return [
        ...prev,
        {
          date: today,
          timestamp: now.toISOString(),
          hour: `${hours}:${minutes}`,
        },
      ].slice(-90);
    });
  }, [userId, dataLoaded]);

  const trackSubjectTime = useCallback((subjectId, minutes) => {
    setSubjectTime((prev) => ({
      ...prev,
      [subjectId]: (prev[subjectId] || 0) + minutes,
    }));
  }, []);

  // Sync to localStorage + Supabase
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
    setLocalStorage(`dani_memory_${userId}`, daniMemory);
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
    setLocalStorage("subscription_tier", subscriptionTier);
    setLocalStorage(`flashcards_${userId}`, flashcardDecks);
    setLocalStorage(`exams_${userId}`, exams);
    setLocalStorage(`exam_materials_${userId}`, examMaterials);
    setLocalStorage(`smartbooks_${userId}`, smartBookHistory);
    setLocalStorage(`plan_completed_${userId}`, planCompletedActivities);

    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      saveData({
        daniChatHistory,
        studentMoodHistory,
        academicTopics,
        conversationCount,
        studentAge,
        vakResult,
        totalPoints,
        pointsHistory,
        unlockedRewards,
        totalActiveMinutes,
        sessions,
        streak,
        streakLog,
        daniMemory,
        subjectTime,
        calendarEvents,
        readNews,
        missions,
        subjects,
        uploadedActivities,
        analyzedActivities,
        darkMode,
        avatarAnimado,
        fondoGalaxia,
        subscriptionTier,
        flashcardDecks,
        exams,
        examMaterials,
        smartBookHistory,
        planCompletedActivities,
      });
    }, 2000);
  }, [
    userId,
    daniChatHistory,
    studentMoodHistory,
    academicTopics,
    conversationCount,
    studentAge,
    vakResult,
    totalPoints,
    pointsHistory,
    unlockedRewards,
    totalActiveMinutes,
    sessions,
    streak,
    streakLog,
    subjectTime,
    calendarEvents,
    readNews,
    missions,
    subjects,
    uploadedActivities,
    analyzedActivities,
    darkMode,
    avatarAnimado,
    fondoGalaxia,
    subscriptionTier,
    flashcardDecks,
    exams,
    examMaterials,
    smartBookHistory,
    planCompletedActivities,
  ]);

  // Compute upcoming deadlines from calendar events
  const computedUpcomingDeadlines = useMemo(() => {
    const now = new Date();
    return calendarEvents
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10);
  }, [calendarEvents]);

  useEffect(() => {
    setUpcomingDeadlines(computedUpcomingDeadlines);
  }, [computedUpcomingDeadlines]);

  // Wrapper functions that use React Query mutations
  const addPointsWithSupabase = useCallback(
    (amount, reason) => {
      // Add to local state immediately
      addPoints(amount, reason);
      // Also sync to Supabase
      if (userId) {
        addPointsMutation.mutate({
          points: amount,
          reason,
          category: "bonus",
        });
      }
    },
    [addPoints, userId, addPointsMutation],
  );

  const setVakResultWithSupabase = useCallback(
    (result, recommendations) => {
      // Add to local state immediately
      setVakResultAndRecommendations(result, recommendations);
      // Also sync to Supabase
      if (result?.visual !== undefined) {
        setVAKMutation.mutate({
          visual_score: result.visual || 0,
          auditory_score: result.auditory || 0,
          kinesthetic_score: result.kinesthetic || 0,
          responses: result.responses || {},
        });
      }
    },
    [setVakResultAndRecommendations, setVAKMutation],
  );

  const createSessionWithSupabase = useCallback(
    (subject, type = "lesson") => {
      if (userId) {
        sessionCreateMutation.mutate({
          subject,
          type,
        });
      }
    },
    [userId, sessionCreateMutation],
  );

  const value = {
    // Loading & connectivity
    dataLoaded,
    syncLoading,
    isConnected,

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
    daniMemory,
    updateDaniMemory,
    buildMemoryInjection,

    // Student
    studentAge,
    setStudentAge,

    // VAK
    vakResult,
    vakRecommendations,
    setVakResultAndRecommendations: setVakResultWithSupabase,

    // Points
    totalPoints,
    pointsHistory,
    unlockedRewards,
    addPoints: addPointsWithSupabase,
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

    // Subscription
    subscriptionTier,
    setSubscriptionTier,

    // Missions & Subjects
    missions,
    subjects,
    subjectsWithGrades,
    completeMission,

    // Persisted data from other SmartBoard tools
    flashcardDecks,
    setFlashcardDecks,
    exams,
    setExams,
    examMaterials,
    setExamMaterials,
    smartBookHistory,
    setSmartBookHistory,
    planCompletedActivities,
    setPlanCompletedActivities,

    // Learning loop
    activeStudyDeck,
    setActiveStudyDeck,
    studentGrades,
    setStudentGrades,

    // Supabase/React Query hooks (for advanced usage)
    supabaseQueries: {
      studentData: studentDataQuery,
      pointsHistory: pointsHistoryQuery,
      vakResult: vakResultQuery,
      sessions: sessionsDataQuery,
      achievements: achievementsQuery,
      learningStreaks: learningStreaksQuery,
      settings: settingsQuery,
    },
  };

  return (
    <SmartBoardKidsContext.Provider value={value}>
      {children}
    </SmartBoardKidsContext.Provider>
  );
};
