// lib/rzpCustomer.ts
//
// Helper to create-or-update a Razorpay Customer using direct REST calls
// instead of the SDK, which has incomplete TypeScript types for customers.all()
// and customers.edit(). Using fetch avoids all SDK type errors.

const RZP_BASE = 'https://api.razorpay.com/v1'

function rzpAuth() {
  const key    = process.env.RAZORPAY_KEY_ID!
  const secret = process.env.RAZORPAY_KEY_SECRET!
  return 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')
}

/**
 * Returns a Razorpay customer_id for the given email, creating or updating
 * the customer record as needed. Name is always kept up to date.
 * Returns undefined (non-fatal) if anything goes wrong.
 */
export async function getOrCreateRazorpayCustomer(
  email: string,
  name: string
): Promise<string | undefined> {
  const auth    = rzpAuth()
  const headers = { 'Content-Type': 'application/json', Authorization: auth }

  try {
    // 1. Try to create the customer
    const createRes = await fetch(`${RZP_BASE}/customers`, {
      method:  'POST',
      headers,
      body: JSON.stringify({ name: name || email, email, fail_existing: '0' }),
    })
    const created = await createRes.json()

    if (createRes.ok && created.id) {
      // New customer — also patch the name immediately in case fail_existing
      // returned an existing record with a stale/empty name
      if (created.name !== name && name) {
        await fetch(`${RZP_BASE}/customers/${created.id}`, {
          method:  'PATCH',
          headers,
          body: JSON.stringify({ name }),
        })
      }
      return created.id
    }

    // 2. If create failed, search by email and patch
    const listRes  = await fetch(`${RZP_BASE}/customers?email=${encodeURIComponent(email)}&count=1`, {
      headers: { Authorization: auth },
    })
    const listData = await listRes.json()
    const existing = listData?.items?.[0]

    if (existing?.id) {
      if (name && existing.name !== name) {
        await fetch(`${RZP_BASE}/customers/${existing.id}`, {
          method:  'PATCH',
          headers,
          body: JSON.stringify({ name }),
        })
      }
      return existing.id
    }
  } catch (err: any) {
    console.warn('getOrCreateRazorpayCustomer error:', err?.message)
  }

  return undefined
}