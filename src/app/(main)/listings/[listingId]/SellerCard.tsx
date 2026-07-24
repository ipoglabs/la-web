"use client";

import Link from "next/link";
import { Mail, Phone, Clock } from "lucide-react";
import { LaButton } from "@/components/la";
import type { Seller } from "@/types/listing";

export type { Seller };

interface SellerCardProps {
  seller: Seller;
  /**
   * "right" (default) — fully self-contained vertical layout with cover photo;
   *   renders its own <section> card — no outer wrapper needed in the parent.
   * "left" — fully self-contained horizontal compact layout for mobile;
   *   renders its own <section> + CTA strip (both md:hidden).
   */
  variant?: "right" | "left";
  /**
   * TODO [INTEGRATION]: Open email compose modal, pre-fill with seller email,
   * or call POST /api/contact/{seller.id} — after verifying user is authenticated.
   */
  onEmail?: () => void;
  /**
   * TODO [INTEGRATION]: Reveal seller phone number after an auth-gated API call
   * (GET /api/sellers/{seller.id}/phone), then use a `tel:` intent or show a modal.
   * Never expose phone numbers in the public seller payload.
   */
  onCall?: () => void;
}

// ─── Shared SVGs ──────────────────────────────────────────────────────────────
function VerifiedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 shrink-0" aria-hidden>
      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
  );
}

function LikesIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-4 shrink-0" aria-hidden>
      <path d="M2.09 15a1 1 0 0 0 1-1V8a1 1 0 1 0-2 0v6a1 1 0 0 0 1 1ZM5.765 13H4.09V8c.663 0 1.218-.466 1.556-1.037a4.02 4.02 0 0 1 1.358-1.377c.478-.292.907-.706.989-1.26V4.32a9.03 9.03 0 0 0 0-2.642c-.028-.194.048-.394.224-.479A2 2 0 0 1 11.09 3c0 .812-.08 1.605-.235 2.371a.521.521 0 0 0 .502.629h1.733c1.104 0 2.01.898 1.901 1.997a19.831 19.831 0 0 1-1.081 4.788c-.27.747-.998 1.215-1.793 1.215H9.414c-.215 0-.428-.035-.632-.103l-2.384-.794A2.002 2.002 0 0 0 5.765 13Z" />
    </svg>
  );
}

function FollowersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 shrink-0" aria-hidden>
      <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 shrink-0" aria-hidden>
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L10 18.354l-4.626 2.821c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006Z" clipRule="evenodd" />
    </svg>
  );
}

/** Compact trust-signal badge (avgRating + reviewCount). Renders nothing when either field is absent from the mock/API data — additive, matches the existing Verified/Likes/Followers badge styling exactly. */
function RatingBadge({ seller, className }: { seller: Seller; className?: string }) {
  if (seller.avgRating == null || seller.reviewCount == null) return null;
  return (
    <span className={className}>
      <StarIcon />
      <span>{seller.avgRating.toFixed(1)} ({seller.reviewCount})</span>
    </span>
  );
}

// ─── Internal prop shape for both layout variants ────────────────────────────
interface SellerCardInternalProps {
  seller: Seller;
  onEmail?: () => void;
  onCall?: () => void;
}

