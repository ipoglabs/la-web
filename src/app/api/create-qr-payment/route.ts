// app/api/create-qr-payment/route.ts
import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import { getOrCreateRazorpayCustomer } from '@/lib/rzpcustomer'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

export async function POST(req: Request) {
  try {
    const { amount, country, donorName, email, donorMessage } = await req.json()

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }
    if (!['SG', 'IN', 'GB'].includes(country)) {
      return NextResponse.json({ error: 'Unsupported country for QR payment' }, { status: 400 })
    }

    const amountInSmallestUnit = Math.round(amount * 100)

    // ── Singapore: Stripe Payment Link QR (SGD) ──────────────────────────────
    if (country === 'SG') {
      const product = await stripe.products.create({
        name: `Lokalads Donation — ${donorName || 'Anonymous'}`,
      })
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: amountInSmallestUnit,
        currency: 'sgd',
      })
      const link = await stripe.paymentLinks.create({
        line_items: [{ price: price.id, quantity: 1 }],
        metadata: { donorName: donorName || 'Anonymous', email: email || '', country: 'SG' },
        after_completion: {
          type: 'redirect',
          redirect: { url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/donate/status` },
        },
      })
      return NextResponse.json({ method: 'payment_link', paymentLinkUrl: link.url, paymentLinkId: link.id })
    }

    // ── India: Razorpay UPI QR ────────────────────────────────────────────────
    if (country === 'IN') {
      const description = donorMessage?.trim()
        ? `Donation Lokalads - ${donorMessage.trim()}`
        : 'Donation Lokalads'

      // Get or create Razorpay customer (populates "Customer detail" in dashboard)
      const customerId = email
        ? await getOrCreateRazorpayCustomer(email, donorName || '')
        : undefined

      const qrPayload: Parameters<typeof razorpay.qrCode.create>[0] = {
        type:           'upi_qr',
        name:           `Donation-${Date.now()}`,
        usage:          'single_use',
        fixed_amount:   true,
        payment_amount: amountInSmallestUnit,
        description,
        close_by: Math.floor(Date.now() / 1000) + 15 * 60,
        notes: {
          donor_name:    donorName           || '',
          donor_email:   email               || '',
          donor_message: donorMessage?.trim() || '',
          description,
        },
        ...(customerId && { customer_id: customerId }),
      }

      const qrCode = await razorpay.qrCode.create(qrPayload)

      return NextResponse.json({
        method:     'razorpay_qr',
        qrCodeId:   qrCode.id,
        qrImageUrl: qrCode.image_url,
        closeBy:    qrCode.close_by,
      })
    }

    // ── UK: Stripe Payment Link QR (GBP) ─────────────────────────────────────
    if (country === 'GB') {
      const product = await stripe.products.create({
        name: `Lokalads Donation — ${donorName || 'Anonymous'}`,
      })
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: amountInSmallestUnit,
        currency: 'gbp',
      })
      const link = await stripe.paymentLinks.create({
        line_items: [{ price: price.id, quantity: 1 }],
        metadata: { donorName: donorName || 'Anonymous', email: email || '', country: 'GB' },
        after_completion: {
          type: 'redirect',
          redirect: { url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/donate/status` },
        },
      })
      return NextResponse.json({ method: 'payment_link', paymentLinkUrl: link.url, paymentLinkId: link.id })
    }
  } catch (err: any) {
    console.error('QR payment error:', err)
    const status = err?.statusCode === 401 ? 401 : 500
    return NextResponse.json(
      { error: err?.error?.description || err.message || 'QR payment creation failed' },
      { status }
    )
  }
}