import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  ScrollRestoration,
  useCatch,
} from '@remix-run/react'
import { json } from '@remix-run/node'
import type {
  LoaderFunction,
  MetaFunction,
  LinksFunction,
} from '@remix-run/node'
import clsx from 'clsx'
import Prose from './components/Prose'
import Analytics from './components/Analytics'
import cloudinary from './utils/cloudinary'
import { SITE_URL, SITE_DESCRIPTION, author } from './consts'
import styles from './tailwind.css'
import Header from './components/Header'
import NotFound from './components/NotFound'
import { removeTrailingSlash } from './utils/http'
import { getMeta } from './utils/seo'

export const loader: LoaderFunction = ({ request }) => {
  removeTrailingSlash(request)
  return json({ appName: process.env.FLY_APP_NAME }, 200)
}

export const meta: MetaFunction = ({ location, data }) => {
  return {
    ...(data?.appName === 'silvenon-staging' ? { robots: 'noindex' } : null),
    ...getMeta({
      title: author.name,
      description: SITE_DESCRIPTION,
    }),
    // Open Graph
    'og:site_name': author.name,
    'og:url': new URL(location.pathname, SITE_URL).href,
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
    { rel: 'me', href: 'https://twitter.com/silvenon' },
  ]
}

function Document({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.classList.replace('no-js', 'js')
            `,
          }}
        />
        <script async src="https://platform.twitter.com/widgets.js"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/@gitgraph/js"></script>
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
          'h-full bg-page text-black selection:bg-amber-300 selection:text-black dark:bg-page-dark dark:text-white',
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
    <Document>
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
    <Document>
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
