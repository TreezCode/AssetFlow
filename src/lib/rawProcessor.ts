import { parse } from 'exifr'
import { RAW_FILE_EXTENSIONS } from './constants'

/**
 * Check if a file is a RAW image format
 */
export function isRawFile(filename: string): boolean {
  const ext = filename.toLowerCase().match(/\.[^.]+$/)?.[0]
  return ext ? (RAW_FILE_EXTENSIONS as readonly string[]).includes(ext) : false
}

/**
 * Extract embedded JPEG preview from RAW file
 * Most RAW files contain a full-size JPEG preview that we can use
 */
export async function extractRawPreview(file: File): Promise<string | null> {
  try {
    // Try to parse EXIF data and extract thumbnail
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exif: any = await parse(file, {
      tiff: false,
      xmp: false,
      icc: false,
      iptc: false,
      jfif: false,
      ihdr: false,
      mergeOutput: false,
    } as any)

    // If thumbnail is available, convert to data URL
    if (exif && exif.thumbnail) {
      // exifr returns thumbnail as base64 or buffer
      if (typeof exif.thumbnail === 'string') {
        // Already base64
        return `data:image/jpeg;base64,${exif.thumbnail}`
      } else if (exif.thumbnail instanceof ArrayBuffer || exif.thumbnail instanceof Uint8Array) {
        // Convert buffer to base64
        const uint8Array = exif.thumbnail instanceof Uint8Array 
          ? exif.thumbnail 
          : new Uint8Array(exif.thumbnail)
        
        const base64 = btoa(
          (Array.from(uint8Array) as number[])
            .map(byte => String.fromCharCode(byte))
            .join('')
        )
        return `data:image/jpeg;base64,${base64}`
      }
    }

    // Fallback: try to read as blob (some RAW files might work)
    return URL.createObjectURL(file)
  } catch (error) {
    console.warn('Failed to extract RAW preview:', error)
    // Return null to indicate preview extraction failed
    return null
  }
}

/**
 * Get file extension including the dot
 */
export function getFileExtension(filename: string): string {
  const match = filename.match(/\.[^.]+$/)
  return match ? match[0] : ''
}
