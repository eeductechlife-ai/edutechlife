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
import { API_BASE_URL } from "../config/api";
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
  useSessionEnd,
  useAcademicContext,
  useUpsertAcademicContext,
  useAchievements,
  useLearningStreaks,
  useUpsertStreak,
  useSyncAchievement,
  useSmartboardSettings,
  useUpdateSettings,
  useTotalPoints,
  useSessionsData,
} from "../hooks/useSmartBoardSupabase";
import useTimetable from "../hooks/useTimetable";
import { useSubjectProgressPersistence } from "../hooks/useSubjectProgressPersistence";
import { useDaniMemory } from "../hooks/useDaniMemory";

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

// Safe version — returns null when used outside the provider (e.g. AppLayout)
export const useSmartBoardKidsSafe = () =>
  useContext(SmartBoardKidsContext) ?? null;

export const SmartBoardKidsProvider = ({ children }) => {
  // Local state (for backward compatibility and instant UI updates)
  const [daniChatHistory, setDaniChatHistory] = useState([]);
  const [daniMood, setDaniMood] = useState("happy");
  const [studentMoodHistory, setStudentMoodHistory] = useState([]);
  const [academicTopics, setAcademicTopics] = useState([]);
  const [conversationCount, setConversationCount] = useState(0);
  const [studentAge, setStudentAge] = useState(null);
  const [gradeLevel, setGradeLevel] = useState(null);
  const [countryCode, setCountryCode] = useState("CO");
  const [schoolName, setSchoolName] = useState("");
  const [vakResult, setVakResult] = useState(null);
  const [vakRecommendations, setVakRecommendations] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [unlockedRewards, setUnlockedRewards] = useState([]);

  const sessionStartRef = useRef(new Date());
  const dbSessionIdRef = useRef(null);
  const isSessionInitializedRef = useRef(false);
  const [totalActiveMinutes, setTotalActiveMinutes] = useState(0);

  // Persistent progress: subject time + sessions
  const { subjectTime, sessions, setSubjectTime, setSessions, saveProgress } =
    useSubjectProgressPersistence();

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
      parentGoal: null,
    },
    pendingTopics: [],
    interactionCount: 0,
    lastSessionSummary: null,
  });
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
  const [lastUnlockedBadge, setLastUnlockedBadge] = useState(null);

  const [flashcardDecks, setFlashcardDecks] = useState([]);
  const [exams, setExams] = useState([]);
  const [examMaterials, setExamMaterials] = useState({});
  const [smartBookHistory, setSmartBookHistory] = useState([]);
  const [planCompletedActivities, setPlanCompletedActivities] = useState([]);
  // Active study loop: deck selected in Flashcards → used by Habla con Dani + Examen
  const [activeStudyDeck, setActiveStudyDeck] = useState(null); // { deckId, title, cards, topic }
  const [studentGrades, setStudentGrades] = useState(() => {
    // Eager-load from localStorage so subjectsWithGrades populates before GradeScanner mounts
    // (userId not yet available — will be refreshed via useEffect below)
    try {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith("edutechlife_grades_"),
      );
      if (keys.length === 1) {
        const parsed = JSON.parse(localStorage.getItem(keys[0]));
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch {}
    return [];
  });

  // Onboarding state (persisted per-user via localStorage pattern)
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

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
  const sessionEndMutation = useSessionEnd();
  const upsertStreakMutation = useUpsertStreak();
  const upsertAcademicContextMutation = useUpsertAcademicContext();
  const syncAchievementMutation = useSyncAchievement();

  // Calculated total points from Supabase
  const supabaseTotalPoints = useTotalPoints();

  // Dani memory — persists to Supabase dani_memory table (Sprint 2)
  const studentDbId = studentDataQuery.data?.id ?? null;
  const { saveMemory: saveDaniMemoryToDB } = useDaniMemory(studentDbId);

  // Timetable (single instance for all consumers)
  const timetableData = useTimetable();

  // Legacy persistence layer (kept for backward compatibility)
  const { dataLoaded, saveData, userId, isConnected, syncLoading } =
    useSmartBoardPersistence({
      setDaniChatHistory,
      setStudentMoodHistory,
      setAcademicTopics,
      setConversationCount,
      setStudentAge,
      setGradeLevel,
      setCountryCode,
      setSchoolName,
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

  // Compute average score from a grade entry (supports 4-period format or legacy single score)
  const gradeAvg = useCallback((g) => {
    const vals = [g.p1, g.p2, g.p3, g.p4].filter(
      (v) => v != null && !isNaN(Number(v)),
    );
    if (vals.length)
      return vals.reduce((a, b) => a + Number(b), 0) / vals.length;
    return Number(g.score) || 0;
  }, []);

  // Period-over-period trend from the last two entered periods (P1→P4).
  // Returns { delta, dir: "up"|"down"|"flat" } or null when <2 periods exist.
  const gradeTrend = useCallback((g) => {
    const periods = [g.p1, g.p2, g.p3, g.p4]
      .map((v) => (v == null || isNaN(Number(v)) ? null : Number(v)))
      .filter((v) => v != null);
    if (periods.length < 2) return null;
    const delta = periods[periods.length - 1] - periods[periods.length - 2];
    const rounded = Math.round(delta * 10) / 10;
    return {
      delta: rounded,
      dir: rounded > 0.05 ? "up" : rounded < -0.05 ? "down" : "flat",
    };
  }, []);

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
      "#7C3AED",
      "#DB2777",
      "#0891B2",
      "#059669",
      "#D97706",
      "#DC2626",
      "#2563EB",
      "#65A30D",
      "#9333EA",
      "#C2410C",
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
      const gradeScore = gradeAvg(match);
      const progress = Math.min(100, Math.round((gradeScore / 5) * 100));
      return { ...subject, progress, gradeScore, trend: gradeTrend(match) };
    });

    // Step 2: add extra subjects from the boletín that didn't match any default
    let colorIdx = 0;
    const extras = studentGrades
      .filter((g) => !matchedGradeKeys.has(norm(g.subject)))
      .map((g) => {
        const color = EXTRA_COLORS[colorIdx++ % EXTRA_COLORS.length];
        const gradeScore = gradeAvg(g);
        const progress = Math.min(100, Math.round((gradeScore / 5) * 100));
        return {
          id: norm(g.subject) || `extra_${colorIdx}`,
          name: g.subject,
          icon: getSubjectEmoji(g.subject),
          color,
          progress,
          gradeScore,
          trend: gradeTrend(g),
        };
      });

    return [...updatedDefaults, ...extras];
  }, [subjects, studentGrades, gradeAvg, gradeTrend]);

  const {
    addPoints,
    completeMission,
    unlockReward,
    toggleDarkMode,
    addDaniMessage,
    recordMoodInference,
    trackAcademicTopic,
    updateDaniMemory: _updateDaniMemory,
    buildMemoryInjection,
    buildDaniContext,
    setVakResultAndRecommendations,
    addCalendarEvent,
    addUploadedActivity,
    addAnalyzedActivity,
    markNewsAsRead,
  } = actions;

  // Wrap updateDaniMemory to also persist to Supabase (Sprint 2)
  const updateDaniMemory = useCallback(
    (parsed) => {
      _updateDaniMemory(parsed);
      // Save updated memory to DB after React state update settles
      setTimeout(() => {
        setDaniMemory((current) => {
          saveDaniMemoryToDB(current);
          return current;
        });
      }, 100);
    },
    [_updateDaniMemory, saveDaniMemoryToDB],
  );

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

  // Fetch missions from backend when student DB id is available
  useEffect(() => {
    if (!studentDbId) return;
    const API_BASE_URL = import.meta.env.VITE_API_URL || "";
    const token = (() => {
      try {
        return sessionStorage.getItem("auth_token") || "";
      } catch {
        return "";
      }
    })();
    fetch(
      `${API_BASE_URL}/api/smartboard/gamification/missions?studentId=${studentDbId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (Array.isArray(data.missions) && data.missions.length > 0) {
          setMissions(data.missions);
        }
      })
      .catch(() => {
        /* keep DEFAULT_MISSIONS fallback */
      });
  }, [studentDbId]);

  useEffect(() => {
    if (studentDataQuery.data) {
      setStudentAge(studentDataQuery.data.age);
      setSubscriptionTier(studentDataQuery.data.subscription_tier || "basic");
      if (studentDataQuery.data.grade_level)
        setGradeLevel(studentDataQuery.data.grade_level);
      if (studentDataQuery.data.country_code)
        setCountryCode(studentDataQuery.data.country_code);
    }
  }, [studentDataQuery.data]);

  // Load Dani chat history from server (P0.6 — localStorage→DB migration)
  const daniHistoryLoaded = useRef(false);
  useEffect(() => {
    if (!dataLoaded || !userId || daniHistoryLoaded.current) return;
    daniHistoryLoaded.current = true;

    const API_BASE_URL = import.meta.env.VITE_API_URL || "";
    const token = (() => {
      try {
        return sessionStorage.getItem("auth_token") || "";
      } catch {
        return "";
      }
    })();
    if (!token) return;

    fetch(`${API_BASE_URL}/api/smartboard/dani/history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.messages?.length) {
          setDaniChatHistory(
            data.messages.map((m) => ({
              role: m.role,
              text: m.text,
              type: "text",
              data: null,
              id:
                Date.now().toString(36) +
                Math.random().toString(36).slice(2, 8),
              timestamp: m.timestamp,
            })),
          );
        }
      })
      .catch(() => {});
  }, [dataLoaded, userId]);

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

  // Session tracking — create session in DB on mount, end on unmount
  useEffect(() => {
    if (!dataLoaded || isSessionInitializedRef.current) return;
    isSessionInitializedRef.current = true;

    // Create local session object for UI
    const localSession = {
      id: Date.now(),
      start: new Date(),
      date: new Date().toISOString().split("T")[0],
      subject: null,
    };
    currentSessionRef.current = localSession;

    // Create session in DB — fire-and-forget with ref to save sessionId
    sessionCreateMutation.mutate(
      {
        subject: "dashboard",
        type: "dashboard",
      },
      {
        onSuccess: (data) => {
          dbSessionIdRef.current = data.id;
        },
        onError: (err) => {
          console.warn("Failed to create DB session:", err.message);
        },
      },
    );

    return () => {
      // Add to local sessions array
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

      // End session in DB if one was created
      if (dbSessionIdRef.current) {
        sessionEndMutation.mutate(
          {
            sessionId: dbSessionIdRef.current,
            completion_percentage: 100,
          },
          {
            onError: (err) => {
              console.warn("Failed to end DB session:", err.message);
            },
          },
        );
        dbSessionIdRef.current = null;
      }
    };
  }, [userId, dataLoaded, sessionCreateMutation, sessionEndMutation]);

  // Sync grades from localStorage keyed by userId, fallback to backend
  useEffect(() => {
    if (!userId) return;
    try {
      const stored = localStorage.getItem(`edutechlife_grades_${userId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          setStudentGrades(parsed);
          return;
        }
      }
    } catch {}
    const token = sessionStorage.getItem("auth_token");
    if (!token) return;
    fetch(`${API_BASE_URL}/api/smartboard/student-grades`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10000),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data?.grades) && data.grades.length) {
          setStudentGrades(data.grades);
          try {
            localStorage.setItem(
              `edutechlife_grades_${userId}`,
              JSON.stringify(data.grades),
            );
          } catch {}
        }
      })
      .catch(() => {});
  }, [userId]);

  // Sync academic context to DB when subject time changes
  useEffect(() => {
    if (
      !dataLoaded ||
      !userId ||
      !subjectTime ||
      Object.keys(subjectTime).length === 0
    )
      return;

    // Upsert each subject with its time
    Object.entries(subjectTime).forEach(([subject, minutes]) => {
      if (minutes > 0) {
        upsertAcademicContextMutation.mutate({
          subject,
          lessons_completed: Math.floor(minutes / 30), // Estimate: 1 lesson ≈ 30 mins
          average_score: 75, // Default; can be updated by content-specific logic
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectTime, dataLoaded, userId]);

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

  // Persist streak to DB when it changes
  useEffect(() => {
    if (!dataLoaded || !userId || !streak.lastActive) return;
    upsertStreakMutation.mutate({
      current_streak: streak.current,
      best_streak: streak.longest,
      last_activity_date: streak.lastActive,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streak.current, streak.longest, streak.lastActive, dataLoaded, userId]);

  // Sync computed achievements to DB
  const syncedAchievementsRef = useRef(new Set());
  useEffect(() => {
    if (!dataLoaded || !userId) return;
    const completedMissions = missions.filter((m) => m.completed);
    const checks = [];
    if (completedMissions.length >= missions.length && missions.length > 0)
      checks.push({
        achievement_type: "all_missions",
        title: "Estrella del Mes",
        description: "Completaste todas las misiones",
      });
    if (completedMissions.length >= 5)
      checks.push({
        achievement_type: "five_missions",
        title: "Rápido Aprendiz",
        description: `${completedMissions.length} misiones completadas`,
      });
    if (totalPoints >= 500)
      checks.push({
        achievement_type: "points_500",
        title: "Acumulador",
        description: `${totalPoints} puntos acumulados`,
      });
    if (totalPoints >= 1000)
      checks.push({
        achievement_type: "points_1000",
        title: "Preciso",
        description: "Más de 1000 puntos acumulados",
      });
    if (streak.current >= 7)
      checks.push({
        achievement_type: "streak_7",
        title: "Consistente",
        description: `${streak.current} días seguidos activo`,
      });
    if (streak.current >= 3)
      checks.push({
        achievement_type: "streak_3",
        title: "Racha Activa",
        description: `${streak.current} días de racha`,
      });
    if (vakResult)
      checks.push({
        achievement_type: "vak_complete",
        title: "Conoces tu Estilo",
        description: `Perfil ${vakResult.predominantStyle || vakResult.primary_style || "identificado"}`,
      });
    if (totalActiveMinutes >= 600)
      checks.push({
        achievement_type: "study_600min",
        title: "Dedicado",
        description: `Más de ${Math.floor(totalActiveMinutes / 60)}h de estudio`,
      });

    for (const a of checks) {
      if (!syncedAchievementsRef.current.has(a.achievement_type)) {
        syncedAchievementsRef.current.add(a.achievement_type);
        syncAchievementMutation.mutate(a);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataLoaded,
    userId,
    missions,
    totalPoints,
    streak.current,
    vakResult,
    totalActiveMinutes,
  ]);

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
    if (gradeLevel) setLocalStorage(`grade_${userId}`, gradeLevel);
    if (countryCode) setLocalStorage(`country_${userId}`, countryCode);
    if (schoolName) setLocalStorage(`school_${userId}`, schoolName);
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

    // Sync subject progress to backend (fire-and-forget)
    if (subjectTime || sessions?.length) {
      saveProgress(subjectTime, sessions);
    }
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

  // Derived onboarding progress values
  const vakCompleted = useMemo(() => !!vakResult, [vakResult]);
  const hasUploadedSchedule = useMemo(
    () => (timetableData.slots?.length ?? 0) > 0,
    [timetableData.slots],
  );
  const hasGrades = useMemo(
    () => (studentGrades?.length ?? 0) > 0,
    [studentGrades],
  );
  const nextRecommendedStep = useMemo(() => {
    if (!vakCompleted) return "vak";
    if (!hasUploadedSchedule) return "horario";
    if (!hasGrades) return "calificaciones";
    return null;
  }, [vakCompleted, hasUploadedSchedule, hasGrades]);

  // Load onboarding state from localStorage when userId is known
  useEffect(() => {
    if (!userId) return;
    const completed = getLocalStorage(`onboarding_complete_${userId}`, false);
    const welcomed = getLocalStorage(`onboarding_welcomed_${userId}`, false);
    const step = getLocalStorage(`onboarding_step_${userId}`, 0);
    setOnboardingComplete(completed);
    setHasSeenWelcome(welcomed);
    setOnboardingStep(step);
  }, [userId]);

  // Persist onboarding state changes
  useEffect(() => {
    if (!userId) return;
    setLocalStorage(`onboarding_complete_${userId}`, onboardingComplete);
  }, [userId, onboardingComplete]);

  useEffect(() => {
    if (!userId) return;
    setLocalStorage(`onboarding_welcomed_${userId}`, hasSeenWelcome);
  }, [userId, hasSeenWelcome]);

  useEffect(() => {
    if (!userId) return;
    setLocalStorage(`onboarding_step_${userId}`, onboardingStep);
  }, [userId, onboardingStep]);

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
      // Store previous total for potential rollback
      const previousTotal = totalPoints;
      // Add to local state immediately (optimistic)
      addPoints(amount, reason);
      // Also sync to Supabase
      if (userId) {
        addPointsMutation.mutate(
          {
            points: amount,
            reason,
            category: "bonus",
          },
          {
            onError: () => {
              // Rollback on mutation error
              setTotalPoints(previousTotal);
            },
          },
        );
      }
    },
    [addPoints, userId, addPointsMutation, totalPoints],
  );

  const setVakResultWithSupabase = useCallback(
    (result, recommendations) => {
      // Normalize scores regardless of shape:
      // VAKDiagnosticEnhanced emits { scores: { visual, auditivo, kinestesico }, predominantStyle }
      // Legacy callers may emit { visual, auditory, kinesthetic, dominant }
      const visualScore = result?.scores?.visual ?? result?.visual ?? 0;
      const auditoryScore = result?.scores?.auditivo ?? result?.auditory ?? 0;
      const kinestheticScore =
        result?.scores?.kinestesico ?? result?.kinesthetic ?? 0;
      const primaryStyle = result?.predominantStyle ?? result?.dominant ?? null;

      // Enrich result with both alias keys so consumers (e.g. GradeScanner)
      // can read either `predominantStyle` or `dominant`
      const normalizedResult = {
        ...result,
        predominantStyle: primaryStyle,
        dominant: primaryStyle,
      };

      // Add to local state immediately
      setVakResultAndRecommendations(normalizedResult, recommendations);

      // Sync to Supabase whenever we have at least one score
      if (visualScore !== undefined) {
        setVAKMutation.mutate({
          visual_score: visualScore,
          auditory_score: auditoryScore,
          kinesthetic_score: kinestheticScore,
          responses: result?.responses || {},
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
    ageGroup:
      studentAge <= 8 ? "early" : studentAge <= 12 ? "middle" : "senior",
    gradeLevel,
    setGradeLevel,
    countryCode,
    setCountryCode,
    schoolName,
    setSchoolName,

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
    toggleDarkMode,
    avatarAnimado,
    fondoGalaxia,
    lastUnlockedReward,
    lastUnlockedBadge,
    setLastUnlockedBadge,

    // Time
    totalActiveMinutes,

    // Session tracking
    sessions,
    streak,
    streakLog,
    subjectTime,
    trackSubjectTime,
    createSession: createSessionWithSupabase,

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
    examMaterials,
    setExamMaterials,
    smartBookHistory,
    setSmartBookHistory,
    planCompletedActivities,
    setPlanCompletedActivities,

    // Onboarding
    onboardingComplete,
    setOnboardingComplete,
    hasSeenWelcome,
    setHasSeenWelcome,
    onboardingStep,
    setOnboardingStep,
    vakCompleted,
    hasUploadedSchedule,
    hasGrades,
    nextRecommendedStep,

    // Learning loop
    activeStudyDeck,
    setActiveStudyDeck,
    studentGrades,
    setStudentGrades,
    gradeAvg,
    gradeTrend,

    // Timetable (weekly schedule + exams)
    timetable: timetableData.timetable,
    slots: timetableData.slots,
    exams: timetableData.exams,
    timetableLoading: timetableData.loading,
    timetableError: timetableData.error,
    saveTimetableWithSlots: timetableData.saveTimetableWithSlots,
    saveTimetable: timetableData.saveTimetable,
    saveSlots: timetableData.saveSlots,
    addExam: timetableData.addExam,
    removeExam: timetableData.removeExam,
    currentClass: timetableData.currentClass,
    nextClass: timetableData.nextClass,
    todayClasses: timetableData.todayClasses,
    upcomingExams: timetableData.upcomingExams,
    reloadTimetable: timetableData.reload,

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
