// @flow
import { injectGlobal } from 'react-emotion'
import theme from './theme'

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  html {
    font-size: 18px;
    ${theme.mqMin.sm} {
      font-size: 20px;
    }
  }

  body {
    font-family: ${theme.fontFamily.base};
    line-height: 1.75;
  }
`
