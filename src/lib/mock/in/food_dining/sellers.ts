import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — India food & dining ──────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  homeChefIndia: {
    name: "Lakshmi's Home Kitchen", role: "Home Chef", location: "T. Nagar, Chennai",
    tagline: "Authentic South Indian home-cooked meals",
    memberSince: "2019", activeListings: 6, lastActive: "15m ago",
    likes: "0.7K", followers: "1.0K", verified: true,
    cover: img(1), avatar: img(3),
  },
  cateringServiceIndia: {
    name: "Royal Caterers India", role: "Catering Service", location: "Rajouri Garden, Delhi",
    tagline: "Wedding, corporate & party catering",
    memberSince: "2012", activeListings: 10, lastActive: "1h ago",
    likes: "1.6K", followers: "2.2K", verified: true,
    cover: img(2), avatar: img(5),
  },
  tiffinWalaIndia: {
    name: "Annapurna Tiffin Service", role: "Tiffin Service", location: "Andheri, Mumbai",
    tagline: "Daily home-style tiffin delivery for offices",
    memberSince: "2016", activeListings: 5, lastActive: "40m ago",
    likes: "0.9K", followers: "1.3K", verified: true,
    cover: img(4), avatar: img(6),
  },
  restaurantDealsIndia: {
    name: "Spice Route Restaurant", role: "Restaurant", location: "Indiranagar, Bengaluru",
    tagline: "Multi-cuisine dining with weekday specials",
    memberSince: "2014", activeListings: 8, lastActive: "50m ago",
    likes: "1.3K", followers: "1.9K", verified: true,
    cover: img(7), avatar: img(8),
  },
  cloudKitchenIndia: {
    name: "FlavorFast Cloud Kitchen", role: "Cloud Kitchen", location: "Koramangala, Bengaluru",
    tagline: "Delivery-only kitchen, biryani & grills specialist",
    memberSince: "2020", activeListings: 4, lastActive: "1h ago",
    likes: "0.5K", followers: "0.8K", verified: false,
    cover: img(9), avatar: img(2),
  },
  bakedGoodsIndia: {
    name: "Sweet Crumb Bakery", role: "Home Baker", location: "Kothrud, Pune",
    tagline: "Custom cakes, cookies & artisan bread",
    memberSince: "2018", activeListings: 7, lastActive: "20m ago",
    likes: "1.1K", followers: "1.5K", verified: true,
    cover: img(3), avatar: img(1),
  },
};
