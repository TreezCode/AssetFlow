export const APP_NAME = 'AssetFlow'

export const MAX_FREE_IMAGES = 20

export const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
} as const

export const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

export const FILENAME_REGEX = /[^a-z0-9-]/g

export const DEFAULT_DESCRIPTORS = [
  { value: 'front', label: 'Front' },
  { value: 'diag1', label: 'Diagonal 1' },
  { value: 'diag2', label: 'Diagonal 2' },
  { value: 'rear', label: 'Rear' },
  { value: 'zoom1', label: 'Zoom 1' },
  { value: 'zoom2', label: 'Zoom 2' },
  { value: 'folded', label: 'Folded' },
  { value: 'tape', label: 'Tape' },
  { value: 'tag', label: 'Tag' },
  { value: 'thickness', label: 'Thickness' },
  { value: 'topdown', label: 'Top Down' },
  { value: 'custom', label: 'Custom' },
] as const

export const THUMBNAIL_MAX_SIZE = 200
