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
// check-razorpay-qr-status) import { razorpay } directly rather than
// calling getRazorpay(), so this needs to exist too.
export const razorpay = getRazorpay();