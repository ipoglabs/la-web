import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — India vehicles ───────────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  vikram: {
    name: "Vikram Rao", role: "Private Owner", location: "Koramangala, Bengaluru",
    tagline: "Selling my own car — single owner, no brokers please",
    memberSince: "2022", activeListings: 1, lastActive: "2h ago",
    likes: "0.2K", followers: "0.1K", verified: false,
    cover: img(1), avatar: img(3),
  },
  deepakMotors: {
    name: "Deepak Motors", role: "Used Car Dealer", location: "OMR, Chennai",
    tagline: "RTO-verified used cars — inspection & warranty on every sale",
    memberSince: "2017", activeListings: 38, lastActive: "20m ago",
    likes: "5.6K", followers: "2.8K", verified: true,
    cover: img(2), avatar: img(5),
  },
  royalBikes: {
    name: "Royal Bikes Pune", role: "Authorised Used Bike Dealer", location: "Kothrud, Pune",
    tagline: "Royal Enfield & Bajaj certified pre-owned two-wheelers",
    memberSince: "2019", activeListings: 22, lastActive: "1h ago",
    likes: "3.1K", followers: "1.6K", verified: true,
    cover: img(4), avatar: img(6),
  },
  ashokaFleet: {
    name: "Ashoka Fleet Traders", role: "Commercial Vehicle Dealer", location: "Narol, Ahmedabad",
    tagline: "Trucks & tempos for transport fleets — finance assisted",
    memberSince: "2015", activeListings: 19, lastActive: "3h ago",
    likes: "2.4K", followers: "1.2K", verified: true,
    cover: img(7), avatar: img(9),
  },
  alleppeyHouseboats: {
    name: "Alleppey Houseboats & Marine", role: "Boat Dealer", location: "Alleppey, Kerala",
    tagline: "Backwater houseboats and fishing boats — genuine RTO papers",
    memberSince: "2016", activeListings: 8, lastActive: "5h ago",
    likes: "1.9K", followers: "0.9K", verified: true,
    cover: img(8), avatar: img(2),
  },
  autoPartsHub: {
    name: "Auto Parts Hub Delhi", role: "Spare Parts Dealer", location: "Kashmere Gate, Delhi",
    tagline: "Genuine & OEM spares for all makes — pan-India shipping",
    memberSince: "2018", activeListings: 64, lastActive: "15m ago",
    likes: "4.3K", followers: "2.1K", verified: true,
    cover: img(6), avatar: img(1),
  },
};
