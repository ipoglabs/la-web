import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — Singapore services ───────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  urbanHomeSG: {
    name: "UrbanHome Services SG", role: "Home Services Provider", location: "Toa Payoh, Singapore",
    tagline: "Licensed electricians, plumbers & cleaners on demand",
    memberSince: "2017", activeListings: 20, lastActive: "10m ago",
    likes: "2.6K", followers: "1.5K", verified: true,
    cover: img(1), avatar: img(3),
  },
  bizConsultSG: {
    name: "Tan & Partners Business Services", role: "Business Services", location: "Raffles Place, Singapore",
    tagline: "ACRA registration, GST & accounting for SMEs",
    memberSince: "2014", activeListings: 10, lastActive: "1h ago",
    likes: "1.1K", followers: "0.6K", verified: true,
    cover: img(2), avatar: img(5),
  },
  fitZoneSG: {
    name: "FitZone Personal Training SG", role: "Fitness Trainer", location: "Bishan, Singapore",
    tagline: "Certified personal trainers for home & gym sessions",
    memberSince: "2019", activeListings: 5, lastActive: "30m ago",
    likes: "0.7K", followers: "0.4K", verified: true,
    cover: img(4), avatar: img(6),
  },
  tutorProSG: {
    name: "Grace Koh", role: "Private Tutor", location: "Bukit Timah, Singapore",
    tagline: "MOE-trained Maths & Science tutor, 8 years experience",
    memberSince: "2018", activeListings: 3, lastActive: "2h ago",
    likes: "0.3K", followers: "0.2K", verified: false,
    cover: img(7), avatar: img(9),
  },
  eduLearnSG: {
    name: "Pinnacle Learning Centre", role: "Tuition Centre", location: "Toa Payoh, Singapore",
    tagline: "PSLE & O-Level tuition with structured small-group classes",
    memberSince: "2015", activeListings: 6, lastActive: "45m ago",
    likes: "0.9K", followers: "0.5K", verified: true,
    cover: img(8), avatar: img(2),
  },
  wanderSG: {
    name: "WanderSEA Travel", role: "Travel Agency", location: "Bugis, Singapore",
    tagline: "Custom holiday packages across Southeast Asia",
    memberSince: "2013", activeListings: 14, lastActive: "20m ago",
    likes: "2.1K", followers: "1.1K", verified: true,
    cover: img(6), avatar: img(1),
  },
  homeCookSG: {
    name: "Peranakan Home Kitchen", role: "Home Chef", location: "Katong, Singapore",
    tagline: "Fresh home-cooked Peranakan meals, delivered daily",
    memberSince: "2018", activeListings: 4, lastActive: "1h ago",
    likes: "1.3K", followers: "0.6K", verified: true,
    cover: img(3), avatar: img(7),
  },
  techFixSG: {
    name: "TechFix Singapore", role: "Repair Technician", location: "Sim Lim Square, Singapore",
    tagline: "Mobile, laptop & gadget repair island-wide",
    memberSince: "2016", activeListings: 8, lastActive: "25m ago",
    likes: "1.0K", followers: "0.5K", verified: true,
    cover: img(9), avatar: img(4),
  },
  otherServicesSG: {
    name: "Marcus Lim", role: "Independent Contractor", location: "Ang Mo Kio, Singapore",
    tagline: "Painting, minor renovation & handyman services",
    memberSince: "2020", activeListings: 4, lastActive: "3h ago",
    likes: "0.2K", followers: "0.1K", verified: false,
    cover: img(5), avatar: img(8),
  },
  wantedServiceSeekerSG: {
    name: "Jasmine Ong", role: "Service Seeker", location: "Clementi, Singapore",
    tagline: "Looking for reliable local service providers",
    memberSince: "2023", activeListings: 1, lastActive: "4h ago",
    likes: "0.05K", followers: "0.02K", verified: false,
    cover: img(2), avatar: img(6),
  },
};
