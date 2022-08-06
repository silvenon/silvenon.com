import { load, trackPageview } from 'fathom-client'
import { useLocation } from '@remix-run/react'
import { useRef, useEffect } from 'react'

export default function FathomAnalytics() {
  const location = useLocation()
  const loadedRef = useRef(false)

  useEffect(() => {
    if (ENV.NODE_ENV !== 'production' || ENV.E2E_TESTING) return
    if (!loadedRef.current) {
      load('GSHQIEZX', {
        url: 'https://reliable-brave.silvenon.com/script.js',
        spa: 'history',
        includedDomains: ['silvenon.com'],
      })
    } else {
      trackPageview()
    }
    loadedRef.current = true
  }, [location])

  return null
}
