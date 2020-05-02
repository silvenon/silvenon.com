import { css } from 'styled-components'

export const visuallyHidden = css`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
`

export const elevated = [
  css`
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  `,
  css`
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  `,
  css`
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  `,
]

export const bleed = css`
  margin-left: calc(var(--site-padding) * -1) !important;
  margin-right: calc(var(--site-padding) * -1) !important;
  border-radius: 0 !important;

  @media ${(props) => props.theme.query.lg} {
    margin-left: 0 !important;
    margin-right: 0 !important;
    border-radius: var(--border-radius) !important;
  }
`
