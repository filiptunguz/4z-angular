/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    screens: {
      // => @media (min-width: [value]px) { ... }
      'sm': '360px',
      'desk': '600px',
      'desk-lg': '990px',
      'xl': '1100px'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#fff',
      'black': '#000',
      // 'gray': colors.gray,
      'green': {
        '50': '#d5e4c8',
        '100': '#cbddba',
        '200': '#b6d09e',
        '300': '#a1c383',
        '400': '#8db568',
        '500': '#78a450',
        '600': '#5c7e3e',
        '700': '#41592b',
        '800': '#253319',
        '900': '#0a0d06'
      },
      'orange': {
        '50': '#fde1da',
        '100': '#fcd1c7',
        '200': '#f9b2a0',
        '300': '#f7937a',
        '400': '#f47353',
        '500': '#f2542d',
        '600': '#d9360d',
        '700': '#a5290a',
        '800': '#701c07',
        '900': '#3b0f04'
      },
      'yellow': {
        '50': '#fffcf6',
        '100': '#fef8ec',
        '200': '#fdeed0',
        '300': '#fce4b3',
        '400': '#facf7a',
        '500': '#f8bb41',
        '600': '#dfa83b',
        '700': '#ba8c31',
        '800': '#957027',
        '900': '#7a5c20'
      },
      'smoke': {
        '50': 'rgba(0,0,0,0.05)',
        '100': 'rgba(0,0,0,0.1)',
        '200': 'rgba(0,0,0,0.2)',
        '300': 'rgba(0,0,0,0.3)',
        '400': 'rgba(0,0,0,0.4)',
        '500': 'rgba(0,0,0,0.5)',
        '600': 'rgba(0,0,0,0.6)',
        '700': 'rgba(0,0,0,0.7)',
        '800': 'rgba(0,0,0,0.8)',
        '900': 'rgba(0,0,0,0.9)'
      },
      // accent: colors.green['500'],
      // primary: colors.orange['500'],
      'error': '#f44336',
      'link': '#007ad9',
      'viber': '#7F4FAF'
    },
    extend: {
      margin: {
        '1px': '1px',
      },
      padding: {
        '1px': '1px',
      },
      zIndex: {
        '1': '1',
      },
      maxWidth: {
        'container': '1100px'
      },
      borderColor: {
        DEFAULT: 'currentColor'
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
