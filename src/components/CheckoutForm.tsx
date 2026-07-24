// components/CheckoutForm.tsx
'use client'
import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import type { StripePaymentElementOptions } from '@stripe/stripe-js'

interface CheckoutFormProps {
  amount: number
  currency: string
  onSuccess: (transactionId: string) => void
  onError: (message: string) => void
}

export default function CheckoutForm({ amount, currency, onSuccess, onError }: CheckoutFormProps) {
  const stripe   = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [errorMsg, setErrorMsg]     = useState('')

  const symbols: Record<string, string> = { sgd: 'S$', inr: '₹', gbp: '£', usd: '$' }
  const symbol = symbols[currency.toLowerCase()] ?? currency.toUpperCase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setErrorMsg('')

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe sends Indian 3DS flow back here
        return_url: `${window.location.origin}/donate/status`,
      },
      redirect: 'if_required', // only redirects when 3DS is needed (India)
    })

    if (error) {
      setErrorMsg(error.message ?? 'Payment failed. Please try again.')
      onError(error.message ?? 'Payment failed')
      setProcessing(false)
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id)
    } else {
      // Stripe handling a redirect (3DS) — page will reload at /donate/status
      setProcessing(false)
    }
  }

  // ── Changes 3, 4 & 5 ────────────────────────────────────────────────────────
  // • layout: 'accordion' keeps the credit card section open by default
  // • paymentMethodOrder: put 'card' first so it's the expanded accordion item
  // • wallets: disable apple_pay / google_pay wallet buttons (they appear as
  //   separate buttons above the form and can surface Revolut Pay / Amazon Pay)
  // • fonts: load Inter from Google Fonts into the Stripe iframe
  // • variables / rules: match the site's input styling (gray-100 bg, gray-700
  //   border, blue-500 focus ring, Inter font family)
  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs',
    paymentMethodOrder: ['card'],   // card first; keeps it top of the accordion
    wallets: {
      applePay: 'never',            // hides Apple Pay button (and Revolut via AP)
      googlePay: 'never',           // hides Google Pay button (and Amazon Pay via GP)
    },
    fields: {
      billingDetails: 'auto',
    },
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/*
        Stripe renders the PaymentElement inside an iframe.
        We pass appearance via <Elements> in StripeProvider (see note below),
        but the font loader must be supplied here via the `fonts` prop on
        <Elements> — handled in StripeProvider.tsx.

        Changes 4 & 5 (input styles + Inter font) are applied via the
        `appearance` object in StripeProvider.tsx. See that file for details.
      */}
      <PaymentElement options={paymentElementOptions} />

      {errorMsg && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-3 rounded-full bg-blue-700 hover:bg-blue-600 text-white font-semibold text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Processing...
          </span>
        ) : (
          `Confirm & Pay ${symbol}${Number(amount).toLocaleString()}`
        )}
      </button>

      <p className="text-center text-sm text-slate-400">
        🔒 Secured by Stripe · PCI DSS Level 1
      </p>
    </form>
  )
}