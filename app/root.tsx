import {
  redirect,
  data,
  Links,
  Scripts,
  Meta,
  Outlet,
  ScrollRestoration,
  useLocation,
  useRouteError,
  isRouteErrorResponse,
  useRouteLoaderData,
} from 'react-router'
import { DarkMode } from './services/dark-mode'
import clsx from 'clsx'
import Header from './components/Header'
import { removeTrailingSlash, getDomainUrl } from './utils/http'
import { author } from './consts'
import stylesUrl from './tailwind.css?url'
import Boundary from './components/Boundary'
import { AnalyticsProvider, AnalyticsScript } from './services/analytics'
import { getDarkMode } from '~/session.server'
import CanonicalLink from './components/CanonicalLink'
import NotFound from './components/NotFound.mdx'
import NotFoundPost from './components/NotFoundPost.mdx'
import type { Route } from './+types/root'

export async function loader({ request }: Route.LoaderArgs) {
  const desiredUrl = removeTrailingSlash(request.url)

  if (request.url !== desiredUrl) {
    throw redirect(desiredUrl, { status: 301 })
  }

  return data(
    {
      appName: process.env.FLY_APP_NAME,
      origin: getDomainUrl(request),
      darkMode: await getDarkMode(request),
    },
    200,
  )
}

export function meta({ error }: Route.MetaArgs) {
  if (!error) return []
  let title: string
  if (isRouteErrorResponse(error)) {
    title =
      error.data ?? (error.status === 404 ? 'Page not found' : 'Page error')
  } else if (error instanceof Error) {
    title = 'Page error'
  } else {
    title = 'Unknown error'
  }
  return [{ title }]
}

export function links() {
  return [
    { rel: 'stylesheet', href: stylesUrl },
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/manifest.webmanifest' },
    { rel: 'me', href: 'https://twitter.com/silvenon' },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      href: '/feed.rss',
      title: 'RSS Feed',
    },
    {
      rel: 'alternate',
      type: 'application/atom+xml',
      href: '/feed.atom',
      title: 'Atom Feed',
    },
  ] satisfies Route.LinkDescriptors
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root')
  const error = useRouteError()
  const origin = data?.origin ?? window.location.origin

  return (
    <AnalyticsProvider>
      <DarkMode.Provider sessionValue={error !== null || data?.darkMode}>
        <DarkMode.Html
          lang="en"
          className={clsx('h-full', import.meta.env.SSR ? 'no-js' : 'js')}
        >
          <head>
            {data?.appName === 'silvenon-staging' && (
              <meta name="robots" content="noindex" />
            )}
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width,initial-scale=1"
            />
            <CanonicalLink origin={origin} />
            <meta property="og:site_name" content={author.name} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@silvenon" />
            <Meta />
            <Links />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  document.documentElement.classList.replace('no-js', 'js')
                `,
              }}
            />
            <DarkMode.Head />
          </head>
          <body className="h-full bg-page text-black selection:bg-amber-300 selection:text-black dark:bg-page-dark dark:text-white">
            {children}
            <ScrollRestoration />
            {import.meta.env.PROD && <AnalyticsScript />}
            <Scripts />
          </body>
        </DarkMode.Html>
      </DarkMode.Provider>
    </AnalyticsProvider>
  )
}

export default function App(_: Route.ComponentProps) {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { pathname } = useLocation()

  let content: React.ReactNode

  if (isRouteErrorResponse(error)) {
    let description: React.ReactNode = null
    if (error.status === 404) {
      description = pathname.startsWith('/blog/') ? (
        <NotFoundPost />
      ) : (
        <NotFound />
      )
    }
    content = (
      <Boundary
        status={error.status}
        title={
          !pathname.startsWith('/blog/') && error.status === 404
            ? 'Nothing found at this URL.'
            : (error.data ??
              (error.status === 404 ? 'Page not found' : 'Page error'))
        }
        description={description}
      />
    )
  } else if (error instanceof Error) {
    content = (
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
                  <span key={line} data-line>
                    {line}
                  </span>
                ))}
              </code>
            </pre>
          </>
        }
      />
    )
  } else {
    content = <Boundary title="Unknown error" />
  }

  return content
}
