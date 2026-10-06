/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        ink: "#16233F",
        inkSoft: "#4A5670",
        bg: "#F4F5F8",
        surface: "#FFFFFF",
        line: "#E2E5EC",
        pending: "#C7CBD6",
        progress: "#D98F3A",
        done: "#1E8F6C",
        accent: "#2F5FD9",
        danger: "#C6432E",
      },
      fontFamily: {
        mono: ["SFMono-Regular", "Consolas", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
