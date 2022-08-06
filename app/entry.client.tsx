import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { RemixBrowser } from '@remix-run/react'
import { load as loadFathom } from 'fathom-client'

function hydrate() {
  React.startTransition(() => {
    hydrateRoot(
      document,
      <React.StrictMode>
        <RemixBrowser />
      </React.StrictMode>,
    )
  })

  if (ENV.NODE_ENV === 'production' && !ENV.E2E_TESTING) {
    loadFathom('GSHQIEZX', {
      url: 'https://reliable-brave.silvenon.com/script.js',
      spa: 'history',
      includedDomains: ['silvenon.com'],
    })
  }
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate)
} else {
  window.setTimeout(hydrate, 1)
}
