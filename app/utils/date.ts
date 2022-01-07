import { format, formatISO, parseISO } from 'date-fns'

export function formatDate(date: string | Date): string {
  return format(
    typeof date === 'string' ? parseISO(date) : date,
    'MMMM do, yyyy',
  )
}

export function formatDateISO(date: string | Date): string {
  return formatISO(typeof date === 'string' ? parseISO(date) : date, {
    representation: 'date',
  })
}
