/**
 * SISTEMA DE DISEÑO GLASSMORPHISM EVOLUTIVO - EDUTECHLIFE
 * Basado en CSS Custom Properties de tokens.css
 * Referencia: var(--ialab-*) para todos los tokens IALab
 */

import { cn } from '../forum/forumDesignSystem';

// ------------------------------------------------------------------
// 1. CSS VARIABLE HELPERS
// ------------------------------------------------------------------

const cv = (name) => `var(${name})`;

// ------------------------------------------------------------------
// 2. PALETA DE COLORES (mapped from CSS variables)
// ------------------------------------------------------------------

export const GLASS_COLORS = {
  PRIMARY_PETROLEUM: cv('--ialab-petroleum'),
  PRIMARY_CYAN: cv('--ialab-cyan'),
  PRIMARY_NAVY: cv('--ialab-navy'),
  PRIMARY_TEAL: cv('--ialab-teal'),

  GLASS_WHITE: {
    90: 'rgba(255, 255, 255, 0.90)',
    85: 'rgba(255, 255, 255, 0.85)',
    80: 'rgba(255, 255, 255, 0.80)',
    70: 'rgba(255, 255, 255, 0.70)',
  },

  GLASS_CYAN: {
    20: 'rgba(0, 188, 212, 0.20)',
    15: 'rgba(0, 188, 212, 0.15)',
    10: 'rgba(0, 188, 212, 0.10)',
    5: 'rgba(0, 188, 212, 0.05)',
  },

  GLASS_PETROLEUM: {
    10: 'rgba(0, 75, 99, 0.10)',
    5: 'rgba(0, 75, 99, 0.05)',
  },

  BORDER_GLASS: 'rgba(255, 255, 255, 0.25)',
  BORDER_CYAN_SUBTLE: 'rgba(0, 188, 212, 0.15)',
  BORDER_PETROLEUM_SUBTLE: 'rgba(0, 75, 99, 0.08)',
};

// ------------------------------------------------------------------
// 3. COMPONENTES GLASSMORPHISM
// ------------------------------------------------------------------

export const GlassPanel = {
  STANDARD: cn(
    "bg-white",
    "border border-slate-200/60",
    "shadow-sm",
    "rounded-2xl",
    "transition-all duration-200",
    "hover:shadow hover:border-slate-200"
  ),

  ELEVATED: cn(
    "bg-white",
    "border border-slate-200/60",
    "shadow",
    "rounded-2xl",
    "transition-all duration-200",
    "hover:shadow-md"
  ),

  COMPACT: cn(
    "bg-white",
    "border border-slate-200/60",
    "shadow-sm",
    "rounded-xl",
    "transition-all duration-150"
  ),
};

export const MicroBorder = {
  CYAN: "border border-cyan-100/30",
  SLATE: "border border-slate-100",
  GLASS: "border border-white/15",
};

export const ShadowSystem = {
  CYAN_SM: "shadow-sm",
  CYAN_MD: "shadow",
  CYAN_LG: "shadow-lg",
  PETROLEUM_SM: "shadow-sm",
  PETROLEUM_MD: "shadow",
  INNER_CYAN: "shadow-inset-[0_2px_8px_rgba(0,188,212,0.05)]",
};

// ------------------------------------------------------------------
// 4. TIPOGRAFÍA COMPACTA
// ------------------------------------------------------------------

export const CompactTypography = {
  MICRO: "text-[11px] font-normal text-slate-500 leading-tight",
  TINY: "text-[12px] font-normal text-slate-600 leading-snug",
  BODY: "text-[14px] font-normal text-slate-700 leading-relaxed",
  SUBHEADING: "text-[15px] font-semibold text-slate-800 leading-tight",
  HEADING: "text-[17px] font-bold text-slate-900 leading-tight",

  LIGHT: "font-light text-slate-500",
  NORMAL: "font-normal text-slate-700",
  MEDIUM: "font-medium text-slate-800",
  SEMIBOLD: "font-semibold text-slate-900",
  BOLD: "font-bold text-slate-900",

  CYAN: "text-cyan-600",
  CYAN_LIGHT: "text-cyan-500",
  PETROLEUM: "text-slate-800",
  PETROLEUM_LIGHT: "text-slate-600",
};

// ------------------------------------------------------------------
// 5. ESPACIADO MICRO-UI
// ------------------------------------------------------------------

export const MicroSpacing = {
  P_MICRO: "p-2.5",
  P_COMPACT: "p-3.5",
  P_NORMAL: "p-4",

  M_MICRO: "m-1.5",
  M_COMPACT: "m-2.5",
  M_NORMAL: "m-3",

  GAP_MICRO: "gap-1.5",
  GAP_COMPACT: "gap-2.5",
  GAP_NORMAL: "gap-3.5",

  SPACE_MICRO: "space-y-1.5",
  SPACE_COMPACT: "space-y-2.5",
  SPACE_NORMAL: "space-y-3.5",
};

// ------------------------------------------------------------------
// 6. BOTONES EVOLUCIONADOS
// ------------------------------------------------------------------

