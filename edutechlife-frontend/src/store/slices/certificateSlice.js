export const createCertificateSlice = (set, get) => ({
  certName: '',
  setCertName: (v) => set({ certName: v }),
  showNameModal: false,
  setShowNameModal: (v) => set({ showNameModal: v }),
  showCertificateModal: false,
  setShowCertificateModal: (v) => set({ showCertificateModal: v }),
  storedCertificate: null,
  setStoredCertificate: (v) => set({ storedCertificate: v }),
  certificateGenerating: false,
  setCertificateGenerating: (v) => set({ certificateGenerating: v }),
});
