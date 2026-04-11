import { useEffect, useRef } from 'react'

const SCROLL_ZONE_SIZE = 100
const SCROLL_SPEED = 10

export function useDragScroll(isDragging: boolean) {
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isDragging) {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
        scrollIntervalRef.current = null
      }
      return
    }

    const handleDragMove = (e: DragEvent) => {
      const viewportHeight = window.innerHeight
      const mouseY = e.clientY

      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
        scrollIntervalRef.current = null
      }

      if (mouseY < SCROLL_ZONE_SIZE) {
        scrollIntervalRef.current = setInterval(() => {
          window.scrollBy({ top: -SCROLL_SPEED, behavior: 'auto' })
        }, 16)
      } else if (mouseY > viewportHeight - SCROLL_ZONE_SIZE) {
        scrollIntervalRef.current = setInterval(() => {
          window.scrollBy({ top: SCROLL_SPEED, behavior: 'auto' })
        }, 16)
      }
    }

    const handleDragEnd = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
        scrollIntervalRef.current = null
      }
    }

    document.addEventListener('drag', handleDragMove)
    document.addEventListener('dragend', handleDragEnd)

    return () => {
      document.removeEventListener('drag', handleDragMove)
      document.removeEventListener('dragend', handleDragEnd)
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
      }
    }
  }, [isDragging])
}
