import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — India travel & stays ─────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  goaHolidayRentalsIndia: {
    name: "Goa Holiday Rentals", role: "Property Host", location: "Calangute, Goa",
    tagline: "Beachfront villas & apartments for short stays",
    memberSince: "2016", activeListings: 9, lastActive: "25m ago",
    likes: "1.3K", followers: "1.9K", verified: true,
    cover: img(1), avatar: img(3),
  },
  keralaGuesthouseIndia: {
    name: "Backwater Guesthouse Kerala", role: "Guesthouse Owner", location: "Alleppey, Kerala",
    tagline: "Cozy guesthouses near the backwaters",
    memberSince: "2013", activeListings: 6, lastActive: "1h ago",
    likes: "0.9K", followers: "1.2K", verified: true,
    cover: img(2), avatar: img(5),
  },
  himalayanTourIndia: {
    name: "Himalayan Tour Packages", role: "Tour Operator", location: "Manali, Himachal Pradesh",
    tagline: "Trekking & adventure tour packages",
    memberSince: "2011", activeListings: 14, lastActive: "45m ago",
    likes: "1.8K", followers: "2.5K", verified: true,
    cover: img(4), avatar: img(6),
  },
  staycationDealsIndia: {
    name: "Staycation Deals India", role: "Staycation Curator", location: "Lonavala, Maharashtra",
    tagline: "Weekend staycation packages near major cities",
    memberSince: "2018", activeListings: 8, lastActive: "1h ago",
    likes: "0.7K", followers: "1.0K", verified: true,
    cover: img(7), avatar: img(8),
  },
  travelServicesIndia: {
    name: "TravelEase Services", role: "Travel Agency", location: "Connaught Place, Delhi",
    tagline: "Visa assistance, itinerary planning & travel insurance",
    memberSince: "2010", activeListings: 5, lastActive: "2h ago",
    likes: "1.1K", followers: "1.5K", verified: true,
    cover: img(9), avatar: img(2),
  },
  travelGearIndia: {
    name: "Wanderer's Gear Shop", role: "Travel Accessories Seller", location: "Commercial Street, Bengaluru",
    tagline: "Backpacks, luggage & travel essentials",
    memberSince: "2017", activeListings: 16, lastActive: "50m ago",
    likes: "0.8K", followers: "1.1K", verified: true,
    cover: img(3), avatar: img(1),
  },
};
