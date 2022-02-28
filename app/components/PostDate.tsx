import Icon from './Icon'
import { formatDate, formatDateISO } from '../utils/date'
import calendarIcon from '@iconify/icons-bx/bx-calendar'
import penIcon from '@iconify/icons-mdi/pen'

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
        <Icon icon={calendarIcon} />
        <span>{formatDate(published)}</span>
      </time>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-300">
      <Icon icon={penIcon} />
      <span>Draft</span>
    </div>
  )
}
