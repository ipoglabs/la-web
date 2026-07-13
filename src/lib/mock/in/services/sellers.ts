import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — India services ───────────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  urbanHome: {
    name: "UrbanHome Services", role: "Home Services Provider", location: "Indiranagar, Bengaluru",
    tagline: "Verified electricians, plumbers & cleaners on demand",
    memberSince: "2018", activeListings: 25, lastActive: "10m ago",
    likes: "3.2K", followers: "1.8K", verified: true,
    cover: img(1), avatar: img(3),
  },
  bizConsult: {
    name: "Sharma Business Consultants", role: "Business Services", location: "Nariman Point, Mumbai",
    tagline: "GST, accounting & company registration for SMEs",
    memberSince: "2015", activeListings: 12, lastActive: "1h ago",
    likes: "1.4K", followers: "0.7K", verified: true,
    cover: img(2), avatar: img(5),
  },
  fitZonePT: {
    name: "FitZone Personal Training", role: "Fitness Trainer", location: "HSR Layout, Bengaluru",
    tagline: "Certified personal trainers for home & gym sessions",
    memberSince: "2020", activeListings: 6, lastActive: "30m ago",
    likes: "0.9K", followers: "0.5K", verified: true,
    cover: img(4), avatar: img(6),
  },
  tutorPro: {
    name: "Meera Nair", role: "Private Tutor", location: "Adyar, Chennai",
    tagline: "Physics & Chemistry tutor, 10 years teaching experience",
    memberSince: "2019", activeListings: 3, lastActive: "2h ago",
    likes: "0.3K", followers: "0.2K", verified: false,
    cover: img(7), avatar: img(9),
  },
  eduLearn: {
    name: "EduLearn Academy", role: "Coaching Institute", location: "Kothrud, Pune",
    tagline: "JEE/NEET coaching with structured batches",
    memberSince: "2016", activeListings: 8, lastActive: "45m ago",
    likes: "1.1K", followers: "0.6K", verified: true,
    cover: img(8), avatar: img(2),
  },
  wanderIndia: {
    name: "WanderIndia Tours", role: "Travel Agency", location: "Panjim, Goa",
    tagline: "Custom holiday packages across South & Central India",
    memberSince: "2014", activeListings: 16, lastActive: "20m ago",
    likes: "2.6K", followers: "1.3K", verified: true,
    cover: img(6), avatar: img(1),
  },
  tiffinWala: {
    name: "Annapurna Tiffin Services", role: "Home Chef", location: "Malviya Nagar, Delhi",
    tagline: "Fresh home-cooked tiffin delivery, veg & non-veg",
    memberSince: "2019", activeListings: 4, lastActive: "1h ago",
    likes: "1.7K", followers: "0.8K", verified: true,
    cover: img(3), avatar: img(7),
  },
  techFixIndia: {
    name: "TechFix India", role: "Repair Technician", location: "Sector 18, Noida",
    tagline: "Mobile, laptop & gadget repair at your doorstep",
    memberSince: "2017", activeListings: 9, lastActive: "25m ago",
    likes: "1.2K", followers: "0.6K", verified: true,
    cover: img(9), avatar: img(4),
  },
  otherServicesProvider: {
    name: "Anil Kumar", role: "Independent Contractor", location: "Rajouri Garden, Delhi",
    tagline: "Painting, carpentry & odd-job handyman services",
    memberSince: "2021", activeListings: 5, lastActive: "3h ago",
    likes: "0.2K", followers: "0.1K", verified: false,
    cover: img(5), avatar: img(8),
  },
  wantedServiceSeeker: {
    name: "Kavya Reddy", role: "Service Seeker", location: "Jubilee Hills, Hyderabad",
    tagline: "Looking for reliable local service providers",
    memberSince: "2023", activeListings: 1, lastActive: "4h ago",
    likes: "0.05K", followers: "0.02K", verified: false,
    cover: img(2), avatar: img(6),
  },
};
