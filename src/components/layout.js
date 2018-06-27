import React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import Helmet from 'react-helmet'
import { ThemeProvider } from 'emotion-theming'
import { injectGlobal } from 'react-emotion'
import { Container } from './container'
import { GitHubCorner } from './github-corner'
import { TrackingCode } from './tracking-code'
import theme from '../styles/theme'
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

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
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
    `}
    render={({
      site: {
        siteMetadata: { title, biography },
      },
    }) => (
      <ThemeProvider theme={theme}>
        <>
          <Helmet titleTemplate={`%s · ${title}`} defaultTitle={title}>
            <html lang="en" />
            <meta charSet="utf-8" />
            <meta name="description" content={biography.short} />
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
            <link rel="icon" href={favicon} />
          </Helmet>
          <Container>{children}</Container>
          <GitHubCorner />
          <TrackingCode />
        </>
      </ThemeProvider>
    )}
  />
)

export { Layout }
