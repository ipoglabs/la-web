import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — Singapore vehicles ───────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  weiJie: {
    name: "Wei Jie Tan", role: "Private Owner", location: "Bishan",
    tagline: "Selling my own car — COE renewed, no agents please",
    memberSince: "2021", activeListings: 1, lastActive: "1h ago",
    likes: "0.2K", followers: "0.1K", verified: false,
    cover: img(1), avatar: img(3),
  },
  sgCarMart: {
    name: "SG Premier Motors", role: "Authorised Dealer", location: "Ubi Avenue, Singapore",
    tagline: "LTA-licensed dealer — inspected, warranty included",
    memberSince: "2016", activeListings: 45, lastActive: "10m ago",
    likes: "7.2K", followers: "3.9K", verified: true,
    cover: img(2), avatar: img(5),
  },
  bikeHub: {
    name: "Bike Hub Singapore", role: "Motorcycle Dealer", location: "Sin Ming, Singapore",
    tagline: "COE motorcycles & scooters — certified pre-owned",
    memberSince: "2018", activeListings: 27, lastActive: "40m ago",
    likes: "3.4K", followers: "1.8K", verified: true,
    cover: img(4), avatar: img(6),
  },
  logisticsFleet: {
    name: "Woodlands Logistics Fleet", role: "Commercial Vehicle Dealer", location: "Woodlands, Singapore",
    tagline: "Vans & lorries for SME fleets — LTA road-tax handled",
    memberSince: "2014", activeListings: 21, lastActive: "2h ago",
    likes: "2.6K", followers: "1.1K", verified: true,
    cover: img(7), avatar: img(9),
  },
  marinaYachts: {
    name: "Marina Yachts & Leisure", role: "Boat Dealer", location: "One\u2019 15 Marina, Sentosa Cove",
    tagline: "Leisure craft & yachts — MPA-registered dealer",
    memberSince: "2015", activeListings: 9, lastActive: "3h ago",
    likes: "2.1K", followers: "1.0K", verified: true,
    cover: img(8), avatar: img(2),
  },
  autoPartsSG: {
    name: "AutoParts Bukit Batok", role: "Spare Parts Dealer", location: "Bukit Batok, Singapore",
    tagline: "Genuine & parallel-import parts \u2014 island-wide delivery",
    memberSince: "2017", activeListings: 58, lastActive: "25m ago",
    likes: "3.9K", followers: "2.0K", verified: true,
    cover: img(6), avatar: img(1),
  },
};
