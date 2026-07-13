import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — Singapore business ───────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  bizBrokerSG: {
    name: "SG Business Brokers", role: "Business Broker", location: "Raffles Place, Singapore",
    tagline: "Verified business-for-sale listings across Singapore",
    memberSince: "2015", activeListings: 18, lastActive: "20m ago",
    likes: "1.5K", followers: "0.8K", verified: true,
    cover: img(1), avatar: img(3),
  },
  b2bSupplyChainSG: {
    name: "Jurong B2B Supply Co.", role: "B2B Service Provider", location: "Jurong, Singapore",
    tagline: "Wholesale sourcing & logistics for SME manufacturers",
    memberSince: "2013", activeListings: 12, lastActive: "1h ago",
    likes: "1.0K", followers: "0.5K", verified: true,
    cover: img(2), avatar: img(5),
  },
  freelanceContractorHubSG: {
    name: "Daniel Wong", role: "Freelance Contractor", location: "One-North, Singapore",
    tagline: "Independent IT contractor \u2014 available for short-term projects",
    memberSince: "2019", activeListings: 3, lastActive: "2h ago",
    likes: "0.2K", followers: "0.1K", verified: false,
    cover: img(4), avatar: img(6),
  },
  partnerSeekerSG: {
    name: "Priya Nair", role: "Entrepreneur", location: "Tanjong Pagar, Singapore",
    tagline: "Seeking co-founders & investment partners for my startup",
    memberSince: "2022", activeListings: 2, lastActive: "3h ago",
    likes: "0.1K", followers: "0.05K", verified: false,
    cover: img(7), avatar: img(9),
  },
  equipSupplySG: {
    name: "SG Equip Supplies", role: "Equipment Supplier", location: "Ubi, Singapore",
    tagline: "Commercial kitchen & office equipment, new and refurbished",
    memberSince: "2014", activeListings: 32, lastActive: "10m ago",
    likes: "1.9K", followers: "1.0K", verified: true,
    cover: img(8), avatar: img(2),
  },
  startupSupportHubSG: {
    name: "Singapore Startup Hub", role: "Incubator", location: "One-North, Singapore",
    tagline: "Mentorship, co-working & funding support for early-stage startups",
    memberSince: "2016", activeListings: 5, lastActive: "45m ago",
    likes: "1.3K", followers: "0.7K", verified: true,
    cover: img(6), avatar: img(1),
  },
};
