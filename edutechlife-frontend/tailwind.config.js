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
        petroleum: '#004B63',
        corporate: '#4DA8C4',
        'soft-blue': '#B2D8E5',
        mint: '#66CCCC',
        navy: '#0A1628',
        'bg-dark': '#0A1628',
        'bg-light': '#FFFFFF',
        'text-main': '#4A4A4A',
        'text-sub': '#64748B',
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
        petroleum: '#004B63',
        corporate: '#4DA8C4',
        'soft-blue': '#B2D8E5',
        mint: '#66CCCC',
        navy: '#0A1628',
        'bg-dark': '#0A1628',
        'bg-light': '#FFFFFF',
      },
      borderColor: {
        petroleum: '#004B63',
        corporate: '#4DA8C4',
        'soft-blue': '#B2D8E5',
        mint: '#66CCCC',
        navy: '#0A1628',
      },
      textColor: {
        petroleum: '#004B63',
        corporate: '#4DA8C4',
        'soft-blue': '#B2D8E5',
        mint: '#66CCCC',
        navy: '#0A1628',
      },
      gradientColorStops: {
        'petroleum-corporate': 'linear-gradient(135deg, #004B63, #4DA8C4)',
        'corporate-mint': 'linear-gradient(135deg, #4DA8C4, #66CCCC)',
        'navy-dark': 'linear-gradient(180deg, #0A1628 0%, #070B14 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 75, 99, 0.1)',
        'glass-lg': '0 20px 50px rgba(0, 75, 99, 0.15)',
        'glass-accent': '0 10px 30px rgba(77, 168, 196, 0.35)',
        'glass-border': '0 0 0 1px rgba(77, 168, 196, 0.12)',
      },
      backdropBlur: {
        glass: '12px',
        'glass-lg': '20px',
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
      },
      transitionProperty: {
        'translate': 'transform',
      },
    },
  },
  plugins: [],
}
