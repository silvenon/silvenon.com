import { createContext, useContext, useRef, useMemo } from 'react'
import type { ReactNode, MutableRefObject } from 'react'

type QueuedCommand =
  | { type: 'trackPageview'; url: string }
  | { type: 'trackGoal'; eventCode: string; value: number }

const AnalyticsQueueContext = createContext<MutableRefObject<QueuedCommand[]>>({
  current: [],
})

const AnalyticsCommandsContext = createContext<{
  trackPageview(url: string): void
  trackGoal(eventCode: string, value: number): void
}>({
  trackPageview() {},
  trackGoal() {},
})

export function useAnalytics() {
  return useContext(AnalyticsCommandsContext)
}

function AnalyticsCommandsProvider({ children }: { children: ReactNode }) {
  const queue = useContext(AnalyticsQueueContext)
  const commands = useMemo(
    () => ({
      trackPageview(url: string) {
        if (window.fathom) {
          // no need to pass the URL, Fathom will pick it up from the canonical link
          window.fathom.trackPageview()
        } else {
          // Fathom hasn't finished loading yet! queue the command
          queue.current.push({ type: 'trackPageview', url })
        }
      },
      trackGoal(eventCode: string, value: number) {
        if (window.fathom) {
          window.fathom.trackGoal(eventCode, value)
        } else {
          // Fathom hasn't finished loading yet! queue the command
          queue.current.push({ type: 'trackGoal', eventCode, value })
        }
      },
    }),
    [queue],
  )
  return (
    <AnalyticsCommandsContext.Provider value={commands}>
      {children}
    </AnalyticsCommandsContext.Provider>
  )
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const queue = useRef<QueuedCommand[]>([])
  return (
    <AnalyticsQueueContext.Provider value={queue}>
      <AnalyticsCommandsProvider>{children}</AnalyticsCommandsProvider>
    </AnalyticsQueueContext.Provider>
  )
}

export function AnalyticsScript() {
  const queue = useContext(AnalyticsQueueContext)

  const flushQueue = () => {
    while (queue.current.length > 0) {
      const queuedCommand = queue.current.shift()!
      if (window.fathom) {
        switch (queuedCommand.type) {
          case 'trackPageview':
            window.fathom.trackPageview({ url: queuedCommand.url })
            break
          case 'trackGoal':
            window.fathom.trackGoal(
              queuedCommand.eventCode,
              queuedCommand.value,
            )
            break
          default: {
            const _: never = queuedCommand
            console.error(
              `Unknown queued command: ${JSON.stringify(
                (_ as QueuedCommand).type,
              )}`,
            )
          }
        }
      } else {
        // Fathom isn't available even though the script has loaded
        // this should never happen!
      }
    }
  }

  return (
    <script
      src="https://cdn.usefathom.com/script.js"
      data-site="GSHQIEZX"
      data-spa="history"
      data-auto="false" // prevent tracking visit twice on initial page load
      defer
      onLoad={flushQueue}
    />
  )
}

declare global {
  interface Window {
    fathom?: {
      trackPageview(options?: { url: string; referrer?: string }): void
      trackGoal(eventCode: string, value: number): void
    }
  }
}
