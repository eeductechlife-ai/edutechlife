/**
 * EDUTECHLIFE DESIGN TOKENS - Sistema de Diseño Premium
 * Única fuente de verdad para tokens de diseño
 * Versión: 1.0.0
 */

export const designTokens = {
  // ==================== PALETA DE COLORES ====================
  colors: {
    // Paleta principal EdutechLife - Azules corporativos
    primary: {
      50: '#F0F9FF',    // Azul muy claro
      100: '#E0F2FE',   // Azul claro
      200: '#BAE6FD',   // Azul suave
      300: '#7DD3FC',   // Azul cielo
      400: '#38BDF8',   // Azul brillante
      500: '#0EA5E9',   // Azul corporativo principal
      600: '#0284C7',   // Azul corporativo oscuro
      700: '#0369A1',   // Azul marino claro
      800: '#075985',   // Azul marino
      900: '#0C4A6E',   // Azul marino oscuro
      
      // Nombres semánticos para compatibilidad
      petroleum: '#004B63',
      corporate: '#4DA8C4',
      softBlue: '#B2D8E5',
      mint: '#66CCCC',
      navy: '#0A1628'
    },
    
    // Colores VAK específicos
    vak: {
      visual: {
        50: '#F0F9FF',
        100: '#E0F2FE',
        500: '#4DA8C4',    // Cian - Visual
        600: '#0284C7',
        900: '#0C4A6E'
      },
      auditivo: {
        50: '#F0FDF4',
        100: '#DCFCE7',
        500: '#66CCCC',    // Menta - Auditivo
        600: '#16A34A',
        900: '#14532D'
      },
      kinestesico: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        500: '#FF6B9D',    // Rosa - Kinestésico
        600: '#DC2626',
        900: '#7F1D1D'
      }
    },
    
    // Colores semánticos para estados y feedback
    semantic: {
      success: {
        50: '#F0FDF4',
        100: '#DCFCE7',
        500: '#10B981',
        600: '#059669',
        900: '#064E3B'
      },
      warning: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        500: '#F59E0B',
        600: '#D97706',
        900: '#78350F'
      },
      error: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        500: '#EF4444',
        600: '#DC2626',
        900: '#7F1D1D'
      },
      info: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        500: '#3B82F6',
        600: '#2563EB',
        900: '#1E3A8A'
      }
    },
    
    // Sistema de grises basado en azul (coherencia tonal)
    gray: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A'
    },
    
    // Fondos y superficies
    background: {
      light: '#FFFFFF',
      dark: '#0A1628',
      glass: 'rgba(255, 255, 255, 0.1)',
      glassDark: 'rgba(15, 23, 42, 0.8)'
    }
  },
  
  // ==================== TIPOGRAFÍA ====================
  typography: {
    // Familias de fuentes
    families: {
      display: "'Montserrat', system-ui, -apple-system, sans-serif",
      body: "'Open Sans', system-ui, -apple-system, sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', Monaco, monospace"
    },
    
    // Escala tipográfica (basada en 16px = 1rem)
    scale: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
      '7xl': '4.5rem',    // 72px
      '8xl': '6rem',      // 96px
      '9xl': '8rem'       // 128px
    },
    
    // Line heights
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    },
    
    // Font weights
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    },
    
    // Letter spacing
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    }
  },
  
  // ==================== ESPACIADO ====================
  spacing: {
    // Sistema 8pt grid (1 unidad = 0.25rem = 4px)
    px: '1px',
    0: '0',
    0.5: '0.125rem',   // 2px
    1: '0.25rem',      // 4px
    1.5: '0.375rem',   // 6px
    2: '0.5rem',       // 8px
    2.5: '0.625rem',   // 10px
    3: '0.75rem',      // 12px
    3.5: '0.875rem',   // 14px
    4: '1rem',         // 16px
    5: '1.25rem',      // 20px
    6: '1.5rem',       // 24px
    7: '1.75rem',      // 28px
    8: '2rem',         // 32px
    9: '2.25rem',      // 36px
    10: '2.5rem',      // 40px
    11: '2.75rem',     // 44px
    12: '3rem',        // 48px
    14: '3.5rem',      // 56px
    16: '4rem',        // 64px
    20: '5rem',        // 80px
    24: '6rem',        // 96px
    28: '7rem',        // 112px
    32: '8rem',        // 128px
    36: '9rem',        // 144px
    40: '10rem',       // 160px
    44: '11rem',       // 176px
    48: '12rem',       // 192px
    52: '13rem',       // 208px
    56: '14rem',       // 224px
    60: '15rem',       // 240px
    64: '16rem',       // 256px
    72: '18rem',       // 288px
    80: '20rem',       // 320px
    96: '24rem'        // 384px
  },
  
  // ==================== BORDES Y RADIOS ====================
  borders: {
    width: {
      none: '0',
      thin: '1px',
      medium: '2px',
      thick: '4px'
    },
    
    radius: {
      none: '0',
      sm: '0.125rem',   // 2px
      DEFAULT: '0.25rem', // 4px
      md: '0.375rem',   // 6px
      lg: '0.5rem',     // 8px
      xl: '0.75rem',    // 12px
      '2xl': '1rem',    // 16px
      '3xl': '1.5rem',  // 24px
      full: '9999px'
    }
  },
  
  // ==================== SOMBRAS ====================
  shadows: {
    // Sombras estándar
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    
    // Sombras glassmorphism premium
    glass: {
      light: '0 8px 32px rgba(31, 38, 135, 0.37)',
      dark: '0 8px 32px rgba(0, 0, 0, 0.5)',
      colored: '0 8px 32px rgba(77, 168, 196, 0.3)'
    },
    
    // Sombras internas
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
  },
  
  // ==================== GRADIENTES ====================
  gradients: {
    primary: {
      horizontal: 'linear-gradient(90deg, #004B63 0%, #4DA8C4 100%)',
      vertical: 'linear-gradient(180deg, #004B63 0%, #4DA8C4 100%)',
      diagonal: 'linear-gradient(135deg, #004B63 0%, #4DA8C4 100%)'
    },
    
    vak: {
      visual: 'linear-gradient(135deg, #4DA8C4 0%, #66CCCC 100%)',
      auditivo: 'linear-gradient(135deg, #66CCCC 0%, #4DA8C4 100%)',
      kinestesico: 'linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%)'
    },
    
    glass: {
      light: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      dark: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)'
    }
  },
  
  // ==================== ANIMACIONES ====================
  animations: {
    duration: {
      fastest: '100ms',
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
      slowest: '700ms'
    },
    
    timing: {
      linear: 'linear',
      ease: 'ease',
      'ease-in': 'ease-in',
      'ease-out': 'ease-out',
      'ease-in-out': 'ease-in-out',
      spring: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  
  // ==================== Z-INDEX ====================
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  }
};

/**
 * Helper functions para usar los tokens
 */
export const tokenHelpers = {
  // Obtener color con opacidad
  colorWithOpacity: (color, opacity = 1) => {
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  },
  
  // Convertir a variables CSS
  toCSSVariables: () => {
    const variables = {};
    
    // Colores
    Object.entries(designTokens.colors).forEach(([category, values]) => {
      if (typeof values === 'object') {
        Object.entries(values).forEach(([key, value]) => {
          if (typeof value === 'object') {
            Object.entries(value).forEach(([shade, shadeValue]) => {
              variables[`--color-${category}-${key}-${shade}`] = shadeValue;
            });
          } else {
            variables[`--color-${category}-${key}`] = value;
          }
        });
      }
    });
    
    return variables;
  }
};

export default designTokens;