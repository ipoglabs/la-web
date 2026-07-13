import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — Singapore special offers ─────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  dbsOffersDeskSG: {
    name: "DBS Bank Offers Desk", role: "Banking Partner", location: "Marina Bay, Singapore",
    tagline: "Exclusive card offers and cashback deals",
    memberSince: "2012", activeListings: 14, lastActive: "30m ago",
    likes: "3.0K", followers: "4.8K", verified: true,
    cover: img(1), avatar: img(3),
  },
  changiTravelDealsSG: {
    name: "Changi Travel Deals", role: "Travel Deals Partner", location: "Changi, Singapore",
    tagline: "Flight & hotel deals across the region",
    memberSince: "2015", activeListings: 20, lastActive: "1h ago",
    likes: "2.5K", followers: "3.8K", verified: true,
    cover: img(2), avatar: img(5),
  },
  ntucDealsSG: {
    name: "NTUC FairPrice Deals", role: "Retail Partner", location: "Bishan, Singapore",
    tagline: "Weekend sales & festive shopping discounts",
    memberSince: "2013", activeListings: 18, lastActive: "45m ago",
    likes: "2.0K", followers: "3.3K", verified: true,
    cover: img(4), avatar: img(6),
  },
  foodpandaOffersSG: {
    name: "foodpanda Offers Hub", role: "Food Delivery Partner", location: "Tanjong Pagar, Singapore",
    tagline: "Daily discounts on food delivery & dining out",
    memberSince: "2016", activeListings: 25, lastActive: "10m ago",
    likes: "4.2K", followers: "5.9K", verified: true,
    cover: img(7), avatar: img(8),
  },
  courtsDealsSG: {
    name: "Courts Deals SG", role: "Electronics Retailer", location: "Jurong, Singapore",
    tagline: "Latest electronics discounts & exchange offers",
    memberSince: "2011", activeListings: 12, lastActive: "2h ago",
    likes: "1.8K", followers: "2.6K", verified: true,
    cover: img(9), avatar: img(2),
  },
  fitnessFirstOffersSG: {
    name: "Fitness First Offers", role: "Wellness Partner", location: "Novena, Singapore",
    tagline: "Gym & wellness membership discounts",
    memberSince: "2018", activeListings: 8, lastActive: "3h ago",
    likes: "1.1K", followers: "1.7K", verified: true,
    cover: img(3), avatar: img(1),
  },
  mindChampsOffersSG: {
    name: "MindChamps Offers Desk", role: "Education Partner", location: "One-North, Singapore",
    tagline: "Course discounts for students & parents",
    memberSince: "2017", activeListings: 6, lastActive: "4h ago",
    likes: "0.8K", followers: "1.4K", verified: true,
    cover: img(5), avatar: img(4),
  },
  festiveDealsSG: {
    name: "Festive Deals Singapore", role: "Seasonal Promotions", location: "Raffles Place, Singapore",
    tagline: "Holiday & festival season shopping deals",
    memberSince: "2014", activeListings: 16, lastActive: "1h ago",
    likes: "2.2K", followers: "2.9K", verified: true,
    cover: img(6), avatar: img(9),
  },
};
