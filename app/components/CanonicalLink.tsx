import { useLocation } from '@remix-run/react'
import { useEffect } from 'react'
import { removeTrailingSlash } from '~/utils/http'
import { useAnalytics } from '~/services/analytics'

interface Props {
  origin: string
}

export default function CanonicalLink({ origin }: Props) {
  const { pathname } = useLocation()
  const canonicalUrl = removeTrailingSlash(new URL(pathname, origin).href)
  const analytics = useAnalytics()

  useEffect(() => {
    analytics.trackPageview(canonicalUrl)
  }, [canonicalUrl, analytics])

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
    </>
  )
}
