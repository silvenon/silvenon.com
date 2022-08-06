import { useEffect } from 'react'
import { load as fathomLoad } from 'fathom-client'

export default function FathomAnalytics() {
  useEffect(() => {
    if (ENV.NODE_ENV === 'production' && !ENV.E2E_TESTING) {
      fathomLoad('GSHQIEZX', {
        url: 'https://reliable-brave.silvenon.com/script.js',
        spa: 'history',
        includedDomains: ['silvenon.com'],
      })
    }
  }, [])
  return null
}
