/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors:{
      'secondary': '#74787b',
      'main-bg': '#062424',
      'main': '#414345'
    },
    variants: {
      extend: {
        textColor: ['responsive', 'dark', 'group-hover', 'focus-within', 'hover', 'focus'],
        backgroundColor: ['responsive', 'dark', 'group-hover', 'focus-within', 'hover', 'focus'],
      },
    },
    extend: {
      boxShadow: {
        'custom': '0 4px 30px 0px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}

