import type { CategoryItem } from "./types";

export const services: CategoryItem = {
  id: "services",
  label: "Services",
  description: "Skilled professionals for every need, from home repairs to tutoring.",
  color: "teal",
  cardIcon: "wrench",
  subcategories: [
  { id: "home_services", label: "Home Services" },
  { id: "business_services", label: "Business Services" },
  { id: "health_fitness", label: "Health & Fitness" },
  { id: "tutoring", label: "Tutoring" },
  { id: "education_learning", label: "Education & Learning" },
  { id: "travel_tourism", label: "Travel & Tourism" },
  { id: "food_dining", label: "Food & Dining" },
  { id: "tech_gadgets", label: "Technology & Gadgets" },
  { id: "creative_services", label: "Creative Services" },
  { id: "other_services", label: "Other Services" },
  { id: "wanted", label: "Wanted" },
  ],
};