// const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'bg-confetti': "url('../src/assets/svg/confetti.svg')"
      }
    },
  },
  variants: {
    extend: {},
    scrollbar: ['dark', 'rounded']
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}
