import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — Singapore education ──────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  mathsTutorSG: {
    name: "Rachel Tan", role: "Private Tutor", location: "Bukit Timah, Singapore",
    tagline: "Maths & Science tutor for Primary to Secondary, 8 years experience",
    memberSince: "2017", activeListings: 4, lastActive: "40m ago",
    likes: "0.3K", followers: "0.4K", verified: true,
    cover: img(1), avatar: img(3),
  },
  onlineCourseHubSG: {
    name: "SkillUp SG Academy", role: "Online Course Provider", location: "One-North, Singapore",
    tagline: "Certified online courses in tech, design & business",
    memberSince: "2016", activeListings: 12, lastActive: "1h ago",
    likes: "1.4K", followers: "2.1K", verified: true,
    cover: img(2), avatar: img(5),
  },
  studyMaterialsSG: {
    name: "ExamPrep Books & Notes SG", role: "Study Materials Seller", location: "Toa Payoh, Singapore",
    tagline: "MOE-aligned textbooks, assessment books & used notes",
    memberSince: "2019", activeListings: 18, lastActive: "2h ago",
    likes: "0.7K", followers: "1.0K", verified: true,
    cover: img(4), avatar: img(6),
  },
  admissionsCounsellorSG: {
    name: "EduPath Admissions Counsellor SG", role: "Education Consultant", location: "Novena, Singapore",
    tagline: "School & university admissions guidance",
    memberSince: "2015", activeListings: 6, lastActive: "3h ago",
    likes: "0.5K", followers: "0.8K", verified: true,
    cover: img(7), avatar: img(8),
  },
  languageClassesSG: {
    name: "Polyglot Language Institute SG", role: "Language School", location: "Orchard, Singapore",
    tagline: "French, German, Mandarin & Japanese classes",
    memberSince: "2014", activeListings: 9, lastActive: "1h ago",
    likes: "1.0K", followers: "1.3K", verified: true,
    cover: img(9), avatar: img(2),
  },
};
