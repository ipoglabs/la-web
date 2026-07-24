// app/api/check-payment-status/route.ts
// Polled by ScanPayPanel every 3 seconds to detect payment completion.
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia',
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const paymentIntentId = searchParams.get('paymentIntentId')

  if (!paymentIntentId) {
    return NextResponse.json({ error: 'Missing paymentIntentId' }, { status: 400 })
  }

  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return NextResponse.json({ status: intent.status })
    // Possible statuses: requires_payment_method | requires_confirmation |
    //   requires_action | processing | requires_capture | canceled | succeeded
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}