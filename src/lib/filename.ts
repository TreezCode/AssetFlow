import { FILENAME_REGEX } from '@/lib/constants'

const MAX_FILENAME_LENGTH = 100

export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return ''

  let sanitized = input
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(FILENAME_REGEX, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')

  if (sanitized.length > MAX_FILENAME_LENGTH) {
    sanitized = sanitized.slice(0, MAX_FILENAME_LENGTH).replace(/-+$/, '')
  }

  return sanitized
}

export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  if (lastDot === -1 || lastDot === filename.length - 1) return ''
  return filename.slice(lastDot).toLowerCase()
}

export function generateFilename(
  sku: string,
  descriptor: string,
  originalFilename: string
): string {
  const sanitizedSku = sanitizeString(sku)
  const sanitizedDescriptor = sanitizeString(descriptor)
  const extension = getFileExtension(originalFilename)

  if (!sanitizedSku || !sanitizedDescriptor) return ''

  return `${sanitizedSku}-${sanitizedDescriptor}${extension}`
}

export function isFilenameComplete(sku: string, descriptor: string): boolean {
  return sanitizeString(sku).length > 0 && sanitizeString(descriptor).length > 0
}
