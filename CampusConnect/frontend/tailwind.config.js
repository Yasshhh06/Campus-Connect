/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          dark: '#0f172a',
          blue: '#1e3a8a',
          teal: '#0d9488',
          light: '#f8fafc',
          accent: '#38bdf8'
        }
      }
    },
  },
  plugins: [],
}
