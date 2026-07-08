import type { CategoryItem } from "./types";

export const travelStays: CategoryItem = {
  id: "travel_stays",
  label: "Travel & Stays",
  description: "Holiday rentals, tour packages, and local staycations.",
  color: "cyan",
  cardIcon: "paper-airplane",
  subcategories: [
  { id: "holiday_rentals", label: "Holiday Rentals" },
  { id: "hotels_guesthouses", label: "Hotels & Guesthouses" },
  { id: "tour_packages", label: "Tour Packages" },
  { id: "staycations", label: "Staycations & Day Trips" },
  { id: "travel_services", label: "Travel Services" },
  { id: "travel_accessories", label: "Travel Accessories" },
  ],
};