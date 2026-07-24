import type { CategoryItem } from "./types";

export const pets: CategoryItem = {
  id: "pets",
  label: "Pets",
  description: "Adopt, buy or find pet services near you.",
  color: "pink",
  cardIcon: "sparkles",
  subcategories: [
  { id: "for_sale", label: "For Sale" },
  { id: "adoption", label: "Adoption" },
  { id: "service", label: "Pet Care" },
  { id: "accessories", label: "Accessories" },
  { id: "lost_found", label: "Lost & Found" },
  { id: "wanted", label: "Wanted" },
  ],
};