import { Hero } from '@/components/landing/Hero'
import { Problem } from '@/components/landing/Problem'
import { Solution } from '@/components/landing/Solution'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Features } from '@/components/landing/Features'
import { Audience } from '@/components/landing/Audience'
import { Pricing } from '@/components/landing/Pricing'
import { CallToAction } from '@/components/landing/CallToAction'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Features />
      <Audience />
      <Pricing />
      <CallToAction />
    </>
  )
}
