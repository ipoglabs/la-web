// app/api/create-payment-intent/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

// Supported currencies per country
const CURRENCY_MAP: Record<string, string> = {
  SG: "sgd",
  IN: "inr",
  GB: "gbp",
  US: "usd",
};

export async function POST(req: Request) {
  try {
    const { amount, currency = "sgd", donorName, email } = await req.json();

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Invalid donation amount" },
        { status: 400 }
      );
    }

    // Stripe amounts are in smallest currency unit (cents/pence/paise)
    // SGD/GBP/USD: multiply by 100  |  INR: multiply by 100 (paise)
    const amountInSmallestUnit = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true }, // enables cards, UPI, wallets etc
      metadata: {
        donorName: donorName || "Anonymous",
        email: email || "",
      },
      receipt_email: email || undefined,
      description: `Donation from ${donorName || "Anonymous"}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: err.message || "Payment intent creation failed" },
      { status: 500 }
    );
  }
}
