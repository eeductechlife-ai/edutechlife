/**
 * SISTEMA DE DISEÑO CORPORATIVO - FORO EDUTECHLIFE
 * Paleta de colores exclusiva para el "Muro de Insights"
 * Basado en la identidad visual de Edutechlife
 */

export const FORUM_COLORS = {
  // Colores corporativos principales
  PRIMARY_PETROLEUM: '#004B63',      // Color principal - Petroleum
  PRIMARY_CORPORATE: '#00BCD4',      // Color corporativo - Cyan
  PRIMARY_DARK: '#00374A',           // Petroleum oscuro (textos)
  
  // Colores de fondo
  BG_GLASS: 'rgba(255, 255, 255, 0.92)',
  BG_GLASS_DARK: 'rgba(248, 250, 252, 0.95)',
  BG_LIGHT: '#F8FAFC',
  BG_ACCENT: '#E8F4F8',
  
  // Colores de texto
  TEXT_MAIN: '#00374A',
  TEXT_SUB: '#004B63',
  TEXT_LIGHT: '#004B63',
  TEXT_DISABLED: '#004B63/40',
  
  // Colores de bordes
  BORDER_LIGHT: 'rgba(0, 75, 99, 0.12)',
  BORDER_GLASS: 'rgba(0, 75, 99, 0.08)',
  BORDER_ACCENT: 'rgba(0, 188, 212, 0.3)',
  
  // Estados
  SUCCESS: '#00BCD4',
  WARNING: '#FFB74D',
  ERROR: '#F44336',
  INFO: '#004B63',
};

export const FORUM_TYPOGRAPHY = {
  // Jerarquía tipográfica
  DISPLAY: {
    XL: 'text-3xl font-bold font-display tracking-tight',
    LG: 'text-2xl font-bold font-display tracking-normal',
    MD: 'text-xl font-bold font-display',
    SM: 'text-lg font-bold font-display',
  },
  
  BODY: {
    XL: 'text-lg font-body',
    LG: 'text-base font-body',
    MD: 'text-sm font-body',
    SM: 'text-xs font-body',
    XS: 'text-[10px] font-body',
  },
  
  // Pesos específicos
  BOLD: 'font-bold',
  SEMIBOLD: 'font-semibold',
  MEDIUM: 'font-medium',
  NORMAL: 'font-normal',
  
  // Colores de texto
  TEXT_PRIMARY: 'text-[#00374A]',
  TEXT_SECONDARY: 'text-[#004B63]',
  TEXT_LIGHT: 'text-[#004B63]/70',
  TEXT_DISABLED: 'text-[#004B63]/40',
};

export const FORUM_SPACING = {
  // Padding
  P_XS: 'p-2',
  P_SM: 'p-3',
  P_MD: 'p-4',
  P_LG: 'p-6',
  P_XL: 'p-8',
  
  // Margin
  M_XS: 'm-2',
  M_SM: 'm-3',
  M_MD: 'm-4',
  M_LG: 'm-6',
  M_XL: 'm-8',
  
  // Gap
  GAP_XS: 'gap-1',
  GAP_SM: 'gap-2',
  GAP_MD: 'gap-3',
  GAP_LG: 'gap-4',
  GAP_XL: 'gap-6',
  
  // Responsive
  RESPONSIVE: {
    MOBILE: 'sm:',
    TABLET: 'md:',
    DESKTOP: 'lg:',
    WIDE: 'xl:',
  }
};

export const FORUM_EFFECTS = {
  // Sombras
  SHADOW_XS: 'shadow-[0_1px_3px_rgba(0,75,99,0.05)]',
  SHADOW_SM: 'shadow-[0_2px_8px_rgba(0,75,99,0.08)]',
  SHADOW_MD: 'shadow-[0_4px_16px_rgba(0,75,99,0.1)]',
  SHADOW_LG: 'shadow-[0_8px_32px_rgba(0,75,99,0.12)]',
  SHADOW_XL: 'shadow-[0_16px_48px_rgba(0,75,99,0.15)]',
  SHADOW_GLASS: 'shadow-[0_30px_60px_rgba(0,0,0,0.05)]',
  
  // Bordes
  BORDER_RADIUS_SM: 'rounded-lg',
  BORDER_RADIUS_MD: 'rounded-xl',
  BORDER_RADIUS_LG: 'rounded-2xl',
  BORDER_RADIUS_XL: 'rounded-3xl',
  BORDER_RADIUS_FULL: 'rounded-full',
  
  // Transiciones
  TRANSITION_ALL: 'transition-all duration-300 ease-out',
  TRANSITION_COLORS: 'transition-colors duration-200 ease-out',
  TRANSITION_TRANSFORM: 'transition-transform duration-300 ease-out',
  TRANSITION_OPACITY: 'transition-opacity duration-200 ease-out',
  
  // Animaciones
  ANIMATION_FADE_IN: 'animate-fade-in',
  ANIMATION_SLIDE_UP: 'animate-slide-up',
  ANIMATION_SCALE_IN: 'animate-scale-in',
  ANIMATION_PULSE: 'animate-pulse',
  ANIMATION_SPIN: 'animate-spin',
  
  // Efectos hover
  HOVER_SCALE: 'hover:scale-[1.02] active:scale-[0.98]',
  HOVER_SHADOW: 'hover:shadow-lg hover:shadow-[#004B63]/10',
  HOVER_BG_LIGHT: 'hover:bg-[#004B63]/5',
  HOVER_BG_MEDIUM: 'hover:bg-[#004B63]/10',
  HOVER_BG_ACCENT: 'hover:bg-gradient-to-r hover:from-[#004B63]/5 hover:to-[#00BCD4]/5',
  
  // Efectos focus
  FOCUS_RING: 'focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-2',
  FOCUS_RING_INSET: 'focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-inset',
  
  // Efectos active
  ACTIVE_SCALE: 'active:scale-[0.98]',
  ACTIVE_OPACITY: 'active:opacity-80',
};

