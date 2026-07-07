// components/ScanPayPanel.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { cn } from '@/lib/utils'

// ─── Country config ────────────────────────────────────────────────────────────
const COUNTRY_CONFIG = {
  SG: {
    label: 'Singapore',
    method: 'PayNow',
    currency: 'sgd',
    symbol: 'S$',
    flag: '🇸🇬',
    badge: 'PayNow',
    badgeColor: 'bg-red-600',
    instructions: [
      "Open any Singapore banking app (DBS, OCBC, UOB, PayLah!, etc.).",
      "Tap Scan & Pay and scan the QR code below.",
      "Confirm the amount and complete payment in your app.",
      "Stay on this page — you'll be redirected once payment is confirmed.",
    ],
    note: "Opens a secure Stripe checkout page. No fixed QR expiry is tracked here.",
  },
  IN: {
    label: 'India',
    method: 'UPI',
    currency: 'inr',
    symbol: '₹',
    flag: '🇮🇳',
    badge: 'UPI',
    badgeColor: 'bg-orange-600',
    instructions: [
      "Open Google Pay, PhonePe, Paytm, BHIM, or any UPI app.",
      "Tap Scan QR and point your camera at the code below.",
      "Verify the amount and complete the UPI payment.",
      "Keep this page open — confirmation will appear automatically.",
    ],
    note: "Works with all UPI apps — GPay, PhonePe, Paytm, BHIM, and more.",
  },
  GB: {
    label: 'United Kingdom',
    method: 'Payment Link',
    currency: 'gbp',
    symbol: '£',
    flag: '🇬🇧',
    badge: 'Stripe',
    badgeColor: 'bg-indigo-600',
    instructions: [
      "Scan the QR code with your phone camera.",
      "You will be taken to a Stripe-hosted payment page.",
      "Pay securely with your card, Apple Pay, or Google Pay.",
      "A confirmation will appear on this page once done.",
    ],
    note: "Opens a secure Stripe checkout page. No fixed QR expiry is tracked here.",
  },
} as const

type Country = keyof typeof COUNTRY_CONFIG

// Razorpay QR codes are created with a 15-minute close_by in
// app/api/create-qr-payment/route.ts. Used as a fallback before the real
// close_by comes back from the API. Stripe Payment Links (SG/GB) don't
// carry a server-tracked expiry, so no countdown is shown for them.
const RAZORPAY_QR_SECONDS = 15 * 60

// ─── QR Timer ─────────────────────────────────────────────────────────────────
function QrTimer({ seconds, onExpire }: { seconds: number; onExpire?: () => void }) {
  const [secs, setSecs] = useState(seconds)
  useEffect(() => { setSecs(seconds) }, [seconds])
  useEffect(() => {
    if (secs <= 0) { onExpire?.(); return }
    const id = setTimeout(() => setSecs(s => s - 1), 1000)
    return () => clearTimeout(id)
  }, [secs])
  const pct = (secs / seconds) * 100
  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')
  const expired = secs === 0
  const urgent = secs <= 60 && !expired
  return (
    <div className="w-full">
      <div className="h-1.5 bg-slate-200 rounded-full mb-1 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000',
            expired ? 'bg-rose-500' : urgent ? 'bg-amber-400' : 'bg-teal-500'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={cn('text-xs text-center font-mono', expired ? 'text-rose-600 font-semibold' : urgent ? 'text-amber-600' : 'text-slate-500')}>
        {expired
          ? 'QR expired — refresh to generate a new one'
          : `QR expires in ${mm}:${ss}`}
      </p>
    </div>
  )
}

