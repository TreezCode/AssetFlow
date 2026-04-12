'use client'

import { motion } from 'framer-motion'
import { Upload, Layers, Download } from 'lucide-react'
import { landingCopy } from '@/lib/landing-copy'

const icons = {
  Upload,
  Label: Layers,
  Download,
}

export function HowItWorks() {
  const { heading, subheading, steps } = landingCopy.howItWorks

  return (
    <section id="how-it-works" className="py-16 sm:py-20 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-display">
            {heading}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            {subheading}
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative"
        >
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

          {steps.map((step) => {
            const Icon = icons[step.title as keyof typeof icons]
            return (
              <motion.div
                key={step.number}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step Number */}
                <div className="text-6xl sm:text-7xl font-bold bg-linear-to-r from-treez-purple to-treez-cyan bg-clip-text text-transparent mb-6 font-display">
                  {step.number}
                </div>

                {/* Icon Card */}
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-6 hover:bg-white/10 hover:border-treez-purple/30 hover:shadow-lg hover:shadow-treez-purple/20 transition-all duration-300 group">
                  <Icon className="w-12 h-12 text-treez-cyan group-hover:text-treez-purple transition-colors duration-300" />
                </div>

                {/* Title & Description */}
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-400 max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
