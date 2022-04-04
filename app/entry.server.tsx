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

  const requestURL = new URL(request.url)
  const proto = request.headers.get('X-Forwarded-Proto')
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')

  if (proto === 'http') {
    responseStatusCode = 301
    responseHeaders.set('X-Forwarded-Proto', 'https')
    responseHeaders.set('location', 'https://' + host + requestURL.pathname)
  }

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
