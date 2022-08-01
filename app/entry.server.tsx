import { PassThrough } from 'stream'
import { renderToPipeableStream } from 'react-dom/server'
import { RemixServer } from '@remix-run/react'
import { Response } from '@remix-run/node'
import type { EntryContext, Headers } from '@remix-run/node'
import isbot from 'isbot'

const ABORT_DELAY = 5000

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const callbackName = isbot(request.headers.get('user-agent'))
    ? 'onAllReady'
    : 'onShellReady'

  return new Promise((resolve, reject) => {
    let didError = false

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        [callbackName]() {
          const body = new PassThrough()

          responseHeaders.set('Content-Type', 'text/html')
          // if they connect once with HTTPS, then they'll connect with HTTPS for the next hundred years
          responseHeaders.set(
            'Strict-Transport-Security',
            `max-age=${60 * 60 * 24 * 365 * 100}`,
          )

          resolve(
            new Response(body, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            }),
          )

          pipe(body)
        },
        onShellError(err: unknown) {
          reject(err)
        },
        onError(err: unknown) {
          didError = true
          console.error(err)
        },
      },
    )

    setTimeout(abort, ABORT_DELAY)
  })
}
