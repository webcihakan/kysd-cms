export function formatDate(dateString, options = {}) {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  })
}

export function formatDateTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function truncateText(text, length = 100) {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

export function getImageUrl(path) {
  if (!path) return '/placeholder.jpg'
  if (path.startsWith('http')) return path
  const baseUrl = import.meta.env.VITE_UPLOADS_URL || ''
  return `${baseUrl}${path}`
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Baş harf büyük, gerisi küçük
export function capitalizeFirst(text) {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// Her kelimenin baş harfi büyük (Title Case)
export function toTitleCase(text) {
  if (!text) return ''
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
