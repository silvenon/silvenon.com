import { useState, useEffect } from 'react'

export function useMedia(media: string) {
  const [matches, setMatches] = useState(
    typeof document !== 'undefined' ? window.matchMedia(media).matches : false,
  )
  useEffect(() => {
    const mediaQueryList = window.matchMedia(media)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mediaQueryList.addEventListener('change', handler)
    return () => {
      mediaQueryList.removeEventListener('change', handler)
    }
  }, [media])
  return matches
}
