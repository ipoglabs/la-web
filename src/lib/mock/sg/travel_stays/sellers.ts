import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — Singapore travel & stays ─────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  sentosaHolidayRentalsSG: {
    name: "Sentosa Holiday Rentals", role: "Property Host", location: "Sentosa, Singapore",
    tagline: "Beachfront villas & apartments for short stays",
    memberSince: "2016", activeListings: 9, lastActive: "25m ago",
    likes: "1.2K", followers: "1.7K", verified: true,
    cover: img(1), avatar: img(3),
  },
  boutiqueGuesthouseSG: {
    name: "Boutique Guesthouse Singapore", role: "Guesthouse Owner", location: "Joo Chiat, Singapore",
    tagline: "Cozy Peranakan-style guesthouses",
    memberSince: "2013", activeListings: 6, lastActive: "1h ago",
    likes: "0.8K", followers: "1.1K", verified: true,
    cover: img(2), avatar: img(5),
  },
  regionTourSG: {
    name: "Region Explorer Tours", role: "Tour Operator", location: "Bugis, Singapore",
    tagline: "Regional tour packages across Southeast Asia",
    memberSince: "2011", activeListings: 14, lastActive: "45m ago",
    likes: "1.6K", followers: "2.2K", verified: true,
    cover: img(4), avatar: img(6),
  },
  staycationDealsSG: {
    name: "Staycation Deals Singapore", role: "Staycation Curator", location: "Marina Bay, Singapore",
    tagline: "Weekend staycation packages at top hotels",
    memberSince: "2018", activeListings: 8, lastActive: "1h ago",
    likes: "0.7K", followers: "0.9K", verified: true,
    cover: img(7), avatar: img(8),
  },
  travelServicesSG: {
    name: "TravelEase Services SG", role: "Travel Agency", location: "Raffles Place, Singapore",
    tagline: "Visa assistance, itinerary planning & travel insurance",
    memberSince: "2010", activeListings: 5, lastActive: "2h ago",
    likes: "1.0K", followers: "1.4K", verified: true,
    cover: img(9), avatar: img(2),
  },
  travelGearSG: {
    name: "Wanderer's Gear Shop SG", role: "Travel Accessories Seller", location: "Bugis, Singapore",
    tagline: "Backpacks, luggage & travel essentials",
    memberSince: "2017", activeListings: 16, lastActive: "50m ago",
    likes: "0.7K", followers: "1.0K", verified: true,
    cover: img(3), avatar: img(1),
  },
};
