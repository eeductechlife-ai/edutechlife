export const createSynthesizerSlice = (set, get) => ({
  coachQ: '',
  setCoachQ: (v) => set({ coachQ: v }),
  coachMsg: '',
  setCoachMsg: (v) => set({ coachMsg: v }),
  coachLoad: false,
  setCoachLoad: (v) => set({ coachLoad: v }),
  isListening: false,
  setIsListening: (v) => set({ isListening: v }),
  avatarState: 'idle',
  setAvatarState: (v) => set({ avatarState: v }),
  showValerioDrawer: false,
  setShowValerioDrawer: (v) => set({ showValerioDrawer: v }),

  isSynthesizerOpen: false,
  setIsSynthesizerOpen: (v) => set({ isSynthesizerOpen: v }),
});
