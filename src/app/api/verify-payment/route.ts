// app/api/verify-payment/route.ts
//
// Verifies the Razorpay checkout signature after a successful payment on
// the Wallet Pay / Card Pay tabs (India only — see RazorpayCheckoutButton).
//
// Razorpay's signature scheme: HMAC-SHA256 of "{order_id}|{payment_id}"
// using your RAZORPAY_KEY_SECRET. If it matches, the payment is genuine.

import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Missing Razorpay env vars')
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    const isValid = expectedSignature === razorpay_signature

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
    }

    // TODO: look up your donation record by order_id (e.g. stored in
    // metadata/notes when the order was created) and mark it complete here,
    // the same way handleSuccess() does on the client.

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Razorpay verify-payment error:', err)
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 })
  }
}