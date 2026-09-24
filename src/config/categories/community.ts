import type { CategoryItem } from "./types";

export const community: CategoryItem = {
  id: "community",
  label: "Community",
  description: "Connect through local events and activities.",
  color: "emerald",
  cardIcon: "users",
  subcategories: [
  { id: "lost_found", label: "Lost & Found" },
  { id: "events", label: "Events" },
  { id: "classes", label: "Classes" },
  { id: "volunteering", label: "Volunteering & Charity" },
  { id: "courses", label: "Classes & Courses" },
  { id: "announcement", label: "Announcement" },
  { id: "child_family", label: "Child & Family Activities" },
  { id: "general_others", label: "General / Others" },
  { id: "rideshare_carpool", label: "Rideshare & Carpool" },
  { id: "wanted", label: "Wanted" },
  ],
};