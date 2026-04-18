import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { WorkspaceLayout } from '@/components/app/WorkspaceLayout'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'

export const metadata: Metadata = {
  title: 'Workspace — Rename Your Product Images',
  description:
    'Upload, batch rename, and export product images with SEO-friendly filenames. Works with Shopify, Etsy, and Amazon image requirements.',
  alternates: {
    canonical: '/app',
  },
  openGraph: {
    title: 'Renamerly Workspace',
    description: 'Batch rename product images with SEO-friendly filenames.',
    url: '/app',
    type: 'website',
  },
}

export default async function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userInfo: { id: string; email: string; full_name?: string } | null = null

  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    userInfo = {
      id: user.id,
      email: user.email || '',
      full_name: profile?.full_name || undefined,
    }
  }

  return (
    <SubscriptionProvider>
      <WorkspaceLayout user={userInfo}>{children}</WorkspaceLayout>
    </SubscriptionProvider>
  )
}
