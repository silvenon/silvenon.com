import React from 'react'

interface Props {
  children: React.ReactNode
}

export default function HotTip({ children }: Props) {
  return (
    <div className="bg-purple-200 dark:bg-desatPurple-900 dark:text-purple-100 -mx-4 p-4 sm:mx-0 sm:rounded-lg">
      <div className="bg-purple-800 dark:bg-purple-200 text-white dark:text-desatPurple-800 inline-block -ml-4 px-4 rounded-r-md uppercase tracking-wide text-lg font-bold">
        Hot tip!
      </div>
      <div className="hot-tip">{children}</div>
    </div>
  )
}
