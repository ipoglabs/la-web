import Razorpay from "razorpay";

export function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Missing Razorpay env vars");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Ready-to-use singleton — your other routes (create-qr-payment,
// create-order, check-razorpay-qr-status) import { razorpay } directly
// rather than calling getRazorpay(). Constructed lazily on first property
// access (not at module scope) so importing this file doesn't crash Next's
// build-time page-data collection in environments missing
// RAZORPAY_KEY_ID/SECRET (e.g. preview deploys) — same eager-construction
// bug this pattern already fixes for lib/stripe.ts.
let cached: Razorpay | undefined;
export const razorpay = new Proxy({} as Razorpay, {
  get(_target, prop) {
    if (!cached) cached = getRazorpay();
    return (cached as unknown as Record<string | symbol, unknown>)[prop];
  },
});