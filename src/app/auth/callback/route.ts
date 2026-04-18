import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin, hostname } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('redirectTo') ?? '/dashboard'

  const isLocalEnv = process.env.NODE_ENV === 'development'
  const expectedSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1'

  // Guard: in production we should never land on localhost. This happens when
  // Supabase's Site URL / Redirect URLs allowlist is misconfigured and Supabase
  // falls back to the Site URL instead of honoring our `redirectTo`.
  if (!isLocalEnv && isLocalHost) {
    console.error(
      '[auth/callback] Received callback on localhost in production. ' +
        'Check Supabase Dashboard → Authentication → URL Configuration ' +
        '(Site URL + Redirect URLs allowlist).',
      { url: request.url, expectedSiteUrl }
    )
    if (expectedSiteUrl) {
      const forwarded = new URL(request.url)
      forwarded.protocol = 'https:'
      forwarded.host = new URL(expectedSiteUrl).host
      return NextResponse.redirect(forwarded.toString())
    }
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (expectedSiteUrl) {
        return NextResponse.redirect(`${expectedSiteUrl}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  const errorBase = !isLocalEnv && expectedSiteUrl ? expectedSiteUrl : origin
  return NextResponse.redirect(`${errorBase}/auth/auth-code-error`)
}
