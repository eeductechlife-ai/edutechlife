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
        montserrat: ['Montserrat', 'sans-serif'],
        'jetbrains-mono': ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        montserrat: {
          700: '700',
          900: '900',
        },
      },
    },
  },
  plugins: [],
}
