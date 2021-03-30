import React from 'react'
import { formatDate } from '../date'
import { Icon } from '@iconify/react'
import calendar from '@iconify-icons/bx/bx-calendar'
import penIcon from '@iconify-icons/mdi/pen'

interface Props {
  published?: string
}

export default function PostDate({ published }: Props) {
  if (published) {
    return (
      <time
        className="flex items-center space-x-2 text-gray-500 dark:text-gray-400"
        dateTime={published}
      >
        <Icon icon={calendar} />
        <span>{formatDate(published)}</span>
      </time>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-300">
      <Icon icon={penIcon} />
      <span>Draft</span>
    </div>
  )
}
