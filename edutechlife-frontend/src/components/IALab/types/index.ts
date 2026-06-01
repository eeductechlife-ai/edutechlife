export type ModuleId = 1 | 2 | 3 | 4 | 5;

export type LessonStatus = 'pending' | 'in-progress' | 'completed';

export type UserRole = 'student' | 'tutor' | 'admin';

export type LessonProgress = Record<string, Record<string, LessonStatus>>;

export type SyncStatus = 'syncing' | 'synced' | 'error' | null;

export interface ModuleProgress {
  isUnlocked?: boolean;
  exam?: number | boolean;
  challenge?: number | boolean;
  community?: boolean;
  resourcesCompleted?: boolean;
}

export interface NavState {
  activeMod: ModuleId;
  activeTab: string;
  visitedModules: number[];
  sidebarDropdowns: Record<string, boolean>;
  openAccordions: Record<string, boolean>;
  visibleAccordions: string[];
  insightsExpanded: boolean;
  currentLessonIndex: number;
  suggestedTime: number;
  timeElapsed: number;
  isTimerRunning: boolean;
  showTimeWarning: boolean;
  isTouchDevice: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

export interface UIState {
  showProfileDropdown: boolean;
  showEvaluationTooltip: boolean;
  isMarkingComplete: boolean;
  isSubmittingQuiz: boolean;
  isQuizValid: boolean;
  showBadgeGallery: boolean;
  showLeaderboard: boolean;
}

export interface ProgressState {
  moduleProgress: Record<number, ModuleProgress>;
  completedModules: number[];
  courseProgress: number;
  completedVideos: string[];
  completedExams: Record<string, boolean>;
  completedInfographics: string[];
  completedActivities: string[];
  challengeScores: Record<string, number>;
  isLoadingProgress: boolean;
  syncStatus: SyncStatus;
  isUsingJWT: boolean;
  userId: string | null;
  userRole: UserRole;
  courseCompleted: boolean;
}

export interface EvaluationState {
  showExamModal: boolean;
  quizAnswers: Record<string, unknown>;
  quizScore: number | null;
  quizPassed: boolean;
  quizResult: unknown;
  showScoreResult: boolean;
  dailyAttemptsCount: number;
  lastAttemptDate: string | null;
  quizAttempts: unknown[];
  showPremiumEvaluationModal: boolean;
  currentQuestion: number;
  currentPage: number;
  evalAnswers: Record<string, unknown>;
  evalSubmitted: boolean;
  evalScore: number;
  isStartingChallenge: boolean;
  isButtonDisabled: boolean;
  isChallengeCompleted: boolean;
  challengeScore: number;
}

export interface LessonState {
  lessonProgress: LessonProgress;
  checkpointAnswers: Record<string, Record<string, number>>;
  lastVisitedLesson: { moduleId: number; lessonId: string } | null;
}

export interface PersistenceState {
  bookmarks: string[];
  valerioWelcomed: boolean;
  sidebarState: 'expanded' | 'collapsed';
  progressCache: Record<string, unknown> | null;
}

export interface GamificationState {
  xp: number;
  streak: number;
  lastActivityDate: string | null;
  startDate: string;
  badges: string[];
  badgesDates: Record<string, string>;
  forumPostCount: number;
  forumCommentCount: number;
}

export interface SynthesizerState {
  input: string;
  genData: unknown;
  loading: boolean;
  loadMsg: string;
  coachQ: string;
  coachMsg: string;
  coachLoad: boolean;
  isListening: boolean;
  avatarState: string;
  showValerioDrawer: boolean;
  isSynthesizerOpen: boolean;
}

export interface CertificateState {
  certName: string;
  showNameModal: boolean;
  showCertificateModal: boolean;
  storedCertificate: unknown;
  certificateGenerating: boolean;
}

export interface SeguridadState {
  showExitConfirmation: boolean;
  showSecurityWarning: boolean;
  securityWarningCount: number;
  screenshotProtectionActive: boolean;
  securityViolations: number;
  attemptsPenalized: number;
  keyboardLockActive: boolean;
  showSecurityStatus: boolean;
  securityMessage: string;
  showSecurityMessage: boolean;
}

export interface ModuleData {
  id: ModuleId;
  title: string;
  icon: string;
  color: string;
  duration: string;
  level: string;
  desc: string;
  totalLessons: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  xp: string;
  icon: string;
  description: string;
  objectives: string[];
}

export interface Activity {
  type: 'lesson' | 'exam' | 'challenge' | 'community';
  id: string;
  lessonId?: string;
  title: string;
  duration: string;
  xp: string;
  status: 'completed' | 'available' | 'locked' | 'in-progress';
  icon?: string;
  description?: string;
  objectives?: string[];
}

export interface PrimaryAction extends Activity {
  actionType: 'resume_lesson' | 'next_lesson' | 'review_weak_topics' | 'take_exam' | 'take_challenge' | 'community' | 'next_module' | 'course_complete';
  nextModuleId?: number;
  weakTopics?: string[];
}

export interface DailyRoute {
  currentModule: {
    id: number;
    title: string;
    icon: string;
    color: string;
    completedLessons: number;
    totalLessons: number;
    progressPct: number;
    moduleScore: number;
    isApproved: boolean;
    activities: Activity[];
  };
  nextModule: {
    id: number;
    title: string;
    icon: string;
    color: string;
    completedLessons: number;
    totalLessons: number;
    duration: string;
    level: string;
    description: string;
  } | null;
  primaryAction: PrimaryAction;
  overview: {
    completedModules: number;
    totalModules: number;
    xp: number;
    streak: number;
    courseProgress: number;
    allModulesComplete: boolean;
  };
}

export interface WeeklyXP {
  weekly: number;
  weeklyTarget: number;
  weeklyPct: number;
  dailyAvg: number;
}

export interface ModuleDominanceLevel {
  label: string;
  color: string;
  bg: string;
}

export interface IALabStore
  extends NavState,
    UIState,
    ProgressState,
    EvaluationState,
    LessonState,
    PersistenceState,
    GamificationState,
    SynthesizerState,
    CertificateState,
    SeguridadState {
  setActiveMod: (mod: ModuleId) => void;
  setActiveTab: (tab: string) => void;
  setVisitedModules: (v: number[] | ((prev: number[]) => number[])) => void;
  setSidebarDropdowns: (v: Record<string, boolean>) => void;
  toggleSidebarDropdown: (section: string) => void;
  setOpenAccordions: (v: Record<string, boolean>) => void;
  setVisibleAccordions: (v: string[]) => void;
  setInsightsExpanded: (v: boolean) => void;
  setCurrentLessonIndex: (v: number) => void;
  setTimeElapsed: (v: number) => void;
  setIsTimerRunning: (v: boolean) => void;
  setShowTimeWarning: (v: boolean) => void;
  setIsTouchDevice: (v: boolean) => void;
  setIsIOS: (v: boolean) => void;
  setIsAndroid: (v: boolean) => void;

  setShowProfileDropdown: (v: boolean) => void;
  setShowEvaluationTooltip: (v: boolean) => void;
  setIsMarkingComplete: (v: boolean) => void;
  setIsSubmittingQuiz: (v: boolean) => void;
  setIsQuizValid: (v: boolean) => void;
  setShowBadgeGallery: (v: boolean) => void;
  setShowLeaderboard: (v: boolean) => void;

  setCompletedModules: (v: number[] | ((prev: number[]) => number[])) => void;
  setCourseProgress: (v: number) => void;
  setIsLoadingProgress: (v: boolean) => void;
  setUserRole: (v: UserRole) => void;
  setCourseCompleted: (v: boolean) => void;

  setShowExamModal: (v: boolean) => void;
  setQuizAnswers: (v: Record<string, unknown> | ((prev: Record<string, unknown>) => Record<string, unknown>)) => void;
  setQuizScore: (v: number | null) => void;
  setQuizPassed: (v: boolean) => void;
  setQuizResult: (v: unknown) => void;
  setShowScoreResult: (v: boolean) => void;
  setDailyAttemptsCount: (v: number) => void;
  setLastAttemptDate: (v: string | null) => void;
  setQuizAttempts: (v: unknown[]) => void;
  setShowPremiumEvaluationModal: (v: boolean) => void;
  setCurrentQuestion: (v: number) => void;
  setCurrentPage: (v: number) => void;
  setEvalAnswers: (v: Record<string, unknown>) => void;
  setEvalSubmitted: (v: boolean) => void;
  setEvalScore: (v: number) => void;
  setIsStartingChallenge: (v: boolean) => void;
  setIsButtonDisabled: (v: boolean) => void;
  setIsChallengeCompleted: (v: boolean) => void;

  markLessonComplete: (moduleId: number, lessonId: string) => void;
  markLessonInProgress: (moduleId: number, lessonId: string) => void;
  recordCheckpointAnswer: (moduleId: number, lessonId: string, answerIndex: number) => void;
  setLastVisitedLesson: (moduleId: number, lessonId: string) => void;
  getCompletedLessonCount: (moduleId: number) => number;

  syncFromPersistence: (data: Record<string, unknown>) => void;
  clearProgressFromStorage: () => void;
  storageGet: <T>(key: string, def: T) => T;
  storageSet: (key: string, val: unknown) => void;
  storageRemove: (key: string) => void;
  storageGetInt: (key: string, def: number) => number;
  persistGamificationState: () => void;
  loadGamificationState: () => Partial<GamificationState>;
  addBookmark: (id: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;

  addXp: (amount: number) => void;
  recordActivity: () => boolean;
  isStreakAtRisk: () => boolean;
  getDaysSinceStart: () => number;
  awardBadge: (badgeId: string) => void;
  checkAndAwardBadges: () => void;
  getLevel: () => number;
  getXpForNextLevel: () => number;
  getLevelProgress: () => number;
  getTotalPoints: () => number;

  setInput: (v: string) => void;
  setGenData: (v: unknown) => void;
  setLoading: (v: boolean) => void;
  setLoadMsg: (v: string) => void;
  setCoachQ: (v: string) => void;
  setCoachMsg: (v: string) => void;
  setCoachLoad: (v: boolean) => void;
  setIsListening: (v: boolean) => void;
  setAvatarState: (v: string) => void;
  setShowValerioDrawer: (v: boolean) => void;
  setIsSynthesizerOpen: (v: boolean) => void;

  setCertName: (v: string) => void;
  setShowNameModal: (v: boolean) => void;
  setShowCertificateModal: (v: boolean) => void;
  setStoredCertificate: (v: unknown) => void;
  setCertificateGenerating: (v: boolean) => void;

  setShowExitConfirmation: (v: boolean) => void;
  setShowSecurityWarning: (v: boolean) => void;
  setSecurityWarningCount: (v: number) => void;
  setScreenshotProtectionActive: (v: boolean) => void;
  setSecurityViolations: (v: number) => void;
  setAttemptsPenalized: (v: number) => void;
  setKeyboardLockActive: (v: boolean) => void;
  setShowSecurityStatus: (v: boolean) => void;
  setSecurityMessage: (v: string) => void;
  setShowSecurityMessage: (v: boolean) => void;

  getCurrentModule: () => ModuleData;
  checkCourseCompletion: () => boolean;
  generateModuleActivityList: (moduleId: number) => Activity[];
  determinePrimaryAction: (moduleId: number, activities: Activity[], nextModuleData: ModuleData | null) => PrimaryAction;
  getDailyRoute: () => DailyRoute;
  getWeeklyXP: () => WeeklyXP;
  getModuleDominanceLevel: (moduleId: number) => ModuleDominanceLevel;
  getDetailedRecommendations: () => unknown;
}
