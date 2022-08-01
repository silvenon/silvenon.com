import {
  Links,
  Scripts,
  LiveReload,
  Meta,
  Outlet,
  ScrollRestoration,
  useLoaderData,
  useCatch,
} from '@remix-run/react'
import { redirect, json } from '@remix-run/node'
import type { MetaFunction, LinksFunction, LoaderArgs } from '@remix-run/node'
import { MetronomeLinks } from '@metronome-sh/react'
import { DarkMode, useDarkMode } from './services/dark-mode'
import clsx from 'clsx'
import Analytics from './components/Analytics'
import cloudinary from './utils/cloudinary'
import { getCanonicalUrl } from './utils/http'
import { author } from './consts'
import styles from './tailwind.css'
import Boundary from './components/Boundary'
import { removeTrailingSlash } from './utils/http'
import { getDarkMode } from '~/session.server'

interface LoaderData {
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

function Document({
  loaderData,
  title,
  className,
  children,
}: {
  loaderData?: LoaderData
  title?: string
  className?: string
  children: React.ReactNode
}) {
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
        {title ? (
          <>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta property="twitter:title" content={title} />
          </>
        ) : null}
        {loaderData?.canonicalUrl ? (
          <link rel="canonical" href={loaderData.canonicalUrl} />
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
        <DarkMode.Head />
      </head>
      <body
        className={clsx(
          'h-full bg-page text-black selection:bg-amber-300 selection:text-black dark:bg-page-dark dark:text-white',
          className,
        )}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

function DocumentWithProviders(props: React.ComponentProps<typeof Document>) {
  return (
    <DarkMode.Provider specifiedValue={props.loaderData?.darkMode}>
      <Document {...props} />
    </DarkMode.Provider>
  )
}

export default function App() {
  const data = useLoaderData<typeof loader>()
  return (
    <DocumentWithProviders loaderData={data}>
      <Outlet />
    </DocumentWithProviders>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  return (
    <DocumentWithProviders
      title={caught.status === 404 ? 'Page not found' : undefined}
    >
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
    </DocumentWithProviders>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <DocumentWithProviders title="Page error">
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
    </DocumentWithProviders>
  )
}
