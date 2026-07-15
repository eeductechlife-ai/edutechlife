export const docContainer = {
  backgroundColor: "#ffffff",
  padding: "0",
  fontFamily: "Montserrat, system-ui, sans-serif",
  color: "#334155",
  lineHeight: "1.5",
  fontSize: "13px",
};

export const coverWrapper = {
  background: "linear-gradient(135deg, #004B63 0%, #1A5A6E 100%)",
  padding: "60px 40px 40px",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
};

export const coverCircleTopRight = {
  position: "absolute",
  top: "-60px",
  right: "-60px",
  width: "200px",
  height: "200px",
  borderRadius: "50%",
  background: "rgba(77,168,196,0.08)",
  pointerEvents: "none",
};

export const coverCircleBottomLeft = {
  position: "absolute",
  bottom: "-40px",
  left: "-40px",
  width: "160px",
  height: "160px",
  borderRadius: "50%",
  background: "rgba(102,204,204,0.06)",
  pointerEvents: "none",
};

export const coverLogo = {
  height: "52px",
  width: "auto",
  marginBottom: "24px",
};

export const companyBadge = {
  display: "inline-block",
  padding: "4px 16px",
  border: "1.5px solid rgba(255,255,255,0.25)",
  borderRadius: "20px",
  color: "rgba(255,255,255,0.7)",
  fontSize: "10px",
  letterSpacing: "2px",
  textTransform: "uppercase",
  marginBottom: "20px",
};

export const coverTitle = {
  color: "#ffffff",
  margin: "0 0 8px 0",
  fontSize: "28px",
  fontWeight: "900",
  letterSpacing: "0.5px",
};

export const coverDivider = {
  width: "60px",
  height: "3px",
  background: "#4DA8C4",
  margin: "16px auto",
  borderRadius: "2px",
};

export const coverStudentName = {
  color: "rgba(255,255,255,0.8)",
  fontSize: "13px",
  margin: "0 0 4px 0",
};

export const coverDateText = {
  color: "rgba(255,255,255,0.5)",
  fontSize: "10px",
  margin: "24px 0 0 0",
};

export const coverFolio = {
  marginTop: "32px",
  padding: "12px 20px",
  display: "inline-block",
  borderTop: "1px solid rgba(255,255,255,0.12)",
  color: "rgba(255,255,255,0.4)",
  fontSize: "9px",
  letterSpacing: "1px",
  textTransform: "uppercase",
};

export const headerWrapper = {
  background: "linear-gradient(135deg, #004B63 0%, #1A5A6E 100%)",
  padding: "18px 28px",
  borderBottom: "3px solid #4DA8C4",
};

export const headerInner = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export const headerLogoArea = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

export const headerLogo = {
  height: "28px",
  width: "auto",
};

export const headerDivider = {
  borderLeft: "1.5px solid rgba(255,255,255,0.2)",
  paddingLeft: "12px",
};

export const headerTitle = {
  margin: 0,
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "0.3px",
};

export const headerSubtitle = {
  margin: "1px 0 0 0",
  color: "rgba(255,255,255,0.6)",
  fontSize: "10px",
  fontWeight: "400",
};

export const headerFolioArea = {
  textAlign: "right",
};

export const headerFolioLabel = {
  margin: 0,
  color: "rgba(255,255,255,0.45)",
  fontSize: "8px",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
};

export const headerFolioValue = {
  margin: "1px 0 2px 0",
  color: "#4DA8C4",
  fontSize: "10px",
  fontWeight: "700",
  fontFamily: "monospace",
};

export const headerDateText = {
  margin: 0,
  color: "rgba(255,255,255,0.6)",
  fontSize: "9px",
};

export const contentPadding = {
  padding: "20px 28px",
  position: "relative",
};

export const sealOuter = {
  position: "absolute",
  top: "180px",
  right: "40px",
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  border: "2.5px solid rgba(77,168,196,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0.6,
  pointerEvents: "none",
  zIndex: 1,
};

export const sealInner = {
  width: "76px",
  height: "76px",
  borderRadius: "50%",
  border: "1.5px solid rgba(77,168,196,0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
};

export const sealCertLabel = {
  color: "#4DA8C4",
  fontSize: "6px",
  fontWeight: "700",
  letterSpacing: "1px",
  textTransform: "uppercase",
};

export const sealVakLabel = {
  color: "#004B63",
  fontSize: "5px",
  fontWeight: "600",
  letterSpacing: "0.5px",
  marginTop: "1px",
  textTransform: "uppercase",
};

export const noteBox = {
  padding: "10px 14px",
  background: "#F8FAFC",
  borderRadius: "8px",
  border: "1px solid #E8EDF2",
  marginBottom: "20px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

export const noteText = {
  color: "#94A3B8",
  fontSize: "9px",
  lineHeight: "1.4",
};

export const infoGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px",
  marginBottom: "20px",
};

