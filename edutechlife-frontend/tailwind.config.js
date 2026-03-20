/** @type {import('tailwindcss').Config} */
export default {
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
      boxShadow: {
        glass: '0 8px 32px rgba(0, 75, 99, 0.1)',
        'glass-lg': '0 20px 50px rgba(0, 75, 99, 0.15)',
        'glass-accent': '0 10px 30px rgba(77, 168, 196, 0.35)',
      },
    },
  },
  plugins: [],
}
