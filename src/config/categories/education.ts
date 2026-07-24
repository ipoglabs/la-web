import type { CategoryItem } from "./types";

export const education: CategoryItem = {
  id: "education",
  label: "Education",
  description: "Tutors, courses, coaching centres, and study materials.",
  color: "sky",
  cardIcon: "book-open",
  subcategories: [
  { id: "tutors", label: "Tutors & Coaching" },
  { id: "online_courses", label: "Online Courses" },
  { id: "study_materials", label: "Study Materials" },
  { id: "schools_colleges", label: "Schools & Colleges" },
  { id: "language_classes", label: "Language Classes" },
  ],
};