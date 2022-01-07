import { useState, useEffect } from 'react'
import { Switch } from '@headlessui/react'
import clsx from 'clsx'
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
          className={clsx(
            'inline-flex items-center px-2.5 py-[3px] border border-transparent text-xs font-medium rounded-full ',
            'text-lightBlue-700 bg-lightBlue-100 hover:bg-lightBlue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightBlue-500',
            'dark:focus:ring-offset-gray-900 dark:focus:ring-lightBlue-100',
          )}
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
        className={clsx(
          darkMode ? 'bg-desatPurple-500' : 'bg-gray-200',
          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
          'dark:focus:ring-offset-gray-900 dark:focus:ring-desatPurple-500',
        )}
      >
        <span className="sr-only">Use setting</span>
        <span
          className={clsx(
            darkMode ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
          )}
        >
          <span
            className={clsx(
              darkMode
                ? 'opacity-0 ease-out duration-100'
                : 'opacity-100 ease-in duration-200',
              'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity',
            )}
            aria-hidden="true"
          >
            <svg className="bg-white w-3 h-3 text-gray-400">
              <use href="/icons.svg#sun" />
            </svg>
          </span>
          <span
            className={clsx(
              darkMode
                ? 'opacity-100 ease-in duration-200'
                : 'opacity-0 ease-out duration-100',
              'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity',
            )}
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
