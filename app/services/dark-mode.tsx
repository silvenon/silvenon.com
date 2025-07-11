import {
  createContext,
  useState,
  useContext,
  useEffect,
  useId,
  useRef,
} from 'react'
import { useFetcher, useLocation } from 'react-router'
import spriteUrl from '~/sprite.svg'
import clsx from 'clsx'

const FETCHER_KEY = 'dark-mode'

const DarkModeContext = createContext<boolean | null>(null)
const DarkModeSessionContext = createContext<boolean | undefined>(undefined)

interface ProviderProps {
  sessionValue: boolean | undefined
  children: React.ReactNode
}

function DarkModeProvider({ sessionValue, children }: ProviderProps) {
  const sessionFetcher = useFetcher({ key: FETCHER_KEY })
  const optimisticSessionValueRef = useRef<boolean | undefined>(undefined)
  const [matchesValue, setMatchesValue] = useState<boolean | null>(() => {
    if (import.meta.env.SSR) {
      // there's no way for us to know what the theme should be in this context
      // the client will have to figure it out before hydration.
      return null
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  if (sessionFetcher.state !== 'idle') {
    const submittedValue = sessionFetcher.formData?.get('darkMode')
    if (typeof submittedValue === 'string') {
      optimisticSessionValueRef.current =
        submittedValue === 'os' ? undefined : submittedValue === 'true'
    }
  }

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      setMatchesValue(event.matches)
    }
    mql.addEventListener('change', handleChange)
    return () => {
      mql.removeEventListener('change', handleChange)
    }
  }, [])

  const darkMode =
    optimisticSessionValueRef.current ?? sessionValue ?? matchesValue

  return (
    <DarkModeContext.Provider value={darkMode}>
      <DarkModeSessionContext.Provider
        value={optimisticSessionValueRef.current ?? sessionValue}
      >
        {children}
      </DarkModeSessionContext.Provider>
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  return useContext(DarkModeContext)
}

function DarkModeHtml(props: React.ComponentProps<'html'>) {
  const darkMode = useContext(DarkModeContext)
  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html {...props} className={clsx(props.className, darkMode && 'dark')} />
  )
}

// https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually
function DarkModeHead() {
  const darkMode = useContext(DarkModeContext)
  const sessionValue = useContext(DarkModeSessionContext)
  return (
    <>
      <meta
        name="color-scheme"
        content={darkMode ? 'dark light' : 'light dark'}
      />
      <meta
        name="twitter:widgets:theme"
        content={darkMode ? 'dark' : 'light'}
      />
      {typeof sessionValue === 'undefined' && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              ;(function () {
                const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
                document.documentElement.classList.toggle('dark', darkMode)
                document
                  .querySelector('meta[name="color-scheme"]')
                  .setAttribute('content', darkMode ? 'dark light' : 'light dark')
                document
                  .querySelector('meta[name="twitter:widgets:theme"]')
                  .setAttribute('content', darkMode ? 'dark' : 'light')
              })()
            `,
          }}
        />
      )}
    </>
  )
}

function DarkModeToggle() {
  const darkMode = useContext(DarkModeContext)
  const sessionValue = useContext(DarkModeSessionContext)
  const location = useLocation()
  const fetcher = useFetcher({ key: FETCHER_KEY })
  const id = useId()
  const searchParams = new URLSearchParams([['redirectTo', location.pathname]])
  const switchId = `${id}-switch`
  const switchLabelId = `${id}-switch-label`

  if (fetcher === null) return null

  return (
    <fetcher.Form
      action={`/dark-mode?${searchParams}`}
      method="post"
      className="flex items-center space-x-2"
    >
      {typeof sessionValue !== 'undefined' && (
        <button
          name="darkMode"
          value="os"
          type="submit"
          className="inline-block items-center rounded-full border border-transparent bg-sky-100 px-2.5 py-[3px] text-xs font-medium text-sky-700 hover:bg-sky-200 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-hidden dark:bg-sky-900 dark:text-sky-200 dark:hover:bg-sky-800 dark:focus:ring-sky-200 dark:focus:ring-offset-gray-900"
        >
          <span className="max-[425px]:sr-only">Reset to </span>
          OS
        </button>
      )}
      <button
        id={switchId}
        role="switch"
        name="darkMode"
        value={String(!darkMode)}
        aria-checked={Boolean(darkMode)}
        type="submit"
        className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-hidden dark:bg-purple-400 dark:focus:ring-purple-400 dark:focus:ring-offset-gray-900"
      >
        <span id={switchLabelId} className="sr-only">
          {darkMode ? 'Disable dark mode' : 'Enable dark mode'}
        </span>
        <span className="pointer-events-none relative inline-block h-5 w-5 translate-x-0 rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out dark:translate-x-5">
          <span
            className="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-out dark:opacity-0 dark:duration-100 dark:ease-out"
            aria-hidden="true"
          >
            <svg className="h-3 w-3 bg-white text-gray-400">
              <use href={`${spriteUrl}#sun`} />
            </svg>
          </span>
          <span
            className="absolute inset-0 flex h-full w-full items-center justify-center opacity-0 transition-opacity duration-100 ease-out dark:opacity-100 dark:duration-200 dark:ease-in"
            aria-hidden="true"
          >
            <svg className="h-3 w-3 bg-white text-purple-500">
              <use href={`${spriteUrl}#moon`} />
            </svg>
          </span>
        </span>
      </button>
      {typeof sessionValue === 'undefined' && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              ;(function () {
                const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
                const switchEl = document.getElementById('${switchId}')
                const switchLabelEl = document.getElementById('${switchLabelId}')
                switchEl.setAttribute('value', String(!darkMode))
                switchEl.setAttribute('aria-checked', String(darkMode))
                switchLabelEl.textContent = darkMode ? 'Disable dark mode' : 'Enable dark mode'
              })()
            `,
          }}
        />
      )}
    </fetcher.Form>
  )
}

export const DarkMode = {
  Provider: DarkModeProvider,
  Html: DarkModeHtml,
  Head: DarkModeHead,
  Toggle: DarkModeToggle,
}
