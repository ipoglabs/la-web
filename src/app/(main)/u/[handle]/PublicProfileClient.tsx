"use client";

/**
 * Public Profile — refactored 2026-07-12
 *
 * Audit findings that drove this rewrite:
 *
 * Technical:
 *  - Old mock data was internally inconsistent — header stat said "37 listings"
 *    while only 11 fake items actually existed in the array.
 *  - Listing cards linked to a dead `/post-details` route.
 *  - Phone number used a Singapore (+65) format for a nominally UK-based agent.
 *  → Fixed by grounding the page in a real seller (`SELLERS.bob`) whose actual
 *    listings live in `ALL_PROPERTY_LISTINGS`, so `sellerListings.length` is the
 *    single source of truth everywhere (stat, tab count, empty state) — it can
 *    never drift out of sync again. Phone corrected to UK format.
 *
 * Architecture:
 *  - Old file imported `@radix-ui/react-tabs` directly, violating the Import
 *    Rule (external libs must be wrapped in `components/ui/`).
 *  - A bespoke `ProfileListingCard` duplicated logic already in the shared
 *    `LaThumbnailListingCard` block used everywhere else in the product.
 *  → Fixed by switching to `@/components/ui/tabs` and the shared listing card
 *    (wrapped in `<Link>`, same pattern as `ListingGrid.tsx`).
 *
 * UX:
 *  - Fake pagination showed "18 pages" for 11 items.
 *  - Active/Closed filter pills were always inert for this seller's data
 *    (every listing is implicitly "active").
 *  - 3 redundant contact rows (Email/Phone/Mobile).
 *  → Fixed by removing fake pagination (8 real listings fit on screen),
 *    dropping the filter pills (would still be data-driven if a seller ever
 *    has mixed statuses — simply not needed here), and collapsing contact
 *    down to 2 rows (Email/Phone).
 */

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { BadgeCheck, Mail, Phone, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/avatar/Avatar";
import { LaButton, LaTextarea } from "@/components/la";
import { LaThumbnailListingCard, type ListingStatus } from "@/components/la-blocks/la-thumbnail-listing";
import { LaRelativeDate } from "@/components/la-blocks/la-relative-date";
import MessageResponsiveDialog from "@/components/responsive-dialog/MessageDrawer";
import { useFavouritesStore } from "@/lib/stores/favouritesStore";
import { ALL_PROPERTY_LISTINGS } from "@/lib/mock/gb/property";
import { toast } from "sonner";
import { HANDLE_TO_SELLER, type ProfileHandle } from "./handle-map";

/**
 * DEMO ONLY — cycles every listing-lifecycle status across this seller's real
 * listings so every badge variant can be visually reviewed on one page. Per
 * `types/listing.ts`'s Public Visibility Matrix, only "active", "closed" and
 * "under-review" would ever genuinely appear on a real public profile —
 * "draft"/"pending"/"off-market"/"expired"/"rejected"/"blocked" are
 * dashboard-only states (never shown on a public detail page), and "deleted"
 * listings aren't shown anywhere. Kept here purely for design-system-style
 * badge QA — remove this override once status comes from real data.
 */
const DEMO_STATUS_CYCLE: ListingStatus[] = [
  "active",
  "pending",
  "off-market",
  "expired",
  "closed",
  "under-review",
  "rejected",
  "blocked",
  "draft",
  "deleted",
];

/**
 * `handle` → seller lookup now lives in `./handle-map` (see that file for
 * why it's a separate server-safe module).
 */

type ProfileReview = {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  upvotes: number;
  downvotes: number;
};

/**
 * Per-handle demo reviews + contact details.
 *
 * Previously these were a single module-level `INITIAL_REVIEWS`/`CONTACT`
 * pair hardcoded to Bob Harrison — harmless while only Bob's profile was
 * reachable, but would have shown Bob's reviews/contact under every other
 * seller's hero card the moment `SellerCard.tsx` started linking to them.
 * Keyed by `ProfileHandle` so each of the 6 wired GB-property sellers gets
 * their own (still mock) content.
 * TODO [INTEGRATION]: replace with real reviews/contact API calls, keyed by
 * seller id, once auth/DB ship.
 */
const REVIEWS_BY_HANDLE: Record<ProfileHandle, ProfileReview[]> = {
  "bob-harrison": [
    {
      id: "r1",
      author: "Michael Chen",
      rating: 5,
      date: "2026-06-29T10:00:00Z",
      comment:
        "Bob made the whole letting process incredibly smooth. Very responsive and honest about the property's condition upfront.",
      upvotes: 12,
      downvotes: 0,
    },
    {
      id: "r2",
      author: "Priya Nair",
      rating: 4,
      date: "2026-06-13T10:00:00Z",
      comment:
        "Good communication throughout. Viewing was well organised. Only minor gripe was a slight delay on the deposit paperwork.",
      upvotes: 8,
      downvotes: 1,
    },
    {
      id: "r3",
      author: "James O'Sullivan",
      rating: 5,
      date: "2026-05-13T10:00:00Z",
      comment:
        "Sold my flat in South London through Bob — knows the local market really well and negotiated a great price.",
      upvotes: 15,
      downvotes: 0,
    },
    {
      id: "r4",
      author: "Aisha Rahman",
      rating: 5,
      date: "2026-04-13T10:00:00Z",
      comment: "Professional, punctual and genuinely helpful. Would recommend to anyone renting in South London.",
      upvotes: 6,
      downvotes: 0,
    },
  ],
  "alice-chen": [
    {
      id: "r1",
      author: "Tom Baxter",
      rating: 5,
      date: "2026-06-20T10:00:00Z",
      comment: "Alice has been a fantastic landlord — quick to fix issues and never charges hidden fees.",
      upvotes: 9,
      downvotes: 0,
    },
    {
      id: "r2",
      author: "Grace Adeyemi",
      rating: 5,
      date: "2026-05-30T10:00:00Z",
      comment: "Renting from Alice for 2 years now, always responsive and fair on renewals.",
      upvotes: 5,
      downvotes: 0,
    },
  ],
  "sarah-patel": [
    {
      id: "r1",
      author: "Daniel Osei",
      rating: 5,
      date: "2026-06-18T10:00:00Z",
      comment: "Sarah's agency was transparent about every fee upfront — no surprises at all.",
      upvotes: 11,
      downvotes: 0,
    },
    {
      id: "r2",
      author: "Emily Foster",
      rating: 4,
      date: "2026-05-22T10:00:00Z",
      comment: "Great viewing experience, though the paperwork took a couple of extra days.",
      upvotes: 4,
      downvotes: 0,
    },
  ],
  "james-obrien": [
    {
      id: "r1",
      author: "Laura Kim",
      rating: 5,
      date: "2026-06-05T10:00:00Z",
      comment: "James was upfront that he's selling his own home — no chain, made things really easy.",
      upvotes: 3,
      downvotes: 0,
    },
  ],
  "prime-developments": [
    {
      id: "r1",
      author: "Robert Nguyen",
      rating: 5,
      date: "2026-06-25T10:00:00Z",
      comment: "Bought a new-build through Prime Developments — quality finish and smooth handover.",
      upvotes: 18,
      downvotes: 0,
    },
    {
      id: "r2",
      author: "Fatima Al-Sayed",
      rating: 4,
      date: "2026-05-10T10:00:00Z",
      comment: "Good development overall, though the show home queue was long on viewing day.",
      upvotes: 7,
      downvotes: 1,
    },
  ],
  "meridian-commercial": [
    {
      id: "r1",
      author: "Oliver Hughes",
      rating: 5,
      date: "2026-06-15T10:00:00Z",
      comment: "Meridian found us the right retail unit in the City fast — very knowledgeable team.",
      upvotes: 10,
      downvotes: 0,
    },
  ],
  // Demo alias — mirrors HANDLE_TO_SELLER's anto27 → Bob alias, so the
  // private `/profile` page's "preview my public profile" journey keeps
  // showing the same reviews it always has.
  anto27: [],
};
REVIEWS_BY_HANDLE.anto27 = REVIEWS_BY_HANDLE["bob-harrison"];

const CONTACT_BY_HANDLE: Record<ProfileHandle, { email: { masked: string; revealed: string }; phone: { masked: string; revealed: string } }> = {
  "bob-harrison": {
    email: { masked: "b••••••@ldnlettings.co.uk", revealed: "bob.harrison@ldnlettings.co.uk" },
    phone: { masked: "+44 77•• •••123", revealed: "+44 7700 900123" },
  },
  "alice-chen": {
    email: { masked: "a••••@gmail.com", revealed: "alice.chen@gmail.com" },
    phone: { masked: "+44 78•• •••456", revealed: "+44 7800 900456" },
  },
  "sarah-patel": {
    email: { masked: "s•••••@primelettings.co.uk", revealed: "sarah.patel@primelettings.co.uk" },
    phone: { masked: "+44 79•• •••789", revealed: "+44 7900 900789" },
  },
  "james-obrien": {
    email: { masked: "j••••@gmail.com", revealed: "james.obrien@gmail.com" },
    phone: { masked: "+44 75•• •••321", revealed: "+44 7500 900321" },
  },
  "prime-developments": {
    email: { masked: "s••••@primedevelopments.co.uk", revealed: "sales@primedevelopments.co.uk" },
    phone: { masked: "+44 20 7••• •654", revealed: "+44 20 7946 0654" },
  },
  "meridian-commercial": {
    email: { masked: "e••••••@meridiancommercial.co.uk", revealed: "enquiries@meridiancommercial.co.uk" },
    phone: { masked: "+44 20 7••• •987", revealed: "+44 20 7946 0987" },
  },
  anto27: {
    email: { masked: "b••••••@ldnlettings.co.uk", revealed: "bob.harrison@ldnlettings.co.uk" },
    phone: { masked: "+44 77•• •••123", revealed: "+44 7700 900123" },
  },
};

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          strokeWidth={1.5}
          aria-hidden="true"
          className={i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-none text-slate-300"}
        />
      ))}
    </div>
  );
}

