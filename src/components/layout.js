// @flow
import * as React from 'react'
import { graphql, StaticQuery, withPrefix } from 'gatsby'
import Helmet from 'react-helmet'
import { ThemeProvider } from 'emotion-theming'
import { MDXProvider } from '@mdx-js/tag'
import { mapKeys } from 'lodash'
import { camelCase } from 'change-case'
import { components } from './body'
import TrackingCode from './tracking-code'
import cl from '../utils/cloudinary'
import * as LOCALE from '../constants/locales'
import theme from '../styles/theme'
import '../styles/fonts'
import '../styles/base'

type Props = {
  title: string,
  description: string,
  pathname: string,
  lang: string,
  image: ?{
    id: string,
    aspectRatio: number,
    alt: string,
  },
  article: ?{
    publishedTime: string,
    modifiedTime: ?string,
    author: string,
    tags: string[],
  },
  children: React.Node,
}

const Layout = ({
  title,
  description,
  pathname,
  lang,
  image,
  article,
  children,
}: Props) => (
  <StaticQuery
    query={graphql`
      query LayoutQuery {
        site {
          siteMetadata {
            siteUrl
            name
          }
        }
      }
    `}
    render={({
      site: {
        siteMetadata: { siteUrl, name },
      },
    }: {
      site: {
        siteMetadata: {
          siteUrl: string,
          name: string,
        },
      },
    }) => {
      const metaImage =
        image != null
          ? {
              url: cl.url(image.id, { width: 280, crop: 'scale' }),
              alt: image.alt,
              width: 280,
              height: 280 * image.aspectRatio,
            }
          : null
      return (
        <ThemeProvider theme={theme}>
          <>
            <Helmet>
              <html lang={lang.toLowerCase()} />
              <title>{title === name ? title : `${title} · ${name}`}</title>
              <meta name="description" content={description} />
              <link rel="icon" href={withPrefix('/favicon.ico')} />

              {/* Schema.org markup for Google+ */}
              <meta itemProp="name" content={title} />
              <meta itemProp="description" content={description} />
              {metaImage != null ? (
                <meta itemProp="image" content={metaImage.url} />
              ) : null}

              {/* Twitter Card data */}
              <meta name="twitter:card" content="summary" />
              <meta name="twitter:title" content={title} />
              <meta name="twitter:description" content={description} />
              <meta name="twitter:creator" content="@silvenon" />
              {metaImage != null ? (
                <>
                  <meta name="twitter:image" content={metaImage.url} />
                  <meta name="twitter:image:alt" content={metaImage.alt} />
                </>
              ) : null}

              {/* Open Graph data */}
              <meta property="og:title" content={title} />
              <meta
                property="og:url"
                content={pathname === '/' ? siteUrl : `${siteUrl}${pathname}`}
              />
              {article != null ? (
                <>
                  <meta property="og:type" content="article" />
                  <meta
                    property="article:published_time"
                    content={article.publishedTime}
                  />
                  {article.modifiedTime != null ? (
                    <meta
                      property="article:modified_time"
                      content={article.modifiedTime}
                    />
                  ) : null}
                  <meta property="article:author" content={article.author} />
                  {article.tags.map(tag => (
                    <meta
                      key={`article:tag ${tag}`}
                      property="article:tag"
                      content={tag}
                    />
                  ))}
                </>
              ) : (
                <>
                  <meta property="og:type" content="website" />
                </>
              )}
              {metaImage != null ? (
                <>
                  <meta property="og:image" content={metaImage.url} />
                  <meta property="og:image:width" content={metaImage.width} />
                  <meta property="og:image:height" content={metaImage.height} />
                  <meta property="og:image:alt" content={metaImage.alt} />
                </>
              ) : null}
              <meta property="og:description" content={description} />
              <meta property="og:locale" content={LOCALE[lang]} />
              <meta property="og:site_name" content={name} />
            </Helmet>
            <MDXProvider
              components={mapKeys(components, (value, key) => camelCase(key))}
            >
              <>{children}</>
            </MDXProvider>
            <TrackingCode />
          </>
        </ThemeProvider>
      )
    }}
  />
)

Layout.defaultProps = {
  lang: 'EN',
  image: null,
  article: null,
}

export default Layout
