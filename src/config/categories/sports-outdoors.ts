import type { CategoryItem } from "./types";

export const sportsOutdoors: CategoryItem = {
  id: "sports_outdoors",
  label: "Sports & Outdoors",
  description: "Equipment, fitness gear, sportswear, and outdoor activities.",
  color: "green",
  cardIcon: "globe",
  subcategories: [
  { id: "gym_fitness_equipment", label: "Fitness Equipment" },
  { id: "team_sports", label: "Team Sports" },
  { id: "outdoor_adventure", label: "Outdoor & Adventure" },
  { id: "water_sports", label: "Water Sports" },
  { id: "sportswear", label: "Sportswear & Footwear" },
  { id: "fitness_coaching", label: "Fitness Classes & Coaching" },
  ],
};