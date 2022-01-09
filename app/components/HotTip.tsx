import React from 'react'

interface Props {
  children: React.ReactNode
}

export default function HotTip({ children }: Props) {
  return (
    <div className="-mx-4 p-4 bg-purple-200 text-purple-900 sm:mx-0 sm:rounded-lg dark:bg-purple-900 dark:text-purple-100">
      <div className="inline-block -ml-4 px-4 bg-purple-800 rounded-r-md text-white uppercase tracking-wide text-lg font-bold dark:bg-purple-200 dark:text-purple-800">
        Hot tip!
      </div>
      <div className="hot-tip">{children}</div>
    </div>
  )
}
