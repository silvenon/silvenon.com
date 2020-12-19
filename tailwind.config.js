const colors = require('tailwindcss/colors')
const convert = require('@csstools/convert-colors')
const { destDir, socialLinks } = require('./site.config')

const socialColors = {}
for (const { id, color } of socialLinks) {
  socialColors[id] = color
}

const desatPurple = {}
for (const [shade, hex] of Object.entries(colors.purple)) {
  const [hue, saturation, lightness] = convert.hex2hsl(hex)
  desatPurple[shade] = convert.hsl2hex(hue, saturation * 0.5, lightness)
}

module.exports = {
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'media',
  theme: {
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      white: colors.white,
      black: colors.black,
      gray: colors.gray,
      yellow: colors.amber,
      purple: colors.purple,
      desatPurple, // useful for dark mode
      ...socialColors,
    },
    fill: (theme) => ({
      current: 'currentColor',
      light: theme('colors.gray.300'),
      github: theme('colors.github'),
    }),
    extend: {
      backgroundImage: () => ({
        'circuit-board-light': 'url("/images/circuit-board-light.svg")',
        'circuit-board-dark': 'url("/images/circuit-board-dark.svg")',
      }),
      typography: (theme) => ({
        DEFAULT: {
          css: {
            boxSizing: 'content-box',
            a: {
              color: theme('colors.purple.700'),
              '&:hover': {
                color: theme('colors.yellow.600'),
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
            pre: {
              backgroundColor: false,
            },
            'figure img': {
              marginTop: 0,
              marginBottom: 0,
            },
            '.ar img': {
              marginTop: 0,
              marginBottom: 0,
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.purple.300'),
              '&:hover': {
                color: theme('colors.yellow.400'),
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
              fontWeight: theme('fontWeight.medium'),
            },
            h2: {
              color: theme('colors.gray.100'),
              fontWeight: theme('fontWeight.medium'),
            },
            h3: {
              color: theme('colors.gray.200'),
              fontWeight: theme('fontWeight.normal'),
            },
            h4: {
              color: theme('colors.gray.300'),
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
  variants: {
    extend: {
      backgroundImage: ['dark'],
      borderWidth: ['dark'],
      fill: ['dark'],
      fontWeight: ['dark'],
      padding: ['focus'],
      ringWidth: ['dark'],
      typography: ['dark'],
      width: ['focus-within'],
    },
  },
  purge: [`${destDir}/**/*.html`, 'scripts/**/*', 'tasks/*'],
}
