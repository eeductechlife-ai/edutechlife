import { lazy, Suspense, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { IngenIAKidsContext } from "../context/IngenIAKidsContext";
import {
  DEFAULT_NEWS,
  DEFAULT_MISSIONS,
  DEFAULT_SUBJECTS,
} from "../context/ingenIAData";
import { PageLoader } from "../components/LoadingScreen";

// DEV ONLY — renders the student dashboard with a fictional student so the UI
// can be reviewed without signing in. Registered only when import.meta.env.DEV.
const IngenIAKidsDashboard = lazy(
  () => import("../components/kids-dashboard/IngenIAKidsDashboard"),
);

const noop = () => {};

const SAMPLE_GRADES = [
  { subject: "Matemáticas", p1: 3.4, p2: 3.0, p3: 2.9 },
  { subject: "Lenguaje", p1: 3.9, p2: 4.0, p3: 4.1 },
  { subject: "Ciencias Naturales", p1: 3.6, p2: 3.8, p3: 3.8 },
  { subject: "Ciencias Sociales", p1: 4.2, p2: 4.3, p3: 4.4 },
  { subject: "Inglés", p1: 3.5, p2: 3.3, p3: 3.2 },
  { subject: "Artística", p1: 4.6, p2: 4.7, p3: 4.7 },
];
const GRADE_BY_SUBJECT = {
  matematicas: 0,
  lenguaje: 1,
  ciencias: 2,
  historia: 3,
  ingles: 4,
  arte: 5,
};

const avg = (g) => {
  const v = [g.p1, g.p2, g.p3, g.p4].filter((x) => x != null);
  return v.reduce((a, b) => a + b, 0) / v.length;
};

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export default function DevIngenIAPreview() {
  const [params] = useSearchParams();
  const age = Number(params.get("edad")) || 10;
  const grade =
    Number(params.get("grado")) || Math.min(11, Math.max(1, age - 5));

  const [darkMode, setDarkMode] = useState(params.get("oscuro") === "1");
  const [totalPoints, setTotalPoints] = useState(
    () => Number(params.get("puntos")) || 420,
  );
  const [unlockedRewards, setUnlockedRewards] = useState([]);
  const [pointsHistory, setPointsHistory] = useState([
    { points: 100, reason: "Reto Matemáticas (60%)", timestamp: daysAgo(2) },
    { points: 50, reason: "Misión completada", timestamp: daysAgo(1) },
  ]);
  const [missions, setMissions] = useState(DEFAULT_MISSIONS);
  const [readNews, setReadNews] = useState([]);
  const [documentForDani, setDocumentForDani] = useState(null);
  const [activeStudyDeck, setActiveStudyDeck] = useState(null);
  const [flashcardDecks, setFlashcardDecks] = useState([]);
  const [examMaterials, setExamMaterials] = useState({});
  const [exams, setExams] = useState([]);
  const [smartBookHistory, setSmartBookHistory] = useState([]);
  const [planCompletedActivities, setPlanCompletedActivities] = useState([]);
  const [studentGrades, setStudentGrades] = useState(SAMPLE_GRADES);
  const [vakResult, setVakResult] = useState(null);
  const [daniChatHistory, setDaniChatHistory] = useState([]);

  const addPoints = useCallback((amount, reason) => {
    setTotalPoints((p) => p + amount);
    setPointsHistory((h) => [
      ...h,
      { points: amount, reason, timestamp: new Date().toISOString() },
    ]);
  }, []);

  const subjectsWithGrades = useMemo(
    () =>
      DEFAULT_SUBJECTS.map((s) => {
        const g = studentGrades[GRADE_BY_SUBJECT[s.id]];
        if (!g) return s;
        const gradeScore = avg(g);
        return {
          ...s,
          gradeScore,
          progress: Math.round((gradeScore / 5) * 100),
          trend: { delta: Math.round((g.p3 - g.p2) * 10) / 10 },
        };
      }),
    [studentGrades],
  );

  const studentData = useMemo(
    () => ({
      data: {
        id: "dev-student",
        name: "Sofía Preview",
        age,
        grade_level: grade,
        country_code: "CO",
        subscription_tier: "premium",
      },
      isLoading: false,
    }),
    [age, grade],
  );

  const value = {
    dataLoaded: true,
    syncLoading: false,
    isConnected: true,

    daniChatHistory,
    daniMood: "happy",
    setDaniMood: noop,
    addDaniMessage: (m) =>
      setDaniChatHistory((h) => [
        ...h,
        { ...m, timestamp: new Date().toISOString() },
      ]),
    studentMoodHistory: [],
    academicTopics: [],
    conversationCount: 0,
    recordMoodInference: noop,
    trackAcademicTopic: noop,
    buildDaniContext: () => "",
    daniMemory: {
      conversations: [],
      studentProfile: { strengths: [], challenges: [], interests: [] },
      pendingTopics: [],
      interactionCount: 0,
    },
    updateDaniMemory: noop,
    buildMemoryInjection: () => "",

    studentAge: age,
    setStudentAge: noop,
    ageGroup: age <= 8 ? "early" : age <= 12 ? "middle" : "senior",
    gradeLevel: grade,
    setGradeLevel: noop,
    countryCode: "CO",
    setCountryCode: noop,
    schoolName: "Colegio de Ejemplo",
    setSchoolName: noop,

    vakResult,
    vakRecommendations: [],
    setVakResultAndRecommendations: setVakResult,

    totalPoints,
    pointsHistory,
    unlockedRewards,
    addPoints,
    unlockReward: (reward) => {
      setUnlockedRewards((prev) => [...prev, reward.id]);
      addPoints(-reward.cost, `Canjeó recompensa: ${reward.name}`);
    },

    darkMode,
    setDarkMode,
    toggleDarkMode: () => setDarkMode((d) => !d),
    avatarAnimado: false,
    fondoGalaxia: false,
    lastUnlockedReward: null,
    lastUnlockedBadge: null,
    setLastUnlockedBadge: noop,

    totalActiveMinutes: 185,
    sessions: [],
    streak: { current: 3, longest: 5, lastActive: daysAgo(0) },
    streakLog: [],
    subjectTime: {},
    trackSubjectTime: noop,
    createSession: noop,

    calendarEvents: [],
    upcomingDeadlines: [],
    addCalendarEvent: noop,

    newsItems: DEFAULT_NEWS,
    readNews,
    markNewsAsRead: (id) => setReadNews((r) => [...r, id]),

    uploadedActivities: [],
    addUploadedActivity: noop,
    analyzedActivities: [],
    addAnalyzedActivity: noop,
    documentForDani,
    setDocumentForDani,

    subscriptionTier: "premium",
    setSubscriptionTier: noop,

    missions,
    subjects: DEFAULT_SUBJECTS,
    subjectsWithGrades,
    completeMission: (id) =>
      setMissions((ms) =>
        ms.map((m) => (m.id === id ? { ...m, completed: true } : m)),
      ),

    flashcardDecks,
    setFlashcardDecks,
    examMaterials,
    setExamMaterials,
    smartBookHistory,
    setSmartBookHistory,
    planCompletedActivities,
    setPlanCompletedActivities,

    // Per-student storage keys (plan, grades…) need an id, as in the real app.
    userId: "dev-student",
    onboardingComplete: true,
    setOnboardingComplete: noop,
    hasSeenWelcome: true,
    setHasSeenWelcome: noop,
    onboardingStep: 0,
    setOnboardingStep: noop,
    vakCompleted: !!vakResult,
    hasUploadedSchedule: false,
    hasGrades: true,
    nextRecommendedStep: null,

    activeStudyDeck,
    setActiveStudyDeck,
    studentGrades,
    setStudentGrades,
    gradeAvg: avg,
    gradeTrend: (g) => ({
      delta: Math.round(((g.p3 ?? 0) - (g.p2 ?? 0)) * 10) / 10,
    }),

    timetable: null,
    slots: [],
    exams,
    timetableLoading: false,
    timetableError: null,
    saveTimetableWithSlots: noop,
    saveTimetable: noop,
    saveSlots: noop,
    addExam: async (row) =>
      setExams((prev) => [...prev, { id: `dev-exam-${Date.now()}`, ...row }]),
    removeExam: (examId) =>
      setExams((prev) => prev.filter((e) => e.id !== examId)),
    currentClass: null,
    nextClass: null,
    todayClasses: [],
    upcomingExams: [],
    reloadTimetable: noop,

    supabaseQueries: {
      studentData,
      pointsHistory: { data: pointsHistory },
      vakResult: { data: vakResult },
      sessions: { data: [] },
      achievements: { data: [] },
      learningStreaks: { data: [] },
      settings: { data: null },
    },
  };

  return (
    <IngenIAKidsContext.Provider value={value}>
      <div className="fixed left-2 bottom-24 z-[200] px-2 py-0.5 rounded-md bg-amber-400/90 text-[9px] font-black text-amber-950 whitespace-nowrap pointer-events-none">
        VISTA DE PRUEBA · datos de ejemplo
      </div>
      <Suspense fallback={<PageLoader message="Cargando vista de prueba…" />}>
        <IngenIAKidsDashboard />
      </Suspense>
    </IngenIAKidsContext.Provider>
  );
}
