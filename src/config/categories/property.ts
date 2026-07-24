import type { CategoryItem } from "./types";

export const property: CategoryItem = {
  id: "property",
  label: "Property",
  description: "Find your perfect home, rental or commercial space.",
  color: "blue",
  cardIcon: "home",
  subcategories: [
  { id: "to_rent", label: "To Rent" },
  { id: "to_buy", label: "To Buy" },
  { id: "room_rental", label: "Room Rental" },
  { id: "for_students", label: "For Students" },
  { id: "commercial", label: "Commercial" },
  { id: "holiday_rental", label: "Holiday Rental" },
  { id: "new_projects", label: "New Projects / Off-Plan" },
  { id: "land", label: "Land for Sale / Lease" },
  { id: "wanted", label: "Wanted" },
  ],
};