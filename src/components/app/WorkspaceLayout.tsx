'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { WorkspaceSidebar } from './WorkspaceSidebar'

const SIDEBAR_EXPANDED = 256
const SIDEBAR_COLLAPSED = 64
const EASE = [0.4, 0, 0.2, 1] as const

interface WorkspaceLayoutProps {
  children: ReactNode
  user: { id: string; email: string; full_name?: string } | null
}

export function WorkspaceLayout({ children, user }: WorkspaceLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('sidebar-collapsed') === 'true'
  })

  function toggleSidebar() {
    const next = !isCollapsed
    setIsCollapsed(next)
    localStorage.setItem('sidebar-collapsed', String(next))
  }

  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED

  return (
    <div className="min-h-screen bg-deep-space text-white overflow-x-hidden">
      <div className="flex">

        {/* ── Desktop Sidebar ── */}
        <motion.aside
          animate={{ width: sidebarWidth }}
          transition={{ duration: 0.3, ease: EASE }}
          className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-30
            bg-white/3 backdrop-blur-xl border-r border-white/10 overflow-hidden"
        >
          <WorkspaceSidebar
            user={user}
            isCollapsed={isCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        </motion.aside>

        {/* ── Main Content (Desktop) ── */}
        <motion.div
          animate={{ paddingLeft: sidebarWidth }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex-1 min-w-0 w-full hidden lg:block"
        >
          <main className="min-h-screen">{children}</main>
        </motion.div>

        {/* ── Mobile ── */}
        <div className="flex-1 min-w-0 w-full lg:hidden">
          {/* Mobile Header */}
          <header className="sticky top-0 z-40 bg-deep-space/95 backdrop-blur-xl border-b border-white/10">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
              <Link href="/" className="flex items-center gap-2 cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/logo-icon.webp" alt="Renamerly" className="h-9 w-auto" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/logo-name.webp" alt="" aria-hidden="true" className="h-5 w-auto" />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg border border-white/10 hover:border-treez-purple transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </header>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="fixed inset-y-0 left-0 z-50 w-72 bg-deep-space border-r border-white/10
                    flex flex-col overflow-y-auto"
                >
                  <WorkspaceSidebar
                    user={user}
                    isCollapsed={false}
                    onToggleCollapse={() => setIsMobileMenuOpen(false)}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Mobile Content */}
          <main className="min-h-screen">{children}</main>
        </div>

      </div>
    </div>
  )
}
