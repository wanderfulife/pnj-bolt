/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-primary': '#0F0F13',
        'dark-secondary': '#1A1A1F',
        'dark-hover': '#25252B',
        'dark-active': '#2F2F36',
        'accent-primary': '#8B5CF6',
        'accent-secondary': '#7C3AED',
        'text-primary': '#E2E2E6',
        'text-secondary': '#9595A5',
        'text-tertiary': '#6B6B7B',
        'border-color': '#2F2F36',
        'message-out': '#7C3AED',
        'message-in': '#25252B'
      },
    },
  },
  plugins: [],
}