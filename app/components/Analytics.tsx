import { useEffect } from 'react'
import * as Fathom from 'fathom-client'
import { useLocation } from '@remix-run/react'

export default function FathomAnalytics() {
  const location = useLocation()
  const shouldTrack = ENV.NODE_ENV === 'production' && !ENV.E2E_TESTING

  useEffect(() => {
    if (shouldTrack) {
      Fathom.load('GSHQIEZX', {
        url: 'https://reliable-brave.silvenon.com/script.js',
        spa: 'history',
        includedDomains: ['silvenon.com'],
      })
    }
  }, [shouldTrack])

  useEffect(() => {
    if (shouldTrack) {
      Fathom.trackPageview()
    }
  }, [shouldTrack, location])

  return null
}
