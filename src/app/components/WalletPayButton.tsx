// components/WalletPayButton.tsx
'use client'
import { useStripe, PaymentRequestButtonElement } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'

export default function WalletPayButton({
  amount,
  currency,
  clientSecret,
  onSuccess,
  onError,
}: {
  amount: number
  currency: string
  clientSecret: string
  onSuccess: (txId: string) => void
  onError: (msg: string) => void
}) {
  const stripe = useStripe()
  const [paymentRequest, setPaymentRequest] = useState<any>(null)
  const [available, setAvailable] = useState<boolean | null>(null) // null = checking

  useEffect(() => {
    if (!stripe || !clientSecret) return

    const pr = stripe.paymentRequest({
      country: 'GB',
      currency: currency.toLowerCase(),
      total: { label: 'Lokalads Donation', amount },
      requestPayerName: false, // ← don't ask for name/email; you already have them
      requestPayerEmail: false,
    })

    pr.canMakePayment().then(result => {
      if (result) {
        setPaymentRequest(pr)
        setAvailable(true)
      } else {
        setAvailable(false)
      }
    })

    pr.on('paymentmethod', async (e) => {
      // ✅ Use confirmPayment, NOT confirmCardPayment
      const { error, paymentIntent } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          payment_method: e.paymentMethod.id,
          return_url: window.location.href, // required by Stripe but won't redirect for wallets
        },
        redirect: 'if_required', // ← prevents redirect; handles 3DS inline
      })

      if (error) {
        e.complete('fail')
        onError(error.message ?? 'Payment failed')
        return
      }

      e.complete('success')
      onSuccess(paymentIntent!.id)
    })
  }, [stripe, amount, currency, clientSecret])

  // Still checking
  if (available === null) return (
    <div className="flex items-center justify-center py-3 gap-2 text-sm text-slate-400">
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      Checking wallet availability...
    </div>
  )

  if (!available) return (
    <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
      <p className="font-medium mb-1">Wallet pay not available</p>
      <p className="text-amber-700">Apple Pay requires Safari on iPhone/Mac. Google Pay requires Chrome. Your current browser doesn't support either — please use Card Pay instead.</p>
    </div>
  )

  return (
    <div className="w-full">
      {/* Single button — Stripe auto-shows Apple Pay OR Google Pay based on device */}
      <PaymentRequestButtonElement
        options={{
          paymentRequest: paymentRequest!,
          style: { paymentRequestButton: { height: '48px' } },
        }}
      />
      <p className="text-xs text-slate-400 text-center mt-2">
        Stripe detects your device and shows the available wallet automatically.
      </p>
    </div>
  )
}