/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        primary: '#800000', // Maroon
        secondary: '#FBBF24', // Amber 400
        surface: '#F9FAFB', // Gray 50
        'primary-dark': '#5a0000',
        'primary-light': '#b30000',
      }
    }
  },
  plugins: [
    // Ensure you have installed these plugins via npm if needed:
    // npm install -D @tailwindcss/forms @tailwindcss/typography
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}