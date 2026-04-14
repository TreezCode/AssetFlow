// Supabase Edge Function for handling Stripe webhooks
// Based on: https://supabase.com/docs/guides/functions/examples/stripe-webhooks

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2024-11-20.acacia',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

console.log('Stripe webhook handler initialized')

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  // Verify webhook signature
  const body = await req.text()
  let event: Stripe.Event

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      undefined,
      cryptoProvider
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  console.log(`🔔 Event received: ${event.type}`)

  // Initialize Supabase client with service role (bypasses RLS)
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  // Handle subscription events
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get Supabase user ID from Stripe customer metadata
        const customer = await stripe.customers.retrieve(customerId)
        const userId = (customer as Stripe.Customer).metadata.supabase_user_id

        if (!userId) {
          console.error('No supabase_user_id in customer metadata')
          break
        }

        // Update subscription tier
        const tier = subscription.status === 'active' ? 'pro' : 'free'
        console.log(`Updating user ${userId} to tier: ${tier}`)

        const { data: profileData, error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .update({ subscription_tier: tier })
          .eq('id', userId)
          .select()

        if (profileError) {
          console.error('Failed to update user profile:', profileError)
          throw profileError
        } else {
          console.log('✅ Profile updated successfully:', profileData)
        }

        // Log subscription event
        const { data: eventData, error: eventError } = await supabaseAdmin
          .from('subscription_events')
          .insert({
            user_id: userId,
            event_type:
              event.type === 'customer.subscription.created'
                ? 'subscribed'
                : subscription.status === 'active'
                ? 'renewed'
                : 'downgraded',
            stripe_subscription_id: subscription.id,
            metadata: {
              status: subscription.status,
            },
          })
          .select()

        if (eventError) {
          console.error('Failed to log subscription event:', eventError)
        } else {
          console.log('✅ Subscription event logged:', eventData)
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const customer = await stripe.customers.retrieve(customerId)
        const userId = (customer as Stripe.Customer).metadata.supabase_user_id

        if (!userId) {
          console.error('No supabase_user_id in customer metadata')
          break
        }

        // Downgrade to free tier
        console.log(`Downgrading user ${userId} to free tier`)

        const { data: profileData, error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .update({ subscription_tier: 'free' })
          .eq('id', userId)
          .select()

        if (profileError) {
          console.error('Failed to downgrade user profile:', profileError)
          throw profileError
        } else {
          console.log('✅ Profile downgraded successfully:', profileData)
        }

        // Log cancellation event
        const { data: eventData, error: eventError } = await supabaseAdmin
          .from('subscription_events')
          .insert({
            user_id: userId,
            event_type: 'canceled',
            stripe_subscription_id: subscription.id,
            metadata: {
              canceled_at: subscription.canceled_at,
              ended_at: subscription.ended_at,
            },
          })
          .select()

        if (eventError) {
          console.error('Failed to log cancellation event:', eventError)
        } else {
          console.log('✅ Cancellation event logged:', eventData)
        }

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
