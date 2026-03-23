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
      },
      transitionProperty: {
        'translate': 'transform',
      },
    },
  },
  plugins: [],
}
