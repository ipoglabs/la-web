import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Creates a "pending" donation record as soon as we know who the donor is
// and how much they intend to give — before payment has actually completed.
export async function POST(req: NextRequest) {
  try {
    const { donorName, donorEmail, amount, currency, method, description } = await req.json()

    if (!donorName || !donorEmail || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required donor/donation fields' },
        { status: 400 }
      )
    }

    const donation = await prisma.donation.create({
      data: {
        donorName,
        donorEmail,
        amount,
        currency,
        method: method ?? 'unknown',
        description: description?.trim() || null,
        status: 'pending',
      },
    })

    return NextResponse.json({ id: donation.id })
  } catch (err) {
    console.error('Failed to create donation record:', err)
    return NextResponse.json(
      { error: 'Could not create donation record' },
      { status: 500 }
    )
  }
}