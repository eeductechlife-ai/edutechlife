import { createContext, useContext, useMemo } from 'react';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';

const VAK_STYLES = {
  visual: {
    icon: '👁️',
    colors: { primary: '#4DA8C4', secondary: '#66CCCC', accent: '#004B63' },
    tips: [
      'Usa mapas mentales y diagramas',
      'Colorea tus apuntes con resaltadores',
      'Dibuja esquemas de los conceptos'
    ],
    recommendation: 'Aprendes mejor viendo. Usa videos, infografías y colores.'
  },
  auditivo: {
    icon: '👂',
    colors: { primary: '#66CCCC', secondary: '#88DDDD', accent: '#004B63' },
    tips: [
      'Graba tus apuntes y escúchalos',
      'Explica los temas en voz alta',
      'Usa canciones y rimas para memorizar'
    ],
    recommendation: 'Aprendes mejor escuchando. Usa podcasts, audios y explicaciones orales.'
  },
  kinestesico: {
    icon: '🏃',
    colors: { primary: '#FFD166', secondary: '#FF8E53', accent: '#004B63' },
    tips: [
      'Construye modelos y maquetas',
      'Actúa situaciones de aprendizaje',
      'Toma descansos activos entre estudio'
    ],
    recommendation: 'Aprendes haciendo. Usa experimentos, juegos y actividades prácticas.'
  }
};

const DEFAULT = { primary: '#4DA8C4', secondary: '#66CCCC', accent: '#004B63' };

const VAKThemeContext = createContext({
  vakStyle: null, vakColors: DEFAULT, vakIcon: '🧠', vakTips: [], learningRecommendation: '', vakResult: null,
});

const VAKThemeProvider = ({ children }) => {
  const { vakResult } = useSmartBoardKids();

  const value = useMemo(() => {
    if (!vakResult?.predominantStyle) return { vakStyle: null, vakColors: DEFAULT, vakIcon: '🧠', vakTips: [], learningRecommendation: '', vakResult: null };

    const style = VAK_STYLES[vakResult.predominantStyle] || VAK_STYLES.visual;
    return { vakStyle: vakResult.predominantStyle, vakColors: style.colors, vakIcon: style.icon, vakTips: style.tips, learningRecommendation: style.recommendation, vakResult };
  }, [vakResult]);

  return <VAKThemeContext.Provider value={value}>{children}</VAKThemeContext.Provider>;
};

const useVAKTheme = () => {
  const context = useContext(VAKThemeContext);
  if (!context) {
    throw new Error('useVAKTheme must be used within a VAKThemeProvider');
  }
  return context;
};

const SIZES = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1', lg: 'text-base px-4 py-1.5' };

const VAKBadge = ({ size = 'md', showIcon = true, className = '' }) => {
  const { vakStyle, vakIcon, vakColors, vakResult } = useVAKTheme();
  if (!vakStyle || !vakResult) return null;

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${SIZES[size]} ${className}`}
      style={{ backgroundColor: `${vakColors.primary}20`, color: vakColors.primary, border: `1px solid ${vakColors.primary}40` }}>
      {showIcon && <span>{vakIcon}</span>}
      {vakStyle.charAt(0).toUpperCase() + vakStyle.slice(1)}
    </span>
  );
};

export { VAKThemeContext, VAKThemeProvider, useVAKTheme, VAKBadge };
export default VAKThemeProvider;
