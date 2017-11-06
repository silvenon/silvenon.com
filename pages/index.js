import React from 'react'
import { injectGlobal } from 'emotion/macro'
import { hydrate } from 'react-emotion/macro'
import Container from '../components/container'
import Avatar from '../components/avatar'
import Name from '../components/name'
import Biography from '../components/biography'
import Branches from '../components/branches'
import { SYSTEM_FONT_FAMILY, BREAKPOINT, BIOGRAPHY } from '../constants'

// Adds server generated styles to emotion cache.
// '__NEXT_DATA__.ids' is set in '_document.js'
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-undef, no-underscore-dangle
  hydrate(window.__NEXT_DATA__.ids)
}

const Home = () => {
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
      <Avatar
        alt="photo of Matija Marohnić"
        src="//res.cloudinary.com/silvenon/image/upload/c_scale,w_300/v1510308691/avatar.jpg"
      />
      <Name>Matija Marohnić</Name>
      <Biography>
        {BIOGRAPHY.split('\n\n').map((paragraph, i) =>
          // eslint-disable-next-line react/no-array-index-key
          <p key={i}>
            {paragraph}
          </p>)}
      </Biography>
      <Branches />
    </Container>
  )
}

export default Home
