import {
  Links,
  Scripts,
  LiveReload,
  Meta,
  Outlet,
  ScrollRestoration,
  useLoaderData,
  useCatch,
  useTransition,
} from '@remix-run/react'
import { redirect, json } from '@remix-run/node'
import type { MetaFunction, LinksFunction, LoaderArgs } from '@remix-run/node'
import { useRef } from 'react'
import { MetronomeLinks } from '@metronome-sh/react'
import { DarkMode, useDarkMode } from './services/dark-mode'
import clsx from 'clsx'
import Header from './components/Header'
import cloudinary from './utils/cloudinary'
import { getCanonicalUrl } from './utils/http'
import { author } from './consts'
import styles from './tailwind.css'
import Boundary from './components/Boundary'
import { removeTrailingSlash } from './utils/http'
import { getEnv } from '~/utils/env.server'
import { getDarkMode } from '~/session.server'

interface LoaderData {
  ENV: ReturnType<typeof getEnv>
  appName?: string
  canonicalUrl: string
  darkMode?: boolean
}

export async function loader({ request }: LoaderArgs) {
  if (request.url !== removeTrailingSlash(request.url)) {
    throw redirect(removeTrailingSlash(request.url), { status: 308 })
  }
  return json<LoaderData>(
    {
      ENV: getEnv(),
      appName: process.env.FLY_APP_NAME,
      canonicalUrl: getCanonicalUrl(request),
      darkMode: await getDarkMode(request),
    },
    200,
  )
}

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => {
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

function App() {
  const data = useLoaderData<typeof loader>()
  const [darkMode] = useDarkMode()

  return (
    <html
      lang="en"
      className={clsx(
        'h-full',
        typeof window === 'undefined' ? 'no-js' : 'js',
        darkMode && 'dark',
      )}
    >
      <head>
        <Meta />
        <link rel="canonical" href={data.canonicalUrl} />
        <Links />
        <MetronomeLinks />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.classList.replace('no-js', 'js')
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.ENV = ${JSON.stringify(data.ENV)}
            `,
          }}
        />
        <DarkMode.Head />
      </head>
      <body className="h-full bg-page text-black selection:bg-amber-300 selection:text-black dark:bg-page-dark dark:text-white">
        <Header />
        <Outlet />
        <ScrollRestoration />
        <script
          src="https://reliable-brave.silvenon.com/script.js"
          data-site="GSHQIEZX"
          data-excluded-domains="localhost,staging.silvenon.com"
          data-spa="history"
          defer
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>()
  const transition = useTransition()
  const specifiedDarkModeRef = useRef(data.darkMode)

  if (
    transition.state === 'submitting' &&
    transition.location.pathname === '/dark-mode'
  ) {
    const optimisticDarkMode = transition.submission.formData.get('darkMode')
    if (typeof optimisticDarkMode === 'string') {
      specifiedDarkModeRef.current =
        optimisticDarkMode === 'os' ? undefined : optimisticDarkMode === 'true'
    }
  }

  return (
    <DarkMode.Provider specifiedValue={specifiedDarkModeRef.current}>
      <App />
    </DarkMode.Provider>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  return (
    <html lang="en" className="dark h-full">
      <head>
        <Meta />
        <title>{caught.status === 404 ? 'Page not found' : 'Page error'}</title>
        <Links />
      </head>
      <body className="h-full">
        <Boundary
          status={caught.status}
          title={
            caught.status === 404
              ? 'Nothing found at this URL.'
              : caught.statusText
          }
          description={
            caught.status === 404 ? (
              <p>It looks like the page you’re looking for doesn't exist.</p>
            ) : undefined
          }
        />
      </body>
    </html>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <Meta />
        <title>Page error</title>
        <Links />
      </head>
      <body className="h-full">
        <Boundary
          title="Oh no!"
          errorOutput={
            <>
              {!error.stack?.includes(error.message) ? (
                <span className="break-words">{error.message}</span>
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
            </>
          }
        />
      </body>
    </html>
  )
}
