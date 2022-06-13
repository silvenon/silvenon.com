import React from 'react'

interface Props {
  children: React.ReactNode
}

export default function HotTip({ children }: Props) {
  return (
    <div className="-mx-4 bg-purple-200 p-4 text-purple-900 dark:bg-purple-900 dark:text-purple-100 sm:mx-0 sm:rounded-lg">
      <div className="-ml-4 inline-block rounded-r-md bg-purple-800 px-4 text-lg font-bold uppercase tracking-wide text-white dark:bg-purple-200 dark:text-purple-800">
        Hot tip!
      </div>
      {/* remove the bottom margin both from the last child and the last code block in light mode */}
      {/* which is 2nd to last because the last one is the hidden dark mode block */}
      <div className="[&_pre]:mx-0 [&>*:last-child]:mb-0 [&>pre[data-theme=light]:nth-last-child(2)]:mb-0">
        {children}
      </div>
    </div>
  )
}
