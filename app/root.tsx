import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  ScrollRestoration,
  useLoaderData,
  useCatch,
} from '@remix-run/react'
import { redirect, json } from '@remix-run/node'
import type {
  LoaderFunction,
  MetaFunction,
  LinksFunction,
} from '@remix-run/node'
import { MetronomeLinks } from '@metronome-sh/react'
import clsx from 'clsx'
import Prose from './components/Prose'
import Analytics from './components/Analytics'
import cloudinary from './utils/cloudinary'
import { getCanonicalUrl } from './utils/http'
import { author } from './consts'
import styles from './tailwind.css'
import Header from './components/Header'
import NotFound from './components/NotFound'
import { removeTrailingSlash } from './utils/http'

interface LoaderData {
  appName?: string
  canonicalUrl: string
}

export const loader: LoaderFunction = ({ request }) => {
  if (request.url !== removeTrailingSlash(request.url)) {
    throw redirect(removeTrailingSlash(request.url), { status: 308 })
  }
  const data: LoaderData = {
    appName: process.env.FLY_APP_NAME,
    canonicalUrl: getCanonicalUrl(request),
  }
  return json(data, 200)
}

export const meta: MetaFunction = ({ data }) => {
  return {
    ...(data?.appName === 'silvenon-staging' ? { robots: 'noindex' } : null),
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    // Open Graph
    'og:site_name': author.name,
    ...(data?.canonicalUrl ? { 'og:url': data.canonicalUrl } : null),
    // https://developers.facebook.com/docs/sharing/best-practices/#images
    'og:image:url': cloudinary('in-reactor-1.jpg', {
      version: 3,
      width: 1080,
      aspectRatio: '1:1',
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
    }),
    'og:image:type': 'image/jpeg',
    'og:image:width': '1080',
    'og:image:height': '1080',
    'twitter:widgets:theme': 'light',
    // Twitter Card
    // https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary
    'twitter:card': 'summary',
    'twitter:site': '@silvenon',
    'twitter:image': cloudinary('in-reactor-1.jpg', {
      version: 3,
      width: 3024,
      aspectRatio: '1:1',
      crop: 'fill',
      gravity: 'face',
      format: 'webp',
      quality: 'auto',
    }),
  }
}

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/manifest.webmanifest' },
    { rel: 'me', href: 'https://twitter.com/silvenon' },
  ]
}

function Document({
  title,
  className,
  children,
}: {
  title?: string
  className?: string
  children: React.ReactNode
}) {
  const data = useLoaderData<LoaderData>()
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        {title ? (
          <>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta property="twitter:title" content={title} />
          </>
        ) : null}
        {data?.canonicalUrl ? (
          <link rel="canonical" href={data.canonicalUrl} />
        ) : null}
        <Links />
        <MetronomeLinks />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.classList.replace('no-js', 'js')
            `,
          }}
        />
        {/* https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const isDarkMode = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
              document.documentElement.classList.toggle('dark', isDarkMode)
              document.querySelector('meta[name="twitter:widgets:theme"]').setAttribute('content', isDarkMode ? 'dark' : 'light')
            `,
          }}
        />
      </head>
      <body
        className={clsx(
          'h-full bg-page px-[var(--content-padding)] text-black selection:bg-amber-300 selection:text-black dark:bg-page-dark dark:text-white',
          className,
        )}
      >
        <Header />
        {children}
        <ScrollRestoration />
        <LiveReload />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  return (
    <Document title={caught.status === 404 ? 'Page Not Found' : undefined}>
      <Prose as="main" className="py-4 text-center">
        {caught.status === 404 ? (
          <NotFound title="Page Not Found">Nothing found at this URL.</NotFound>
        ) : (
          <h1>
            <span className="text-amber-600">{caught.status}</span>{' '}
            {caught.statusText}
          </h1>
        )}
      </Prose>
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error">
      <Prose as="main" className="py-4">
        <h1>Oh no!</h1>
        {!error.stack?.includes(error.message) ? (
          <p className="break-words">{error.message}</p>
        ) : null}
        <pre>
          <code>
            {error.stack?.split('\n').map((line) => (
              <span key={line} className="line">
                {line}
              </span>
            ))}
          </code>
        </pre>
      </Prose>
    </Document>
  )
}
