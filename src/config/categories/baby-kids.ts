import type { CategoryItem } from "./types";

export const babyKids: CategoryItem = {
  id: "baby_kids",
  label: "Baby & Kids",
  description: "Toys, clothing, childcare, baby gear, and school supplies.",
  color: "yellow-amber",
  cardIcon: "gift",
  subcategories: [
  { id: "toys_games", label: "Toys & Games" },
  { id: "baby_gear", label: "Baby Gear & Equipment" },
  { id: "kids_clothing", label: "Baby & Kids Clothing" },
  { id: "childcare", label: "Childcare & Nurseries" },
  { id: "school_supplies", label: "School Supplies & Books" },
  { id: "kids_activities", label: "Kids Classes & Activities" },
  ],
};