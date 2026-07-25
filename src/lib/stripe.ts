/**
 * lib/stripe.ts
 *
 * Lazy Stripe client — constructed on first use inside a request handler,
 * not at module scope. `new Stripe(undefined!, ...)` throws synchronously
 * ("Neither apiKey nor config.authenticator provided"), and Next.js
 * evaluates API route modules during `next build`'s page-data collection
 * step — so an eager `const stripe = new Stripe(...)` at the top of a route
 * file crashes the *build* in any environment missing STRIPE_SECRET_KEY
 * (e.g. a preview deploy without payment secrets configured), not just
 * requests to that route. Mirrors the same lazy pattern already used for
 * Twilio in lib/twilioVerify.ts.
 */
import Stripe from "stripe";

let cached: Stripe | undefined;

export function getStripe(): Stripe {
  if (!cached) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }
    cached = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-06-24.dahlia",
    });
  }
  return cached;
}
