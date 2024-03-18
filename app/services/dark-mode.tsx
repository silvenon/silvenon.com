import { createContext, useState, useContext, useEffect, useId } from 'react'
import { Form, useLocation, useNavigation } from '@remix-run/react'
import spriteUrl from '~/sprite.svg'
import clsx from 'clsx'

const DarkModeContext = createContext<[boolean | null, boolean]>([null, false])

interface ProviderProps {
  sessionValue: boolean | undefined
  children: React.ReactNode
}

function DarkModeProvider({ sessionValue, children }: ProviderProps) {
  const [matchesValue, setMatchesValue] = useState<boolean | null>(() => {
    if (typeof document === 'undefined') {
      // there's no way for us to know what the theme should be in this context
      // the client will have to figure it out before hydration.
      return null
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const navigation = useNavigation()
  let specifiedValue = sessionValue

  if (
    navigation.state === 'submitting' &&
    navigation.location.pathname === '/dark-mode'
  ) {
    const optimisticDarkMode = navigation.formData?.get('darkMode')
    if (typeof optimisticDarkMode === 'string') {
      specifiedValue =
        optimisticDarkMode === 'os' ? undefined : optimisticDarkMode === 'true'
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

  const darkMode = specifiedValue ?? matchesValue
  const isSpecified = typeof specifiedValue === 'boolean'

  return (
    <DarkModeContext.Provider value={[darkMode, isSpecified]}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  return useContext(DarkModeContext)
}

function DarkModeHtml(props: React.ComponentProps<'html'>) {
  const [darkMode] = useDarkMode()
  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html {...props} className={clsx(props.className, darkMode && 'dark')} />
  )
}

// https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually
function DarkModeHead() {
  const [darkMode, isSpecified] = useDarkMode()
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
      {!isSpecified && (
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
  const [darkMode, isSpecified] = useDarkMode()
  const location = useLocation()
  const id = useId()
  const searchParams = new URLSearchParams([['redirectTo', location.pathname]])

  return (
    <Form
      action={`/dark-mode?${searchParams}`}
      method="post"
      className="flex items-center space-x-2"
    >
      {isSpecified && (
        <button
          name="darkMode"
          value="os"
          type="submit"
          className="inline-flex items-center rounded-full border border-transparent bg-sky-100 px-2.5 py-[3px] text-xs font-medium text-sky-700 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:bg-sky-900 dark:text-sky-200 dark:hover:bg-sky-800 dark:focus:ring-sky-200 dark:focus:ring-offset-gray-900"
        >
          Reset to OS
        </button>
      )}
      <button
        id={`${id}-switch`}
        role="switch"
        name="darkMode"
        value={String(!darkMode)}
        aria-checked={Boolean(darkMode)}
        type="submit"
        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-400 dark:focus:ring-purple-400 dark:focus:ring-offset-gray-900"
      >
        <span id={`${id}-switch-label`} className="sr-only">
          {darkMode ? 'Disable dark mode' : 'Enable dark mode'}
        </span>
        <span className="pointer-events-none relative inline-block h-5 w-5 translate-x-0 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:translate-x-5">
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
      {!isSpecified && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              ;(function () {
                const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
                const switchEl = document.getElementById('${id}-switch')
                const switchLabelEl = document.getElementById('${id}-switch-label')
                switchEl.setAttribute('value', String(!darkMode))
                switchEl.setAttribute('aria-checked', String(darkMode))
                switchLabelEl.textContent = darkMode ? 'Disable dark mode' : 'Enable dark mode'
              })()
            `,
          }}
        />
      )}
    </Form>
  )
}

export const DarkMode = {
  Provider: DarkModeProvider,
  Html: DarkModeHtml,
  Head: DarkModeHead,
  Toggle: DarkModeToggle,
}
