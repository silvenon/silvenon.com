import {
  Links,
  Scripts,
  LiveReload,
  Meta,
  Outlet,
  ScrollRestoration,
  useLoaderData,
  useCatch,
  useNavigation,
  useLocation,
} from '@remix-run/react'
import { json } from '@remix-run/node'
import type { LinksFunction, LoaderArgs } from '@remix-run/node'
import { useRef } from 'react'
import { MetronomeLinks } from '@metronome-sh/react'
import { DarkMode } from './services/dark-mode'
import clsx from 'clsx'
import Header from './components/Header'
import cloudinary from './utils/cloudinary'
import { removeTrailingSlash, getCanonicalUrl } from './utils/http'
import { author } from './consts'
import styles from './tailwind.css'
import Boundary from './components/Boundary'
import Analytics from './components/Analytics'
import { getEnv } from '~/utils/env.server'
import { getDarkMode } from '~/session.server'

export async function loader({ request }: LoaderArgs) {
  removeTrailingSlash(request)

  return json(
    {
      ENV: getEnv(),
      appName: process.env.FLY_APP_NAME,
      canonicalUrl: getCanonicalUrl(request),
      darkMode: await getDarkMode(request),
    },
    200,
  )
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
  const hasJs = typeof window !== 'undefined'

  return (
    <DarkMode.Html lang="en" className={clsx('h-full', hasJs ? 'js' : 'no-js')}>
      <head>
        {data.appName === 'silvenon-staging' && (
          <meta name="robots" content="noindex" />
        )}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="canonical" href={data.canonicalUrl} />
        {/* Open Graph */}
        <meta property="og:site_name" content={author.name} />
        <meta property="og:url" content={data.canonicalUrl} />
        {/* https://developers.facebook.com/docs/sharing/best-practices/#images */}
        <meta
          property="og:image:url"
          content={cloudinary('in-reactor-1.jpg', {
            version: 3,
            width: 1080,
            aspectRatio: '1:1',
            crop: 'fill',
            gravity: 'face',
            quality: 'auto',
          })}
        />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1080" />
        <meta property="og:image:height" content="1080" />
        {/* Twitter Card */}
        {/* https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@silvenon" />
        <meta
          name="twitter:image"
          content={cloudinary('in-reactor-1.jpg', {
            version: 3,
            width: 3024,
            aspectRatio: '1:1',
            crop: 'fill',
            gravity: 'face',
            format: 'webp',
            quality: 'auto',
          })}
        />
        <Meta />
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
        <Analytics />
        <Scripts />
        <LiveReload />
      </body>
    </DarkMode.Html>
  )
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const specifiedDarkModeRef = useRef(data.darkMode)

  if (
    navigation.state === 'submitting' &&
    navigation.location.pathname === '/dark-mode'
  ) {
    const optimisticDarkMode = navigation.formData.get('darkMode')
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
  const { pathname } = useLocation()
  const title =
    caught.data ?? (caught.status === 404 ? 'Page not found' : 'Page error')

  let description
  if (caught.status === 404) {
    description = pathname.startsWith('/blog/') ? (
      <p>
        It&apos;s likely that you got here by following a link to one of my blog
        posts which no longer has that URL. You should be able to find the
        content you&apos;re looking for elsewhere on this site, unless I deleted
        that post!{' '}
        <span role="img" aria-label="embarrassed">
          😳
        </span>
      </p>
    ) : (
      <p>It looks like the page you’re looking for doesn't exist.</p>
    )
  }

  return (
    <html lang="en" className="dark h-full">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body className="h-full">
        <Boundary
          status={caught.status}
          title={
            !pathname.startsWith('/blog/') && caught.status === 404
              ? 'Nothing found at this URL.'
              : title
          }
          description={description}
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
