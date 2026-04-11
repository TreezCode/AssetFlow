'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { landingCopy } from '@/lib/landing-copy'

export function Problem() {
  const { heading, messyFiles, painPoints, punchline } = landingCopy.problem

  return (
    <section className="py-16 sm:py-20 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-12 font-[family-name:var(--font-space-grotesk)]"
        >
          {heading}
        </motion.h2>

        {/* Messy Files Code Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="bg-black/40 backdrop-blur-sm border border-error/30 rounded-xl p-6 font-mono text-sm">
            {messyFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-gray-400 py-2"
              >
                <X className="w-4 h-4 text-error flex-shrink-0" />
                <span>{file}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pain Points Grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto mb-12"
        >
          {painPoints.map((pain) => (
            <motion.div
              key={pain}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
              className="flex items-start gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4"
            >
              <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">{pain}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Punchline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl sm:text-2xl text-center text-white font-medium max-w-2xl mx-auto"
        >
          {punchline}
        </motion.p>
      </div>
    </section>
  )
}
