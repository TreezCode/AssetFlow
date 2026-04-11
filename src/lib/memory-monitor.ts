export interface MemoryInfo {
  totalSize: number
  imageCount: number
  estimatedMemoryUsage: number
  isNearLimit: boolean
  warningMessage?: string
}

const MEMORY_WARNING_THRESHOLD = 0.75
const ESTIMATED_OVERHEAD_PER_IMAGE = 1.5

export function estimateMemoryUsage(files: File[]): number {
  const totalFileSize = files.reduce((sum, file) => sum + file.size, 0)
  return totalFileSize * ESTIMATED_OVERHEAD_PER_IMAGE
}

export function checkMemoryStatus(files: File[]): MemoryInfo {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  const estimatedMemoryUsage = estimateMemoryUsage(files)
  
  const memoryInfo: MemoryInfo = {
    totalSize,
    imageCount: files.length,
    estimatedMemoryUsage,
    isNearLimit: false,
  }

  if ('memory' in performance && (performance as unknown as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory) {
    const memory = (performance as unknown as { memory: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory
    const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit
    
    if (usageRatio > MEMORY_WARNING_THRESHOLD) {
      memoryInfo.isNearLimit = true
      memoryInfo.warningMessage = `High memory usage detected (${Math.round(usageRatio * 100)}%). Consider exporting and starting fresh.`
    }
  }

  return memoryInfo
}

export function revokeObjectURLs(urls: string[]): void {
  urls.forEach((url) => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })
}

export function cleanupThumbnails(images: Array<{ thumbnail: string }>): void {
  const blobUrls = images
    .map((img) => img.thumbnail)
    .filter((url) => url.startsWith('blob:'))
  
  revokeObjectURLs(blobUrls)
}
