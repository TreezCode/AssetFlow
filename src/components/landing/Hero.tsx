'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { landingCopy } from '@/lib/landing-copy'

export function Hero() {
  const handleScrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Subtle sacred geometry background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#915eff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4ff]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto space-y-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="w-2 h-2 rounded-full bg-[#00d4ff]" />
            <span className="text-sm font-medium text-gray-300">
              {landingCopy.hero.badge}
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight font-[family-name:var(--font-space-grotesk)]"
        >
          <span className="bg-gradient-to-r from-[#915eff] via-[#00d4ff] to-[#ff6b9d] bg-clip-text text-transparent">
            {landingCopy.hero.headline}
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto"
        >
          {landingCopy.hero.subheadline}
        </motion.p>

        {/* Value Bullets */}
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-3 max-w-2xl mx-auto text-left"
        >
          {landingCopy.hero.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">{bullet}</span>
            </li>
          ))}
        </motion.ul>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/app">
              <Button variant="primary" size="lg" className="gap-2">
                {landingCopy.hero.primaryCta}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="secondary" size="lg" onClick={handleScrollToPricing}>
              {landingCopy.hero.secondaryCta}
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            {landingCopy.hero.reinforcement}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
