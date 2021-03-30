import { format, formatISO, parseISO } from 'date-fns'

export function formatDate(dateISO: string): string {
  return format(parseISO(dateISO), 'MMMM do, yyyy')
}

export function formatDateISO(date: string): string {
  return formatISO(parseISO(date), {
    representation: 'date',
  })
}
