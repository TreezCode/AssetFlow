'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const navLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isLanding = pathname === '/'

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isLanding && href.startsWith('#')) {
      e.preventDefault()
      const id = href.replace('#', '')
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-[#915eff] to-[#00d4ff] bg-clip-text text-transparent">
              AssetFlow
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={isLanding ? link.href : `/${link.href}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm font-medium text-gray-400 hover:text-[#00d4ff] transition-colors duration-300"
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/app"
                className="text-sm font-medium text-gray-400 hover:text-[#00d4ff] transition-colors duration-300"
              >
                App
              </Link>
            </li>
          </ul>

          <div className="hidden md:block">
            <Link href="/app">
              <Button variant="primary" size="sm">
                Try It Free
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg border border-white/10 hover:border-[#915eff] transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/10 bg-[#0a0a0a]/98 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={isLanding ? link.href : `/${link.href}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block text-sm font-medium text-gray-400 hover:text-[#00d4ff] transition-colors duration-300 py-2"
                >
                  {link.name}
                </a>
              ))}
              <Link
                href="/app"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-medium text-gray-400 hover:text-[#00d4ff] transition-colors duration-300 py-2"
              >
                App
              </Link>
              <div className="pt-2">
                <Link href="/app" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Try It Free
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