function ProfileStat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center px-4 py-2">
      <span className="text-lg font-semibold text-slate-900">{value}</span>
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  );
}

function ContactRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-4 py-3">
      <span className="text-slate-500">{icon}</span>
      <div className="flex flex-col">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="text-sm font-medium text-slate-700">{value}</span>
      </div>
    </div>
  );
}

/**
 * Derives the Avatar's presence dot from the seller's real `lastActive`
 * string (e.g. "30m ago", "1h ago", "5h ago") — replaces the earlier
 * hardcoded `status="online"` that contradicted whatever `lastActive` said.
 * Heuristic: active within the last hour → online, otherwise offline.
 * A real implementation would compare a `lastSeenAt` timestamp to now.
 */
function getPresenceStatus(lastActive: string): "online" | "offline" {
  const match = /(\d+)\s*(m|h|d)/.exec(lastActive);
  if (!match) return "offline";
  const [, amountStr, unit] = match;
  const amount = Number(amountStr);
  if (unit === "m") return "online";
  if (unit === "h") return amount <= 1 ? "online" : "offline";
  return "offline";
}

export default function PublicProfileClient({ handle }: { handle: string }) {
  const [contactRevealed, setContactRevealed] = useState(false);
  const [pendingRating, setPendingRating] = useState(0);
  const [pendingComment, setPendingComment] = useState("");
  const [reviewVotes, setReviewVotes] = useState<Record<string, "up" | "down" | null>>({});
  const [reviews, setReviews] = useState(
    REVIEWS_BY_HANDLE[handle as ProfileHandle] ?? []
  );

  const favItems = useFavouritesStore((s) => s.items);
  const addFav = useFavouritesStore((s) => s.add);
  const removeFav = useFavouritesStore((s) => s.remove);

  const profileSeller = HANDLE_TO_SELLER[handle as ProfileHandle];
  const contact = CONTACT_BY_HANDLE[handle as ProfileHandle];

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingBreakdown = [5, 4, 3, 2, 1]
    .map((star) => ({ star, count: reviews.filter((r) => r.rating === star).length }))
    .filter(({ count }) => count > 0);

  function handleVote(id: string, direction: "up" | "down") {
    setReviewVotes((prev) => ({ ...prev, [id]: prev[id] === direction ? null : direction }));
  }

  function handleSubmitReview() {
    setReviews((prev) => [
      {
        id: `r-${Date.now()}`,
        author: "You",
        rating: pendingRating,
        date: new Date().toISOString(),
        comment: pendingComment.trim(),
        upvotes: 0,
        downvotes: 0,
      },
      ...prev,
    ]);
    setPendingRating(0);
    setPendingComment("");
    toast.success("Review posted");
  }

  if (!profileSeller) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Profile not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          There&apos;s no seller profile at &ldquo;{handle}&rdquo;.
        </p>
        <Link href="/" className="mt-4 text-sm font-medium text-blue-600 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  const sellerListings = ALL_PROPERTY_LISTINGS.filter((l) => l.seller === profileSeller);

  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      {/* Profile card */}
      <div className="rounded-xl border border-slate-300 bg-white p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
            <Avatar
              src={profileSeller.avatar}
              alt={profileSeller.name}
              initials={profileSeller.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
              size="2xl"
              status={getPresenceStatus(profileSeller.lastActive)}
              ring
            />

            <div className="w-full flex-1">
              <div className="flex items-center justify-center gap-1.5 sm:justify-start">
                <h1 className="text-xl font-semibold text-slate-900">{profileSeller.name}</h1>
                {profileSeller.verified && (
                  <span className="inline-flex items-center" title="Verified seller">
                    <BadgeCheck
                      width={20}
                      height={20}
                      aria-hidden="true"
                      className="text-blue-500"
                      fill="currentColor"
                      stroke="white"
                    />
                    <span className="sr-only">Verified seller</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">
                {profileSeller.role} · {profileSeller.location}
              </p>
              {/* Not italicised — italics reduce legibility for low-vision reading */}
              <p className="mt-2 text-sm text-slate-700">{profileSeller.tagline}</p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="text-2xl font-semibold text-slate-900">{avgRating.toFixed(1)}</span>
                <StarRating rating={avgRating} size={20} />
                <span className="text-sm text-slate-500">({reviews.length} reviews)</span>
                {ratingBreakdown.length > 0 && (
                  <span className="text-sm text-slate-500">
                    ·{" "}
                    {ratingBreakdown.map(({ star, count }, i) => (
                      <span key={star}>
                        {i > 0 && " · "}
                        {count} rated {star}★
                      </span>
                    ))}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Member since {profileSeller.memberSince} · Active {profileSeller.lastActive}
              </p>
            </div>
          </div>

          {/* Stat + primary CTA — right-aligned, uses the spare horizontal space on desktop */}
          <div className="hidden shrink-0 flex-col items-end gap-3 sm:flex">
            <LaButton intent="link" size="default" className="h-auto p-0">
              {profileSeller.followers} Followers
            </LaButton>
            <div className="w-48">
              <MessageResponsiveDialog sellerName={profileSeller.name} />
            </div>
          </div>
        </div>

        {/* Mobile stat + CTA — desktop's side-by-side layout has no room on narrow screens */}
        <div className="mt-4 flex flex-col items-center border-t border-slate-300 pt-4 sm:hidden">
          <LaButton intent="link" size="default" className="h-auto p-0">
            {profileSeller.followers} Followers
          </LaButton>
          <div className="mt-4 w-full">
            <MessageResponsiveDialog sellerName={profileSeller.name} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="listing" className="mt-6">
        <TabsList>
          <TabsTrigger value="listing">Listings ({sellerListings.length})</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="listing" className="min-h-105 p-4">
          {sellerListings.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">No listings yet.</p>
          ) : (
            <>
              <p className="mb-3 text-sm text-slate-500">
                Demo: every listing status badge, cycled across these cards for visual QA. In
                real use only <span className="font-medium text-slate-700">Active</span>,{" "}
                <span className="font-medium text-slate-700">Closed</span> and{" "}
                <span className="font-medium text-slate-700">Under Review</span> ever appear on a
                public profile — the rest are seller-dashboard-only states.
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {sellerListings.map((item, i) => {
                  const isFav = favItems.some((f) => f.id === item.id);
                  const demoStatus = DEMO_STATUS_CYCLE[i % DEMO_STATUS_CYCLE.length];
                  return (
                    <Link key={item.id} href={item.href}>
                      <LaThumbnailListingCard
                        images={item.images}
                        priceLabel={item.priceLabel}
                        priceSuffix={item.priceSuffix}
                        title={item.title}
                        detailsLabel={item.detailsLabel}
                        locationLabel={item.locationLabel}
                        postedAt={item.postedAt}
                        status={demoStatus}
                        favorite={isFav}
                        onFavoriteChange={(next) => {
                          if (next) {
                            addFav({
                              id: item.id,
                              image: item.images[0],
                              priceLabel: item.priceLabel,
                              priceSuffix: item.priceSuffix,
                              title: item.title,
                              detailsLabel: item.detailsLabel,
                              locationLabel: item.locationLabel,
                              // postedAt is ISO string in Listing — store expects unix ms
                              postedAt: new Date(item.postedAt).getTime(),
                              status: demoStatus,
                            });
                          } else {
                            removeFav(item.id);
                          }
                        }}
                      />
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="min-h-105 px-4 pb-4 pt-1.5">
          <div className="overflow-hidden rounded-md border-[1.5px] border-gray-700/55">
            <div className="flex items-center gap-1 border-b border-slate-200 bg-gray-50 px-3 py-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <LaButton
                  key={i}
                  intent="ghost"
                  iconOnly
                  className="h-auto w-auto rounded-md p-0.5 [&_svg]:size-5.5"
                  onClick={() => setPendingRating(i + 1)}
                  aria-label={`Rate ${i + 1} star${i === 0 ? "" : "s"}`}
                  aria-pressed={i < pendingRating}
                >
                  <Star
                    strokeWidth={1.5}
                    className={i < pendingRating ? "fill-amber-400 text-amber-400" : "fill-none text-slate-300"}
                  />
                </LaButton>
              ))}
            </div>
            <div className="relative">
              <LaTextarea
                value={pendingComment}
                onChange={(e) => setPendingComment(e.target.value)}
                placeholder="Share your experience..."
                rows={2}
                className="rounded-none border-0 pt-4 pr-24"
              />
              <LaButton
                intent="primary-blue"
                size="compact"
                className="absolute bottom-2.5 right-2.5"
                onClick={handleSubmitReview}
                disabled={pendingRating === 0 || pendingComment.trim().length === 0}
              >
                Submit
              </LaButton>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-t border-slate-300 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{review.author}</span>
                  <LaRelativeDate value={review.date} className="text-sm text-slate-500" />
                </div>
                <StarRating rating={review.rating} />
                <p className="mt-2 text-sm text-slate-700">{review.comment}</p>
                <div className="mt-2 flex items-center gap-4">
                  <LaButton
                    intent="ghost"
                    size="compact"
                    className={`h-auto rounded-md px-2 py-1 ${
                      reviewVotes[review.id] === "up" ? "text-blue-600" : "text-slate-500"
                    }`}
                    onClick={() => handleVote(review.id, "up")}
                  >
                    <ThumbsUp width={16} height={16} />
                    {review.upvotes + (reviewVotes[review.id] === "up" ? 1 : 0)}
                  </LaButton>
                  <LaButton
                    intent="ghost"
                    size="compact"
                    className={`h-auto rounded-md px-2 py-1 ${
                      reviewVotes[review.id] === "down" ? "text-rose-600" : "text-slate-500"
                    }`}
                    onClick={() => handleVote(review.id, "down")}
                  >
                    <ThumbsDown width={16} height={16} />
                    {review.downvotes + (reviewVotes[review.id] === "down" ? 1 : 0)}
                  </LaButton>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="min-h-105 p-4">
          <div className="space-y-3">
            <ContactRow
              icon={<Mail width={18} height={18} />}
              label="Email"
              value={contactRevealed ? contact.email.revealed : contact.email.masked}
            />
            <ContactRow
              icon={<Phone width={18} height={18} />}
              label="Phone"
              value={contactRevealed ? contact.phone.revealed : contact.phone.masked}
            />

            {!contactRevealed && (
              <LaButton intent="link" size="default" className="h-auto p-0" onClick={() => setContactRevealed(true)}>
                Reveal contact details
              </LaButton>
            )}

            <p className="mt-4 border-t border-slate-300 pt-4 text-sm text-slate-500">
              Prefer to message instead? Use the &ldquo;Send a message&rdquo; button above —
              usually replies within 24 hours · English.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
