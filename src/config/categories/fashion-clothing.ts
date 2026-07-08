import type { CategoryItem } from "./types";

export const fashionClothing: CategoryItem = {
  id: "fashion_clothing",
  label: "Fashion & Clothing",
  description: "Clothes, shoes, bags, jewellery, and designer finds.",
  color: "purple",
  cardIcon: "shopping-bag",
  subcategories: [
  { id: "mens_clothing", label: "Men's Clothing" },
  { id: "womens_clothing", label: "Women's Clothing" },
  { id: "ethnic_traditional", label: "Traditional & Ethnic Wear" },
  { id: "shoes_footwear", label: "Shoes & Footwear" },
  { id: "bags_accessories", label: "Bags & Accessories" },
  { id: "jewellery_watches", label: "Jewellery & Watches" },
  { id: "designer_luxury", label: "Designer & Luxury" },
  { id: "vintage_secondhand", label: "Vintage & Preloved" },
  ],
};