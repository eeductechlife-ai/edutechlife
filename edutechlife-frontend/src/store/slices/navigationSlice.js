export const createNavigationSlice = (set, get) => ({
  activeMod: 1,
  setActiveMod: (mod) => set({ activeMod: mod }),
  activeTab: 'lab',
  setActiveTab: (tab) => set({ activeTab: tab }),
  visitedModules: [1],
  setVisitedModules: (v) => set(typeof v === 'function' ? { visitedModules: v(get().visitedModules) } : { visitedModules: v }),

  sidebarDropdowns: { videos: false, recursos: false },
  setSidebarDropdowns: (v) => set({ sidebarDropdowns: v }),
  toggleSidebarDropdown: (section) => set((s) => ({
    sidebarDropdowns: { ...s.sidebarDropdowns, [section]: !s.sidebarDropdowns[section] },
  })),

  openAccordions: {},
  setOpenAccordions: (v) => set({ openAccordions: v }),
  visibleAccordions: [],
  setVisibleAccordions: (v) => set({ visibleAccordions: v }),

  insightsExpanded: false,
  setInsightsExpanded: (v) => set({ insightsExpanded: v }),

  currentLessonIndex: 0,
  setCurrentLessonIndex: (v) => set({ currentLessonIndex: v }),

  suggestedTime: 25 * 60,
  timeElapsed: 0,
  setTimeElapsed: (v) => set({ timeElapsed: v }),
  isTimerRunning: false,
  setIsTimerRunning: (v) => set({ isTimerRunning: v }),
  showTimeWarning: false,
  setShowTimeWarning: (v) => set({ showTimeWarning: v }),

  isTouchDevice: false,
  setIsTouchDevice: (v) => set({ isTouchDevice: v }),
  isIOS: false,
  setIsIOS: (v) => set({ isIOS: v }),
  isAndroid: false,
  setIsAndroid: (v) => set({ isAndroid: v }),
});
