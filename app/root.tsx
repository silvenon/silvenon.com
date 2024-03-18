import {
  Links,
  Scripts,
  Meta,
  Outlet,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useRouteError,
  isRouteErrorResponse,
} from '@remix-run/react'
import { redirect, json } from '@remix-run/node'
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node'
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

export async function loader({ request }: LoaderFunctionArgs) {
  const desiredUrl = removeTrailingSlash(request.url)

  if (request.url !== desiredUrl) {
    throw redirect(desiredUrl, { status: 301 })
  }

  return json(
    {
      appName: process.env.FLY_APP_NAME,
      origin: getDomainUrl(request),
      darkMode: await getDarkMode(request),
    },
    200,
  )
}

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: stylesUrl },
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/manifest.webmanifest' },
    { rel: 'me', href: 'https://twitter.com/silvenon' },
  ]
}

export default function App() {
  const data = useLoaderData<typeof loader>()
  const hasJs = typeof document !== 'undefined'

  return (
    <AnalyticsProvider>
      <DarkMode.Provider sessionValue={data.darkMode}>
        <DarkMode.Html
          lang="en"
          className={clsx('h-full', hasJs ? 'js' : 'no-js')}
        >
          <head>
            {data.appName === 'silvenon-staging' && (
              <meta name="robots" content="noindex" />
            )}
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width,initial-scale=1"
            />
            <CanonicalLink origin={data.origin} />
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
            <Header />
            <Outlet />
            <ScrollRestoration />
            {import.meta.env.PROD && <AnalyticsScript />}
            <Scripts />
          </body>
        </DarkMode.Html>
      </DarkMode.Provider>
    </AnalyticsProvider>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  const { pathname } = useLocation()

  let title: string
  let content: React.ReactNode

  if (isRouteErrorResponse(error)) {
    title =
      error.data ?? (error.status === 404 ? 'Page not found' : 'Page error')
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
            : title
        }
        description={description}
      />
    )
  } else if (error instanceof Error) {
    title = 'Page error'
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
                  <span key={line} className="line">
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
    title = 'Unknown error'
    content = <Boundary title={title} />
  }

  return (
    <html lang="en" className="dark h-full">
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">{content}</body>
    </html>
  )
}
