/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from design tokens
        petroleum: 'var(--color-petroleum)',
        corporate: 'var(--color-corporate)',
        'soft-blue': 'var(--color-soft-blue)',
        mint: 'var(--color-mint)',
        navy: 'var(--color-navy)',
        
        // Semantic colors from design tokens
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-light': 'var(--color-primary-light)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
        
        // Background colors
        'bg-dark': 'var(--color-bg-dark)',
        'bg-light': 'var(--color-bg-light)',
        'bg-card': 'var(--color-bg-card)',
        'bg-card-dark': 'var(--color-bg-card-dark)',
        'bg-glass': 'var(--color-bg-glass)',
        'bg-glass-dark': 'var(--color-bg-glass-dark)',
        
        // Text colors
        'text-main': 'var(--color-text-main)',
        'text-sub': 'var(--color-text-sub)',
        'text-light': 'var(--color-text-light)',
        'text-dark': 'var(--color-text-dark)',
        'text-inverse': 'var(--color-text-inverse)',
        
        // Border colors
        'border-light': 'var(--color-border-light)',
        'border-dark': 'var(--color-border-dark)',
        'border-glass': 'var(--color-border-glass)',
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        montserrat: ['Montserrat', 'sans-serif'],
        'jetbrains-mono': ['JetBrains Mono', 'monospace'],
        'open-sans': ['Open Sans', 'sans-serif'],
        sans: ['Open Sans', 'sans-serif'],
      },
      backgroundColor: {
        petroleum: 'var(--color-petroleum)',
        corporate: 'var(--color-corporate)',
        'soft-blue': 'var(--color-soft-blue)',
        mint: 'var(--color-mint)',
        navy: 'var(--color-navy)',
        'bg-dark': 'var(--color-bg-dark)',
        'bg-light': 'var(--color-bg-light)',
        'bg-card': 'var(--color-bg-card)',
        'bg-card-dark': 'var(--color-bg-card-dark)',
        'bg-glass': 'var(--color-bg-glass)',
        'bg-glass-dark': 'var(--color-bg-glass-dark)',
      },
      borderColor: {
        petroleum: 'var(--color-petroleum)',
        corporate: 'var(--color-corporate)',
        'soft-blue': 'var(--color-soft-blue)',
        mint: 'var(--color-mint)',
        navy: 'var(--color-navy)',
        'border-light': 'var(--color-border-light)',
        'border-dark': 'var(--color-border-dark)',
        'border-glass': 'var(--color-border-glass)',
      },
      textColor: {
        petroleum: 'var(--color-petroleum)',
        corporate: 'var(--color-corporate)',
        'soft-blue': 'var(--color-soft-blue)',
        mint: 'var(--color-mint)',
        navy: 'var(--color-navy)',
        'text-main': 'var(--color-text-main)',
        'text-sub': 'var(--color-text-sub)',
        'text-light': 'var(--color-text-light)',
        'text-dark': 'var(--color-text-dark)',
        'text-inverse': 'var(--color-text-inverse)',
      },
      gradientColorStops: {
        'petroleum-corporate': 'linear-gradient(135deg, var(--color-petroleum), var(--color-corporate))',
        'corporate-mint': 'linear-gradient(135deg, var(--color-corporate), var(--color-mint))',
        'navy-dark': 'linear-gradient(180deg, var(--color-navy) 0%, var(--color-bg-dark) 100%)',
        'premium-gradient': 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
        'glass-gradient': 'linear-gradient(135deg, var(--color-bg-glass), var(--color-bg-glass-dark))',
      },
      boxShadow: {
        glass: 'var(--shadow-glass)',
        'glass-lg': 'var(--shadow-glass-lg)',
        'glass-accent': 'var(--shadow-glass-accent)',
        'glass-border': 'var(--shadow-glass-border)',
        'premium': 'var(--shadow-premium)',
        'premium-lg': 'var(--shadow-premium-lg)',
        'inner-glow': 'var(--shadow-inner-glow)',
        'outer-glow': 'var(--shadow-outer-glow)',
      },
      backdropBlur: {
        glass: 'var(--backdrop-blur-glass)',
        'glass-lg': 'var(--backdrop-blur-glass-lg)',
        'premium': 'var(--backdrop-blur-premium)',
      },
      borderRadius: {
        'glass': 'var(--radius-glass)',
        'glass-lg': 'var(--radius-glass-lg)',
        'pill': 'var(--radius-pill)',
        'premium': 'var(--radius-premium)',
      },
      animation: {
        'grid-move': 'grid-move 24s linear infinite',
        'particle-float': 'particle-float 6s ease-in-out infinite',
        'orb-float': 'orb-float 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'marquee': 'marquee 40s linear infinite',
        'gradient': 'gradient 8s linear infinite',
        'sweep': 'sweep 1.5s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 8s ease-in-out infinite',
        'float-3d': 'float-3d 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'hologram': 'hologram 3s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 0.15s ease-in-out infinite',
        'wave': 'wave 8s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'scan-line': 'scan-line 3s linear infinite',
        'border-glow': 'border-glow 2s ease-in-out infinite',
        'pulse-border': 'pulse-border 2s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out infinite',
        'scale-pulse': 'scale-pulse 2s ease-in-out infinite',
        'premium-pulse': 'premium-pulse 3s ease-in-out infinite',
        'glass-shimmer': 'glass-shimmer 2s ease-in-out infinite',
        'text-glow': 'text-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'grid-move': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 55px' },
        },
        'particle-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'orb-float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-5%, 5%) scale(1.05)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
        'gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'sweep': {
          '0%': { transform: 'translateX(-100%) skewX(-20deg)' },
          '100%': { transform: 'translateX(200%) skewX(-20deg)' },
        },
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
        },
        'float-3d': {
          '0%, 100%': { transform: 'translateY(0px) rotateZ(0deg)' },
          '25%': { transform: 'translateY(-15px) rotateZ(2deg)' },
          '50%': { transform: 'translateY(0px) rotateZ(0deg)' },
          '75%': { transform: 'translateY(15px) rotateZ(-2deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(77, 168, 196, 0.4), 0 0 40px rgba(77, 168, 196, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(77, 168, 196, 0.6), 0 0 60px rgba(77, 168, 196, 0.3)' },
        },
        'hologram': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1) blur(0px)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.2) blur(1px)' },
        },
        'neon-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'wave': {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(5px) translateY(-5px)' },
          '50%': { transform: 'translateX(0) translateY(-10px)' },
          '75%': { transform: 'translateX(-5px) translateY(-5px)' },
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-3px, 3px)' },
          '40%': { transform: 'translate(-3px, -3px)' },
          '60%': { transform: 'translate(3px, 3px)' },
          '80%': { transform: 'translate(3px, -3px)' },
          '100%': { transform: 'translate(0)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'border-glow': {
          '0%, 100%': { borderColor: 'rgba(77, 168, 196, 0.3)', boxShadow: '0 0 10px rgba(77, 168, 196, 0.2)' },
          '50%': { borderColor: 'rgba(77, 168, 196, 0.8)', boxShadow: '0 0 20px rgba(77, 168, 196, 0.5)' },
        },
        'pulse-border': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(77, 168, 196, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(77, 168, 196, 0)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'scale-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'premium-pulse': {
          '0%, 100%': { 
            boxShadow: 'var(--shadow-premium)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: 'var(--shadow-premium-lg)',
            transform: 'scale(1.02)'
          },
        },
        'glass-shimmer': {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
            opacity: '0.95'
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            opacity: '1'
          },
        },
        'text-glow': {
          '0%, 100%': { 
            textShadow: '0 0 10px var(--color-accent), 0 0 20px var(--color-accent)'
          },
          '50%': { 
            textShadow: '0 0 20px var(--color-accent), 0 0 40px var(--color-accent)'
          },
        },
      },
      transitionProperty: {
        'translate': 'transform',
        'glass': 'background, backdrop-filter, box-shadow',
        'premium': 'all',
      },
      transitionDuration: {
        'glass': '300ms',
        'premium': '500ms',
      },
      transitionTimingFunction: {
        'glass': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'premium': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
