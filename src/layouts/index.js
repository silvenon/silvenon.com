import React from 'react'
import Helmet from 'react-helmet'
import { ThemeProvider } from 'emotion-theming'
import { injectGlobal } from 'react-emotion'
import { Container } from '../components/container'
import { GitHubCorner } from '../components/github-corner'
import { TrackingCode } from '../components/tracking-code'
import * as theme from '../styles/theme'
import favicon from '../images/favicon.ico'
import '../styles/reboot.css'
import '../styles/minireset.css'

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  html {
    font-family: ${theme.fontFamily.base};
    font-size: 14px;
    ${theme.mqMin.sm} {
      font-size: 16px;
    }
  }
`

const Layout = ({
  children,
  data: {
    site: {
      siteMetadata: { title, biography },
    },
  },
}) => (
  <ThemeProvider theme={theme}>
    <React.Fragment>
      <Helmet titleTemplate={`%s · ${title}`} defaultTitle={title}>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="description" content={biography.short} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href={favicon} />
      </Helmet>
      <Container>{children()}</Container>
      <GitHubCorner />
      <TrackingCode />
    </React.Fragment>
  </ThemeProvider>
)

export default Layout

export const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
        biography {
          short
        }
      }
    }
  }
`
