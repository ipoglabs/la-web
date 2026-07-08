import type { CategoryItem } from "./types";

export const healthBeauty: CategoryItem = {
  id: "health_beauty",
  label: "Health & Beauty",
  description: "Gyms, salons, wellness, fitness, and medical services.",
  color: "fuchsia",
  cardIcon: "heart",
  subcategories: [
  { id: "gyms_fitness", label: "Fitness Classes & Training" },
  { id: "salons_spas", label: "Salons & Spas" },
  { id: "medical", label: "Medical & Therapy" },
  { id: "beauty_products", label: "Beauty Products" },
  { id: "wellness", label: "Wellness & Nutrition" },
  { id: "mental_health", label: "Mental Health & Counselling" },
  ],
};