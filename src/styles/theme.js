import { css } from 'react-emotion'

export const screenWidth = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1440,
}
export const mqMin = Object.keys(screenWidth).reduce(
  (accumulator, label) => ({
    ...accumulator,
    [label]: `@media (min-width: ${screenWidth[label]}px)`,
  }),
  {},
)
export const mqMax = Object.keys(screenWidth).reduce(
  (accumulator, label) => ({
    ...accumulator,
    [label]: `@media (max-width: ${screenWidth[label] - 1}px)`,
  }),
  {},
)

export const fontFamily = {
  base:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
}

export const colors = {
  blue: {
    lighter: '#007FAA',
    darker: '#34495E',
  },
}

export const sitePadding = 1

// natural box shadow
// https://codepen.io/Aryck/pen/DExLs
export const boxShadow = css`
  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.16), 0 3px 3px 0 rgba(0, 0, 0, 0.23);
`

export const fontSmoothing = css`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`