export const studentCard = {
  background: "#ffffff",
  padding: "14px",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,75,99,0.06)",
  border: "1px solid #E8F0F3",
};

export const cardTitle = (borderColor) => ({
  color: "#004B63",
  margin: "0 0 10px 0",
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  borderBottom: `2px solid ${borderColor}`,
  paddingBottom: "7px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

export const infoRow = {
  fontSize: "11px",
  marginBottom: "5px",
  display: "flex",
  justifyContent: "space-between",
};

export const infoRowLast = {
  fontSize: "11px",
  display: "flex",
  justifyContent: "space-between",
};

export const infoLabel = {
  color: "#64748B",
};

export const infoValue = {
  color: "#004B63",
  fontWeight: "600",
};

export const infoValuePlain = {
  color: "#004B63",
};

export const guardianCard = {
  background: "linear-gradient(135deg, #F8FCFF, #F0FDFF)",
  padding: "14px",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(77,168,196,0.07)",
  border: "1px solid #D6EEF5",
};

export const separator = {
  height: "1px",
  background: "linear-gradient(to right, transparent, #4DA8C4, transparent)",
  margin: "0 0 20px 0",
  opacity: 0.3,
};

export const heroWrapper = (gradient) => ({
  position: "relative",
  margin: "0 0 20px 0",
  padding: "28px 24px",
  background: gradient,
  borderRadius: "16px",
  textAlign: "center",
  color: "white",
  boxShadow: "0 8px 40px rgba(77,168,196,0.2)",
});

export const heroSeal = {
  position: "absolute",
  top: "12px",
  right: "12px",
  width: "52px",
  height: "52px",
  borderRadius: "50%",
  border: "2px solid rgba(255,255,255,0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  opacity: 0.8,
};

export const heroSealOficial = {
  color: "#ffffff",
  fontSize: "6px",
  fontWeight: "700",
  letterSpacing: "0.8px",
  textTransform: "uppercase",
  lineHeight: "1.2",
};

export const heroSealDivider = {
  width: "16px",
  height: "1.5px",
  background: "rgba(255,255,255,0.4)",
  margin: "2px 0",
};

export const heroSealVerified = {
  color: "rgba(255,255,255,0.8)",
  fontSize: "5px",
  fontWeight: "600",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
};

export const heroIconBox = {
  width: "52px",
  height: "52px",
  margin: "0 auto 10px",
  background: "rgba(255,255,255,0.18)",
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(4px)",
};

export const heroLabel = {
  margin: "0 0 4px 0",
  color: "rgba(255,255,255,0.8)",
  fontSize: "9px",
  textTransform: "uppercase",
  letterSpacing: "3px",
  fontWeight: "600",
};

export const heroTitle = {
  margin: "0 0 2px 0",
  fontSize: "24px",
  fontWeight: "800",
  letterSpacing: "0.5px",
};

export const heroPercentage = {
  fontSize: "48px",
  fontWeight: "900",
  margin: "6px 0",
  textShadow: "0 4px 20px rgba(0,0,0,0.12)",
  lineHeight: "1",
};

export const heroProgressTrack = {
  width: "100%",
  maxWidth: "260px",
  height: "5px",
  margin: "6px auto 10px",
  background: "rgba(255,255,255,0.3)",
  borderRadius: "3px",
  overflow: "hidden",
};

export const heroProgressFill = {
  height: "100%",
  width: "100%",
  background: "rgba(255,255,255,0.65)",
  borderRadius: "3px",
};

export const heroDescription = {
  margin: 0,
  opacity: 0.9,
  fontSize: "12px",
  lineHeight: "1.5",
  maxWidth: "440px",
  marginLeft: "auto",
  marginRight: "auto",
};

export const scoreRow = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

export const scoreCard = (bg, borderColor) => ({
  flex: 1,
  padding: "12px 10px",
  background: bg,
  borderRadius: "12px",
  border: `1.5px solid ${borderColor}`,
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
});

export const scoreCorner = (color) => ({
  position: "absolute",
  top: 0,
  right: 0,
  width: 0,
  height: 0,
  borderStyle: "solid",
  borderWidth: "0 20px 20px 0",
  borderColor: `transparent ${color} transparent transparent`,
});

export const scoreCheckmark = {
  position: "absolute",
  top: "3px",
  right: "-16px",
  color: "white",
  fontSize: "7px",
  fontWeight: "700",
};

export const scoreLabel = (color) => ({
  fontSize: "9px",
  color: color,
  fontWeight: "700",
  marginBottom: "5px",
  letterSpacing: "1.5px",
});

export const scoreValue = (color) => ({
  fontSize: "26px",
  fontWeight: "800",
  color: color,
  lineHeight: "1",
});

export const scoreMaxLabel = {
  fontSize: "11px",
  color: "#94A3B8",
  fontWeight: "400",
};

export const scoreTrack = {
  marginTop: "7px",
  height: "3px",
  background: "#E8EDF0",
  borderRadius: "2px",
  overflow: "hidden",
};

export const scoreFill = (color, width) => ({
  height: "100%",
  width: `${width}%`,
  background: color,
  borderRadius: "2px",
  transition: "width 0.5s ease",
});

export const analysisBox = (sColor) => ({
  padding: "18px 18px 18px 22px",
  background: "linear-gradient(135deg, #F8FAFC, #F0FDFF)",
  borderRadius: "12px",
  borderLeft: `4px solid ${sColor}`,
  marginBottom: "20px",
  position: "relative",
  boxShadow: "0 2px 12px rgba(77,168,196,0.06)",
});

export const analysisQuoteMark = (sColor) => ({
  position: "absolute",
  top: "4px",
  left: "10px",
  fontSize: "36px",
  color: sColor,
  opacity: 0.15,
  fontFamily: "Georgia, serif",
  lineHeight: "1",
  userSelect: "none",
  pointerEvents: "none",
});

export const analysisTitle = {
  color: "#004B63",
  margin: "0 0 6px 0",
  fontSize: "12px",
  fontWeight: "700",
};

export const analysisText = {
  margin: 0,
  color: "#334155",
  fontSize: "11px",
  lineHeight: "1.7",
  fontStyle: "italic",
};

export const analysisFooter = {
  margin: "8px 0 0 0",
  color: "#64748B",
  fontSize: "10px",
  lineHeight: "1.5",
  borderTop: "1px solid #E2E8F0",
  paddingTop: "8px",
};

export const twoColGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px",
  marginBottom: "20px",
};

export const leftCol = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

export const rightCol = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

export const whiteCard = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "14px",
  boxShadow: "0 4px 20px rgba(0,75,99,0.05)",
  border: "1px solid #E8F0F3",
};

