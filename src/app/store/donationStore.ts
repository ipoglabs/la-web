import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentMethod = 'qr' | 'card' | 'paypal'

export type DonationStatus = 'idle' | 'pending' | 'success' | 'failed'

export interface DonorInfo {
  name: string
  email: string
  message?: string
}

export interface DonationState {
  // Step 1 — amount & method
  amount: string           // e.g. "£30"
  amountRaw: number        // e.g. 30  (pence/number, no symbol)
  currency: string         // "GBP" | "INR" etc.
  method: PaymentMethod

  // Step 1 — donor info
  donor: DonorInfo

  // Step 2 / 3 — payment result
  status: DonationStatus
  transactionId: string
  errorMessage: string

  // Actions
  setAmount: (display: string, raw: number, currency?: string) => void
  setMethod: (method: PaymentMethod) => void
  setDonor: (donor: DonorInfo) => void
  setStatus: (status: DonationStatus) => void
  setTransactionId: (id: string) => void
  setErrorMessage: (msg: string) => void
  reset: () => void
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaults = {
  amount: '£1',
  amountRaw: 1,
  currency: 'GBP',
  method: 'qr' as PaymentMethod,
  donor: { name: '', email: '' },
  status: 'idle' as DonationStatus,
  transactionId: '',
  errorMessage: '',
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useDonationStore = create<DonationState>()(
  persist(
    (set) => ({
      ...defaults,

      setAmount: (display, raw, currency = 'GBP') =>
        set({ amount: display, amountRaw: raw, currency }),

      setMethod: (method) => set({ method }),

      setDonor: (donor) => set({ donor }),

      setStatus: (status) => set({ status }),

      setTransactionId: (transactionId) => set({ transactionId }),

      setErrorMessage: (errorMessage) => set({ errorMessage }),

      reset: () => set({ ...defaults }),
    }),
    {
      name: 'lokalads-donation',          // localStorage key
      storage: createJSONStorage(() => sessionStorage), // clears on tab close
      // only persist what's needed across page navigations
      partialize: (state) => ({
        amount: state.amount,
        amountRaw: state.amountRaw,
        currency: state.currency,
        method: state.method,
        donor: state.donor,
        status: state.status,
        transactionId: state.transactionId,
      }),
    }
  )
)