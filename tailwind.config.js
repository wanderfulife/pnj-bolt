/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00A884',
        secondary: '#008F72',
        'dark-bg': '#111B21',
        'dark-secondary': '#202C33',
        'dark-hover': '#2A3942',
        'message-out': '#005C4B',
        'text-primary': '#E9EDEF',
        'text-secondary': '#8696A0',
      }
    },
  },
  plugins: [],
}