export const EvolvedButtons = {
  CYAN_PRIMARY: cn(
    "bg-gradient-to-r from-[#004B63] to-[#00BCD4]",
    "text-white font-medium",
    "px-4 py-2.5 rounded-xl",
    "shadow-sm",
    "hover:from-cyan-700 hover:to-cyan-600",
    "hover:shadow",
    "active:scale-[0.98]",
    "transition-all duration-200",
    "disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none"
  ),

  GLASS_SECONDARY: cn(
    "bg-white",
    "border border-slate-200",
    "text-slate-700 font-medium",
    "px-3.5 py-2 rounded-xl",
    "shadow-sm",
    "hover:bg-slate-50 hover:border-slate-300",
    "hover:shadow",
    "active:scale-[0.98]",
    "transition-all duration-150"
  ),

  MICRO_ACTION: cn(
    "bg-white",
    "border border-slate-200",
    "text-slate-600 text-xs font-medium",
    "px-2.5 py-1.5 rounded-lg",
    "hover:bg-slate-50",
    "active:scale-[0.97]",
    "transition-all duration-100"
  ),
};

export const EvolvedInputs = {
  TEXTAREA_COMPACT: cn(
    "bg-white",
    "border border-cyan-100/40",
    "text-slate-700 placeholder:text-slate-600/70",
    "rounded-xl",
    "px-3.5 py-2.5",
    "focus:outline-none focus:ring-2 focus:ring-cyan-300/30 focus:border-cyan-300",
    "transition-all duration-150",
    "resize-none"
  ),

  INPUT_MICRO: cn(
    "bg-white",
    "border border-slate-100",
    "text-slate-700 placeholder:text-slate-600/60",
    "rounded-lg",
    "px-3 py-2",
    "text-sm",
    "focus:outline-none focus:ring-1 focus:ring-cyan-300/20 focus:border-cyan-200",
    "transition-all duration-150"
  ),
};

export const LEDIndicators = {
  CONFIG: {
    idle: { bg: 'bg-slate-400', pulse: false },
    live: { bg: 'bg-emerald-500', pulse: true },
    processing: { bg: 'bg-cyan-500', pulse: true, ping: true },
    success: { bg: 'bg-emerald-500', pulse: false },
    warning: { bg: 'bg-amber-500', pulse: true },
    error: { bg: 'bg-rose-500', pulse: false },
  },

  BASE: "w-2 h-2 rounded-full",

  PULSE: "animate-pulse",
  PING: "animate-ping",
};

// ------------------------------------------------------------------
// 7. SISTEMA DE TARJETAS BLANCAS
// ------------------------------------------------------------------

export const WhiteCard = {
  BASE: cn(
    "rounded-2xl",
    "shadow-sm",
    "border border-slate-200/60",
    "transition-all duration-200"
  ),

  PADDING_XL: "p-12",
  PADDING_LG: "p-10",
  PADDING_MD: "p-8",
  PADDING_SM: "p-6",

  HOVER: cn(
    "hover:shadow",
    "hover:border-slate-200"
  ),

  FOCUS: "focus:outline-none focus:ring-2 focus:ring-cyan-300/30 focus:ring-offset-2",

  WITH_ACCENT_BORDER: "border-l-4 border-l-cyan-500",
  WITH_TOP_GRADIENT: "border-t-4 border-t-cyan-500",

  CONTENT_SPACING: "space-y-6",
  COMPACT_CONTENT: "space-y-4",

  RESPONSIVE: "rounded-2xl",
};

export const WhiteCardPanel = {
  PRIMARY: cn(
    WhiteCard.BASE,
    WhiteCard.PADDING_LG,
    WhiteCard.HOVER,
    "min-h-[200px]"
  ),

  STATS: cn(
    WhiteCard.BASE,
    WhiteCard.PADDING_MD,
    "text-center",
    "hover:shadow"
  ),

  FORM: cn(
    WhiteCard.BASE,
    WhiteCard.PADDING_LG,
    WhiteCard.CONTENT_SPACING
  ),

  FORUM: cn(
    WhiteCard.BASE,
    WhiteCard.PADDING_LG,
    WhiteCard.COMPACT_CONTENT,
    "min-h-[400px]"
  ),

  TOOL: cn(
    WhiteCard.BASE,
    WhiteCard.PADDING_LG,
    WhiteCard.WITH_ACCENT_BORDER,
    "min-h-[300px]"
  ),

  BANNER: cn(
    WhiteCard.BASE,
    WhiteCard.PADDING_MD,
    WhiteCard.WITH_TOP_GRADIENT,
    "bg-gradient-to-br from-white to-slate-50/50"
  ),
};

// ------------------------------------------------------------------
// 8. UTILIDADES
// ------------------------------------------------------------------

export function evolveWithGlassmorphism(baseClass, level = 'standard') {
  const glassClass = GlassPanel[level.toUpperCase()];
  return cn(baseClass, glassClass);
}

export function applyWhiteCard(baseClass, variant = 'primary') {
  const whiteCardClass = WhiteCardPanel[variant.toUpperCase()];
  return cn(baseClass, whiteCardClass);
}

export function cyanGradientBg(opacity = 0.05) {
  return `bg-gradient-to-br from-cyan-500/${opacity * 100} to-cyan-400/${opacity * 70}`;
}

export function applyCompactTypography(type) {
  return CompactTypography[type.toUpperCase()];
}

export default {
  GLASS_COLORS,
  GlassPanel,
  MicroBorder,
  ShadowSystem,
  CompactTypography,
  MicroSpacing,
  EvolvedButtons,
  EvolvedInputs,
  LEDIndicators,
  WhiteCard,
  WhiteCardPanel,
  evolveWithGlassmorphism,
  applyWhiteCard,
  cyanGradientBg,
  applyCompactTypography,
};
