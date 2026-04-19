declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function gtagEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params ?? {})
  }
}
