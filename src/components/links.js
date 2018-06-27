// @flow
import * as React from 'react'
import { withProps } from 'recompose'
import styled from 'react-emotion'
import { FaGithub, FaMedium, FaLinkedinSquare } from 'react-icons/lib/fa'
import { CardIconLink } from './card-icon-link'

const Container = styled.ul`
  align-self: center;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  ${props => props.theme.mqMin.sm} {
    flex-direction: row;
    justify-content: space-around;
    margin-top: 2rem;
    text-align: center;
  }
`

const Item = styled.li`
  margin: 0.5rem 0;
  ${props => props.theme.mqMin.sm} {
    margin: 0 1rem;
  }
`

export const GitHubLink = withProps({
  label: 'Open Source',
  href: 'https://github.com/silvenon',
  icon: {
    Component: FaGithub,
    size: 3.5,
  },
  size: 5,
  color: '#333',
})(CardIconLink)

export const MediumLink = withProps({
  label: 'Blog',
  href: 'https://blog.silvenon.com',
  icon: {
    Component: FaMedium,
    size: 3.0,
  },
  size: 5,
  color: '#00ab6c',
})(CardIconLink)

export const LinkedInLink = withProps({
  label: 'Background',
  href: 'https://www.linkedin.com/in/silvenon/',
  icon: {
    Component: FaLinkedinSquare,
    size: 3.5,
  },
  size: 5,
  color: '#0077b5',
})(CardIconLink)

const AllLinks = () => (
  <Container>
    <Item>
      <GitHubLink />
    </Item>
    <Item>
      <MediumLink />
    </Item>
    <Item>
      <LinkedInLink />
    </Item>
  </Container>
)

export { AllLinks }
