'use client'

import { motion } from 'framer-motion'
import { landingCopy } from '@/lib/landing-copy'
import { BeforeAfter } from './BeforeAfter'

export function Solution() {
  const { heading, body, reinforcement } = landingCopy.solution

  return (
    <section className="py-16 sm:py-20 md:py-28 lg:py-32 bg-deep-space/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-6 font-display"
        >
          {heading}
        </motion.h2>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-300 text-center mb-4 max-w-2xl mx-auto"
        >
          {body}
        </motion.p>

        {/* Reinforcement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg text-gray-400 text-center mb-16 max-w-xl mx-auto"
        >
          {reinforcement}
        </motion.p>

        {/* BeforeAfter Transformation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <BeforeAfter />
        </motion.div>
      </div>
    </section>
  )
}
