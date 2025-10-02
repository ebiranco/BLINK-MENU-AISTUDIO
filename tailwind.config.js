/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{components,data,utils,hooks,views}/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#1F2330',
        'primary': '#6C4EFF',
        'secondary': '#D6FF57',
        'text': '#FFFFFF',
        'text-muted': '#a0aec0',
      }
    },
  },
  plugins: [],
}
