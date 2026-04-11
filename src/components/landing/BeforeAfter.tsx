'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const beforeExamples = [
  'IMG_2045.jpg',
  'DSC_0892.png',
  'photo (3).jpeg',
  '20240115_143022.jpg',
]

const afterExamples = [
  '63755-front.jpg',
  '63755-rear.png',
  '63755-zoom1.jpeg',
  '63755-diag1.jpg',
]

export function BeforeAfter() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex-1 w-full md:w-auto"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-error/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-error" />
            <span className="text-sm font-semibold text-error">Before</span>
          </div>
          <div className="space-y-2">
            {beforeExamples.map((filename, i) => (
              <div
                key={i}
                className="font-mono text-sm text-gray-400 bg-error/5 px-3 py-2 rounded border border-error/10"
              >
                {filename}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="flex items-center justify-center">
        <ArrowRight className="w-8 h-8 text-[#00d4ff] hidden md:block" />
        <ArrowRight className="w-6 h-6 text-[#00d4ff] md:hidden rotate-90" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex-1 w-full md:w-auto"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-success/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-sm font-semibold text-success">After</span>
          </div>
          <div className="space-y-2">
            {afterExamples.map((filename, i) => (
              <div
                key={i}
                className="font-mono text-sm text-white bg-success/5 px-3 py-2 rounded border border-success/10"
              >
                {filename}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
