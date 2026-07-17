import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react"
import { DEFAULT_NEWS, DEFAULT_MISSIONS, DEFAULT_SUBJECTS } from "./smartBoardData"
import { useSmartBoardPersistence, getLocalStorage, setLocalStorage } from "./useSmartBoardPersistence"
import { useSmartBoardActions } from "./useSmartBoardActions"

const SmartBoardKidsContext = createContext()

export const useSmartBoardKids = () => {
  const context = useContext(SmartBoardKidsContext)
  if (!context) {
    throw new Error("useSmartBoardKids must be used within SmartBoardKidsProvider")
  }
  return context
}

export const SmartBoardKidsProvider = ({ children }) => {
  const [daniChatHistory, setDaniChatHistory] = useState([])
  const [daniMood, setDaniMood] = useState("happy")
  const [studentMoodHistory, setStudentMoodHistory] = useState([])
  const [academicTopics, setAcademicTopics] = useState([])
  const [conversationCount, setConversationCount] = useState(0)
  const [studentAge, setStudentAge] = useState(null)
  const [vakResult, setVakResult] = useState(null)
  const [vakRecommendations, setVakRecommendations] = useState([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [pointsHistory, setPointsHistory] = useState([])
  const [unlockedRewards, setUnlockedRewards] = useState([])

  const sessionStartRef = useRef(new Date())
  const [totalActiveMinutes, setTotalActiveMinutes] = useState(0)

  const [sessions, setSessions] = useState([])
  const [streak, setStreak] = useState({ current: 0, longest: 0, lastActive: null })
  const [streakLog, setStreakLog] = useState([])
  const [daniMemory, setDaniMemory] = useState({
    conversations: [],
    studentProfile: { communicationStyle: null, strengths: [], challenges: [], interests: [] },
    pendingTopics: [],
    interactionCount: 0,
    lastSessionSummary: null,
  })
  const [subjectTime, setSubjectTime] = useState({})
  const currentSessionRef = useRef(null)

  const [calendarEvents, setCalendarEvents] = useState([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([])

  const [newsItems, setNewsItems] = useState(DEFAULT_NEWS)
  const [readNews, setReadNews] = useState([])

  const [missions, setMissions] = useState(DEFAULT_MISSIONS)
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS)

  const [uploadedActivities, setUploadedActivities] = useState([])
  const [analyzedActivities, setAnalyzedActivities] = useState([])
  const [documentForDani, setDocumentForDani] = useState(null)

  const [subscriptionTier, setSubscriptionTier] = useState(() => getLocalStorage("subscription_tier", "basic"))
  const [darkMode, setDarkMode] = useState(false)
  const [avatarAnimado, setAvatarAnimado] = useState(false)
  const [fondoGalaxia, setFondoGalaxia] = useState(false)
  const [lastUnlockedReward, setLastUnlockedReward] = useState(null)

  const [flashcardDecks, setFlashcardDecks] = useState([])
  const [exams, setExams] = useState([])
  const [examMaterials, setExamMaterials] = useState({})
  const [smartBookHistory, setSmartBookHistory] = useState([])
  const [planCompletedActivities, setPlanCompletedActivities] = useState([])

  const syncTimeoutRef = useRef(null)

  const {
    dataLoaded,
    saveData,
    userId,
    isConnected,
    syncLoading,
  } = useSmartBoardPersistence({
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
  })

  const actions = useSmartBoardActions({
    setTotalPoints,
    setPointsHistory,
    setMissions, missions,
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
  })

  const { addPoints, completeMission, unlockReward, addDaniMessage, recordMoodInference, trackAcademicTopic, updateDaniMemory, buildMemoryInjection, buildDaniContext, setVakResultAndRecommendations, addCalendarEvent, addUploadedActivity, addAnalyzedActivity, markNewsAsRead } = actions

  // Earn points for active minutes
  useEffect(() => {
    if (!dataLoaded) return
    const interval = setInterval(() => {
      const minutes = Math.floor((new Date() - sessionStartRef.current) / 1000 / 60)
      if (minutes > 0 && minutes !== totalActiveMinutes) {
        setTotalActiveMinutes((prev) => prev + 1)
        addPoints(1, "Minuto activo en dashboard")
        sessionStartRef.current = new Date()
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [totalActiveMinutes, dataLoaded])

  // Session tracking
  useEffect(() => {
    if (!dataLoaded) return
    const session = { id: Date.now(), start: new Date(), date: new Date().toISOString().split("T")[0], subject: null }
    currentSessionRef.current = session
    return () => {
      if (currentSessionRef.current) {
        const ended = {
          ...currentSessionRef.current,
          end: new Date(),
          duration: Math.floor((new Date() - new Date(currentSessionRef.current.start)) / 1000 / 60),
        }
        setSessions((prev) => [...prev, ended])
      }
    }
  }, [userId, dataLoaded])

  // Daily streak
  useEffect(() => {
    if (!dataLoaded) return
    const now = new Date()
    const today = now.toISOString().split("T")[0]
    setStreak((prev) => {
      if (prev.lastActive === today) return prev
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
      const newCurrent = prev.lastActive === yesterday ? prev.current + 1 : 1
      return { current: newCurrent, longest: Math.max(newCurrent, prev.longest), lastActive: today }
    })
    setStreakLog((prev) => {
      if (prev.some((entry) => entry.date === today)) return prev
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      return [...prev, { date: today, timestamp: now.toISOString(), hour: `${hours}:${minutes}` }].slice(-90)
    })
  }, [userId, dataLoaded])

  const trackSubjectTime = useCallback((subjectId, minutes) => {
    setSubjectTime((prev) => ({ ...prev, [subjectId]: (prev[subjectId] || 0) + minutes }))
  }, [])

  // Sync to localStorage + Supabase
  useEffect(() => {
    if (!dataLoaded || !userId) return

    setLocalStorage(`dani_chat_${userId}`, daniChatHistory)
    setLocalStorage(`mood_history_${userId}`, studentMoodHistory)
    setLocalStorage(`academic_topics_${userId}`, academicTopics)
    setLocalStorage(`conversation_count_${userId}`, conversationCount)
    setLocalStorage(`age_${userId}`, studentAge)
    setLocalStorage(`vak_${userId}`, vakResult)
    setLocalStorage(`points_${userId}`, totalPoints)
    setLocalStorage(`points_history_${userId}`, pointsHistory)
    setLocalStorage(`rewards_${userId}`, unlockedRewards)
    setLocalStorage(`minutes_${userId}`, totalActiveMinutes)
    setLocalStorage(`sessions_${userId}`, sessions)
    setLocalStorage(`streak_${userId}`, streak)
    setLocalStorage(`streak_log_${userId}`, streakLog)
    setLocalStorage(`dani_memory_${userId}`, daniMemory)
    setLocalStorage(`subject_time_${userId}`, subjectTime)
    setLocalStorage(`calendar_${userId}`, calendarEvents)
    setLocalStorage(`read_news_${userId}`, readNews)
    setLocalStorage(`missions_${userId}`, missions)
    setLocalStorage(`subjects_${userId}`, subjects)
    setLocalStorage(`activities_${userId}`, uploadedActivities)
    setLocalStorage(`analyzed_${userId}`, analyzedActivities)
    setLocalStorage(`dark_mode_${userId}`, darkMode)
    setLocalStorage(`avatar_animado_${userId}`, avatarAnimado)
    setLocalStorage(`fondo_galaxia_${userId}`, fondoGalaxia)
    setLocalStorage("subscription_tier", subscriptionTier)
    setLocalStorage(`flashcards_${userId}`, flashcardDecks)
    setLocalStorage(`exams_${userId}`, exams)
    setLocalStorage(`exam_materials_${userId}`, examMaterials)
    setLocalStorage(`smartbooks_${userId}`, smartBookHistory)
    setLocalStorage(`plan_completed_${userId}`, planCompletedActivities)

    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)
    syncTimeoutRef.current = setTimeout(() => {
      saveData({
        daniChatHistory, studentMoodHistory, academicTopics,
        conversationCount, studentAge, vakResult, totalPoints,
        pointsHistory, unlockedRewards, totalActiveMinutes, sessions,
        streak, streakLog, daniMemory, subjectTime, calendarEvents,
        readNews, missions, subjects, uploadedActivities,
        analyzedActivities, darkMode, avatarAnimado, fondoGalaxia,
        subscriptionTier, flashcardDecks, exams, examMaterials,
        smartBookHistory, planCompletedActivities,
      })
    }, 2000)
  }, [
    userId, daniChatHistory, studentMoodHistory, academicTopics,
    conversationCount, studentAge, vakResult, totalPoints, pointsHistory,
    unlockedRewards, totalActiveMinutes, sessions, streak, streakLog,
    subjectTime, calendarEvents, readNews, missions, subjects,
    uploadedActivities, analyzedActivities, darkMode, avatarAnimado,
    fondoGalaxia, subscriptionTier, flashcardDecks, exams, examMaterials,
    smartBookHistory, planCompletedActivities,
  ])

  // Compute upcoming deadlines from calendar events
  const computedUpcomingDeadlines = useMemo(() => {
    const now = new Date()
    return calendarEvents
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10)
  }, [calendarEvents])

  useEffect(() => {
    setUpcomingDeadlines(computedUpcomingDeadlines)
  }, [computedUpcomingDeadlines])

  const value = {
    // Dani
    daniChatHistory, daniMood, setDaniMood, addDaniMessage,
    studentMoodHistory, academicTopics, conversationCount,
    recordMoodInference, trackAcademicTopic, buildDaniContext,
    daniMemory, updateDaniMemory, buildMemoryInjection,

    // Student
    studentAge, setStudentAge,

    // VAK
    vakResult, vakRecommendations, setVakResultAndRecommendations,

    // Points
    totalPoints, pointsHistory, unlockedRewards, addPoints, unlockReward,

    // Rewards effects
    darkMode, setDarkMode, avatarAnimado, fondoGalaxia, lastUnlockedReward,

    // Time
    totalActiveMinutes,

    // Session tracking
    sessions, streak, streakLog, subjectTime, trackSubjectTime,

    // Calendar
    calendarEvents, upcomingDeadlines, addCalendarEvent,

    // News
    newsItems, readNews, markNewsAsRead,

    // Activities
    uploadedActivities, addUploadedActivity,
    analyzedActivities, addAnalyzedActivity,
    documentForDani, setDocumentForDani,

    // Subscription
    subscriptionTier, setSubscriptionTier,

    // Missions & Subjects
    missions, subjects, completeMission,

    // Persisted data from other SmartBoard tools
    flashcardDecks, setFlashcardDecks,
    exams, setExams,
    examMaterials, setExamMaterials,
    smartBookHistory, setSmartBookHistory,
    planCompletedActivities, setPlanCompletedActivities,
  }

  return (
    <SmartBoardKidsContext.Provider value={value}>
      {children}
    </SmartBoardKidsContext.Provider>
  )
}