// ─── Mobile layout (md:hidden) ────────────────────────────────────────────────
function SellerCardMobile({ seller, onEmail, onCall }: SellerCardInternalProps) {
  const profileHref = seller.handle ? `/u/${seller.handle}` : undefined;
  return (
    <>
      {/* Info section */}
      <section className="md:hidden bg-white px-4 py-5 border-y border-slate-900/25 sm:rounded-md sm:border sm:shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Seller Details</h2>

        <div className="flex flex-row flex-nowrap gap-3">
          {/* Avatar */}
          {profileHref ? (
            <Link href={profileHref} className="flex-none size-24 rounded-full border-4 border-slate-100 overflow-hidden bg-slate-200 shrink-0" aria-label={`View ${seller.name}'s profile`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={seller.avatar} alt={seller.name} className="h-full w-full object-cover object-center" loading="lazy" />
            </Link>
          ) : (
            <div className="flex-none size-24 rounded-full border-4 border-slate-100 overflow-hidden bg-slate-200 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={seller.avatar} alt={seller.name} className="h-full w-full object-cover object-center" loading="lazy" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Name */}
            <h3 className="font-bold text-xl text-slate-900 leading-tight">
              {profileHref ? <Link href={profileHref}>{seller.name}</Link> : seller.name}
            </h3>

            {/* Role + location + tagline */}
            <p className="text-sm text-slate-600 mt-0.5">
              {seller.role}, located in {seller.location}
            </p>
            <p className="text-sm italic font-medium text-slate-700 mt-0.5">&ldquo;{seller.tagline}&rdquo;</p>

            {/* Verified + rating + metrics */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {seller.verified && (
                <span className="inline-flex items-center gap-1 text-blue-700 text-sm font-semibold">
                  <VerifiedIcon />
                  Verified
                </span>
              )}
              <RatingBadge seller={seller} className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md" />
              <span className="inline-flex items-center gap-1 text-sm text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                <LikesIcon />
                {seller.likes}
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                <FollowersIcon />
                {seller.followers}
              </span>
            </div>
          </div>
        </div>

        {/* Key facts */}
        <p className="text-sm text-slate-500 mt-3">
          Loyal user since {seller.memberSince}
          <span className="mx-1.5 text-slate-300">|</span>
          {seller.activeListings} active listings
          <span className="mx-1.5 text-slate-300">|</span>
          <Clock className="inline size-3.5 text-slate-400 -mt-px" />
          <span className="ml-0.5">Active: {seller.lastActive}</span>
        </p>
      </section>

      {/* CTA strip */}
      <section className="md:hidden bg-slate-700 px-3 py-3 sm:rounded-b-md sm:shadow-sm flex flex-row gap-3 -mt-3 z-10 relative">
        <LaButton intent="primary-blue" size="big" className="flex-1 rounded-xl" onClick={onEmail}>
          <Mail className="size-5" />
          Email
        </LaButton>
        <LaButton intent="primary-rose" size="big" className="flex-1 rounded-xl" onClick={onCall}>
          <Phone className="size-5" />
          Call
        </LaButton>
      </section>
    </>
  );
}

// ─── Desktop layout (md+) — self-contained section matching the HTML template ──
function SellerCardDesktop({ seller, onEmail, onCall }: SellerCardInternalProps) {
  const profileHref = seller.handle ? `/u/${seller.handle}` : undefined;
  return (
    <section className="bg-white border border-slate-900/25 rounded-md shadow-black/10 shadow-md overflow-hidden">

      {/* Cover photo */}
      <div className="bg-slate-500 rounded-tl-md h-32 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="object-cover object-top w-full" src={seller.cover} alt="" aria-hidden loading="lazy" />
      </div>

      <div className="max-lg:px-2 px-5 pt-3 mb-2 text-center">

        {/* Avatar — overlaps cover */}
        {profileHref ? (
          <Link href={profileHref} className="mx-auto w-32 h-32 relative -mt-28 border-4 border-white rounded-full overflow-hidden block" aria-label={`View ${seller.name}'s profile`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="object-cover object-center h-full w-full" src={seller.avatar} alt={seller.name} loading="lazy" />
          </Link>
        ) : (
          <div className="mx-auto w-32 h-32 relative -mt-28 border-4 border-white rounded-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="object-cover object-center h-full w-full" src={seller.avatar} alt={seller.name} loading="lazy" />
          </div>
        )}

        {/* Name */}
        <h3 className="relative inline-block font-bold max-lg:text-xl text-2xl text-gray-800 mb-1">
          {profileHref ? <Link href={profileHref}>{seller.name}</Link> : seller.name}
        </h3>

        {/* Role + location */}
        <p className="-mt-1 mb-0.5 text-slate-600 max-lg:text-sm">
          {seller.role}, located in{" "}
          <span className="inline">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3 inline" aria-hidden>
              <path fillRule="evenodd" d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" clipRule="evenodd" />
            </svg>
          </span>
          {" "}{seller.location}
        </p>

        {/* Tagline */}
        <p className="italic max-lg:text-sm text-base font-medium text-slate-700 mb-4">
          &ldquo;{seller.tagline}&rdquo;
        </p>

        {/* Verified badge + rating */}
        <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
          {seller.verified && (
            <div className="bg-blue-200 text-blue-700 inline-flex items-center text-sm text-center px-2 py-1 rounded-md font-semibold">
              <VerifiedIcon />
              <span className="ml-1">Verified Seller</span>
            </div>
          )}
          <RatingBadge seller={seller} className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-md" />
        </div>

        {/* Key facts */}
        <div className="mb-4 px-5 text-[14px] text-slate-700 leading-6">
          <span>Loyal user since {seller.memberSince}</span>{" | "}
          <span>{seller.activeListings} active listings</span>{" | "}
          <span className="inline">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="inline size-4 text-slate-500" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </span>
          {" "}<span>Last Active: {seller.lastActive}</span>
        </div>

        {/* Social metrics */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="px-3 py-1 flex flex-row flex-nowrap gap-1 text-sm text-slate-600 bg-slate-100 rounded-md">
            <LikesIcon />
            <span>{seller.likes} <span className="max-lg:hidden">likes</span></span>
          </div>
          <div className="px-3 py-1 flex flex-row flex-nowrap gap-1 text-sm text-slate-600 bg-slate-100 rounded-md">
            <FollowersIcon />
            <span>{seller.followers} <span className="max-lg:hidden">followers</span></span>
          </div>
        </div>

      </div>

      {/* CTAs */}
      <div className="px-6 mb-5 flex flex-col flex-nowrap items-start gap-2.5">
        <LaButton intent="outline" size="big" className="w-full rounded-lg" onClick={onEmail}>
          <Mail className="size-5" />
          Email
        </LaButton>
        <LaButton intent="primary-rose" size="big" className="w-full rounded-lg" onClick={onCall}>
          <Phone className="size-5" />
          Call
        </LaButton>
      </div>

    </section>
  );
}

// ─── Exported component ───────────────────────────────────────────────────────
export default function SellerCard({ seller, variant = "right", onEmail, onCall }: SellerCardProps) {
  if (variant === "left") return <SellerCardMobile seller={seller} onEmail={onEmail} onCall={onCall} />;
  return <SellerCardDesktop seller={seller} onEmail={onEmail} onCall={onCall} />;
}
