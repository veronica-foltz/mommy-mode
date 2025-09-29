/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f7f7fd",
          100: "#eeeefd",
          200: "#e1e5fc",
          300: "#cfd3f9",
          400: "#aab2f2",
          500: "#7f86e5",   // primary lavender
          600: "#6a70cd",
          700: "#575caf",
          800: "#464c8e",
          900: "#3a3f73",
        },
      },
      borderRadius: { xl2: "1.25rem" }
    },
  },
  plugins: [],
};