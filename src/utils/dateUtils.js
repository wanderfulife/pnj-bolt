import { format, formatDistance } from 'date-fns'

export function formatMessageTime(date) {
  return format(new Date(date), 'HH:mm')
}

export function formatRelativeTime(date) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

export function formatTimestamp(date) {
  const now = new Date()
  const messageDate = new Date(date)
  
  if (isSameDay(now, messageDate)) {
    return format(messageDate, 'HH:mm')
  }
  return format(messageDate, 'dd/MM/yyyy')
}