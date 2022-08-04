const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: 'class',
  mode: 'jit',
  important: false,
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: colors.rose,
        dark: {
          50: '#e4e4eb',
          100: '#bbbace',
          200: '#8f8ead',
          300: '#66658c',
          400: '#4b4777',
          500: '#302a62',
          600: '#2b245b',
          700: '#241c51',
          800: '#1c1445',
          900: '#130030',
        },
      },
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
