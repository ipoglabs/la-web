import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — Singapore pets ───────────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  sgKennelClub: {
    name: "Singapore Kennel Breeders", role: "AVS-Licensed Breeder", location: "Yishun, Singapore",
    tagline: "AVS-licensed breeder \u2014 Poodle & Corgi pups",
    memberSince: "2016", activeListings: 4, lastActive: "20m ago",
    likes: "1.9K", followers: "1.0K", verified: true,
    cover: img(1), avatar: img(3),
  },
  spcaShelterSG: {
    name: "Companion Animal Rescue SG", role: "Animal Shelter (NGO)", location: "Sungei Tengah, Singapore",
    tagline: "Rescued dogs & cats looking for loving homes",
    memberSince: "2014", activeListings: 15, lastActive: "15m ago",
    likes: "3.1K", followers: "1.7K", verified: true,
    cover: img(2), avatar: img(5),
  },
  vetCareSG: {
    name: "VetCare Grooming & Clinic SG", role: "Vet & Groomer", location: "Novena, Singapore",
    tagline: "Certified vets & groomers \u2014 house-call visits available",
    memberSince: "2017", activeListings: 4, lastActive: "1h ago",
    likes: "1.2K", followers: "0.6K", verified: true,
    cover: img(4), avatar: img(6),
  },
  petMartSG: {
    name: "PetMart Singapore", role: "Pet Store", location: "Bukit Timah, Singapore",
    tagline: "Food, toys & accessories for all pets \u2014 island-wide delivery",
    memberSince: "2015", activeListings: 26, lastActive: "10m ago",
    likes: "2.3K", followers: "1.2K", verified: true,
    cover: img(7), avatar: img(9),
  },
  individualPetOwnerSG: {
    name: "Rachel Teo", role: "Pet Owner", location: "Tampines, Singapore",
    tagline: "Local community member helping reunite lost pets",
    memberSince: "2022", activeListings: 1, lastActive: "3h ago",
    likes: "0.1K", followers: "0.05K", verified: false,
    cover: img(8), avatar: img(2),
  },
};
