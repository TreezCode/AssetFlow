import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist. Head back to Renamerly to rename your product images.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-deep-space text-white px-6 py-24">
      <div className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-treez-purple mb-4">
          404
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold font-display mb-4">
          Page not found
        </h1>
        <p className="text-gray-400 text-base sm:text-lg mb-10">
          The page you are looking for does not exist or has been moved. Let&apos;s get you
          back to something useful.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button variant="primary" size="lg">
              Back to Home
            </Button>
          </Link>
          <Link href="/app">
            <Button variant="secondary" size="lg">
              Open Workspace
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
