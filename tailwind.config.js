/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          100: '#f3e8ed',
          200: '#e7d1dd',
          400: '#d8b1c9',
          500: '#c28ca7',
          600: '#ab6387',
        },
        purple: {
          400: '#c5a8dc',
          500: '#baa8d6',
          600: '#a985d2',
        },
        cyan: {
          100: '#d8ebee',
          400: '#78b8c3',
          500: '#5c9aa7',
        },
        teal: {
          500: '#6FA19C',
        },
        yellow: {
          50: '#f7f5e7',
          200: '#e9e4be',
          800: '#7a6547',
        },
        orange: {
          100: '#f0ddc8',
          400: '#D4956B',
          500: '#C67B4B',
          600: '#B66A3A',
          700: '#A65A2A',
        },
        amber: {
          100: '#f0e9c8',
          200: '#e8ddb0',
          400: '#D9C577',
          500: '#C9B561',
          600: '#B8A450',
        },
        red: {
          500: '#B65C5C',
          600: '#A85555',
        },
        emerald: {
          600: '#5B8A7A',
        },
      },
    },
  },
  plugins: [],
};
