import type { MockListingSeller } from "@/lib/mock/mock-listing-schema";

export const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
export const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

// ─── Sellers pool — India education ───────────────────────────────────────────
export const SELLERS: Record<string, MockListingSeller> = {
  mathsTutorIndia: {
    name: "Anjali Rao", role: "Private Tutor", location: "Malleswaram, Bengaluru",
    tagline: "Maths & Science tutor for grades 6-10, 8 years experience",
    memberSince: "2017", activeListings: 4, lastActive: "40m ago",
    likes: "0.3K", followers: "0.4K", verified: true,
    cover: img(1), avatar: img(3),
  },
  onlineCourseHubIndia: {
    name: "SkillUp Online Academy", role: "Online Course Provider", location: "HITEC City, Hyderabad",
    tagline: "Certified online courses in tech, design & business",
    memberSince: "2016", activeListings: 12, lastActive: "1h ago",
    likes: "1.5K", followers: "2.3K", verified: true,
    cover: img(2), avatar: img(5),
  },
  studyMaterialsIndia: {
    name: "ExamPrep Books & Notes", role: "Study Materials Seller", location: "Nungambakkam, Chennai",
    tagline: "NCERT, competitive exam guides & used textbooks",
    memberSince: "2019", activeListings: 20, lastActive: "2h ago",
    likes: "0.8K", followers: "1.1K", verified: true,
    cover: img(4), avatar: img(6),
  },
  admissionsCounsellorIndia: {
    name: "EduPath Admissions Counsellor", role: "Education Consultant", location: "Salt Lake, Kolkata",
    tagline: "School & college admissions guidance",
    memberSince: "2015", activeListings: 6, lastActive: "3h ago",
    likes: "0.6K", followers: "0.9K", verified: true,
    cover: img(7), avatar: img(8),
  },
  languageClassesIndia: {
    name: "Polyglot Language Institute", role: "Language School", location: "Vasant Vihar, Delhi",
    tagline: "French, German, Spanish & Japanese classes",
    memberSince: "2014", activeListings: 9, lastActive: "1h ago",
    likes: "1.1K", followers: "1.4K", verified: true,
    cover: img(9), avatar: img(2),
  },
};
