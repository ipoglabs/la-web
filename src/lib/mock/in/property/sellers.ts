import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — India ────────────────────────────────────────────────────
// All seller fields in every IN listing MUST reference one of these constants.
export const SELLERS: Record<string, MockListingSeller> = {
  rajesh: {
    name: "Rajesh Kumar", role: "Private Owner", location: "Koramangala, Bengaluru",
    tagline: "Selling / renting my own flat — no brokerage, direct deal",
    memberSince: "2021", activeListings: 2, lastActive: "1h ago",
    likes: "0.4K", followers: "0.2K", verified: false,
    cover: img(1), avatar: img(4),
  },
  priya: {
    name: "Priya Sharma", role: "Real Estate Agent", location: "Andheri West, Mumbai",
    tagline: "RERA-registered broker — 8+ years across Mumbai & Pune",
    memberSince: "2018", activeListings: 26, lastActive: "30m ago",
    likes: "6.8K", followers: "3.4K", verified: true,
    cover: img(2), avatar: img(5),
  },
  prestige: {
    name: "Prestige Builders & Developers", role: "Developer", location: "Whitefield, Bengaluru",
    tagline: "RERA-registered developer — premium homes across South India",
    memberSince: "2015", activeListings: 42, lastActive: "2h ago",
    likes: "11.2K", followers: "7.9K", verified: true,
    cover: img(3), avatar: img(6),
  },
  anita: {
    name: "Anita Desai", role: "Owner", location: "Anna Nagar, Chennai",
    tagline: "Family relocating abroad — genuine buyers/tenants only",
    memberSince: "2020", activeListings: 2, lastActive: "5h ago",
    likes: "0.1K", followers: "0.1K", verified: false,
    cover: img(7), avatar: img(8),
  },
  gurgaonRealty: {
    name: "Gurugram Realty Partners", role: "Property Consultant", location: "DLF Cyber City, Gurugram",
    tagline: "Commercial & residential specialists across NCR",
    memberSince: "2016", activeListings: 34, lastActive: "1h ago",
    likes: "9.1K", followers: "4.6K", verified: true,
    cover: img(9), avatar: img(2),
  },
  pgHomes: {
    name: "PG Homes Bengaluru", role: "PG / Hostel Manager", location: "HSR Layout, Bengaluru",
    tagline: "Managed PG accommodation for students & working professionals",
    memberSince: "2019", activeListings: 15, lastActive: "45m ago",
    likes: "2.9K", followers: "1.5K", verified: true,
    cover: img(4), avatar: img(7),
  },
};
