/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'hacker-dark': '#040504',
        'electric-lime': '#39ff14',
      },
      fontFamily: {
        display: ['VT323', 'Courier New', 'monospace'],
        tech: ['Share Tech Mono', 'Courier New', 'monospace'],
        mono: ['Roboto Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 3px rgba(57, 255, 20, 0.7), 0 0 6px rgba(57, 255, 20, 0.5)',
      },
    },
  },
  plugins: [],
};
