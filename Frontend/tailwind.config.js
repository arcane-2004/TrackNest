/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@ilamy/calendar/dist/**/*.{js,ts,jsx,tsx}", // include the calendar
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
