import { createContext, useContext, useMemo } from "react";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";

const VAK_STYLES = {
  visual: {
    icon: "👁️",
    colors: { primary: "#4DA8C4", secondary: "#66CCCC", accent: "#004B63" },
    tips: [
      "kid.vak.tip_visual_1",
      "kid.vak.tip_visual_2",
      "kid.vak.tip_visual_3",
    ],
    recommendation: "kid.vak.rec_visual",
  },
  auditivo: {
    icon: "👂",
    colors: { primary: "#66CCCC", secondary: "#88DDDD", accent: "#004B63" },
    tips: [
      "kid.vak.tip_auditory_1",
      "kid.vak.tip_auditory_2",
      "kid.vak.tip_auditory_3",
    ],
    recommendation: "kid.vak.rec_auditory",
  },
  kinestesico: {
    icon: "🏃",
    colors: { primary: "#FFD166", secondary: "#FF8E53", accent: "#004B63" },
    tips: [
      "kid.vak.tip_kinesthetic_1",
      "kid.vak.tip_kinesthetic_2",
      "kid.vak.tip_kinesthetic_3",
    ],
    recommendation: "kid.vak.rec_kinesthetic",
  },
};

const DEFAULT = { primary: "#4DA8C4", secondary: "#66CCCC", accent: "#004B63" };

const VAKThemeContext = createContext({
  vakStyle: null,
  vakColors: DEFAULT,
  vakIcon: "🧠",
  vakTips: [],
  learningRecommendation: "",
  vakResult: null,
});

const VAKThemeProvider = ({ children }) => {
  const { vakResult } = useSmartBoardKids();
  const { t } = useTranslation();

  const value = useMemo(() => {
    if (!vakResult?.predominantStyle)
      return {
        vakStyle: null,
        vakColors: DEFAULT,
        vakIcon: "🧠",
        vakTips: [],
        learningRecommendation: "",
        vakResult: null,
      };

    const style = VAK_STYLES[vakResult.predominantStyle] || VAK_STYLES.visual;
    return {
      vakStyle: vakResult.predominantStyle,
      vakColors: style.colors,
      vakIcon: style.icon,
      vakTips: style.tips.map((k) => t(k)),
      learningRecommendation: t(style.recommendation),
      vakResult,
    };
  }, [vakResult, t]);

  return (
    <VAKThemeContext.Provider value={value}>
      {children}
    </VAKThemeContext.Provider>
  );
};

const useVAKTheme = () => {
  const context = useContext(VAKThemeContext);
  if (!context) {
    throw new Error("useVAKTheme must be used within a VAKThemeProvider");
  }
  return context;
};

const SIZES = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1.5",
};

const VAKBadge = ({ size = "md", showIcon = true, className = "" }) => {
  const { vakStyle, vakIcon, vakColors, vakResult } = useVAKTheme();
  if (!vakStyle || !vakResult) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${SIZES[size]} ${className}`}
      style={{
        backgroundColor: `${vakColors.primary}20`,
        color: vakColors.primary,
        border: `1px solid ${vakColors.primary}40`,
      }}
    >
      {showIcon && <span>{vakIcon}</span>}
      {vakStyle.charAt(0).toUpperCase() + vakStyle.slice(1)}
    </span>
  );
};

export { VAKThemeContext, VAKThemeProvider, useVAKTheme, VAKBadge };
export default VAKThemeProvider;
