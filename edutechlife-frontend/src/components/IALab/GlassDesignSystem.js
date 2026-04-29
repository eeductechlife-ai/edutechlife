/**
 * SISTEMA DE DISEÑO GLASSMORPHISM EVOLUTIVO - EDUTECHLIFE
 * Evolución de la paleta corporativa hacia interfaz compacta tipo SaaS Premium
 * Mantiene 100% compatibilidad con estilos existentes mientras añade refinamiento
 */

import { cn } from '../forum/forumDesignSystem';

// ------------------------------------------------------------------
// 1. PALETA DE COLORES EVOLUTIVA (Mantiene colores corporativos)
// ------------------------------------------------------------------

export const GLASS_COLORS = {
  // Colores corporativos base (INALTERADOS)
  PRIMARY_PETROLEUM: '#004B63',
  PRIMARY_CYAN: '#00BCD4',
  
  // Evolución: Transparencias para glassmorphism
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
  
  // Bordes evolucionados (más sutiles)
  BORDER_GLASS: 'rgba(255, 255, 255, 0.25)',
  BORDER_CYAN_SUBTLE: 'rgba(0, 188, 212, 0.15)',
  BORDER_PETROLEUM_SUBTLE: 'rgba(0, 75, 99, 0.08)',
};

// ------------------------------------------------------------------
// 2. COMPONENTES GLASSMORPHISM EVOLUTIVOS
// ------------------------------------------------------------------

/**
 * GlassPanel - Evolución de tarjetas existentes hacia diseño compacto premium
 * Mantiene bordes cyan pero los hace más sutiles, añade glassmorphism
 */
export const GlassPanel = {
  // Nivel 1: Panel estandar (fondo solido blanco)
  STANDARD: cn(
    "bg-white",
    "border border-slate-200/60",
    "shadow-sm",
    "rounded-2xl",
    "transition-all duration-200",
    "hover:shadow hover:border-slate-200"
  ),
  
  // Nivel 2: Panel elevado (para elementos interactivos)
  ELEVATED: cn(
    "bg-white",
    "border border-slate-200/60",
    "shadow",
    "rounded-2xl",
    "transition-all duration-200",
    "hover:shadow-md"
  ),
  
  // Nivel 3: Panel compacto (para micro-UI)
  COMPACT: cn(
    "bg-white",
    "border border-slate-200/60",
    "shadow-sm",
    "rounded-xl",
    "transition-all duration-150"
  ),
};

/**
 * MicroBorder - Bordes ultra sutiles para componentes compactos
 */
export const MicroBorder = {
  CYAN: "border border-cyan-100/30",
  SLATE: "border border-slate-100",
  GLASS: "border border-white/15",
};

/**
 * ShadowSystem - Sombras ambientales evolucionadas
 */
export const ShadowSystem = {
  // Sombras cyan sutiles (reemplazan sombras negras genéricas)
  CYAN_SM: "shadow-sm",
  CYAN_MD: "shadow",
  CYAN_LG: "shadow-lg",
  
  // Sombras petroleum para estructura
  PETROLEUM_SM: "shadow-sm",
  PETROLEUM_MD: "shadow",
  
  // Sombras interiores para profundidad
  INNER_CYAN: "shadow-inset-[0_2px_8px_rgba(0,188,212,0.05)]",
};

// ------------------------------------------------------------------
// 3. TIPOGRAFÍA COMPACTA (14px base - Evolución sutil)
// ------------------------------------------------------------------

export const CompactTypography = {
  // Jerarquía compacta (evolución manteniendo legibilidad)
  MICRO: "text-[11px] font-normal text-slate-500 leading-tight",
  TINY: "text-[12px] font-normal text-slate-600 leading-snug",
  BODY: "text-[14px] font-normal text-slate-700 leading-relaxed", // BASE
  SUBHEADING: "text-[15px] font-semibold text-slate-800 leading-tight",
  HEADING: "text-[17px] font-bold text-slate-900 leading-tight",
  
  // Pesos estratégicos (evolución sutil)
  LIGHT: "font-light text-slate-500",      // Datos secundarios
  NORMAL: "font-normal text-slate-700",    // Contenido principal
  MEDIUM: "font-medium text-slate-800",    // Subtítulos
  SEMIBOLD: "font-semibold text-slate-900", // Encabezados sección
  BOLD: "font-bold text-slate-900",        // Solo puntos de enfoque
  
  // Colores corporativos evolucionados
  CYAN: "text-cyan-600",
  CYAN_LIGHT: "text-cyan-500",
  PETROLEUM: "text-slate-800",
  PETROLEUM_LIGHT: "text-slate-600",
};

