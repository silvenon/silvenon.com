const colors = require('tailwindcss/colors')
const typography = require('@tailwindcss/typography')
const { hex2hsl, hsl2hex } = require('@csstools/convert-colors')
const screens = require('./screens.json')

const desatPurple = {}
for (const [shade, hex] of Object.entries(colors.purple)) {
  const [hue, saturation, lightness] = hex2hsl(hex)
  desatPurple[shade] = hsl2hex(hue, saturation * 0.5, lightness)
}

module.exports = {
  mode: 'jit',
  purge: ['src/**/*.{ts,tsx,mdx,yml}', 'safelist.txt'],
  plugins: [typography],
  darkMode: 'class',
  theme: {
    screens,
    extend: {
      colors: {
        ...colors,
        desatPurple, // useful for dark mode
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            boxSizing: 'content-box',
            a: {
              color: theme('colors.purple.700'),
              '&:hover': {
                color: theme('colors.amber.600'),
              },
            },
            'code::before': false,
            'code::after': false,
            code: {
              fontWeight: false,
              color: false,
            },
            'a code': {
              color: false,
            },
            blockquote: {
              color: theme('colors.desatPurple.600'),
              fontWeight: 'normal',
              borderLeftColor: theme('colors.desatPurple.200'),
            },
            'blockquote p:first-of-type::before': false,
            'blockquote p:last-of-type::after': false,
            pre: {
              backgroundColor: false,
            },
            'figure img': {
              marginTop: 0,
              marginBottom: 0,
            },
            figure: {
              textAlign: 'center',
            },
            '.ar img': {
              marginTop: 0,
              marginBottom: 0,
            },
            '.twitter-tweet': {
              marginLeft: 'auto',
              marginRight: 'auto',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.purple.300'),
              '&:hover': {
                color: theme('colors.amber.400'),
              },
            },
            strong: {
              color: theme('colors.gray.100'),
            },
            'ol > li::before': {
              color: theme('colors.gray.400'),
            },
            hr: {
              borderColor: theme('colors.gray.500'),
            },
            h1: {
              color: theme('colors.white'),
              fontWeight: theme('fontWeight.bold'),
            },
            h2: {
              color: theme('colors.gray.100'),
              fontWeight: theme('fontWeight.semibold'),
            },
            h3: {
              color: theme('colors.gray.200'),
              fontWeight: theme('fontWeight.medium'),
            },
            h4: {
              color: theme('colors.gray.300'),
              fontWeight: theme('fontWeight.normal'),
            },
            h5: {
              color: theme('colors.gray.300'),
            },
            h6: {
              color: theme('colors.gray.300'),
            },
            blockquote: {
              color: theme('colors.gray.400'),
              borderLeftColor: theme('colors.gray.600'),
            },
            img: {
              filter: 'brightness(.8) contrast(1.2)',
            },
          },
        },
      }),
    },
  },
}
