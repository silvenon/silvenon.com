const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
const typography = require('@tailwindcss/typography')
const screens = require('./screens.json')

const light = plugin(({ addVariant }) => {
  addVariant('light', '&:where(:not(.dark *))')
})
const a11y = plugin(({ addVariant }) => {
  addVariant('a11y-expanded', [
    '&[aria-expanded="true"]',
    '[aria-expanded="true"] &',
  ])
  addVariant('a11y-selected', [
    '&[aria-selected="true"]',
    '[aria-selected="true"] &',
  ])
})

module.exports = {
  content: ['app/**/*.{ts,tsx,mdx,yml}'],
  safelist: ['token'],
  plugins: [typography, light, a11y],
  darkMode: 'class',
  theme: {
    screens,
    container: (theme) => ({
      center: true,
      padding: theme('spacing.4'),
    }),
    extend: {
      colors: {
        gray: colors.zinc,
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '> :first-child': {
              marginTop: 0,
            },
            '> :last-child': {
              marginBottom: 0,
            },
            a: {
              color: theme('colors.purple.700'),
            },
            'a:hover': {
              color: theme('colors.amber.600'),
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
            'a:hover code': {
              color: 'inherit',
            },
            'blockquote p:first-of-type::before': false,
            'blockquote p:last-of-type::after': false,
            pre: {
              backgroundColor: theme('colors.slate.100'),
              color: '#24292eff',
            },
            figure: {
              textAlign: 'center',
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.purple.300'),
            },
            'a:hover': {
              color: theme('colors.amber.400'),
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
            'a:hover code': {
              color: 'inherit',
            },
            pre: {
              backgroundColor: '#031417',
              color: '#f1f5f9',
            },
          },
        },
      }),
    },
  },
}
