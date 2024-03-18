import { lightTheme, darkTheme } from './etc/code-theme'

import colors from 'tailwindcss/colors'
import plugin from 'tailwindcss/plugin'
import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'
import aspectRatio from '@tailwindcss/aspect-ratio'
// @ts-expect-error missing type declaration
import typographyStyles from '@tailwindcss/typography/src/styles'
import screens from './app/screens.json'

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
    screens,
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
        'code-foreground': lightTheme.colors!['editor.foreground'],
        // most light themes have a completely white background, we want it to be slightly gray
        // 'code-background': codeTheme.light.colors['editor.background'],
        // 'code-highlight':
        //   codeTheme.light.colors['editor.lineHighlightBackground'],
        'code-background': colors.zinc[100],
        'code-highlight': colors.zinc[200],
        'code-foreground-dark': darkTheme.colors!['editor.foreground'],
        'code-background-dark': darkTheme.colors!['editor.background'],
        'code-highlight-dark':
          darkTheme.colors!['editor.lineHighlightBackground'],
      },
      typography: {
        DEFAULT: {
          css: {
            'pre code': {
              // needed to prevent highlighted lines from being cut off when scrolling horizontally
              display: 'grid',
              // the .prose-code variant overrides this, possibly a bug with @tailwindcss/typography
              backgroundColor: 'transparent !important',
              borderWidth: '0 !important',
              borderRadius: '0 !important',
              padding: '0 !important',
              fontWeight: 'inherit !important',
              color: 'inherit !important',
              fontSize: 'inherit !important',
              fontFamily: 'inherit !important',
              lineHeight: 'inherit !important',
            },
          },
        },
        ...Object.fromEntries(
          ['sm', 'base', 'lg', 'xl', '2xl'].map((size) => [
            size,
            {
              css: {
                pre: {
                  paddingLeft: false,
                  paddingRight: false,
                  marginLeft: `-${typographyStyles[size].css[0].pre.paddingLeft}`,
                  marginRight: `-${typographyStyles[size].css[0].pre.paddingRight}`,
                },
                'pre code .line': {
                  paddingLeft: typographyStyles[size].css[0].pre.paddingLeft,
                  paddingRight: typographyStyles[size].css[0].pre.paddingRight,
                },
              },
            },
          ]),
        ),
      },
    },
  },
}
