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

export default {
  screenWidth,
  mqMin: mapValues(screenWidth, width => `@media (min-width: ${width}px)`),
  mqMax: mapValues(screenWidth, width => `@media (max-width: ${width - 1}px)`),
  fontFamily: {
    base:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  colors: {
    blue: {
      lighter: '#007FAA',
      darker: '#34495E',
    },
  },
  sitePadding: 1,
  // natural box shadow
  // https://codepen.io/Aryck/pen/DExLs
  boxShadow: css`
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.16), 0 3px 3px 0 rgba(0, 0, 0, 0.23);
  `,
  fontSmoothing: css`
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  `,
}
