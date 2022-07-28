import { formatDate, formatDateISO } from '../utils/date'
import { CalendarIcon, PencilIcon } from '@heroicons/react/outline'

interface Props {
  published?: string
  lastModified?: string
}

export default function PostDate({ published, lastModified }: Props) {
  if (published) {
    return (
      <>
        <span className="sr-only">Published on </span>
        <time
          className="flex items-center space-x-2 text-gray-500 dark:text-gray-400"
          dateTime={formatDateISO(published)}
        >
          <CalendarIcon aria-hidden="true" className="h-5 w-5" />
          <span>{formatDate(published)}</span>
        </time>
        {lastModified ? (
          <span className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <PencilIcon aria-hidden="true" className="h-5 w-5" />
            <span>
              Last modified on{' '}
              <time className="" dateTime={formatDateISO(lastModified)}>
                {formatDate(lastModified)}
              </time>
            </span>
          </span>
        ) : null}
      </>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-300">
      <PencilIcon className="h-5 w-5" />
      <span>Draft</span>
    </div>
  )
}
