import colors from 'tailwindcss/colors'
import plugin from 'tailwindcss/plugin'
import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'
import aspectRatio from '@tailwindcss/aspect-ratio'
import typographyStyles from '@tailwindcss/typography/src/styles'

const js = plugin(({ addVariant }) => {
  addVariant('no-js', '.no-js &')
  addVariant('js', '.js &')
})
const light = plugin(({ addVariant }) => {
  addVariant('light', '&:not(html:not(.dark) &)')
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

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    'app/**/*.{ts,tsx,mdx}',
    'posts/**/*.mdx',
    'scripts/**/*.ts',
    'etc/**/*.ts',
  ],
  safelist: [
    'token', // syntax highlighting
    'twitter-tweet', // tweets are being loaded using a library
  ],
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [typography, forms, aspectRatio, js, light, a11y],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        page: 'var(--page-padding)',
      },
      colors: {
        gray: colors.zinc,
        page: colors.white,
        'page-dark': colors.zinc[900],
        github: '#333',
        twitter: '#1da1f2',
        linkedin: '#0077b5',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            code: {
              fontWeight: theme('fontWeight.normal'),
            },
            'code:not(pre code)': {
              borderRadius: theme('borderRadius.lg'),
              padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
            },
            ':is(code, pre)[data-theme=*=" "], :is(code, pre)[data-theme*=" "] span':
              {
                color: 'var(--shiki-light)',
                // most light themes have a completely white background, we want it to be slightly darker
                backgroundColor: theme('colors.gray.100'),
              },
            'pre [data-highlighted-line]': {
              backgroundColor: theme('colors.gray.200'),
            },
            'pre [data-highlighted-line] span': {
              backgroundColor: 'transparent',
            },
          },
        },
        invert: {
          css: {
            'code:not(pre code)': {
              borderWidth: 1,
              borderColor: theme('colors.gray.800'),
            },
            pre: {
              borderWidth: 1,
              borderColor: theme('colors.gray.700'),
            },
            ':is(code, pre)[data-theme=*=" "], :is(code, pre)[data-theme*=" "] span':
              {
                color: 'var(--shiki-dark)',
                backgroundColor: 'var(--shiki-dark-bg)',
              },
            'pre [data-highlighted-line]': {
              backgroundImage: `linear-gradient(to right, ${theme('colors.gray.700')}, ${theme('colors.gray.800')})`,
            },
            'pre [data-highlighted-line] span': {
              backgroundColor: 'transparent',
            },
          },
        },
        ...Object.fromEntries(
          ['sm', 'base', 'lg', 'xl', '2xl'].map((size) => [
            size,
            {
              css: {
                pre: {
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginLeft: `-${typographyStyles[size].css[0].pre.paddingInlineStart}`,
                  marginRight: `-${typographyStyles[size].css[0].pre.paddingInlineEnd}`,
                  lineHeight: theme('lineHeight.loose'),
                },
                'pre code': {
                  padding: 0,
                  fontSize: '1em',
                },
                'pre [data-line]': {
                  paddingLeft:
                    typographyStyles[size].css[0].pre.paddingInlineStart,
                  paddingRight:
                    typographyStyles[size].css[0].pre.paddingInlineEnd,
                },
              },
            },
          ]),
        ),
      }),
    },
  },
}
