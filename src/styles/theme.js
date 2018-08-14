// @flow
import { css } from 'react-emotion'
import { mapValues } from 'lodash'

const screenWidth = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1440,
}

const fontFamily = {
  system: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
}

type ScreenWidth = $Values<typeof screenWidth>
type MediaQueries = {
  [$Keys<typeof screenWidth>]: string,
}

const theme = {
  dprs: [1, 2],
  screenWidth,
  mqMin: (mapValues(
    screenWidth,
    (width: ScreenWidth) => `@media (min-width: ${width}px)`,
  ): MediaQueries),
  mqMax: (mapValues(
    screenWidth,
    (width: ScreenWidth) => `@media (max-width: ${width - 1}px)`,
  ): MediaQueries),
  sitePadding: '1rem',
  containerMaxWidth: screenWidth.lg,
  borderRadius: '0.5rem',
  fontFamily: {
    base: `Lora, Georgia, Times, "Times New Roman", serif`,
    alt: fontFamily.system,
  },
  // http://www.colourlovers.com/palette/4581821/Haunted
  colors: {
    beigeLight: '#FAEAD3',
    beige: '#FEE2CC',
    red: '#EE7266',
    blue: '#007faa',
    blueDark: '#33495e',
    grey: '#999',
  },
  // natural box shadow
  // https://codepen.io/Aryck/pen/DExLs
  boxShadow: css`
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.16), 0 3px 3px 0 rgba(0, 0, 0, 0.23);
  `,
  fontSmoothing: css`
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  `,
  logoSize: (
    strings: string[],
    ...fns: Array<({ size: string }) => string>
  ) => (props: { theme: typeof theme }) => css`
    ${strings.reduce(
      (acc, string, i) =>
        `${acc}${string}${fns[i] != null ? fns[i]({ size: '2rem' }) : ''}`,
      '',
    )};
    ${props.theme.mqMin.sm} {
      ${strings.reduce(
        (acc, string, i) =>
          `${acc}${string}${fns[i] != null ? fns[i]({ size: '3rem' }) : ''}`,
        '',
      )};
    }
  `,
}

export default theme
