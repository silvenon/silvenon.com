import React from 'react'
import styled from 'react-emotion/macro'
import { Page } from '../components/page'
import { GoHome } from '../components/go-home'
import { Card } from '../components/card'
import { Title } from '../components/title'
import { Paragraph } from '../components/paragraph'
import { COLOR } from '../constants'

const List = styled('ul')`
  list-style-type: disc;
  padding-left: 2rem;
`

const Item = styled('li')`
  a {
    text-decoration: none;
    color: ${COLOR.BLUE_LIGHTER};
    &:hover, &:focus {
      text-decoration: underline;
      color: ${COLOR.BLUE_DARKER}
    }
  }
`

const Uses = () =>
  <Page>
    <GoHome />
    <Card>
      <Title>Technologies used</Title>
      <Paragraph>
        <p>
          You came to this hidden page because you were curious which technologies I used to create this site.
          Well, it's pretty overengineered, the main ones are:
        </p>

        <List>
          <Item><a href="https://github.com/zeit/next.js/">Next.js</a></Item>
          <Item><a href="https://zeit.co/now">Now</a></Item>
          <Item><a href="https://github.com/emotion-js/emotion">emotion</a></Item>
          <Item><a href="https://github.com/acdlite/recompose">Recompose</a></Item>
          <Item><a href="https://eslint.org/">ESLint</a></Item>
        </List>
      </Paragraph>
    </Card>
  </Page>

export default Uses
