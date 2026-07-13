
import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool ─────────────────────────────────────────────────────────────
// All seller fields in every listing MUST reference one of these constants.
// Never use an inline anonymous seller object.
//
// `id`, `avgRating`, `reviewCount`, `accountType` added 2026-07-13 — ratings
// are hand-computed from the review arrays in
// app/(main)/u/[handle]/PublicProfileClient.tsx's REVIEWS_BY_HANDLE so the
// two stay consistent (public profile page average === this pool's mock
// value) until a real reviews API replaces both.
// `id` values are distinct synthetic strings, deliberately NOT matching the
// mock session's "mock-user-001" (see lib/session.ts) — none of these
// sellers is "you" in the current POC, so the own-listing guard in
// listings/[listingId]/page.tsx correctly never fires yet. Wire a real id
// once auth ships and a logged-in user can actually own a listing.
export const SELLERS: Record<string, MockListingSeller> = {
  alice: {
    name: "Alice Chen", role: "Private Landlord", location: "East London",
    tagline: "Long-term landlord since 2015 — no agency fees, quick responses",
    memberSince: "2019", activeListings: 4,  lastActive: "2h ago",
    likes: "3.1K", followers: "1.2K", verified: true,
    cover: img(1), avatar: img(4), handle: "alice-chen",
    id: "seller-alice-chen", avgRating: 5.0, reviewCount: 2, accountType: "individual",
  },
  bob: {
    name: "Bob Harrison", role: "Property Agent", location: "South London",
    tagline: "10+ years in London residential lettings and sales",
    memberSince: "2017", activeListings: 22, lastActive: "1h ago",
    likes: "7.4K", followers: "3.1K", verified: true,
    cover: img(2), avatar: img(5), handle: "bob-harrison",
    id: "seller-bob-harrison", avgRating: 4.75, reviewCount: 4, accountType: "individual",
  },
  sarah: {
    name: "Sarah Patel", role: "Letting Agent", location: "North London",
    tagline: "Award-winning agency — transparent fees, no surprises",
    memberSince: "2020", activeListings: 18, lastActive: "30m ago",
    likes: "5.2K", followers: "2.7K", verified: true,
    cover: img(3), avatar: img(6), handle: "sarah-patel",
    id: "seller-sarah-patel", avgRating: 4.5, reviewCount: 2, accountType: "individual",
  },
  prime: {
    name: "Prime Developments Ltd", role: "New Build Developer", location: "London",
    tagline: "Premium new-build homes across Greater London",
    memberSince: "2016", activeListings: 31, lastActive: "3h ago",
    likes: "12.1K", followers: "8.5K", verified: true,
    cover: img(7), avatar: img(8), handle: "prime-developments",
    id: "seller-prime-developments", avgRating: 4.5, reviewCount: 2, accountType: "business",
  },
  james: {
    name: "James O'Brien", role: "Owner", location: "West London",
    tagline: "Selling my family home — no chain, flexible on completion",
    memberSince: "2023", activeListings: 1,  lastActive: "5h ago",
    likes: "0.2K", followers: "0.1K", verified: false,
    cover: img(9), avatar: img(2), handle: "james-obrien",
    id: "seller-james-obrien", avgRating: 5.0, reviewCount: 1, accountType: "individual",
  },
  comm: {
    name: "Meridian Commercial", role: "Commercial Agent", location: "City of London",
    tagline: "Specialists in London office, retail and industrial property",
    memberSince: "2015", activeListings: 47, lastActive: "1h ago",
    likes: "9.8K", followers: "4.3K", verified: true,
    cover: img(6), avatar: img(7), handle: "meridian-commercial",
    id: "seller-meridian-commercial", avgRating: 5.0, reviewCount: 1, accountType: "business",
  },
};

