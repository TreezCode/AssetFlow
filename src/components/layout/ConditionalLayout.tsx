'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

/**
 * Conditionally shows Header/Footer based on route
 * Dashboard routes use their own layout, so we hide the global Header/Footer
 */
export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Hide Header/Footer on dashboard and workspace routes — they manage their own layout
  const isDashboard = pathname?.startsWith('/dashboard')
  const isWorkspace = pathname?.startsWith('/app')

  if (isDashboard || isWorkspace) {
    return <main id="main-content" className="flex-1">{children}</main>
  }
  
  // Marketing/app routes show Header and Footer
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 pt-16">{children}</main>
      <Footer />
    </>
  )
}
