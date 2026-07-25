// app/api/check-payment-status/route.ts
// Polled by ScanPayPanel every 3 seconds to detect payment completion.
import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const paymentIntentId = searchParams.get('paymentIntentId')

  if (!paymentIntentId) {
    return NextResponse.json({ error: 'Missing paymentIntentId' }, { status: 400 })
  }

  try {
    const intent = await getStripe().paymentIntents.retrieve(paymentIntentId)
    return NextResponse.json({ status: intent.status })
    // Possible statuses: requires_payment_method | requires_confirmation |
    //   requires_action | processing | requires_capture | canceled | succeeded
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}