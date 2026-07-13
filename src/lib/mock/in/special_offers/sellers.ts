import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — India special offers ─────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  hdfcOffersDesk: {
    name: "HDFC Bank Offers Desk", role: "Banking Partner", location: "Nariman Point, Mumbai",
    tagline: "Exclusive card offers and cashback deals",
    memberSince: "2012", activeListings: 14, lastActive: "30m ago",
    likes: "3.2K", followers: "5.1K", verified: true,
    cover: img(1), avatar: img(3),
  },
  makeMyDealsIndia: {
    name: "MakeMyDeals India", role: "Travel Deals Partner", location: "Gurugram, Delhi/NCR",
    tagline: "Flight & hotel deals across India and abroad",
    memberSince: "2015", activeListings: 20, lastActive: "1h ago",
    likes: "2.6K", followers: "4.0K", verified: true,
    cover: img(2), avatar: img(5),
  },
  bigBazaarDeals: {
    name: "Big Bazaar Deals", role: "Retail Partner", location: "Andheri, Mumbai",
    tagline: "Weekend sales & festive shopping discounts",
    memberSince: "2013", activeListings: 18, lastActive: "45m ago",
    likes: "2.1K", followers: "3.5K", verified: true,
    cover: img(4), avatar: img(6),
  },
  swiggyOffersHub: {
    name: "Swiggy Offers Hub", role: "Food Delivery Partner", location: "Koramangala, Bengaluru",
    tagline: "Daily discounts on food delivery & dining out",
    memberSince: "2016", activeListings: 25, lastActive: "10m ago",
    likes: "4.5K", followers: "6.2K", verified: true,
    cover: img(7), avatar: img(8),
  },
  cromaDealsIndia: {
    name: "Croma Deals India", role: "Electronics Retailer", location: "Powai, Mumbai",
    tagline: "Latest electronics discounts & exchange offers",
    memberSince: "2011", activeListings: 12, lastActive: "2h ago",
    likes: "1.9K", followers: "2.8K", verified: true,
    cover: img(9), avatar: img(2),
  },
  cultFitOffers: {
    name: "Cult.fit Offers", role: "Wellness Partner", location: "HSR Layout, Bengaluru",
    tagline: "Gym & wellness membership discounts",
    memberSince: "2018", activeListings: 8, lastActive: "3h ago",
    likes: "1.2K", followers: "1.8K", verified: true,
    cover: img(3), avatar: img(1),
  },
  byjusOffersDesk: {
    name: "BYJU'S Offers Desk", role: "Education Partner", location: "Whitefield, Bengaluru",
    tagline: "Course discounts for students & parents",
    memberSince: "2017", activeListings: 6, lastActive: "4h ago",
    likes: "0.9K", followers: "1.5K", verified: true,
    cover: img(5), avatar: img(4),
  },
  festiveDealsIndia: {
    name: "Festive Deals India", role: "Seasonal Promotions", location: "Connaught Place, Delhi",
    tagline: "Holiday & festival season shopping deals",
    memberSince: "2014", activeListings: 16, lastActive: "1h ago",
    likes: "2.4K", followers: "3.1K", verified: true,
    cover: img(6), avatar: img(9),
  },
};
