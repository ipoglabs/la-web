// Save this as: app/api/webhooks/razorpay/route.ts
// Recommended (not strictly required): client-side polling stops if the user
// closes the tab mid-payment. Webhooks make sure the donation still gets
// marked as paid in your database even then.

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const rawBody = await req.text() // must use the RAW body for signature verification
  const signature = req.headers.get('x-razorpay-signature') || ''

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex')

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(rawBody)

  if (event.event === 'qr_code.credited' || event.event === 'payment.captured') {
    const payment = event.payload?.payment?.entity
    if (payment) {
      // TODO: look up your donation record (e.g. via payment.notes.email / donationId)
      // and mark it complete here, the same way handleSuccess() does on the client.
      console.log('Razorpay payment captured:', payment.id, payment.amount, payment.vpa)
    }
  }

  return NextResponse.json({ status: 'ok' })
}