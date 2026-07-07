// Save this as: app/api/check-razorpay-qr-status/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'

export async function GET(req: NextRequest) {
  const qrCodeId = req.nextUrl.searchParams.get('qrCodeId')
  if (!qrCodeId) {
    return NextResponse.json({ error: 'qrCodeId is required' }, { status: 400 })
  }

  try {
    const qrCode = await razorpay.qrCode.fetch(qrCodeId)

    if (qrCode.payments_count_received > 0) {
      const payments = await razorpay.qrCode.fetchAllPayments(qrCodeId, {})
      const captured = payments.items?.find((p: any) => p.status === 'captured')
      return NextResponse.json({ status: 'succeeded', paymentId: captured?.id ?? qrCodeId })
    }

    if (qrCode.status === 'closed') {
      return NextResponse.json({ status: 'expired' })
    }

    return NextResponse.json({ status: 'pending' })
  } catch (err: any) {
    console.error('Razorpay QR status check failed:', err)
    return NextResponse.json({ error: err.message || 'Failed to check QR status' }, { status: 500 })
  }
}