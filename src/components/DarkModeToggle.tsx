import React from 'react'
import { Switch } from '@headlessui/react'
import { useMediaQueries } from '@react-hook/media-query'
import clsx from 'clsx'

export default function DarkModeToggle() {
  const [checked, setChecked] = React.useState<boolean>(false)
  const [showReset, setShowReset] = React.useState<boolean>(false)
  const { matches } = useMediaQueries({
    dark: '(prefers-color-scheme: dark)',
  })

  React.useEffect(() => {
    setChecked(document.documentElement.classList.contains('dark'))
  }, [])

  React.useEffect(() => {
    if (!('theme' in localStorage)) {
      document.documentElement.classList.toggle('dark', matches.dark)
      setChecked(matches.dark)
    }
  }, [matches.dark])

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
            setChecked(matches.dark)
            localStorage.removeItem('theme')
            document.documentElement.classList.toggle('dark', matches.dark)
          }}
        >
          Reset to OS
        </button>
      )}
      <Switch
        checked={checked}
        onChange={(newChecked) => {
          setChecked(newChecked)
          setShowReset(true)
          document.documentElement.classList.toggle('dark', newChecked)
          if (newChecked) {
            localStorage.theme = 'dark'
          } else {
            localStorage.theme = 'light'
          }
        }}
        className={clsx(
          checked ? 'bg-desatPurple-500' : 'bg-gray-200',
          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
          'dark:focus:ring-offset-gray-900 dark:focus:ring-desatPurple-500',
        )}
      >
        <span className="sr-only">Use setting</span>
        <span
          className={clsx(
            checked ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
          )}
        >
          <span
            className={clsx(
              checked
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
              checked
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