export const FORUM_COMPONENTS = {
  // Botones
  BUTTON_PRIMARY: `
    bg-[#004B63] text-white 
    px-4 py-2 rounded-xl 
    hover:bg-[#00374A] 
    focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed 
    transition-all duration-300
  `,
  
  BUTTON_SECONDARY: `
    bg-[#00BCD4] text-white 
    px-4 py-2 rounded-xl 
    hover:bg-[#00A5C2] 
    focus:outline-none focus:ring-2 focus:ring-[#004B63] focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed 
    transition-all duration-300
  `,
  
  BUTTON_OUTLINE: `
    border border-[#004B63] text-[#004B63] 
    px-4 py-2 rounded-xl 
    hover:bg-[#004B63]/10 
    focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed 
    transition-all duration-300
  `,
  
  BUTTON_GHOST: `
    text-[#004B63] 
    px-3 py-1.5 rounded-lg 
    hover:bg-[#004B63]/10 
    focus:outline-none focus:ring-1 focus:ring-[#00BCD4] 
    disabled:opacity-50 disabled:cursor-not-allowed 
    transition-all duration-200
  `,
  
  // Inputs
  INPUT_BASE: `
    w-full text-sm p-3 
    border border-[rgba(0,75,99,0.15)] rounded-lg 
    bg-white 
    focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent 
    disabled:opacity-50 disabled:cursor-not-allowed 
    transition-all duration-200
  `,
  
  TEXTAREA_BASE: `
    w-full text-sm p-3 
    border border-[rgba(0,75,99,0.15)] rounded-lg 
    bg-white resize-none 
    focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent 
    disabled:opacity-50 disabled:cursor-not-allowed 
    transition-all duration-200
  `,
  
  // Cards
  CARD_GLASS: `
    bg-white/95 backdrop-blur-sm 
    border border-[rgba(0,75,99,0.1)] 
    shadow-[0_8px_32px_rgba(0,75,99,0.08)] 
    rounded-2xl 
    transition-all duration-300
  `,
  
  CARD_ACCENT: `
    bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5 
    border border-[rgba(0,188,212,0.2)] 
    shadow-[0_4px_16px_rgba(0,188,212,0.1)] 
    rounded-2xl 
    transition-all duration-300
  `,
  
  // Badges
  BADGE_PRIMARY: `
    bg-[#004B63]/10 text-[#004B63] 
    px-2 py-1 rounded-full 
    text-xs font-medium
  `,
  
  BADGE_SECONDARY: `
    bg-[#00BCD4]/10 text-[#00BCD4] 
    px-2 py-1 rounded-full 
    text-xs font-medium
  `,
  
  BADGE_SUCCESS: `
    bg-[#00BCD4]/10 text-[#00BCD4] 
    px-2 py-1 rounded-full 
    text-xs font-medium
  `,
};

// Helper para clases condicionales
export const cn = (...classes) => classes.filter(Boolean).join(' ');

// Helper para gradientes corporativos
export const GRADIENTS = {
  PRIMARY: 'bg-gradient-to-r from-[#004B63] to-[#00BCD4]',
  PRIMARY_REVERSE: 'bg-gradient-to-r from-[#00BCD4] to-[#004B63]',
  LIGHT: 'bg-gradient-to-br from-white to-[#F8FAFC]',
  GLASS: 'bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-sm',
};

export default {
  COLORS: FORUM_COLORS,
  TYPOGRAPHY: FORUM_TYPOGRAPHY,
  SPACING: FORUM_SPACING,
  EFFECTS: FORUM_EFFECTS,
  COMPONENTS: FORUM_COMPONENTS,
  GRADIENTS,
  cn,
};