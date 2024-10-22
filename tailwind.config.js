/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');  // Import colors from Tailwind CSS

module.exports = {
  mode: 'jit',
  content: [
    './views/**/*.ejs',   // Correct path to your EJS templates
    './src/**/*.html',    // HTML files, if any
    './src/**/*.js',      // JavaScript files with Tailwind classes
  ],
  theme: {
    extend: {  // Use `extend` to avoid overwriting the default colors
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        gray: colors.slate,
        green: colors.emerald,
        purple: colors.violet,
        yellow: colors.amber,
        pink: colors.fuchsia,
        customAmber: '#D97706'
      },
    },
  },
  plugins: [],
}
