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
});
