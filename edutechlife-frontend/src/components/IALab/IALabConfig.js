/**
 * CONFIGURACIÓN EVOLUTIVA IALab - Control de migración gradual
 * 
 * Este archivo controla qué componentes evolucionados están activos
 * Permite migración gradual sin romper funcionalidad existente
 */

// ------------------------------------------------------------------
// 1. CONFIGURACIÓN DE COMPONENTES EVOLUTIVOS
// ------------------------------------------------------------------

export const IALabConfig = {
  // Control Center - Fusión sintetizador + dashboard
  CONTROL_CENTER: {
    // true: Usa ControlCenterUnified (nuevo, compacto, premium)
    // false: Usa ReactivePromptStation (existente, compatible)
    USE_UNIFIED: true,
    
    // Mostrar selector de versión en desarrollo
    SHOW_VERSION_SELECTOR: process.env.NODE_ENV === 'development',
    
    // Características del Control Center Unificado
    FEATURES: {
      ANALYTICS_REALTIME: true,
      LED_INDICATORS: true,
      GLASSMORPHISM: true,
      MICRO_UI: true,
      TABS: true, // Pestañas sintetizador/analytics/config
    }
  },
  
  // Sistema de diseño evolutivo
  DESIGN_SYSTEM: {
    // true: Usa GlassDesignSystem (glassmorphism, tipografía 14px)
    // false: Usa forumDesignSystem existente
    USE_GLASSMORPHISM: true,
    
    // Aplicar glassmorphism evolutivo a componentes existentes
    EVOLVE_EXISTING_COMPONENTS: true,
    
    // Tipografía compacta (14px base)
    USE_COMPACT_TYPOGRAPHY: true,
  },
  
  // Foro optimizado
  FORUM: {
    // true: Usa IALabForumOptimized (chat compacto)
    // false: Usa IALabForumSection existente
    USE_OPTIMIZED: true,
    
    // Características del foro optimizado
    FEATURES: {
      CHAT_STYLE: true,
      SCROLL_INTERNAL: true,
      BUBBLE_DESIGN: true,
      REAL_TIME_UPDATES: true,
    }
  },
  
  // Lecciones y contenido
  CONTENT: {
    // Reducir espacio vertical entre componentes
    REDUCE_VERTICAL_SPACE: true,
    
    // Aplicar glassmorphism a tarjetas existentes
    EVOLVE_CARDS: true,
    
    // Usar acordeones colapsables para lecciones
    USE_COLLAPSIBLE_ACCORDIONS: true,
  },
  
  // Performance y optimización
  PERFORMANCE: {
    // Lazy loading de componentes pesados
    LAZY_LOAD: true,
    
    // Optimizar renders con React.memo
    USE_MEMO: true,
    
    // Debounce para inputs reactivos
    USE_DEBOUNCE: true,
  }
};

// ------------------------------------------------------------------
// 2. UTILIDADES PARA MIGRACIÓN GRADUAL
// ------------------------------------------------------------------

/**
 * Determina qué componente renderizar basado en configuración
 * @param {Object} options - Opciones de renderizado
 * @param {React.Component} options.unified - Componente evolucionado
 * @param {React.Component} options.existing - Componente existente
 * @param {string} options.feature - Nombre de la característica
 */
export function renderEvolvedComponent({ unified, existing, feature = 'CONTROL_CENTER' }) {
  const config = IALabConfig[feature];
  
  if (!config) {
    console.warn(`⚠️ Configuración no encontrada para: ${feature}`);
    return existing;
  }
  
  const useEvolved = config.USE_UNIFIED || config.USE_OPTIMIZED || config.USE_GLASSMORPHISM;
  
  return useEvolved ? unified : existing;
}

/**
 * Aplica clases evolutivas a componentes existentes
 * @param {string} baseClass - Clase base del componente
 * @param {string} componentType - Tipo de componente ('panel' | 'card' | 'input' | 'button')
 */
export function applyEvolvedStyles(baseClass, componentType = 'panel') {
  if (!IALabConfig.DESIGN_SYSTEM.EVOLVE_EXISTING_COMPONENTS) {
    return baseClass;
  }
  
  const evolvedClasses = {
    panel: "bg-white/85 backdrop-blur-md border border-cyan-100/50 rounded-2xl shadow-[0_8px_30px_rgba(0,188,212,0.08)]",
    card: "bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl shadow-[0_4px_20px_rgba(0,75,99,0.06)]",
    input: "bg-white/85 backdrop-blur-sm border border-slate-100 rounded-lg focus:ring-1 focus:ring-cyan-300/20",
    button: "bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-xl shadow-[0_4px_15px_rgba(0,188,212,0.25)] hover:shadow-[0_6px_20px_rgba(0,188,212,0.35)]",
  };
  
  return `${baseClass} ${evolvedClasses[componentType] || ''}`;
}

/**
 * Obtiene configuración para desarrollo
 */
export function getDevConfig() {
  return {
    isDevelopment: process.env.NODE_ENV === 'development',
    showVersionSelectors: IALabConfig.CONTROL_CENTER.SHOW_VERSION_SELECTOR,
    activeFeatures: Object.entries(IALabConfig)
      .filter(([_, config]) => typeof config === 'object' && 'USE_UNIFIED' in config)
      .map(([feature, config]) => ({
        feature,
        active: config.USE_UNIFIED || config.USE_OPTIMIZED || config.USE_GLASSMORPHISM
      }))
  };
}

export default IALabConfig;