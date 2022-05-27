const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
const typography = require('@tailwindcss/typography')
const forms = require('@tailwindcss/forms')
const aspectRatio = require('@tailwindcss/aspect-ratio')
const typographyStyles = require('@tailwindcss/typography/src/styles')
const screens = require('./app/screens.json')
const codeTheme = require('./scripts/utils/code-theme')

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

module.exports = {
  content: ['app/**/*.{ts,tsx,mdx}', 'scripts/**/*.ts'],
  safelist: ['token'],
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [typography, forms, aspectRatio, js, light, a11y],
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
        'code-foreground': codeTheme.light.colors['editor.foreground'],
        // most light themes have a completely white background, we want it to be slightly gray
        // 'code-background': codeTheme.light.colors['editor.background'],
        // 'code-highlight':
        //   codeTheme.light.colors['editor.lineHighlightBackground'],
        'code-background': colors.zinc[100],
        'code-highlight': colors.zinc[200],
        'code-foreground-dark': codeTheme.dark.colors['editor.foreground'],
        'code-background-dark': codeTheme.dark.colors['editor.background'],
        'code-highlight-dark':
          codeTheme.dark.colors['editor.lineHighlightBackground'],
      },
      typography: (theme) => ({
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
      }),
    },
  },
}
