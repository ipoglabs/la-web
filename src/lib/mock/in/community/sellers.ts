import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — India community ──────────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  neighbourhoodWatch: {
    name: "Neighbourhood Watch Delhi", role: "Community Volunteer", location: "Vasant Kunj, Delhi",
    tagline: "Keeping our community informed and connected",
    memberSince: "2021", activeListings: 5, lastActive: "1h ago",
    likes: "0.2K", followers: "0.3K", verified: true,
    cover: img(1), avatar: img(3),
  },
  puneEventsCollective: {
    name: "Pune Events Collective", role: "Event Organiser", location: "Koregaon Park, Pune",
    tagline: "Bringing people together, one event at a time",
    memberSince: "2020", activeListings: 8, lastActive: "3h ago",
    likes: "0.5K", followers: "0.6K", verified: true,
    cover: img(2), avatar: img(5),
  },
  ngoVolunteerHub: {
    name: "NGO Volunteer Hub", role: "Volunteer Coordinator", location: "Indiranagar, Bengaluru",
    tagline: "Connecting volunteers with causes that matter",
    memberSince: "2019", activeListings: 6, lastActive: "5h ago",
    likes: "0.4K", followers: "0.5K", verified: true,
    cover: img(4), avatar: img(6),
  },
  residentAnnouncer: {
    name: "Meera Krishnan", role: "Resident", location: "Adyar, Chennai",
    tagline: "Sharing what's happening around the neighbourhood",
    memberSince: "2022", activeListings: 3, lastActive: "1d ago",
    likes: "0.1K", followers: "0.1K", verified: false,
    cover: img(7), avatar: img(8),
  },
  familySupportCircle: {
    name: "Family Support Circle", role: "Community Group", location: "Kothrud, Pune",
    tagline: "Support and resources for families in our area",
    memberSince: "2021", activeListings: 4, lastActive: "8h ago",
    likes: "0.2K", followers: "0.2K", verified: true,
    cover: img(9), avatar: img(2),
  },
  generalNoticeBoard: {
    name: "Local Notice Board", role: "Community Admin", location: "Banjara Hills, Hyderabad",
    tagline: "General notices and updates for the local community",
    memberSince: "2020", activeListings: 7, lastActive: "2h ago",
    likes: "0.1K", followers: "0.2K", verified: true,
    cover: img(3), avatar: img(1),
  },
};
