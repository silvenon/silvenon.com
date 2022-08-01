import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { RemixBrowser } from '@remix-run/react'

function hydrate() {
  React.startTransition(() => {
    hydrateRoot(
      document,
      <React.StrictMode>
        <RemixBrowser />
      </React.StrictMode>,
    )
  })
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate)
} else {
  window.setTimeout(hydrate, 1)
}
