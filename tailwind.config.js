/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#F5F4F8",
          navy: "#EDEAF6",
          blue: "#E4DEF5",
          cyan: "#4C1D95",
          sky: "#F0EEF9",
          orange: "#B9A6F0",
          yellow: "#6D28D9",
          slate: "#241B3A",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
