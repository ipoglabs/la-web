// components/StripeProvider.tsx
'use client'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import type { Appearance, StripeElementsOptions } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeProviderProps {
  clientSecret: string
  children: React.ReactNode
}

// ── Appearance: matches Lokalads input styles + Inter font ────────────────────
// Equivalent to the site's Tailwind classes:
//   bg-gray-100  border-gray-700  rounded-md  py-3 px-4
//   focus:border-sky-900  focus:ring-2  focus:ring-blue-500
//   placeholder-gray-500  text-slate-800
const appearance: Appearance = {
  theme: 'stripe',
  variables: {
    // Font — matches Inter used across the site
    fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
    fontSizeBase: '16px',
    fontWeightNormal: '400',

    // Colours — mirroring Tailwind gray-100 / gray-700 / blue-500
    colorBackground:      '#f3f4f6',   // gray-100
    colorText:            '#1e293b',   // slate-800
    colorTextPlaceholder: '#6b7280',   // gray-500
    colorPrimary:         '#3b82f6',   // blue-500  (focus ring & active state)
    colorDanger:          '#ef4444',   // red-500

    // Border
    borderRadius:  '6px',             // rounded-md
    spacingUnit:   '4px',

    // Input sizing — matches py-3 px-4
    spacingGridRow: '20px',
  },
  rules: {
    '.Input': {
      backgroundColor: '#f3f4f6',     // bg-gray-100
      border:          '1px solid #374151', // border-gray-700
      padding:         '12px 16px',   // py-3 px-4
      boxShadow:       'none',
      outline:         'none',
    },
    '.Input:focus': {
      backgroundColor: '#ffffff',     // focus:bg-white
      border:          '1px solid #0c4a6e', // focus:border-sky-900
      boxShadow:       '0 0 0 2px rgba(59,130,246,0.4)', // focus:ring-2 focus:ring-blue-500
      outline:         'none',
    },
    '.Input--invalid': {
      backgroundColor: '#fef2f2',     // bg-red-50
      border:          '1px solid #f87171', // border-red-400
    },
    '.Label': {
      fontWeight:  '500',
      color:       '#374151',         // gray-700
      marginBottom: '4px',
    },
    '.Tab': {
      border:          '1px solid #d1d5db', // gray-300
      backgroundColor: '#f3f4f6',
    },
    '.Tab:hover': {
      backgroundColor: '#e5e7eb',
    },
    '.Tab--selected': {
      backgroundColor: '#eff6ff',     // blue-50
      borderColor:     '#60a5fa',     // blue-400
      color:           '#1d4ed8',     // blue-700
      boxShadow:       '0 0 0 2px rgba(96,165,250,0.4)',
    },
    '.AccordionItem': {
      border:          '1px solid #d1d5db',
      borderRadius:    '6px',
    },
    // Hide the "Card" label + icon header inside the accordion
    '.AccordionItem-title': {
      display: 'none',
    },
    '.AccordionItem-title + *': {
      marginTop: '0',
    },
  },
}

export default function StripeProvider({ clientSecret, children }: StripeProviderProps) {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
    // Disable Stripe Link (the "Secure, fast checkout with Link" prompt)
    paymentMethodCreation: 'manual' as any,
    // Load Inter into the Stripe iframe
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
      },
    ],
    locale: 'en-GB',
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}