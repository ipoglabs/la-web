import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status, transactionId, amount, currency, method } = await req.json()

    const donation = await prisma.donation.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(transactionId && { transactionId }),
        ...(amount && { amount }),
        ...(currency && { currency }),
        ...(method && { method }),
      },
    })

    return NextResponse.json({ donation })
  } catch (err) {
    console.error('Failed to update donation record:', err)
    return NextResponse.json(
      { error: 'Could not update donation record' },
      { status: 500 }
    )
  }
}