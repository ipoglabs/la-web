import type { CategoryItem } from "./types";

export const business: CategoryItem = {
  id: "business",
  label: "Business",
  description: "Promote, buy or sell businesses and franchises.",
  color: "indigo",
  cardIcon: "building-office",
  subcategories: [
  { id: "biz_for_sale", label: "Business For Sale / Lease" },
  { id: "b2b_service", label: "B2B Service" },
  { id: "b2c_service", label: "B2C Service" },
  { id: "freelance_contractors", label: "Freelance Contractors" },
  { id: "partnership", label: "Partnership Opportunities" },
  { id: "equipment_supplies", label: "Equipment & Supplies" },
  { id: "startup_support", label: "Startup Support" },
  { id: "training", label: "Training Opportunities" },
  { id: "franchise", label: "Franchise Opportunities" },
  { id: "business_events", label: "Business Events" },
  { id: "financial_services", label: "Financial Services" },
  { id: "misc", label: "Miscellaneous" },
  { id: "wanted", label: "Wanted" },
  ],
};