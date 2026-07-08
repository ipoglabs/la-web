import type { CategoryItem } from "./types";

export const freeGiveaway: CategoryItem = {
  id: "free_giveaway",
  label: "Free & Giveaway",
  description: "Free items — furniture, clothing, electronics, food, and more.",
  color: "yellow",
  cardIcon: "tag",
  subcategories: [
  { id: "furniture_free", label: "Furniture" },
  { id: "clothing_free", label: "Clothing" },
  { id: "electronics_free", label: "Electronics" },
  { id: "food_free", label: "Food" },
  { id: "kids_items", label: "Kids Items" },
  { id: "general_free", label: "General" },
  ],
};