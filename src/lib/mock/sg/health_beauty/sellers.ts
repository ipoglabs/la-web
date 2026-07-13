import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — Singapore health & beauty ────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  fitZoneGymSG: {
    name: "FitZone Gym & Fitness SG", role: "Gym Owner", location: "Tanjong Pagar, Singapore",
    tagline: "Modern gym with certified trainers & group classes",
    memberSince: "2015", activeListings: 5, lastActive: "20m ago",
    likes: "1.0K", followers: "1.5K", verified: true,
    cover: img(1), avatar: img(3),
  },
  glamourSalonSG: {
    name: "Glamour Salon & Spa SG", role: "Salon Owner", location: "Orchard, Singapore",
    tagline: "Full-service salon & spa, unisex treatments",
    memberSince: "2013", activeListings: 8, lastActive: "1h ago",
    likes: "0.8K", followers: "1.2K", verified: true,
    cover: img(2), avatar: img(5),
  },
  drTanClinicSG: {
    name: "Dr. Tan's Clinic", role: "Medical Practitioner", location: "Novena, Singapore",
    tagline: "General physician & family healthcare services",
    memberSince: "2010", activeListings: 4, lastActive: "45m ago",
    likes: "1.3K", followers: "1.8K", verified: true,
    cover: img(4), avatar: img(6),
  },
  beautyEssentialsSG: {
    name: "Beauty Essentials Singapore", role: "Beauty Retailer", location: "Orchard, Singapore",
    tagline: "Skincare, makeup & haircare products",
    memberSince: "2018", activeListings: 22, lastActive: "1h ago",
    likes: "1.9K", followers: "2.7K", verified: true,
    cover: img(7), avatar: img(8),
  },
  wellnessRetreatSG: {
    name: "Serenity Wellness Retreat", role: "Wellness Centre", location: "Sentosa, Singapore",
    tagline: "Spa, massage & holistic wellness therapies",
    memberSince: "2014", activeListings: 7, lastActive: "2h ago",
    likes: "0.9K", followers: "1.4K", verified: true,
    cover: img(9), avatar: img(2),
  },
};
