/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#000000',
        secondary: '#4b5563',
        border: '#d1d5db',
        card: '#f9fafb',
      },
    },
  },
  plugins: [],
}