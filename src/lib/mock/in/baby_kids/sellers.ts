import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — India baby & kids ────────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  toyBoxIndia: {
    name: "ToyBox India", role: "Toy Store", location: "Malad, Mumbai",
    tagline: "Educational toys & games for all ages",
    memberSince: "2017", activeListings: 24, lastActive: "20m ago",
    likes: "1.4K", followers: "2.0K", verified: true,
    cover: img(1), avatar: img(3),
  },
  babyGearIndia: {
    name: "Little Steps Baby Gear", role: "Baby Products Seller", location: "Jayanagar, Bengaluru",
    tagline: "Strollers, car seats & nursery essentials",
    memberSince: "2015", activeListings: 15, lastActive: "1h ago",
    likes: "1.1K", followers: "1.6K", verified: true,
    cover: img(2), avatar: img(5),
  },
  kidsClothingIndia: {
    name: "Chikoo Kids Clothing", role: "Kids Fashion Retailer", location: "Camp, Pune",
    tagline: "Cute & comfy clothing for infants to age 10",
    memberSince: "2019", activeListings: 30, lastActive: "45m ago",
    likes: "0.9K", followers: "1.3K", verified: true,
    cover: img(4), avatar: img(6),
  },
  childcareIndia: {
    name: "Sunshine Childcare Centre", role: "Childcare Provider", location: "Vasant Kunj, Delhi",
    tagline: "Trusted daycare & after-school care",
    memberSince: "2012", activeListings: 4, lastActive: "1h ago",
    likes: "0.8K", followers: "1.1K", verified: true,
    cover: img(7), avatar: img(8),
  },
  schoolSuppliesIndia: {
    name: "Study Corner Supplies", role: "Stationery Retailer", location: "Anna Nagar, Chennai",
    tagline: "School bags, stationery & uniforms",
    memberSince: "2016", activeListings: 18, lastActive: "50m ago",
    likes: "0.6K", followers: "0.9K", verified: true,
    cover: img(9), avatar: img(2),
  },
  kidsActivitiesIndia: {
    name: "PlayZone Kids Activities", role: "Activity Centre", location: "HSR Layout, Bengaluru",
    tagline: "Weekend workshops, sports & art classes for kids",
    memberSince: "2018", activeListings: 9, lastActive: "2h ago",
    likes: "0.7K", followers: "1.0K", verified: true,
    cover: img(3), avatar: img(1),
  },
};
