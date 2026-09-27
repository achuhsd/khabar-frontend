/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A0F2C',
        coral: '#FF6B47',
        teal: '#1ECFAA',
        gold: '#FFD166',
        card: '#161B3A',
        card2: '#1A2040',
        muted: '#A0A8C0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}