// ------------------------------------------------------------------
// 4. ESPACIADO MICRO-UI (Evolución: reducción sutil)
// ------------------------------------------------------------------

export const MicroSpacing = {
  // Padding evolucionado (ligera reducción)
  P_MICRO: "p-2.5",
  P_COMPACT: "p-3.5",
  P_NORMAL: "p-4",
  
  // Margin evolucionado
  M_MICRO: "m-1.5",
  M_COMPACT: "m-2.5",
  M_NORMAL: "m-3",
  
  // Gap evolucionado
  GAP_MICRO: "gap-1.5",
  GAP_COMPACT: "gap-2.5",
  GAP_NORMAL: "gap-3.5",
  
  // Espaciado vertical evolucionado
  SPACE_MICRO: "space-y-1.5",
  SPACE_COMPACT: "space-y-2.5",
  SPACE_NORMAL: "space-y-3.5",
};

// ------------------------------------------------------------------
// 5. COMPONENTES ESPECÍFICOS EVOLUTIVOS
// ------------------------------------------------------------------

/**
 * Botones evolucionados - Mantienen gradientes pero más sutiles
 */
export const EvolvedButtons = {
  // Botón cyan premium (evolución del botón actual)
  CYAN_PRIMARY: cn(
    "bg-gradient-to-r from-cyan-600 to-cyan-500",
    "text-white font-medium",
    "px-4 py-2.5 rounded-xl",
    "shadow-sm",
    "hover:from-cyan-700 hover:to-cyan-600",
    "hover:shadow",
    "active:scale-[0.98]",
    "transition-all duration-200",
    "disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none"
  ),
  
  // Botón glass sutil
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
  
  // Botón micro para acciones compactas
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

/**
 * Inputs evolucionados - Más compactos y refinados
 */
export const EvolvedInputs = {
  // Textarea premium compacta
  TEXTAREA_COMPACT: cn(
    "bg-white",
    "border border-cyan-100/40",
    "text-slate-700 placeholder:text-slate-400/70",
    "rounded-xl",
    "px-3.5 py-2.5",
    "focus:outline-none focus:ring-2 focus:ring-cyan-300/30 focus:border-cyan-300",
    "transition-all duration-150",
    "resize-none"
  ),
  
  // Input micro para formularios compactos
  INPUT_MICRO: cn(
    "bg-white",
    "border border-slate-100",
    "text-slate-700 placeholder:text-slate-400/60",
    "rounded-lg",
    "px-3 py-2",
    "text-sm",
    "focus:outline-none focus:ring-1 focus:ring-cyan-300/20 focus:border-cyan-200",
    "transition-all duration-150"
  ),
};

/**
 * LED Indicators - Sistema de micro-indicadores de estado
 */
export const LEDIndicators = {
  // Configuración por tipo
  CONFIG: {
    idle: { bg: 'bg-slate-400', pulse: false },
    live: { bg: 'bg-emerald-500', pulse: true },
    processing: { bg: 'bg-cyan-500', pulse: true, ping: true },
    success: { bg: 'bg-emerald-500', pulse: false },
    warning: { bg: 'bg-amber-500', pulse: true },
    error: { bg: 'bg-rose-500', pulse: false },
  },
  
  // Clase base para LED
  BASE: "w-2 h-2 rounded-full",
  
  // Animaciones
  PULSE: "animate-pulse",
  PING: "animate-ping",
};

// ------------------------------------------------------------------
// 6. SISTEMA DE TARJETAS BLANCAS INDEPENDIENTES - SaaS Premium
// ------------------------------------------------------------------

/**
 * WhiteCard - Sistema de tarjetas blancas independientes con acabados SaaS Premium
 * ADN Visual: bg-white sólido, rounded-[2.5rem], sombra ambiental con azul petróleo
 */
export const WhiteCard = {
  // Base: Tarjeta blanca independiente con curvatura amplia y moderna
  BASE: cn(
    "bg-white",                          // Sólido, limpieza absoluta
    "rounded-[2.5rem]",                  // Curvatura amplia y moderna (40px)
    "shadow-sm",                         // Sombra sutil
    "border border-slate-200/60",        // Contorno definido
    "transition-all duration-200"        // Transiciones suaves
  ),
  
  // Variantes de padding para contenido que respira
  PADDING_XL: "p-12",                    // Espaciado máximo premium
  PADDING_LG: "p-10",                    // Espaciado generoso (recomendado)
  PADDING_MD: "p-8",                     // Espaciado estándar
  PADDING_SM: "p-6",                     // Espaciado compacto
  
  // Estados interactivos
  HOVER: cn(
    "hover:shadow",
    "hover:border-slate-200"
  ),
  
  FOCUS: "focus:outline-none focus:ring-2 focus:ring-cyan-300/30 focus:ring-offset-2",
  
  // Variantes especiales
  WITH_ACCENT_BORDER: "border-l-4 border-l-cyan-500", // Borde lateral cyan para destacar
  WITH_TOP_GRADIENT: "border-t-4 border-t-cyan-500",  // Gradiente superior
  
  // Para contenido interno
  CONTENT_SPACING: "space-y-6",          // Espaciado vertical generoso
  COMPACT_CONTENT: "space-y-4",          // Espaciado compacto
  
  // Responsive
  RESPONSIVE: "rounded-3xl md:rounded-[2.5rem]", // Mobile: 24px, Desktop: 40px
};

/**
 * WhiteCardPanel - Paneles específicos para diferentes tipos de contenido
 */
export const WhiteCardPanel = {
  // Panel principal para contenido destacado
  PRIMARY: cn(
    WhiteCard.BASE,
    WhiteCard.PADDING_LG,
    WhiteCard.HOVER,
    "min-h-[200px]"
  ),
  
  // Panel para estadísticas y métricas
  STATS: cn(
    WhiteCard.BASE,
    WhiteCard.PADDING_MD,
    "text-center",
    "hover:shadow"
  ),
  
  // Panel para formularios y entrada de datos
  FORM: cn(
    WhiteCard.BASE,
    WhiteCard.PADDING_LG,
    WhiteCard.CONTENT_SPACING
  ),
  
  // Panel para foros y conversaciones
  FORUM: cn(
    WhiteCard.BASE,
    WhiteCard.PADDING_LG,
    WhiteCard.COMPACT_CONTENT,
    "min-h-[400px]"
  ),
  
  // Panel para sintetizadores y herramientas
  TOOL: cn(
    WhiteCard.BASE,
    WhiteCard.PADDING_LG,
    WhiteCard.WITH_ACCENT_BORDER,
    "min-h-[300px]"
  ),
  
  // Panel para banners y anuncios
  BANNER: cn(
    WhiteCard.BASE,
    WhiteCard.PADDING_MD,
    WhiteCard.WITH_TOP_GRADIENT,
    "bg-gradient-to-br from-white to-slate-50/50"
  ),
};

// ------------------------------------------------------------------
// 7. UTILIDADES DE DISEÑO
// ------------------------------------------------------------------

/**
 * Aplica glassmorphism evolutivo a componentes existentes
 * @param {string} baseClass - Clase base del componente existente
 * @param {string} level - Nivel de glassmorphism ('standard' | 'elevated' | 'compact')
 */
export function evolveWithGlassmorphism(baseClass, level = 'standard') {
  const glassClass = GlassPanel[level.toUpperCase()];
  return cn(baseClass, glassClass);
}

/**
 * Aplica sistema de tarjetas blancas independientes
 * @param {string} baseClass - Clase base del componente existente
 * @param {string} variant - Variante de tarjeta blanca ('primary' | 'stats' | 'form' | 'forum' | 'tool' | 'banner')
 */
export function applyWhiteCard(baseClass, variant = 'primary') {
  const whiteCardClass = WhiteCardPanel[variant.toUpperCase()];
  return cn(baseClass, whiteCardClass);
}

/**
 * Crea un gradiente cyan sutil para fondos
 */
export function cyanGradientBg(opacity = 0.05) {
  return `bg-gradient-to-br from-cyan-500/${opacity * 100} to-cyan-400/${opacity * 70}`;
}

/**
 * Aplica tipografía compacta manteniendo jerarquía
 * @param {string} type - Tipo de tipografía ('micro' | 'tiny' | 'body' | 'subheading' | 'heading')
 */
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