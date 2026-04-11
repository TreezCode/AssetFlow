import JSZip from 'jszip'
import { AssetImage } from '@/types'

export async function exportAsZip(
  images: AssetImage[],
  getFilename: (image: AssetImage) => string,
  onProgress?: (percent: number) => void
): Promise<void> {
  const zip = new JSZip()

  for (const image of images) {
    const filename = getFilename(image)
    const arrayBuffer = await image.file.arrayBuffer()
    zip.file(filename, arrayBuffer)
  }

  const blob = await zip.generateAsync(
    { type: 'blob' },
    (metadata) => {
      onProgress?.(metadata.percent)
    }
  )

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'assetflow-export.zip'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
