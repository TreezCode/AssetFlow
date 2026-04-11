'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { landingCopy } from '@/lib/landing-copy'

export function Pricing() {
  const { heading, subheading, reinforcement, tiers } = landingCopy.pricing
  const tierData = [
    {
      ...tiers.free,
      ctaLink: '/app',
      highlighted: false,
    },
    {
      ...tiers.pro,
      ctaLink: null,
      highlighted: true,
    },
  ]

  return (
    <section id="pricing" className="py-16 sm:py-20 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-[family-name:var(--font-space-grotesk)]">
            {heading}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            {subheading}
          </p>
        </motion.div>

        {/* Pricing Cards */}
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
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {tierData.map((tier) => (
            <motion.div
              key={tier.name}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                show: { opacity: 1, scale: 1 },
              }}
              className={`relative bg-white/5 backdrop-blur-xl border rounded-xl p-8 transition-all duration-300 ${
                tier.highlighted
                  ? 'border-[#915eff] shadow-xl shadow-[#915eff]/20 md:scale-105'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Badge */}
              {'badge' in tier && tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#915eff] to-[#ff6b9d] text-white text-sm font-semibold">
                  {tier.badge}
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold text-white">{tier.price}</span>
                  {'priceSubtext' in tier && tier.priceSubtext && (
                    <span className="text-gray-400">{tier.priceSubtext}</span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{tier.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-auto">
                {tier.ctaLink ? (
                  <Link href={tier.ctaLink} className="block">
                    <Button
                      variant={tier.highlighted ? 'primary' : 'secondary'}
                      size="lg"
                      className="w-full"
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant={tier.highlighted ? 'primary' : 'secondary'}
                    size="lg"
                    className="w-full"
                    disabled
                  >
                    {tier.cta}
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Reinforcement Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center text-base text-gray-400 mt-12"
        >
          {reinforcement}
        </motion.p>
      </div>
    </section>
  )
}
