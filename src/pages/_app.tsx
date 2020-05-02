import React from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'
import { ThemeProvider } from 'styled-components'
import { MDXProvider } from '@mdx-js/react'
import { SvgDefs } from '../components/icon'
import { mdxComponents } from '../components/body'
import GitHubCorner from '../components/github-corner'
import TrackingCode from '../components/tracking-code'
import CustomProperties from '../styles/custom-properties'
import BaseStyles from '../styles/base'
import cl from '../lib/cloudinary'
import { siteConfig } from '../lib/consts'
import theme from '../styles/theme'
import 'bootstrap/dist/css/bootstrap-reboot.min.css'
import 'minireset.css'
import 'prism-themes/themes/prism-atom-dark.css'

const [firstName, lastName] = siteConfig.name.split(' ')

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { pathname } = useRouter()
  const canonicalUrl = `${siteConfig.url}${pathname}`
  return (
    <>
      <DefaultSeo
        titleTemplate={`%s · ${siteConfig.name}`}
        description={siteConfig.biography.short}
        openGraph={{
          url: canonicalUrl,
          type: 'website',
          // eslint-disable-next-line @typescript-eslint/camelcase
          site_name: siteConfig.name,
          profile: {
            firstName,
            lastName,
          },
          images: [
            {
              url: cl.url(siteConfig.avatar.id),
              width: siteConfig.avatar.width,
              height: siteConfig.avatar.height,
              alt: 'avatar',
            },
          ],
        }}
        twitter={{
          handle: '@silvenon',
          cardType: 'summary',
        }}
      />
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="/feeds/atom.xml"
          rel="alternate"
          title="Matija's blog"
          type="application/atom+xml"
        />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </Head>
      <SvgDefs />
      <ThemeProvider theme={theme}>
        <>
          <CustomProperties />
          <BaseStyles />
          <MDXProvider components={mdxComponents}>
            <Component {...pageProps} />
          </MDXProvider>
          <GitHubCorner />
        </>
      </ThemeProvider>
      <TrackingCode />
    </>
  )
}

export default MyApp
