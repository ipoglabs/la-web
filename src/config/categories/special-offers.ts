import type { CategoryItem } from "./types";

export const specialOffers: CategoryItem = {
  id: "special_offers",
  label: "Special Offers",
  description: "Exclusive deals, discounts, and limited-time offers.",
  color: "rose",
  cardIcon: "percent-badge",
  subcategories: [
  { id: "banking_finance", label: "Banking & Finance" },
  { id: "travel_tourism", label: "Travel & Tourism" },
  { id: "retail_shopping", label: "Retail & Shopping" },
  { id: "food_dining", label: "Food & Dining" },
  { id: "electronics_gadgets", label: "Electronics & Gadgets" },
  { id: "health_wellness", label: "Health & Wellness" },
  { id: "education_learning", label: "Education & Learning" },
  { id: "holiday_seasonal", label: "Holiday & Seasonal Offers" },
  { id: "entertainment", label: "Entertainment" },
  { id: "home_living", label: "Home & Living" },
  { id: "automotive", label: "Automotive" },
  { id: "misc_offers", label: "Miscellaneous" },
  ],
};