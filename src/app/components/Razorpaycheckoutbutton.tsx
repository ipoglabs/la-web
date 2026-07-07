// Save as: components/RazorpayCheckoutButton.tsx
//
// The Razorpay script is loaded ONCE in page.tsx via <Script> and
// `rzpScriptLoaded` is passed down as a prop. This avoids the race condition
// where each button instance loaded its own script and wasn't ready in time.
//
// NOTE: this file previously also exported an inline card-entry form
// (`RazorpayCardForm`) that called `rzp.createPayment(...)` directly. That
// method only exists on Razorpay's separate Custom Checkout integration
// (PCI-compliant, requires its own setup) — it does not exist on the
// standard checkout.js client loaded here, so calling it threw
// `TypeError: createPayment is not a function`. Every current caller in
// page.tsx already passes a `method` prop (card/wallet), which always uses
// the working `rzp.open()` modal flow below, so the card form was dead code
// and has been removed rather than fixed, to avoid leaving a landmine for
// any future caller that omits `method`.
'use client'

import { useState } from 'react'

declare global {
  interface Window {
    Razorpay: any
  }
}

// Razorpay test/live orders below ₹10 reliably trip its own minimum-amount
// error (see /api/create-order, which also enforces this server-side).
// Clamping here too means even if a caller passes a lower amountInRupees,
// the actual order/charge is never below ₹10 — note this is charge-side
// only; the button `label` text passed in from the caller is NOT adjusted
// here, so it can still display a lower figure than what's charged.
const MIN_INR_AMOUNT = 10

interface RazorpayCheckoutButtonProps {
  amountInRupees: number
  currency?: string
  name?: string
  donorName?: string
  donorMessage?: string   // optional message from the donate page — used in description & notes
  email?: string
  contact?: string
  label?: string
  className?: string
  /** Opens the Razorpay modal pre-selected to this tab (card/wallet/UPI/etc). */
  method: 'card' | 'wallet' | 'upi' | 'netbanking' | 'emi'
  wallet?: string
  /** Passed from page.tsx — true once the shared Razorpay <Script> has loaded. */
  scriptLoaded: boolean
  onSuccess: (paymentId: string) => void
  onError: (message: string) => void
}

export default function RazorpayCheckoutButton({
  amountInRupees,
  currency = 'INR',
  name = 'Lokalads',
  donorName,
  donorMessage,
  email,
  contact,
  label = 'Pay Now',
  className = 'px-8 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md text-white font-semibold',
  method,
  wallet,
  scriptLoaded,
  onSuccess,
  onError,
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  // Amount actually sent to Razorpay — floored at MIN_INR_AMOUNT regardless
  // of what amountInRupees the caller passed (and regardless of what the
  // button's `label` text shows).
  const payableAmount = Math.max(amountInRupees, MIN_INR_AMOUNT)

  const handlePay = async () => {
    if (!scriptLoaded || !window.Razorpay) {
      onError('Payment script is still loading — try again in a moment.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: payableAmount,
          currency,
          receipt: `rcpt_${Date.now()}`,
          donorName,
          donorEmail: email,
          donorMessage,
        }),
      })
      const order = await res.json()
      if (!res.ok) throw new Error(order.error || 'Could not create order')

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name,
        description: order.description || 'Donation Lokalads',
        prefill: {
          name: donorName,
          email,
          contact,
          ...(method ? { method } : {}),
          ...(wallet ? { wallet } : {}),
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })
            const verifyData = await verifyRes.json()
            if (verifyRes.ok && verifyData.success) {
              onSuccess(response.razorpay_payment_id)
            } else {
              onError(verifyData.error || 'Payment verification failed')
            }
          } catch (err: any) {
            onError(err.message || 'Payment verification failed')
          } finally {
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            onError('Payment cancelled')
          },
        },
        theme: { color: '#0f172a' },
      })

      rzp.on('payment.failed', (response: any) => {
        setLoading(false)
        onError(response.error?.description || 'Payment failed')
      })

      rzp.open()
    } catch (err: any) {
      setLoading(false)
      onError(err.message || 'Could not start payment')
    }
  }

  return (
    <button onClick={handlePay} disabled={loading || !scriptLoaded} className={className}>
      {loading ? 'Processing...' : label}
    </button>
  )
}