import { createContext, useState, useEffect, useContext } from 'react'
import { useMediaQuery } from '@react-hook/media-query'

const DarkModeContext = createContext<null | boolean>(null)

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState<null | boolean>(null)
  const matches = useMediaQuery('(prefers-color-scheme: dark)')

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains('dark'))
  }, [])

  useEffect(() => {
    if (!('theme' in localStorage)) {
      document.documentElement.classList.toggle('dark', matches)
      setDarkMode(matches)
    }
  }, [matches])

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.target instanceof Element) {
          setDarkMode(mutation.target.classList.contains('dark'))
        }
      }
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <DarkModeContext.Provider value={darkMode}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const darkMode = useContext(DarkModeContext)
  return darkMode
}
