import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — Singapore ────────────────────────────────────────────────
// All seller fields in every SG listing MUST reference one of these constants.
export const SELLERS: Record<string, MockListingSeller> = {
  weiMing: {
    name: "Tan Wei Ming", role: "Private Owner", location: "Tampines",
    tagline: "Renting out my own unit — no agent fees, direct deal",
    memberSince: "2021", activeListings: 1, lastActive: "1h ago",
    likes: "0.3K", followers: "0.1K", verified: false,
    cover: img(1), avatar: img(4),
  },
  siti: {
    name: "Siti Nurhaliza", role: "PropNex Agent", location: "Bishan",
    tagline: "CEA-registered agent — HDB & condo specialist, 9 years",
    memberSince: "2017", activeListings: 24, lastActive: "20m ago",
    likes: "6.1K", followers: "3.0K", verified: true,
    cover: img(2), avatar: img(5),
  },
  era: {
    name: "ERA Realty Network", role: "Property Agency", location: "Raffles Place",
    tagline: "One of Singapore's largest full-service realty networks",
    memberSince: "2014", activeListings: 58, lastActive: "45m ago",
    likes: "14.5K", followers: "9.2K", verified: true,
    cover: img(3), avatar: img(6),
  },
  rajan: {
    name: "Kumar Rajan", role: "Owner", location: "Punggol",
    tagline: "Upgrading to a new BTO — selling my resale flat",
    memberSince: "2019", activeListings: 1, lastActive: "3h ago",
    likes: "0.2K", followers: "0.1K", verified: false,
    cover: img(7), avatar: img(8),
  },
  huatProperty: {
    name: "Huat Property Holdings", role: "Developer", location: "Bukit Timah",
    tagline: "Boutique developer — landed & freehold projects island-wide",
    memberSince: "2016", activeListings: 19, lastActive: "1h ago",
    likes: "7.8K", followers: "4.1K", verified: true,
    cover: img(9), avatar: img(2),
  },
  campusLiving: {
    name: "Campus Living SG", role: "Student Housing Agency", location: "Clementi",
    tagline: "Managed student accommodation near NUS & NTU",
    memberSince: "2018", activeListings: 12, lastActive: "40m ago",
    likes: "2.4K", followers: "1.1K", verified: true,
    cover: img(4), avatar: img(7),
  },
};
