import React from 'react'

// https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/scripting-loading-and-initialization

interface Props {
  children: React.ReactNode
}

export default function Tweet({ children }: Props) {
  const initTweet = React.useCallback((node) => {
    window.twttr.widgets.load(node)
  }, [])
  return (
    <blockquote className="twitter-tweet" ref={initTweet}>
      {children}
    </blockquote>
  )
}

declare global {
  interface Window {
    twttr: {
      widgets: {
        load(el?: HTMLElement): void
      }
    }
  }
}
