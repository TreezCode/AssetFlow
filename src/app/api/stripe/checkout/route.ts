import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'
import { STRIPE_CONFIG } from '@/lib/stripe/config'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile to check for existing Stripe customer
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })

      customerId = customer.id

      // Update profile with Stripe customer ID
      await supabase
        .from('user_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    } else {
      // Guard against duplicate subscriptions. A customer that already exists
      // in Stripe may already have an active sub — double-clicking Upgrade,
      // manually POSTing the route, or hitting this page from a stale tab
      // would otherwise create a second subscription and double-charge.
      //
      // Statuses we block:
      //   - active        → paying right now
      //   - trialing      → in a free trial
      //   - past_due      → payment failed; they should fix their card, not re-subscribe
      //   - unpaid        → same, further into dunning
      //
      // Statuses we allow (user SHOULD be able to re-subscribe):
      //   - canceled, incomplete, incomplete_expired, paused
      //
      // Supabase's user_profiles.subscription_tier can be stale (webhook
      // latency), so we check Stripe directly as the source of truth.
      const existing = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        limit: 10,
      })

      const BLOCKING_STATUSES = new Set([
        'active',
        'trialing',
        'past_due',
        'unpaid',
      ])
      const hasActive = existing.data.some((sub) =>
        BLOCKING_STATUSES.has(sub.status)
      )

      if (hasActive) {
        return NextResponse.json(
          {
            error:
              'You already have an active subscription. Manage it from your billing page.',
            code: 'already_subscribed',
          },
          { status: 409 }
        )
      }
    }

    // Get origin for redirect URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_CONFIG.plans.pro.priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}${STRIPE_CONFIG.urls.success}`,
      cancel_url: `${origin}${STRIPE_CONFIG.urls.cancel}`,
      metadata: {
        supabase_user_id: user.id,
      },
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