// ─── Props ─────────────────────────────────────────────────────────────────────
interface ScanPayPanelProps {
  amount: number           // raw number e.g. 10
  donorName: string
  email: string
  onSuccess: (txId: string) => void
  onError: (msg: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ScanPayPanel({ amount, donorName, email, onSuccess, onError }: ScanPayPanelProps) {
  const [country, setCountry] = useState<Country>('SG')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  // Generic reference id used for status polling. For India this is
  // Razorpay's qrCodeId — SG/GB don't poll (see generateQR below).
  const [referenceId, setReferenceId] = useState<string | null>(null)
  const [qrSeconds, setQrSeconds] = useState(RAZORPAY_QR_SECONDS)
  const [expired, setExpired] = useState(false)
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  const cfg = COUNTRY_CONFIG[country]

  // ── Fetch QR from backend ──────────────────────────────────────────────────
  const generateQR = async () => {
    setLoading(true)
    setApiError('')
    setQrDataUrl('')
    setExpired(false)
    setReferenceId(null)
    if (pollRef.current) clearInterval(pollRef.current)

    try {
      const res = await fetch('/api/create-qr-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, country, donorName, email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create QR payment')

      // ── India: Razorpay UPI QR — image_url comes ready-made, no
      // client-side QR generation needed ───────────────────────────────────
      if (data.method === 'razorpay_qr' && data.qrImageUrl) {
        setQrDataUrl(data.qrImageUrl)
        setReferenceId(data.qrCodeId)
        // Sync the on-screen countdown with Razorpay's actual close_by
        // timestamp rather than assuming a fixed duration.
        if (data.closeBy) {
          const remaining = data.closeBy - Math.floor(Date.now() / 1000)
          setQrSeconds(remaining > 0 ? remaining : 0)
        }
        startPolling(data.qrCodeId)
      }

      // ── Singapore / UK: Stripe Payment Link — convert URL to a QR
      // client-side. No server-side polling here; the user lands on
      // /donate/status after Stripe redirects them ───────────────────────
      else if (data.method === 'payment_link' && data.paymentLinkUrl) {
        const url = await QRCode.toDataURL(data.paymentLinkUrl, {
          width: 240, margin: 1,
          color: { dark: '#000000', light: '#ffffff' },
        })
        setQrDataUrl(url)
      }

      else {
        throw new Error('Unrecognized response from create-qr-payment')
      }
    } catch (err: any) {
      setApiError(err.message)
      onError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Poll Razorpay for QR payment completion (India only) ──────────────────
  const startPolling = (qrCodeId: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/check-razorpay-qr-status?qrCodeId=${qrCodeId}`)
        const data = await res.json()
        if (data.status === 'succeeded') {
          clearInterval(pollRef.current!)
          onSuccess(data.paymentId || qrCodeId)
        } else if (data.status === 'expired') {
          clearInterval(pollRef.current!)
          setExpired(true)
        }
      } catch (_) { /* silent */ }
    }, 3000) // poll every 3 seconds
  }

  useEffect(() => {
    generateQR()
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [country, amount])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `lokalads-${cfg.method.toLowerCase().replace(' ', '-')}-qr.png`
    link.click()
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">

      {/* ── LEFT: Instructions ──────────────────────────────────────────────── */}
      <div className="flex-1">

        {/* Country selector */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-slate-600 mb-2">Select your country:</p>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(COUNTRY_CONFIG) as Country[]).map(c => (
              <button
                key={c}
                onClick={() => setCountry(c)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all',
                  country === c
                    ? 'bg-slate-700 text-white border-slate-700'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                )}
              >
                <span>{COUNTRY_CONFIG[c].flag}</span>
                <span>{COUNTRY_CONFIG[c].label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Method badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className={cn('text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide', cfg.badgeColor)}>
            {cfg.badge}
          </span>
          <span className="text-slate-500 text-sm">
            {cfg.method} · {cfg.currency.toUpperCase()}
          </span>
        </div>

        {/* Instructions */}
        <ol className="text-slate-700 list-decimal ml-5 mb-4 space-y-1.5 text-sm">
          {cfg.instructions.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>

        {/* Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
          {cfg.note}
        </div>

        {/* Stay-on-page warning */}
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          <b>Keep this page open</b> until payment is confirmed.
          {country === 'IN' && ' Polling every 3 seconds.'}
        </div>
      </div>

      {/* ── RIGHT: QR panel ─────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center md:w-72">
        <p className="text-base font-semibold text-center mb-3 text-slate-700">
          Scan to pay {cfg.symbol}{Number(amount).toLocaleString()}
        </p>

        {/* QR box */}
        <div className="relative mb-5">
          <div className="relative size-56 border-2 border-slate-300 rounded-xl bg-white shadow-sm overflow-hidden flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="text-xs text-slate-500">Generating QR...</span>
              </div>
            ) : apiError ? (
              <div className="text-center px-2">
                <p className="text-xs text-red-600 mb-2">{apiError}</p>
                <button onClick={generateQR} className="text-xs underline text-blue-600">Retry</button>
              </div>
            ) : qrDataUrl ? (
              country === 'IN' ? (
                // Razorpay's hosted UPI QR image is a full branded poster
                // (logos, the QR itself, merchant name, etc). Scale + shift
                // it so only the QR matrix itself is visible in the box,
                // instead of shrinking the whole poster to fit.
                <img
                  src={qrDataUrl}
                  alt={`Scan to pay via ${cfg.method}`}
                  style={{ position: 'absolute', width: '160%', maxWidth: 'none', left: '-30%', top: '-150%' }}
                />
              ) : (
                <img
                  src={qrDataUrl}
                  alt={`Scan to pay via ${cfg.method}`}
                  className="w-full h-full object-contain p-1.5"
                />
              )
            ) : null}
          </div>

          {/* Method badge on QR */}
          {!loading && !apiError && qrDataUrl && (
            <span className={cn('absolute -bottom-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap', cfg.badgeColor)}>
              {cfg.badge} QR
            </span>
          )}
        </div>

        {/* Timer — only India has a server-tracked expiry (Razorpay close_by) */}
        {country === 'IN' && !loading && qrDataUrl && !expired && (
          <div className="w-56 mb-4">
            <QrTimer seconds={qrSeconds} onExpire={() => setExpired(true)} />
          </div>
        )}

        {/* Expired refresh */}
        {expired && (
          <button
            onClick={generateQR}
            className="mb-3 text-sm text-blue-700 underline font-medium"
          >
            ↻ Generate new QR
          </button>
        )}

        {/* Download button */}
        {qrDataUrl && !loading && !expired && (
          <button
            onClick={handleDownload}
            className="bg-blue-800 hover:bg-blue-700 rounded-md text-sm text-white flex items-center gap-2 px-4 py-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
              <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
              <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
            </svg>
            Download QR
          </button>
        )}

        {/* Polling indicator (India only) */}
        {referenceId && !expired && (
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-teal-500" />
            </span>
            Waiting for payment confirmation...
          </div>
        )}
      </div>

    </div>
  )
}