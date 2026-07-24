import { create } from "zustand";

// ─── Types ────────────────────────────────────────────────────────────────

export type PaymentTier = "qr" | "wallet" | "card";
export type WalletMethod = "apple-pay" | "google-pay" | "paypal";
export type CardMethod = "credit-card" | "bank-transfer";

export interface DonationState {
  // ── Step 1: Amount & Donor Details
  selectedAmount: number | null;  // null = "other"
  customAmount: string;
  donorName: string;
  donorEmail: string;
  donorMessage: string;

  // ── Step 2: Payment
  paymentTier: PaymentTier;
  walletMethod: WalletMethod;
  cardMethod: CardMethod;

  // ── Mock transaction (set on "pay")
  transactionId: string;
  paidAt: string;

  // ── Actions
  setSelectedAmount: (amount: number | null) => void;
  setCustomAmount: (amount: string) => void;
  setDonorName: (name: string) => void;
  setDonorEmail: (email: string) => void;
  setDonorMessage: (message: string) => void;
  setPaymentTier: (tier: PaymentTier) => void;
  setWalletMethod: (method: WalletMethod) => void;
  setCardMethod: (method: CardMethod) => void;
  confirmPayment: () => void;
  reset: () => void;
}

// ─── Mock helpers ─────────────────────────────────────────────────────────

function generateTxnId(): string {
  const now = new Date();
  const date = now.toISOString().replace(/[-:T.Z]/g, "").slice(0, 8);
  const rand = Math.floor(Math.random() * 9000000 + 1000000);
  return `${date}TRGBPSGD${rand}`;
}

// ─── Store ────────────────────────────────────────────────────────────────

const initialState = {
  selectedAmount: 50 as number | null,
  customAmount: "",
  donorName: "",
  donorEmail: "",
  donorMessage: "",
  paymentTier: "qr" as PaymentTier,
  walletMethod: "apple-pay" as WalletMethod,
  cardMethod: "credit-card" as CardMethod,
  transactionId: "",
  paidAt: "",
};

export const useDonationStore = create<DonationState>((set) => ({
  ...initialState,

  setSelectedAmount: (amount) => set({ selectedAmount: amount }),
  setCustomAmount: (amount) => set({ customAmount: amount }),
  setDonorName: (name) => set({ donorName: name }),
  setDonorEmail: (email) => set({ donorEmail: email }),
  setDonorMessage: (message) => set({ donorMessage: message }),
  setPaymentTier: (tier) => set({ paymentTier: tier }),
  setWalletMethod: (method) => set({ walletMethod: method }),
  setCardMethod: (method) => set({ cardMethod: method }),

  confirmPayment: () =>
    set({
      transactionId: generateTxnId(),
      paidAt: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }),

  reset: () => set(initialState),
}));
