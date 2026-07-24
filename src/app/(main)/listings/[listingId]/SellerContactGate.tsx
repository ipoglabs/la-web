"use client";

/**
 * SellerContactGate — thin client wrapper around SellerCard.
 *
 * Added 2026-07-13 as part of the listing-detail Seller Card gap analysis
 * (see md/architecture/api/07-real-api-gap-inventory.md domains 4 & 5).
 * Deliberately does NOT modify SellerCard.tsx's markup/styling — that file
 * stays exactly as designed. This component only adds two things around it:
 *
 *  1. Own-listing guard — `isOwnListing` is computed server-side in page.tsx
 *     (session.id === seller.id) and passed in as a plain boolean prop
 *     (serializable across the Server → Client boundary, unlike a function).
 *     When true, SellerCard is not rendered at all — a seller should never
 *     see Email/Call/ChitChat CTAs on their own ad. Per the journey doc
 *     (md/architecture/journeys/03-listing-detail.md#page-load-sequence),
 *     the correct treatment is to swap those CTAs for an edit affordance.
 *
 *  2. Email/Call wiring — SellerCard's onEmail/onCall props existed but were
 *     never passed a function (page.tsx is a Server Component and can't hand
 *     a closure to a "use client" child directly). Real auth-gated
 *     email/reveal-phone endpoints don't exist yet (still 📐 in the gap
 *     inventory), so for now these show an honest "sign in to contact" toast
 *     instead of a silently-dead button — TODO [INTEGRATION]: replace both
 *     with the real calls once /api/auth/* and phone-reveal exist.
 */

import Link from "next/link";
import { toast } from "sonner";
import { PencilLine } from "lucide-react";
import SellerCard from "./SellerCard";
import type { Seller } from "@/types/listing";

interface SellerContactGateProps {
  seller: Seller;
  variant?: "right" | "left";
  isOwnListing: boolean;
  /** Needed only for the own-listing "Edit" link. */
  listingId: string;
}

function handleEmail() {
  toast.info("Sign in to email this seller");
}

function handleCall() {
  toast.info("Sign in to reveal this seller's phone number");
}

export default function SellerContactGate({ seller, variant = "right", isOwnListing, listingId }: SellerContactGateProps) {
  if (isOwnListing) {
    return (
      <section className="bg-white px-4 py-5 border-y border-slate-900/25 sm:rounded-md sm:border sm:shadow-sm flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">This is your listing — buyers see your contact details here.</p>
        <Link
          href={`/myads?edit=${listingId}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 shrink-0"
        >
          <PencilLine className="size-4" />
          Edit
        </Link>
      </section>
    );
  }

  return <SellerCard seller={seller} variant={variant} onEmail={handleEmail} onCall={handleCall} />;
}
