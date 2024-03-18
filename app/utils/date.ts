export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(
    typeof date === 'string' ? new Date(date) : date,
  )
}

export function formatDateISO(date: string | Date): string {
  return typeof date === 'string' ? date : date.toISOString().split('T')[0]
}
