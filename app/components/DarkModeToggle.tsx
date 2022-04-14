import { SunIcon, MoonIcon } from '@heroicons/react/outline'
import dedent from 'dedent'

export default function DarkModeToggle() {
  return (
    <>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="dark-mode-reset hidden items-center rounded-full border border-transparent bg-sky-100 px-2.5 py-[3px] text-xs font-medium text-sky-700 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:bg-sky-900 dark:text-sky-200 dark:hover:bg-sky-800 dark:focus:ring-sky-200 dark:focus:ring-offset-gray-900"
        >
          Reset to OS
        </button>
        <button
          role="switch"
          aria-checked={false}
          type="button"
          className="dark-mode-toggle relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-400 dark:focus:ring-purple-400 dark:focus:ring-offset-gray-900"
        >
          <span className="dark-mode-label sr-only">Enable dark mode</span>
          <span className="pointer-events-none relative inline-block h-5 w-5 translate-x-0 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:translate-x-5">
            <span
              className="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-out dark:opacity-0 dark:duration-100 dark:ease-out"
              aria-hidden="true"
            >
              <SunIcon className="h-3 w-3 bg-white text-gray-400" />
            </span>
            <span
              className="absolute inset-0 flex h-full w-full items-center justify-center opacity-0 transition-opacity duration-100 ease-out dark:opacity-100 dark:duration-200 dark:ease-in"
              aria-hidden="true"
            >
              <MoonIcon className="h-3 w-3 bg-white text-purple-500" />
            </span>
          </span>
        </button>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: dedent`
            ;(() => {
              const switchEl = document.querySelector('.dark-mode-toggle')
              const resetEl = document.querySelector('.dark-mode-reset')
              const labelEl = document.querySelector('.dark-mode-label')
              const mql = window.matchMedia('(prefers-color-scheme: dark)')

              updateSwitch()
              mql.addEventListener('change', updateSwitch)

              switchEl.addEventListener('click', () => {
                const isDarkMode = switchEl.getAttribute('aria-checked') === 'true'
                localStorage.theme = isDarkMode ? 'light' : 'dark'
                updateSwitch()
              })

              resetEl.addEventListener('click', () => {
                localStorage.removeItem('theme')
                updateSwitch()
              })

              function updateSwitch() {
                const isDarkMode = localStorage.theme === 'dark' || (!('theme' in localStorage) && mql.matches)
                const hasReset = 'theme' in localStorage
                document.documentElement.classList.toggle('dark', isDarkMode)
                resetEl.classList.toggle('inline-flex', hasReset)
                resetEl.classList.toggle('hidden', !hasReset)
                switchEl.setAttribute('aria-checked', String(isDarkMode))
                labelEl.textContent = isDarkMode ? 'Disable dark mode' : 'Enable dark mode'
              }
            })()
          `,
        }}
      />
    </>
  )
}
