import { useState, useEffect } from 'react'
import { Switch } from '@headlessui/react'
import { useDarkMode } from '~/services/dark-mode'
import { useMedia } from '~/hooks/useMedia'

export default function DarkModeToggle() {
  const darkMode = useDarkMode()
  const [showReset, setShowReset] = useState<boolean>(false)
  const matchesDark = useMedia('(prefers-color-scheme: dark)')

  useEffect(() => {
    setShowReset('theme' in localStorage)
  }, [])

  if (darkMode === null) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      {showReset && (
        <button
          type="button"
          className="inline-flex items-center rounded-full border border-transparent bg-sky-100 px-2.5 py-[3px] text-xs font-medium text-sky-700 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:bg-sky-900 dark:text-sky-200 dark:hover:bg-sky-800 dark:focus:ring-sky-200 dark:focus:ring-offset-gray-900"
          onClick={() => {
            setShowReset(false)
            localStorage.removeItem('theme')
            document.documentElement.classList.toggle('dark', matchesDark)
          }}
        >
          Reset to OS
        </button>
      )}
      <Switch
        checked={darkMode}
        onChange={(newChecked) => {
          setShowReset(true)
          document.documentElement.classList.toggle('dark', newChecked)
          if (newChecked) {
            localStorage.theme = 'dark'
          } else {
            localStorage.theme = 'light'
          }
        }}
        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-400 dark:focus:ring-purple-400 dark:focus:ring-offset-gray-900"
      >
        <span className="sr-only">Use setting</span>
        <span className="pointer-events-none relative inline-block h-5 w-5 translate-x-0 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:translate-x-5">
          <span
            className="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-out dark:opacity-0 dark:duration-100 dark:ease-out"
            aria-hidden="true"
          >
            <svg className="h-3 w-3 bg-white text-gray-400">
              <use href="/icons.svg#sun" />
            </svg>
          </span>
          <span
            className="absolute inset-0 flex h-full w-full items-center justify-center opacity-0 transition-opacity duration-100 ease-out dark:opacity-100 dark:duration-200 dark:ease-in"
            aria-hidden="true"
          >
            <svg className="h-3 w-3 bg-white text-purple-500">
              <use href="/icons.svg#moon" />
            </svg>
          </span>
        </span>
      </Switch>
    </div>
  )
}
