'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useDonationStore } from '@/app/store/donationStore'

// ─── Step Progress ────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Choose Amount' },
  { label: 'Select Payment Type' },
  { label: 'Payment Confirmation' },
]

const StepProgress = ({ step }: { step: number }) => (
  <div className="bg-slate-800 py-2.5 px-4">
    <div className="max-w-screen-lg container mx-auto px-4 sm:px-6 lg:px-36">

      {/* Mobile: bar + label */}
      <nav className="sm:hidden">
        <div className="flex gap-2 mb-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 h-1.5 rounded-full',
                i + 1 <= step ? 'bg-teal-500' : 'bg-slate-600'
              )}
            />
          ))}
        </div>
        <p className="text-sm font-medium text-slate-200">
          Step {step}: {STEPS[step - 1].label}
        </p>
      </nav>

      {/* Desktop: full steps */}
      <nav className="hidden sm:block">
        <ol className="flex gap-4">
          {STEPS.map((s, i) => (
            <li key={i} className="flex-1">
              <div className={cn(
                'h-1 rounded-full mb-1',
                i + 1 <= step ? 'bg-teal-500' : 'bg-slate-600'
              )} />
              <p className={cn(
                'text-sm font-medium',
                i + 1 <= step ? 'text-slate-200' : 'text-slate-500'
              )}>
                Step {i + 1}: {s.label}
              </p>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  </div>
)

// ─── Amount Card ──────────────────────────────────────────────────────────

const AMOUNTS = [
  { value: 1,   tagline: 'Help keep Lokalads running smoothly every day.' },
  { value: 30,  tagline: 'Drive essential improvements and innovation.' },
  { value: 50,  tagline: 'Empower us to deliver better features and services.' },
  { value: 100, tagline: 'Be the reason Lokalads transforms for the better.' },
  { value: 500, tagline: 'Fuel a bigger change and help us reach more communities.' },
]

function AmountCard({
  amount,
  tagline,
  selected,
  onSelect,
}: {
  amount: number
  tagline: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative text-left px-4 py-3 rounded-xl border transition-all',
        selected
          ? 'border-blue-500 ring-2 ring-blue-400/50 bg-blue-50'
          : 'border-slate-300 bg-white hover:bg-slate-50'
      )}
    >
      <span className={cn(
        'block text-2xl sm:text-3xl font-bold',
        selected ? 'text-blue-700' : 'text-slate-800'
      )}>
        £{amount}
      </span>
      <span className="block text-sm text-slate-500 mt-0.5 leading-snug">{tagline}</span>
      {selected && (
        <span className="absolute top-3 right-3 size-5 rounded-full bg-blue-500 flex items-center justify-center">
          <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  )
}

function OtherAmountCard({
  selected,
  onSelect,
}: {
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative text-left px-4 py-3 rounded-xl border transition-all',
        selected
          ? 'border-blue-500 ring-2 ring-blue-400/50 bg-blue-50'
          : 'border-slate-300 bg-white hover:bg-slate-50'
      )}
    >
      <span className={cn(
        'block text-2xl font-bold',
        selected ? 'text-blue-700' : 'text-slate-800'
      )}>
        Other Amount
      </span>
      <span className="block text-sm text-slate-500 mt-0.5 leading-snug">
        Every pound counts — customise your support and make a difference!
      </span>
      {selected && (
        <span className="absolute top-3 right-3 size-5 rounded-full bg-blue-500 flex items-center justify-center">
          <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function DonatePage() {
  const router = useRouter()
  const { setAmount, setMethod, setDonor } = useDonationStore()

  // true = a preset value; false/null = "Other Amount" selected
  const [selAmt, setSelAmt]       = useState<number | 'other'>(1)
  const [customAmt, setCustomAmt] = useState('')
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [message, setMessage]     = useState('')
  const [errors, setErrors]       = useState<{ name?: string; email?: string; amount?: string }>({})

  const rawAmt = selAmt === 'other' ? Number(customAmt) : Number(selAmt)

  const validate = () => {
    const e: typeof errors = {}
    if (!name.trim())                          e.name   = 'Please enter your name.'
    if (!email.trim() || !email.includes('@')) e.email  = 'Please enter a valid email.'
    if (!rawAmt || rawAmt < 1)                 e.amount = 'Please select or enter an amount (minimum £1).'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => {
    if (!validate()) return
    setAmount(`£${rawAmt}`, rawAmt, 'GBP')
    setMethod('qr')
    setDonor({ name: name.trim(), email: email.trim(), message: message.trim() })
    router.push('/donate/review')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Main ── */}
      <main className="flex-1 max-w-screen-lg container mx-auto w-full px-4 sm:px-6 lg:px-16 py-8">

        {/* Headline */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
            Support Lokalads Together, We Build Stronger Communities!
          </h2>
          <p className="text-lg sm:text-lg text-slate-500 italic mt-2">
            &ldquo;Your contribution keeps Lokalads free and growing, so millions can benefit from our platform.&rdquo;
          </p>
        </div>

        {/* ── Amount Selection ── */}
        <fieldset className="mb-8">
          <legend className="text-lg font-semibold text-slate-700 mb-3">
            Choose your contribution amount:
          </legend>

          {errors.amount && (
            <p className="text-sm text-rose-600 mb-3">{errors.amount}</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {AMOUNTS.map(({ value, tagline }) => (
              <AmountCard
                key={value}
                amount={value}
                tagline={tagline}
                selected={selAmt === value}
                onSelect={() => {
                  setSelAmt(value)
                  setErrors(e => ({ ...e, amount: undefined }))
                }}
              />
            ))}
            <OtherAmountCard
              selected={selAmt === 'other'}
              onSelect={() => {
                setSelAmt('other')
                setErrors(e => ({ ...e, amount: undefined }))
              }}
            />
          </div>

          {/* Custom amount input — only shown when "Other" is selected */}
          {selAmt === 'other' && (
            <div className="border-l-4 border-blue-400 bg-blue-50 rounded-r-lg px-4 py-3 mt-1">
              <label htmlFor="customAmt" className="block text-sm font-medium text-slate-700 mb-1.5">
                Enter your amount (£)
              </label>
              <input
                id="customAmt"
                type="number"
                min={1}
                inputMode="numeric"
                placeholder="e.g. 75"
                value={customAmt}
                onChange={(e) => {
                  setCustomAmt(e.target.value)
                  setErrors(er => ({ ...er, amount: undefined }))
                }}
                className="w-40 appearance-none py-2 px-3 rounded-md bg-white placeholder-gray-400 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 focus:outline-none text-slate-800"
              />
            </div>
          )}
        </fieldset>

        {/* ── Separator ── */}
        <hr className="border-slate-200 mb-8" />

        {/* ── Donor Details ── */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Your details:</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

            {/* Full Name */}
            <div>
              <label htmlFor="donorName" className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="donorName"
                type="text"
                autoComplete="name"
                placeholder="e.g. Jane Smith"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors(er => ({ ...er, name: undefined })) }}
                className={cn(
                  'block w-full appearance-none py-2.5 px-3 rounded-md bg-gray-50 placeholder-gray-400 border text-slate-800 focus:ring-2 focus:ring-blue-500/25 focus:outline-none focus:bg-white',
                  errors.name ? 'border-rose-400 bg-rose-50' : 'border-gray-300 focus:border-blue-500'
                )}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="donorEmail" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="donorEmail"
                type="email"
                autoComplete="email"
                placeholder="e.g. jane@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(er => ({ ...er, email: undefined })) }}
                className={cn(
                  'block w-full appearance-none py-2.5 px-3 rounded-md bg-gray-50 placeholder-gray-400 border text-slate-800 focus:ring-2 focus:ring-blue-500/25 focus:outline-none focus:bg-white',
                  errors.email ? 'border-rose-400 bg-rose-50' : 'border-gray-300 focus:border-blue-500'
                )}
              />
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="donorMessage" className="block text-sm font-medium text-slate-700 mb-1.5">
              Message <span className="text-slate-400 text-xs font-normal">(Optional)</span>
            </label>
            <textarea
              id="donorMessage"
              rows={3}
              placeholder="Feel free to share your experience with Lokalads!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full appearance-none py-2.5 px-3 rounded-md bg-gray-50 placeholder-gray-400 border border-gray-300 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 focus:outline-none focus:bg-white resize-none"
            />
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleContinue}
            className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-yellow-900 text-lg font-bold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
          >
            Yes, I want to Support Lokalads!
          </button>
        </div>

        {/* Sub tagline */}
        <p className="text-center text-sm text-slate-400 italic mt-8 mb-2">
          ...every contribution empowers us to enhance your experience, introduce new features,
          and keep Lokalads thriving for everyone. Be a part of this journey!
        </p>

      </main>
    </div>
  )
}