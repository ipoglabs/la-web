import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — India business ───────────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  bizBrokerIndia: {
    name: "BizBroker India", role: "Business Broker", location: "Connaught Place, Delhi",
    tagline: "Verified business-for-sale listings across India",
    memberSince: "2016", activeListings: 22, lastActive: "20m ago",
    likes: "1.9K", followers: "1.0K", verified: true,
    cover: img(1), avatar: img(3),
  },
  b2bSupplyChain: {
    name: "Chennai B2B Supply Co.", role: "B2B Service Provider", location: "Guindy, Chennai",
    tagline: "Wholesale sourcing & logistics for manufacturers",
    memberSince: "2014", activeListings: 15, lastActive: "1h ago",
    likes: "1.2K", followers: "0.6K", verified: true,
    cover: img(2), avatar: img(5),
  },
  freelanceContractorHub: {
    name: "Suresh Iyer", role: "Freelance Contractor", location: "Electronic City, Bengaluru",
    tagline: "Independent IT contractor \u2014 available for short-term projects",
    memberSince: "2020", activeListings: 3, lastActive: "2h ago",
    likes: "0.2K", followers: "0.1K", verified: false,
    cover: img(4), avatar: img(6),
  },
  partnerSeeker: {
    name: "Divya Menon", role: "Entrepreneur", location: "Kochi",
    tagline: "Seeking co-founders & investment partners for my startup",
    memberSince: "2022", activeListings: 2, lastActive: "3h ago",
    likes: "0.1K", followers: "0.05K", verified: false,
    cover: img(7), avatar: img(9),
  },
  equipSupplyIndia: {
    name: "IndiaEquip Supplies", role: "Equipment Supplier", location: "Peenya, Bengaluru",
    tagline: "Commercial kitchen & office equipment, new and refurbished",
    memberSince: "2015", activeListings: 40, lastActive: "10m ago",
    likes: "2.4K", followers: "1.3K", verified: true,
    cover: img(8), avatar: img(2),
  },
  startupSupportHub: {
    name: "Startup Support Hub", role: "Incubator", location: "Koramangala, Bengaluru",
    tagline: "Mentorship, co-working & funding support for early-stage startups",
    memberSince: "2017", activeListings: 6, lastActive: "45m ago",
    likes: "1.6K", followers: "0.9K", verified: true,
    cover: img(6), avatar: img(1),
  },
};
