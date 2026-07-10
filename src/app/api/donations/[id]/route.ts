import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Donation from '@/models/donation'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status, transactionId, amount, currency, method } = await req.json()

    await dbConnect()

    const donation = await Donation.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(transactionId && { transactionId }),
        ...(amount && { amount }),
        ...(currency && { currency }),
        ...(method && { method }),
      },
      { new: true }
    ).lean()

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ donation })
  } catch (err) {
    console.error('Failed to update donation record:', err)
    return NextResponse.json(
      { error: 'Could not update donation record' },
      { status: 500 }
    )
  }
}