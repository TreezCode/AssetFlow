import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Pricing — Free & Pro Plans',
  description:
    'Simple, transparent pricing for Renamerly. Start free with 20 images per session, or upgrade to Pro for unlimited batch renaming, RAW processing, and AI descriptor suggestions.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Renamerly Pricing — Free & Pro Plans',
    description:
      'Start free, upgrade to Pro for unlimited batch image renaming, RAW processing, and AI suggestions. No hidden fees.',
    url: '/pricing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Renamerly Pricing — Free & Pro Plans',
    description:
      'Start free, upgrade to Pro for unlimited batch image renaming, RAW processing, and AI suggestions.',
  },
}

export default function PricingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
