// app/api/confirm-upi-intent/route.ts
//
// Confirms a UPI PaymentIntent and returns the UPI deep link / QR data.
// The client converts the upiLink into a QR code (using qrcode npm package).
//
// UPI collect flow:
//   1. Create PaymentIntent with payment_method_types: ['upi']  ← done in create-qr-payment
//   2. Confirm with a UPI payment method → Stripe returns next_action.upi_await_notification
//      which contains a hosted_voucher_url or upi_qr_code
//
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia',
})

export async function POST(req: Request) {
  try {
    const { paymentIntentId } = await req.json()
    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Missing paymentIntentId' }, { status: 400 })
    }

    // Create a UPI payment method (collect flow — no VPA required upfront)
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'upi',
    } as any)

    const confirmed = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethod.id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/donate/status`,
    } as any)

    const nextAction = (confirmed as any).next_action

    // Stripe may return:
    //   next_action.type === 'upi_await_notification'
    //     → next_action.upi_await_notification.upi_qr_code (base64 PNG)
    //   next_action.type === 'display_bank_transfer_instructions'
    //   next_action.redirect_to_url.url  (hosted page with QR)

    let upiLink: string | null = null
    let qrImageBase64: string | null = null

    if (nextAction?.type === 'upi_await_notification') {
      upiLink = nextAction.upi_await_notification?.upi_qr_code ?? null
      // upi_qr_code is the raw UPI URI (upi://pay?pa=...&am=...) — convert to QR on client
    } else if (nextAction?.redirect_to_url?.url) {
      upiLink = nextAction.redirect_to_url.url
    }

    if (!upiLink) {
      return NextResponse.json(
        { error: 'Stripe did not return a UPI QR. Ensure UPI is enabled for your IN Stripe account.' },
        { status: 422 }
      )
    }

    return NextResponse.json({
      upiLink,
      qrImageBase64,   // null unless Stripe returns pre-rendered PNG
      status: confirmed.status,
    })
  } catch (err: any) {
    console.error('UPI confirm error:', err)
    return NextResponse.json({ error: err.message || 'UPI confirmation failed' }, { status: 500 })
  }
}