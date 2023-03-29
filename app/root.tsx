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
  useLocation,
} from '@remix-run/react'
import { json } from '@remix-run/node'
import type { MetaFunction, LinksFunction, LoaderArgs } from '@remix-run/node'
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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    ...(data.appName === 'silvenon-staging' ? { robots: 'noindex' } : null),
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    // Open Graph
    'og:site_name': author.name,
    'og:url': data.canonicalUrl,
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
  const hasJs = typeof window !== 'undefined'

  return (
    <DarkMode.Html lang="en" className={clsx('h-full', hasJs ? 'js' : 'no-js')}>
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
        <Analytics />
        <Scripts />
        <LiveReload />
      </body>
    </DarkMode.Html>
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
