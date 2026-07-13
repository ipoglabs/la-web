import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — Singapore jobs ───────────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  brightPathTech: {
    name: "BrightPath Technologies", role: "HR Team", location: "Raffles Place, Singapore",
    tagline: "Hiring engineers & product talent across our Singapore hub",
    memberSince: "2018", activeListings: 12, lastActive: "20m ago",
    likes: "1.8K", followers: "1.1K", verified: true,
    cover: img(1), avatar: img(3),
  },
  marinaRetail: {
    name: "Marina Retail Group", role: "Talent Acquisition", location: "Marina Bay, Singapore",
    tagline: "Retail & hospitality hiring across our Singapore outlets",
    memberSince: "2016", activeListings: 19, lastActive: "1h ago",
    likes: "1.3K", followers: "0.7K", verified: true,
    cover: img(2), avatar: img(5),
  },
  freelanceHubSG: {
    name: "Kevin Ong", role: "Hiring Manager", location: "Tanjong Pagar, Singapore",
    tagline: "Independent consultant hiring freelance creatives",
    memberSince: "2020", activeListings: 3, lastActive: "2h ago",
    likes: "0.2K", followers: "0.1K", verified: false,
    cover: img(4), avatar: img(6),
  },
  ntuCareers: {
    name: "Campus Careers SG", role: "Internship Coordinator", location: "Jurong East, Singapore",
    tagline: "Internship placements for NUS/NTU/SMU students",
    memberSince: "2019", activeListings: 7, lastActive: "40m ago",
    likes: "0.6K", followers: "0.4K", verified: true,
    cover: img(7), avatar: img(9),
  },
  festiveStaffingSG: {
    name: "Orchard Festive Staffing", role: "Recruiter", location: "Orchard, Singapore",
    tagline: "Seasonal staffing for retail & F&B across Orchard Road",
    memberSince: "2017", activeListings: 15, lastActive: "15m ago",
    likes: "0.9K", followers: "0.5K", verified: true,
    cover: img(8), avatar: img(2),
  },
  jobSeekerSG: {
    name: "Michelle Lim", role: "Job Seeker", location: "Bishan, Singapore",
    tagline: "Experienced professional actively looking for the next role",
    memberSince: "2022", activeListings: 1, lastActive: "3h ago",
    likes: "0.1K", followers: "0.05K", verified: false,
    cover: img(6), avatar: img(1),
  },
};
