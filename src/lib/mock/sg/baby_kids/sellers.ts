import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — Singapore baby & kids ────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  toyBoxSG: {
    name: "ToyBox Singapore", role: "Toy Store", location: "Bugis, Singapore",
    tagline: "Educational toys & games for all ages",
    memberSince: "2017", activeListings: 24, lastActive: "20m ago",
    likes: "1.3K", followers: "1.9K", verified: true,
    cover: img(1), avatar: img(3),
  },
  babyGearSG: {
    name: "Little Steps Baby Gear SG", role: "Baby Products Seller", location: "Tampines, Singapore",
    tagline: "Strollers, car seats & nursery essentials",
    memberSince: "2015", activeListings: 15, lastActive: "1h ago",
    likes: "1.0K", followers: "1.5K", verified: true,
    cover: img(2), avatar: img(5),
  },
  kidsClothingSG: {
    name: "Chikoo Kids Clothing SG", role: "Kids Fashion Retailer", location: "Bishan, Singapore",
    tagline: "Cute & comfy clothing for infants to age 10",
    memberSince: "2019", activeListings: 30, lastActive: "45m ago",
    likes: "0.8K", followers: "1.2K", verified: true,
    cover: img(4), avatar: img(6),
  },
  childcareSG: {
    name: "Sunshine Childcare Centre SG", role: "Childcare Provider", location: "Yishun, Singapore",
    tagline: "Trusted daycare & after-school care",
    memberSince: "2012", activeListings: 4, lastActive: "1h ago",
    likes: "0.7K", followers: "1.0K", verified: true,
    cover: img(7), avatar: img(8),
  },
  schoolSuppliesSG: {
    name: "Study Corner Supplies SG", role: "Stationery Retailer", location: "Toa Payoh, Singapore",
    tagline: "School bags, stationery & uniforms",
    memberSince: "2016", activeListings: 18, lastActive: "50m ago",
    likes: "0.5K", followers: "0.8K", verified: true,
    cover: img(9), avatar: img(2),
  },
  kidsActivitiesSG: {
    name: "PlayZone Kids Activities SG", role: "Activity Centre", location: "Novena, Singapore",
    tagline: "Weekend workshops, sports & art classes for kids",
    memberSince: "2018", activeListings: 9, lastActive: "2h ago",
    likes: "0.6K", followers: "0.9K", verified: true,
    cover: img(3), avatar: img(1),
  },
};
