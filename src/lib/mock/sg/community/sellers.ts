import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — Singapore community ──────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  neighbourhoodWatchSG: {
    name: "Neighbourhood Watch Bishan", role: "Community Volunteer", location: "Bishan, Singapore",
    tagline: "Keeping our community informed and connected",
    memberSince: "2021", activeListings: 5, lastActive: "1h ago",
    likes: "0.19K", followers: "0.3K", verified: true,
    cover: img(1), avatar: img(3),
  },
  eventsCollectiveSG: {
    name: "Tampines Events Collective", role: "Event Organiser", location: "Tampines, Singapore",
    tagline: "Bringing people together, one event at a time",
    memberSince: "2020", activeListings: 8, lastActive: "3h ago",
    likes: "0.41K", followers: "0.56K", verified: true,
    cover: img(2), avatar: img(5),
  },
  ngoVolunteerHubSG: {
    name: "SG Volunteer Hub", role: "Volunteer Coordinator", location: "Novena, Singapore",
    tagline: "Connecting volunteers with causes that matter",
    memberSince: "2019", activeListings: 6, lastActive: "5h ago",
    likes: "0.34K", followers: "0.47K", verified: true,
    cover: img(4), avatar: img(6),
  },
  residentAnnouncerSG: {
    name: "Wei Ling Tan", role: "Resident", location: "Toa Payoh, Singapore",
    tagline: "Sharing what's happening around the neighbourhood",
    memberSince: "2022", activeListings: 3, lastActive: "1d ago",
    likes: "0.06K", followers: "0.08K", verified: false,
    cover: img(7), avatar: img(8),
  },
  familySupportCircleSG: {
    name: "Family Support Circle SG", role: "Community Group", location: "Yishun, Singapore",
    tagline: "Support and resources for families in our area",
    memberSince: "2021", activeListings: 4, lastActive: "8h ago",
    likes: "0.16K", followers: "0.22K", verified: true,
    cover: img(9), avatar: img(2),
  },
  generalNoticeBoardSG: {
    name: "Local Notice Board SG", role: "Community Admin", location: "Bukit Timah, Singapore",
    tagline: "General notices and updates for the local community",
    memberSince: "2020", activeListings: 7, lastActive: "2h ago",
    likes: "0.12K", followers: "0.18K", verified: true,
    cover: img(3), avatar: img(1),
  },
};
