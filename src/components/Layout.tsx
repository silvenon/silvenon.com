import React from 'react'
import { Helmet } from 'react-helmet'
import Header from './Header'
import Analytics from './Analytics'
import cloudinary from '../cloudinary'
import { SITE_URL, author } from '../consts'

interface Props {
  uri?: string
  title: string
  description: string
  canonical?: string
  children: React.ReactNode
}

export default function Layout({
  uri,
  title,
  description,
  canonical,
  children,
}: Props) {
  const url = `${SITE_URL}${uri}/`

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {canonical && <link rel="canonical" href={canonical} />}
        {/* Open Graph */}
        <meta property="og:site_name" content={author.name} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical || url} />
        {/* https://developers.facebook.com/docs/sharing/best-practices/#images */}
        <meta
          property="og:image"
          content={cloudinary('in-reactor-1.jpg', {
            version: 3,
            width: 1080,
            aspectRatio: '1:1',
            crop: 'fill',
            gravity: 'face',
          })}
        />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1080" />
        <meta property="og:image:height" content="1080" />
        {/* Twitter Card */}
        {/* https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@silvenon" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta
          name="twitter:image"
          content={cloudinary('in-reactor-1.jpg', {
            version: 3,
            transformations: [
              {
                width: 3024,
                aspectRatio: '1:1',
                crop: 'fill',
                gravity: 'face',
              },
            ],
          })}
        />
      </Helmet>
      <Header isHome={uri === '/'} />
      {children}
      {import.meta.env.PROD && <Analytics />}
    </>
  )
}
