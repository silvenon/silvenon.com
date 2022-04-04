const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
const typography = require('@tailwindcss/typography')
const forms = require('@tailwindcss/forms')
const typographyStyles = require('@tailwindcss/typography/src/styles')
const screens = require('./app/screens.json')

const js = plugin(({ addVariant }) => {
  addVariant('no-js', '.no-js &')
  addVariant('js', '.js &')
})
const light = plugin(({ addVariant }) => {
  addVariant('light', ':not(.dark) &')
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
  content: ['app/**/*.{ts,tsx,mdx}'],
  safelist: ['token'],
  plugins: [typography, forms, js, light, a11y],
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
        page: colors.white,
        'page-dark': colors.zinc[900],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            ...typographyStyles.zinc.css,
            '--tw-prose-links': theme('colors.purple.700'),
            '--tw-prose-links-hover': theme('colors.amber.600'),
            '--tw-prose-inline-code-bg': theme('colors.zinc.100'),
            '--tw-prose-inline-code-border': `1px solid ${theme(
              'colors.zinc.200',
            )}`,
            '--tw-prose-inline-code-shadow': 'none',
            '--tw-prose-pre-bg': theme('colors.zinc.100'),
            '--tw-prose-pre-border': 0,
            '--tw-prose-pre-code': '#24292eff',
            '--tw-prose-pre-shadow': 'none',

            'a:hover': {
              color: 'var(--tw-prose-links-hover)',
            },
            code: {
              fontWeight: false,
              color: false,
            },
            'code::before': false,
            'code::after': false,
            'code:not(pre code)': {
              display: 'inline',
              padding: `${theme('padding.1')} ${theme('padding.2')}`,
              backgroundColor: 'var(--tw-prose-inline-code-bg)',
              color: 'var(--tw-prose-body)',
              borderRadius: theme('borderRadius.lg'),
              border: 'var(--tw-prose-inline-code-border)',
              boxShadow: 'var(--tw-prose-inline-code-shadow)',
              '&[data-theme="dark"]': {
                display: 'none',
              },
            },
            'a code': {
              color: 'inherit',
            },
            pre: {
              border: 'var(--tw-prose-pre-border)',
              boxShadow: 'var(--tw-prose-pre-shadow)',
              paddingLeft: false,
              paddingRight: false,
              lineHeight: 2,
            },
            'pre code': {
              // needed to prevent highlighted lines from being cut off when scrolling horizontally
              display: 'grid',
            },
            'pre code .line': {
              paddingLeft: typographyStyles.base.css[0].pre.paddingLeft,
              paddingRight: typographyStyles.base.css[0].pre.paddingRight,
            },
            'blockquote p:first-of-type::before': false,
            'blockquote p:last-of-type::after': false,
            figure: {
              textAlign: 'center',
            },
          },
        },
        sm: {
          css: {
            pre: {
              paddingLeft: false,
              paddingRight: false,
            },
            'pre code .line': {
              paddingLeft: typographyStyles.sm.css[0].pre.paddingLeft,
              paddingRight: typographyStyles.sm.css[0].pre.paddingRight,
            },
          },
        },
        base: {
          css: {
            pre: {
              paddingLeft: false,
              paddingRight: false,
            },
            'pre code .line': {
              paddingLeft: typographyStyles.base.css[0].pre.paddingLeft,
              paddingRight: typographyStyles.base.css[0].pre.paddingRight,
            },
          },
        },
        lg: {
          css: {
            pre: {
              paddingLeft: false,
              paddingRight: false,
            },
            'pre code .line': {
              paddingLeft: typographyStyles.lg.css[0].pre.paddingLeft,
              paddingRight: typographyStyles.lg.css[0].pre.paddingRight,
            },
          },
        },
        xl: {
          css: {
            pre: {
              paddingLeft: false,
              paddingRight: false,
            },
            'pre code .line': {
              paddingLeft: typographyStyles.xl.css[0].pre.paddingLeft,
              paddingRight: typographyStyles.xl.css[0].pre.paddingRight,
            },
          },
        },
        '2xl': {
          css: {
            pre: {
              paddingLeft: false,
              paddingRight: false,
            },
            'pre code .line': {
              paddingLeft: typographyStyles['2xl'].css[0].pre.paddingLeft,
              paddingRight: typographyStyles['2xl'].css[0].pre.paddingRight,
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-links': theme('colors.purple.300'),
            '--tw-prose-links-hover': theme('colors.amber.400'),
            '--tw-prose-inline-code-bg': '#031417',
            '--tw-prose-inline-code-border': `1px solid ${theme(
              'colors.zinc.800',
            )}`,
            '--tw-prose-inline-code-shadow': `inset 0 0 0.5rem ${theme(
              'colors.black',
            )}`,
            '--tw-prose-pre-bg': '#031417',
            '--tw-prose-pre-border': `1px solid ${theme('colors.zinc.800')}`,
            '--tw-prose-pre-code': '#f1f5f9',
            '--tw-prose-pre-shadow': `inset 0 0 1rem ${theme('colors.black')}`,

            'code:not(pre code)': {
              '&[data-theme="light"]': {
                display: 'none',
              },
              '&[data-theme="dark"]': {
                display: 'inline',
              },
            },
          },
        },
      }),
    },
  },
}
