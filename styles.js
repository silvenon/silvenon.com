import { css } from 'emotion/macro'

export const center = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

// natural box shadow
// https://codepen.io/Aryck/pen/DExLs
export const boxShadow = css`
  box-shadow:
    0 3px 3px 0 rgba(0, 0, 0, 0.16),
    0 3px 3px 0 rgba(0, 0, 0, 0.23);
`
