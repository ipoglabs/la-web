import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — India jobs ───────────────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  nexalytics: {
    name: "Nexalytics Software Pvt Ltd", role: "HR Team", location: "Whitefield, Bengaluru",
    tagline: "Hiring engineers & analysts across our Bengaluru & Pune offices",
    memberSince: "2019", activeListings: 14, lastActive: "30m ago",
    likes: "2.1K", followers: "1.4K", verified: true,
    cover: img(1), avatar: img(3),
  },
  primeRetail: {
    name: "Prime Retail Solutions", role: "Talent Acquisition", location: "Sector 44, Gurugram",
    tagline: "Retail & operations hiring across NCR stores",
    memberSince: "2017", activeListings: 22, lastActive: "1h ago",
    likes: "1.6K", followers: "0.9K", verified: true,
    cover: img(2), avatar: img(5),
  },
  freelanceDesk: {
    name: "Rohit Verma", role: "Hiring Manager", location: "Powai, Mumbai",
    tagline: "Independent consultant hiring freelance designers & writers",
    memberSince: "2021", activeListings: 4, lastActive: "2h ago",
    likes: "0.3K", followers: "0.2K", verified: false,
    cover: img(4), avatar: img(6),
  },
  campusConnect: {
    name: "CampusConnect Internships", role: "Internship Coordinator", location: "Hinjawadi, Pune",
    tagline: "Structured internship programmes for final-year students",
    memberSince: "2020", activeListings: 9, lastActive: "45m ago",
    likes: "0.8K", followers: "0.5K", verified: true,
    cover: img(7), avatar: img(9),
  },
  festiveStaffing: {
    name: "Festive Staffing Agency", role: "Recruiter", location: "Andheri East, Mumbai",
    tagline: "Seasonal & festival-season staffing across retail & events",
    memberSince: "2018", activeListings: 17, lastActive: "20m ago",
    likes: "1.1K", followers: "0.6K", verified: true,
    cover: img(8), avatar: img(2),
  },
  jobSeeker: {
    name: "Ananya Iyer", role: "Job Seeker", location: "Koramangala, Bengaluru",
    tagline: "Experienced professional actively looking for the next role",
    memberSince: "2023", activeListings: 1, lastActive: "3h ago",
    likes: "0.1K", followers: "0.05K", verified: false,
    cover: img(6), avatar: img(1),
  },
};
