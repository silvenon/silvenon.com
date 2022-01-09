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
          className="inline-flex items-center px-2.5 py-[3px] border border-transparent text-xs font-medium rounded-full text-lightBlue-700 bg-lightBlue-100 hover:bg-lightBlue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightBlue-500 dark:focus:ring-offset-gray-900 dark:focus:ring-lightBlue-100"
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
        className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:bg-purple-400 dark:focus:ring-offset-gray-900 dark:focus:ring-purple-400"
      >
        <span className="sr-only">Use setting</span>
        <span className="pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow translate-x-0 ring-0 transition ease-in-out duration-200 dark:translate-x-5">
          <span
            className="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity ease-out duration-200 dark:opacity-0 dark:ease-out dark:duration-100"
            aria-hidden="true"
          >
            <svg className="bg-white w-3 h-3 text-gray-400">
              <use href="/icons.svg#sun" />
            </svg>
          </span>
          <span
            className="absolute inset-0 h-full w-full flex items-center justify-center opacity-0 transition-opacity ease-out duration-100 dark:opacity-100 dark:ease-in dark:duration-200"
            aria-hidden="true"
          >
            <svg className="bg-white w-3 h-3 text-purple-500">
              <use href="/icons.svg#moon" />
            </svg>
          </span>
        </span>
      </Switch>
    </div>
  )
}
