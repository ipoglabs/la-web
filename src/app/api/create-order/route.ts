// app/api/create-order/route.ts
import { NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import { getOrCreateRazorpayCustomer } from '@/lib/rzpcustomer'
import type { Orders } from 'razorpay/dist/types/orders'

export async function POST(req: Request) {
  try {
    const {
      amount,
      currency = 'INR',
      receipt,
      donorName,
      donorEmail,
      donorMessage,
    } = await req.json()

    // Enforce a sane minimum in rupees *before* hitting Razorpay, so testers
    // get a clear message instead of Razorpay's cryptic minimum-amount error.
    // (Razorpay's own floor is ₹1 / 100 paise; we set ₹10 for INR test traffic.)
    const MIN_AMOUNT_RUPEES = currency.toUpperCase() === 'INR' ? 10 : 1
    if (!amount || amount < MIN_AMOUNT_RUPEES) {
      return NextResponse.json(
        {
          error: `Minimum donation amount is ${
            currency.toUpperCase() === 'INR' ? '₹' : ''
          }${MIN_AMOUNT_RUPEES}`,
        },
        { status: 400 }
      )
    }

    const description = donorMessage?.trim()
      ? `Donation Lokalads - ${donorMessage.trim()}`
      : 'Donation Lokalads'

    // Get or create Razorpay customer (populates "Customer detail" in dashboard)
    const customerId = donorEmail
      ? await getOrCreateRazorpayCustomer(donorEmail, donorName || '')
      : undefined

    const orderPayload: Orders.RazorpayOrderCreateRequestBody = {
      // Razorpay expects the smallest currency unit (paise for INR).
      // `amount` here is rupees as sent from the client (`amountInRupees`),
      // so it must be multiplied by 100 — this was previously passed
      // straight through, sending e.g. 1 paise instead of 100 for a ₹1 donation,
      // which tripped Razorpay's own minimum-amount check.
      amount:   Math.round(amount * 100),
      currency,
      receipt:  receipt || `receipt_${Date.now()}`,
      notes: {
        donor_name:    donorName        || '',
        donor_email:   donorEmail       || '',
        donor_message: donorMessage?.trim() || '',
        description,
      },
      ...(customerId && { customer_id: customerId }),
    }

    const order = await razorpay.orders.create(orderPayload)

    return NextResponse.json({
      order_id:    order.id,
      amount:      order.amount,
      currency:    order.currency,
      description,
    })
  } catch (err: any) {
    console.error('Razorpay create-order error:', err)
    const status = err?.statusCode === 401 ? 401 : 500
    return NextResponse.json(
      { error: err?.error?.description || err.message || 'Order creation failed' },
      { status }
    )
  }
}