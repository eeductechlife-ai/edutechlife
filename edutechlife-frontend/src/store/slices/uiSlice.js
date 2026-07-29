export const createUiSlice = (set, get) => ({
  showProfileDropdown: false,
  setShowProfileDropdown: (v) => set({ showProfileDropdown: v }),
  showEvaluationTooltip: false,
  setShowEvaluationTooltip: (v) => set({ showEvaluationTooltip: v }),
  isMarkingComplete: false,
  setIsMarkingComplete: (v) => set({ isMarkingComplete: v }),
  isSubmittingQuiz: false,
  setIsSubmittingQuiz: (v) => set({ isSubmittingQuiz: v }),
  isQuizValid: false,
  setIsQuizValid: (v) => set({ isQuizValid: v }),

  showBadgeGallery: false,
  setShowBadgeGallery: (v) => set({ showBadgeGallery: v }),

  showLeaderboard: false,
  setShowLeaderboard: (v) => set({ showLeaderboard: v }),

  immersiveModalOpen: false,
  setImmersiveModalOpen: (v) => set({ immersiveModalOpen: v }),

  showQuizModal: false,
  setShowQuizModal: (v) => set({ showQuizModal: v }),
  showExamResult: false,
  setShowExamResult: (v) => set({ showExamResult: v }),
  showChallengeResult: false,
  setShowChallengeResult: (v) => set({ showChallengeResult: v }),
  showHistoryModal: false,
  setShowHistoryModal: (v) => set({ showHistoryModal: v }),
  showHelpModal: false,
  setShowHelpModal: (v) => set({ showHelpModal: v }),

  practiceToolOpen: false,
  activePracticeTool: null,
  setPracticeTool: (type) => set({ practiceToolOpen: true, activePracticeTool: type }),
  closePracticeTool: () => set({ practiceToolOpen: false, activePracticeTool: null }),
});
