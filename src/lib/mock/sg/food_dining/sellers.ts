import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — Singapore food & dining ──────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  homeChefSG: {
    name: "Mei's Home Kitchen", role: "Home Chef", location: "Toa Payoh, Singapore",
    tagline: "Authentic Peranakan home-cooked meals",
    memberSince: "2019", activeListings: 6, lastActive: "15m ago",
    likes: "0.6K", followers: "0.9K", verified: true,
    cover: img(1), avatar: img(3),
  },
  cateringServiceSG: {
    name: "Royal Caterers Singapore", role: "Catering Service", location: "Ubi, Singapore",
    tagline: "Wedding, corporate & party catering",
    memberSince: "2012", activeListings: 10, lastActive: "1h ago",
    likes: "1.5K", followers: "2.0K", verified: true,
    cover: img(2), avatar: img(5),
  },
  homeCookSG: {
    name: "Nutrition Bowl Delivery", role: "Meal Delivery Service", location: "Bishan, Singapore",
    tagline: "Daily home-style meal delivery for offices",
    memberSince: "2016", activeListings: 5, lastActive: "40m ago",
    likes: "0.8K", followers: "1.2K", verified: true,
    cover: img(4), avatar: img(6),
  },
  restaurantDealsSG: {
    name: "Spice Route Restaurant SG", role: "Restaurant", location: "Tanjong Pagar, Singapore",
    tagline: "Multi-cuisine dining with weekday specials",
    memberSince: "2014", activeListings: 8, lastActive: "50m ago",
    likes: "1.2K", followers: "1.8K", verified: true,
    cover: img(7), avatar: img(8),
  },
  cloudKitchenSG: {
    name: "FlavorFast Cloud Kitchen SG", role: "Cloud Kitchen", location: "Ubi, Singapore",
    tagline: "Delivery-only kitchen, laksa & grills specialist",
    memberSince: "2020", activeListings: 4, lastActive: "1h ago",
    likes: "0.4K", followers: "0.7K", verified: false,
    cover: img(9), avatar: img(2),
  },
  bakedGoodsSG: {
    name: "Sweet Crumb Bakery SG", role: "Home Baker", location: "Yishun, Singapore",
    tagline: "Custom cakes, cookies & artisan bread",
    memberSince: "2018", activeListings: 7, lastActive: "20m ago",
    likes: "1.0K", followers: "1.4K", verified: true,
    cover: img(3), avatar: img(1),
  },
};
