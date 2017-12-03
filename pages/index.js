import React from 'react'
import { hydrate } from 'react-emotion/macro'
import { Page } from '../components/page'
import { Card } from '../components/card'
import { Avatar } from '../components/avatar'
import { Title } from '../components/title'
import { Paragraph } from '../components/paragraph'
import { AllLinks } from '../components/links'
import { BIOGRAPHY } from '../constants'

// Adds server generated styles to emotion cache.
// '__NEXT_DATA__.ids' is set in '_document.js'
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-undef, no-underscore-dangle
  hydrate(window.__NEXT_DATA__.ids)
}

const Home = () =>
  <Page>
    <Avatar
      alt="photo of Matija Marohnić"
      src="//res.cloudinary.com/silvenon/image/upload/c_scale,w_300/v1510308691/avatar.jpg"
    />
    <Card>
      <Title>Matija Marohnić</Title>
      <Paragraph>
        {BIOGRAPHY.split('\n\n').map((paragraph, i) =>
            // eslint-disable-next-line react/no-array-index-key
          <p key={i}>
            {paragraph}
          </p>)}
      </Paragraph>
    </Card>
    <AllLinks />
  </Page>

export default Home
