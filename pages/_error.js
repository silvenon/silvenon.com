import React from 'react'
import styled from 'react-emotion/macro'
import Page from '../components/page'
import Card from '../components/card'
import Title from '../components/title'
import Paragraph from '../components/paragraph'
import * as Link from '../components/links'

const Inner = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Back = styled('a')`
  display: block;
  margin-bottom: 1rem;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  opacity: 0.5;
  &:hover, &:focus {
    opacity: 1;
  }
`

const BlogLink = styled(Link.Blog)`
  align-self: center;
  margin-top: 1rem;
`

class Error extends React.Component {
  static getInitialProps({ res, err }) {
    // eslint-disable-next-line no-nested-ternary
    const statusCode = res
      ? res.statusCode
      : err
        ? err.statusCode
        : null
    return { statusCode }
  }

  render() {
    return (
      <Page>
        {this.props.statusCode === 404 ? (
          <Inner>
            <Back href="/">
              ← Back
            </Back>
            <Card>
              <Title>Page Not Found</Title>
              <Paragraph>
                <p>
                  This page no longer exists. It's likely that you got here by following a link to my blog
                  post which no longer has this URL. My blog is now on Medium and, while I moved some of
                  my old posts there, I didn't move the posts I no longer stand by.
                </p>
                <p>
                  Try to find that post in my Medium publication.
                </p>
              </Paragraph>
            </Card>
            <BlogLink />
          </Inner>
        ) : (
          <Card>
            <Title>Error</Title>
            <Paragraph>
              <p>
                An unknown error occurred. Maybe there's a temporary problem with the server.
              </p>
            </Paragraph>
          </Card>
        )}
      </Page>
    )
  }
}

export default Error
