import { renderToString } from 'react-dom/server'
import { RemixServer } from '@remix-run/react'
import type { EntryContext } from '@remix-run/node'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />,
  )

  responseHeaders.set('Content-Type', 'text/html')
  // if they connect once with HTTPS, then they'll connect with HTTPS for the next hundred years
  responseHeaders.set(
    'Strict-Transport-Security',
    `max-age=${60 * 60 * 24 * 365 * 100}`,
  )

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
