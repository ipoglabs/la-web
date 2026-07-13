import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — India health & beauty ────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  fitZoneGymIndia: {
    name: "FitZone Gym & Fitness", role: "Gym Owner", location: "Bandra, Mumbai",
    tagline: "Modern gym with certified trainers & group classes",
    memberSince: "2015", activeListings: 5, lastActive: "20m ago",
    likes: "1.1K", followers: "1.6K", verified: true,
    cover: img(1), avatar: img(3),
  },
  glamourSalonIndia: {
    name: "Glamour Salon & Spa", role: "Salon Owner", location: "Jubilee Hills, Hyderabad",
    tagline: "Full-service salon & spa, unisex treatments",
    memberSince: "2013", activeListings: 8, lastActive: "1h ago",
    likes: "0.9K", followers: "1.3K", verified: true,
    cover: img(2), avatar: img(5),
  },
  drSharmaClinic: {
    name: "Dr. Sharma's Clinic", role: "Medical Practitioner", location: "Vashi, Navi Mumbai",
    tagline: "General physician & family healthcare services",
    memberSince: "2010", activeListings: 4, lastActive: "45m ago",
    likes: "1.4K", followers: "1.9K", verified: true,
    cover: img(4), avatar: img(6),
  },
  beautyEssentialsIndia: {
    name: "Beauty Essentials India", role: "Beauty Retailer", location: "Linking Road, Mumbai",
    tagline: "Skincare, makeup & haircare products",
    memberSince: "2018", activeListings: 22, lastActive: "1h ago",
    likes: "2.0K", followers: "2.9K", verified: true,
    cover: img(7), avatar: img(8),
  },
  wellnessRetreatIndia: {
    name: "Ananda Wellness Retreat", role: "Wellness Centre", location: "Whitefield, Bengaluru",
    tagline: "Ayurveda, massage & holistic wellness therapies",
    memberSince: "2014", activeListings: 7, lastActive: "2h ago",
    likes: "1.0K", followers: "1.5K", verified: true,
    cover: img(9), avatar: img(2),
  },
};
