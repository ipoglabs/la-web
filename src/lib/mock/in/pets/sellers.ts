import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — India pets ───────────────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  puppyLoveKennel: {
    name: "PuppyLove Kennel", role: "Registered Breeder", location: "Sarjapur Road, Bengaluru",
    tagline: "KCI-registered breeder \u2014 Labrador & Golden Retriever pups",
    memberSince: "2017", activeListings: 6, lastActive: "20m ago",
    likes: "2.4K", followers: "1.3K", verified: true,
    cover: img(1), avatar: img(3),
  },
  pawsShelterDelhi: {
    name: "Paws & Care Shelter", role: "Animal Shelter (NGO)", location: "Vasant Kunj, Delhi",
    tagline: "Rescued dogs & cats looking for loving homes",
    memberSince: "2015", activeListings: 18, lastActive: "15m ago",
    likes: "3.8K", followers: "2.1K", verified: true,
    cover: img(2), avatar: img(5),
  },
  vetCareMumbai: {
    name: "VetCare Grooming & Clinic", role: "Vet & Groomer", location: "Bandra West, Mumbai",
    tagline: "Certified vets & groomers \u2014 home visits available",
    memberSince: "2018", activeListings: 5, lastActive: "1h ago",
    likes: "1.5K", followers: "0.8K", verified: true,
    cover: img(4), avatar: img(6),
  },
  petMartIndia: {
    name: "PetMart India", role: "Pet Store", location: "Kothrud, Pune",
    tagline: "Food, toys & accessories for all pets \u2014 home delivery",
    memberSince: "2016", activeListings: 30, lastActive: "10m ago",
    likes: "2.9K", followers: "1.6K", verified: true,
    cover: img(7), avatar: img(9),
  },
  individualPetOwner: {
    name: "Sneha Pillai", role: "Pet Owner", location: "Indiranagar, Bengaluru",
    tagline: "Local community member helping reunite lost pets",
    memberSince: "2022", activeListings: 1, lastActive: "3h ago",
    likes: "0.1K", followers: "0.05K", verified: false,
    cover: img(8), avatar: img(2),
  },
};
