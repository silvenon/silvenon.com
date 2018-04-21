import React from 'react'
import styled from 'react-emotion'
import { GoHome } from '../components/go-home'
import { Card } from '../components/card'
import { Title } from '../components/title'
import { Paragraph } from '../components/paragraph'
import { MediumLink } from '../components/links'

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const BlogLink = styled(MediumLink)`
  align-self: center;
  margin-top: 1rem;
`

const NotFoundPage = () => (
  <Inner>
    <GoHome />
    <Card>
      <Title>Page Not Found</Title>
      <Paragraph>
        <p>
          This page no longer exists. It's likely that you got here by following
          a link to my blog post which no longer has this URL. My blog is now on
          Medium and, while I moved some of my old posts there, I didn't move
          the posts I no longer stand by.
        </p>
        <p>Try to find that post in my Medium publication.</p>
      </Paragraph>
    </Card>
    <BlogLink />
  </Inner>
)

export default NotFoundPage
