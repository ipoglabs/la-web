import type { CategoryItem } from "./types";

export const foodDining: CategoryItem = {
  id: "food_dining",
  label: "Food & Dining",
  description: "Home-cooked meals, catering, cloud kitchens, and restaurant deals.",
  color: "lime",
  cardIcon: "cake",
  subcategories: [
  { id: "home_chefs_tiffin", label: "Home Chefs & Tiffin" },
  { id: "catering", label: "Catering Services" },
  { id: "restaurant_deals", label: "Restaurant Deals" },
  { id: "cloud_kitchens", label: "Cloud Kitchens" },
  { id: "baked_goods", label: "Baked Goods & Desserts" },
  ],
};