import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Hero } from '@/components/landing/Hero'
import { Problem } from '@/components/landing/Problem'

// Lazy load below-the-fold sections for better mobile performance
const Solution = dynamic(() => import('@/components/landing/Solution').then(mod => ({ default: mod.Solution })), {
  loading: () => <div className="h-screen" />
})
const HowItWorks = dynamic(() => import('@/components/landing/HowItWorks').then(mod => ({ default: mod.HowItWorks })), {
  loading: () => <div className="h-screen" />
})
const Features = dynamic(() => import('@/components/landing/Features').then(mod => ({ default: mod.Features })), {
  loading: () => <div className="h-screen" />
})
const Audience = dynamic(() => import('@/components/landing/Audience').then(mod => ({ default: mod.Audience })), {
  loading: () => <div className="h-screen" />
})
const Pricing = dynamic(() => import('@/components/landing/Pricing').then(mod => ({ default: mod.Pricing })), {
  loading: () => <div className="h-screen" />
})
const CallToAction = dynamic(() => import('@/components/landing/CallToAction').then(mod => ({ default: mod.CallToAction })), {
  loading: () => <div className="h-screen" />
})
const ScrollHandler = dynamic(() => import('@/components/landing/ScrollHandler').then(mod => ({ default: mod.ScrollHandler })))

export default function LandingPage() {
  return (
    <div className="w-full overflow-x-hidden">
      <Suspense fallback={null}>
        <ScrollHandler />
      </Suspense>
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Features />
      <Audience />
      <Pricing />
      <CallToAction />
    </div>
  )
}
