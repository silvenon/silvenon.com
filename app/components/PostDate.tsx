import { formatDate, formatDateISO } from '../utils/date'
import { CalendarIcon, PencilIcon } from '@heroicons/react/outline'

interface Props {
  published?: Date
}

export default function PostDate({ published }: Props) {
  if (published) {
    return (
      <time
        className="flex items-center space-x-2 text-gray-500 dark:text-gray-400"
        dateTime={formatDateISO(published)}
      >
        <CalendarIcon className="h-5 w-5" />
        <span>{formatDate(published)}</span>
      </time>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-300">
      <PencilIcon className="h-5 w-5" />
      <span>Draft</span>
    </div>
  )
}
