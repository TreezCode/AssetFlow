'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { landingCopy } from '@/lib/landing-copy'

export function CallToAction() {
  const { heading, subheading, primaryCta } = landingCopy.finalCta

  return (
    <section className="py-16 sm:py-20 md:py-28 lg:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-deep-space via-cosmic-gray/30 to-deep-space pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#915eff10_1px,transparent_1px),linear-gradient(to_bottom,#915eff10_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12 md:p-16"
        >
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-display">
            {heading}
          </h2>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            {subheading}
          </p>

          {/* CTA */}
          <Link href="/app">
            <Button variant="primary" size="lg" className="gap-2">
              {primaryCta}
              <ArrowRight className="w-5 h-5 shrink-0" />
            </Button>
          </Link>

          {/* Decorative border */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-treez-purple to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}