export const sectionTitle = (borderColor) => ({
  color: "#004B63",
  margin: "0 0 8px 0",
  fontSize: "11px",
  fontWeight: "700",
  borderBottom: `2px solid ${borderColor}`,
  paddingBottom: "7px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

export const sectionIcon = (bgColor) => ({
  display: "inline-flex",
  width: "18px",
  height: "18px",
  background: bgColor,
  borderRadius: "5px",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "10px",
});

export const charList = {
  fontSize: "10px",
};

export const charItem = {
  marginBottom: "4px",
  display: "flex",
  alignItems: "flex-start",
  gap: "5px",
};

export const charBullet = (color) => ({
  color: color,
  fontWeight: "bold",
  fontSize: "12px",
  lineHeight: "1.4",
  flexShrink: 0,
});

export const charText = {
  color: "#475569",
};

export const charMore = (color) => ({
  marginTop: "6px",
  color: color,
  fontSize: "9px",
  fontWeight: "600",
  cursor: "pointer",
});

export const strengthsBox = (bgColor, sColor) => ({
  padding: "12px 14px",
  background: `linear-gradient(135deg, ${bgColor}, transparent)`,
  borderRadius: "12px",
  borderLeft: `3px solid ${sColor}`,
  boxShadow: "0 2px 12px rgba(77,168,196,0.05)",
});

export const strengthsTitle = {
  color: "#004B63",
  margin: "0 0 6px 0",
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

export const strengthsText = {
  fontSize: "10px",
  lineHeight: "1.5",
  color: "#475569",
};

export const stratList = {
  paddingLeft: "16px",
  margin: 0,
  fontSize: "10px",
  lineHeight: "1.6",
  color: "#475569",
};

export const stratItem = {
  marginBottom: "4px",
  color: "#475569",
};

export const stratHighlight = (color) => ({
  color: color,
  fontWeight: "600",
});

export const careerTitle = {
  color: "#004B63",
  margin: "0 0 8px 0",
  fontSize: "11px",
  fontWeight: "700",
  borderBottom: "2px solid #66CCCC",
  paddingBottom: "7px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

export const careerIcon = {
  display: "inline-flex",
  width: "18px",
  height: "18px",
  background: "rgba(102,204,204,0.12)",
  borderRadius: "5px",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "10px",
};

export const careerTagContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "5px",
};

export const careerTag = (bgColor, borderColor) => ({
  padding: "4px 8px",
  background: `linear-gradient(135deg, ${bgColor}, transparent)`,
  borderRadius: "16px",
  color: "#004B63",
  fontSize: "9px",
  fontWeight: "600",
  border: `1px solid ${borderColor}`,
});

export const separator2 = {
  height: "1px",
  background: "linear-gradient(to right, transparent, #66CCCC, transparent)",
  margin: "0 0 16px 0",
  opacity: 0.25,
};

export const tipsBox = {
  padding: "14px 16px",
  background:
    "linear-gradient(135deg, rgba(77,168,196,0.04), rgba(102,204,204,0.04))",
  borderRadius: "12px",
  borderLeft: "4px solid #66CCCC",
  marginBottom: "16px",
  boxShadow: "0 2px 12px rgba(102,204,204,0.06)",
};

export const tipsTitle = {
  color: "#004B63",
  margin: "0 0 8px 0",
  fontSize: "11px",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  gap: "7px",
};

export const tipsIcon = {
  display: "inline-flex",
  width: "24px",
  height: "24px",
  background: "linear-gradient(135deg, #66CCCC, #4DA8C4)",
  borderRadius: "7px",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: "12px",
};

export const tipsContent = {
  fontSize: "10px",
  lineHeight: "1.6",
};

export const tipItem = {
  marginBottom: "4px",
  display: "flex",
  alignItems: "flex-start",
  gap: "6px",
};

export const tipBullet = {
  color: "#66CCCC",
  fontWeight: "bold",
  fontSize: "12px",
  lineHeight: "1.5",
  flexShrink: 0,
};

export const tipText = {
  color: "#475569",
};

export const commentBox = (sColor) => ({
  padding: "14px 16px",
  background:
    "linear-gradient(135deg, rgba(102,204,204,0.07), rgba(77,168,196,0.07))",
  borderRadius: "12px",
  borderLeft: `4px solid ${sColor}`,
  marginBottom: "14px",
  boxShadow: "0 2px 12px rgba(77,168,196,0.06)",
});

export const commentHeader = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "8px",
};

export const commentAvatar = {
  position: "relative",
  width: "40px",
  height: "40px",
  flexShrink: 0,
};

export const commentAvatarImg = (sColor) => ({
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  objectFit: "cover",
  border: `2px solid ${sColor}`,
  boxShadow: `0 0 0 3px ${sColor}15`,
});

export const commentAvatarFallback = (sColor) => ({
  display: "none",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${sColor}, ${sColor}88)`,
  alignItems: "center",
  justifyContent: "center",
});

export const commentAvatarText = {
  color: "white",
  fontSize: "14px",
  fontWeight: "bold",
};

export const commentInfo = {};

export const commentName = {
  color: "#004B63",
  margin: 0,
  fontSize: "12px",
  fontWeight: "700",
};

export const commentRole = {
  margin: "1px 0 0 0",
  color: "#64748B",
  fontSize: "9px",
};

export const commentText = {
  margin: 0,
  color: "#334155",
  fontSize: "10px",
  lineHeight: "1.6",
  whiteSpace: "pre-line",
  fontStyle: "italic",
};

export const adviceBox = (bgColor, sColor) => ({
  padding: "12px 14px",
  background: `linear-gradient(135deg, ${bgColor}, transparent)`,
  borderRadius: "10px",
  borderLeft: `3px solid ${sColor}`,
  marginBottom: "16px",
});

export const adviceTitle = {
  color: "#004B63",
  margin: "0 0 4px 0",
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

export const adviceText = {
  margin: 0,
  color: "#475569",
  fontSize: "10px",
  lineHeight: "1.5",
};

export const footerWrapper = {
  marginTop: "20px",
  padding: "16px 0 0 0",
  borderTop: "2px solid #D6E4EB",
  textAlign: "center",
};

export const footerContent = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
};

export const qrBox = {
  background: "#ffffff",
  padding: "6px",
  borderRadius: "8px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
};

export const qrImage = {
  width: 80,
  height: 80,
  display: "block",
};

export const qrLabel = {
  color: "#94A3B8",
  fontSize: "7px",
  letterSpacing: "0.5px",
};

export const footerInfo = {
  padding: "0 20px",
};

export const footerGeneratedBy = {
  margin: "0 0 2px 0",
  color: "#64748B",
  fontSize: "9px",
  fontWeight: "500",
};

export const footerSite = {
  margin: 0,
  color: "#4DA8C4",
  fontSize: "10px",
  fontWeight: "600",
};

export const footerMeta = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  marginTop: "4px",
};

export const footerFolio = {
  color: "#94A3B8",
  fontSize: "7px",
};

export const footerSep = {
  color: "#CBD5E1",
  fontSize: "7px",
};

export const footerDate = {
  color: "#94A3B8",
  fontSize: "7px",
};

export const footerLegal = {
  margin: "4px 0 0 0",
  color: "#CBD5E1",
  fontSize: "7px",
  lineHeight: "1.4",
};
