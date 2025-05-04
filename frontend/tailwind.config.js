/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#8FD9A8', // Vert clair
          DEFAULT: '#4CAF50', // Vert
          dark: '#2E7D32', // Vert foncé
        },
        secondary: {
          light: '#81D4FA', // Bleu clair
          DEFAULT: '#03A9F4', // Bleu
          dark: '#0288D1', // Bleu foncé
        },
      },
    },
  },
  plugins: [],
}
