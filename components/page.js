import React from 'react'
import { injectGlobal } from 'emotion/macro'
import Container from './container'
import { SYSTEM_FONT_FAMILY, BREAKPOINT } from '../constants'

const Page = ({ children }) => {
  // eslint-disable-next-line no-unused-expressions
  injectGlobal`
    html {
      font-family: ${SYSTEM_FONT_FAMILY};
      font-size: 14px;
      @media (min-width: ${BREAKPOINT}) {
        font-size: 16px;
      }
    }
  `

  return (
    <Container>
      {children}
    </Container>
  )
}

export default Page
