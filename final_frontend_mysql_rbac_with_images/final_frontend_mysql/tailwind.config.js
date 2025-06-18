/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // <--- This enables class-based dark mode!
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all JS/TS files inside src folder for Tailwind classes
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
