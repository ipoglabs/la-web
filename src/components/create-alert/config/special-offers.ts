import type { FilterOption, MainCategory } from "../types";
import { discount, dealType, offerFor, redemption } from "./shared";

// Option values are the Special Offers forms' (posting/form-schema/defaults/specialOffers.ts):
// each sub's first filter is its Type (`itemType`); Deal Type, Redeem At,
// Who Can Use It and Min Discount are asked on every offer (lib/postFilterQuery.ts SPECIAL_OFFERS_FORM_FILTERS).

const opts = (entries: [string, string][]): FilterOption[] => entries.map(([value, label]) => ({ label, value }));

export const specialOffers: MainCategory = {
  id: "special_offers",
  label: "Special Offers",
  description: "Exclusive deals, discounts, and limited-time offers.",
  icon: "tag",
  iconBg: "bg-rose-100",
  iconColor: "text-rose-600",
  subcategories: [
    {
      id: "banking_finance",
      label: "Banking & Finance",
      icon: "landmark",
      filters: [
        {
          id: "bf_category",
          label: "Product",
          type: "toggle",
          options: opts([["credit_card", "Credit Card"], ["loan", "Loan"], ["insurance", "Insurance"], ["savings", "Savings Account"], ["investment", "Investment"], ["current_account", "Current / Business Account"], ["other", "Other"]]),
        },
        dealType,
        discount,
        offerFor,
      ],
    },
    {
      id: "travel_tourism",
      label: "Travel & Tourism",
      icon: "plane",
      filters: [
        {
          id: "travel_category",
          label: "Type",
          type: "toggle",
          options: opts([["flights", "Flights"], ["hotels", "Hotels"], ["packages", "Holiday Packages"], ["activities", "Activities & Tours"], ["car_rental", "Car Rental"], ["cruise", "Cruise"], ["other", "Other"]]),
        },
        dealType,
        discount,
        offerFor,
      ],
    },
    {
      id: "retail_shopping",
      label: "Retail & Shopping",
      icon: "shopping-bag",
      filters: [
        {
          id: "shop_category",
          label: "Category",
          type: "toggle",
          options: opts([["fashion", "Fashion"], ["electronics", "Electronics"], ["home", "Home & Living"], ["beauty", "Beauty"], ["sports", "Sports"], ["kids", "Kids"], ["groceries", "Groceries"], ["other", "Other"]]),
        },
        dealType,
        redemption,
        discount,
        offerFor,
      ],
    },
    {
      id: "food_dining",
      label: "Food & Dining",
      icon: "utensils-crossed",
      filters: [
        {
          id: "cuisine",
          label: "Cuisine",
          type: "toggle",
          options: opts([["local", "Local"], ["asian", "Asian"], ["western", "Western"], ["fusion", "Fusion"], ["fast_food", "Fast Food"], ["cafe", "Café"], ["buffet", "Buffet"], ["other", "Other"]]),
        },
        {
          id: "meal_type",
          label: "Available For",
          type: "toggle",
          singleSelect: true,
          options: opts([["dinein", "Dine-in"], ["takeaway", "Takeaway"], ["delivery", "Delivery"]]),
        },
        dealType,
        discount,
        offerFor,
      ],
    },
    {
      id: "electronics_gadgets",
      label: "Electronics & Gadgets",
      icon: "monitor",
      filters: [
        {
          id: "elec_category",
          label: "Product",
          type: "toggle",
          options: opts([["phone", "Phone"], ["laptop", "Laptop"], ["tv", "TV"], ["camera", "Camera"], ["gaming", "Gaming"], ["smart_home", "Smart Home"], ["audio", "Audio"], ["wearable", "Wearable"], ["other", "Other"]]),
        },
        dealType,
        redemption,
        discount,
        offerFor,
      ],
    },
    {
      id: "health_wellness",
      label: "Health & Wellness",
      icon: "heart-pulse",
      filters: [
        {
          id: "hw_type",
          label: "Type",
          type: "toggle",
          options: opts([["gym", "Gym"], ["classes", "Yoga & Fitness Classes"], ["spa", "Spa & Massage"], ["salon", "Salon"], ["dental", "Dental"], ["optical", "Optical"], ["pharmacy", "Pharmacy"], ["medical", "Medical"], ["mental_health", "Mental Health"], ["other", "Other"]]),
        },
        dealType,
        redemption,
        discount,
        offerFor,
      ],
    },
    {
      id: "education_learning",
      label: "Education & Learning",
      icon: "graduation-cap",
      filters: [
        {
          id: "edu_category",
          label: "Category",
          type: "toggle",
          options: opts([["languages", "Languages"], ["tech", "Tech & Coding"], ["arts", "Arts & Music"], ["professional", "Professional"], ["school", "School Subjects"], ["kids", "Kids Programs"], ["online", "Online Courses"], ["test_prep", "Test Prep"], ["other", "Other"]]),
        },
        {
          id: "edu_format",
          label: "Format",
          type: "toggle",
          singleSelect: true,
          options: opts([["inperson", "In-person"], ["online", "Online"], ["hybrid", "Hybrid"]]),
        },
        dealType,
        discount,
        offerFor,
      ],
    },
    {
      id: "holiday_seasonal",
      label: "Holiday & Seasonal Offers",
      icon: "sparkles",
      filters: [
        {
          id: "occasion",
          label: "Occasion",
          type: "toggle",
          // Each market's own occasions (lib/listing-filters.ts BY_MARKET).
          options: opts([["diwali", "Diwali"], ["eid", "Eid"], ["cny", "Chinese New Year"], ["christmas", "Christmas"], ["newyear", "New Year"], ["blackfriday", "Black Friday"], ["easter", "Easter"], ["national", "National Day"], ["valentines", "Valentine's"], ["backtoschool", "Back to School"], ["summer", "Summer Sale"], ["midyear", "Mid-Year Sale"], ["yearend", "Year-End Sale"], ["other", "Other"]]),
        },
        {
          id: "seasonal_category",
          label: "Category",
          type: "toggle",
          options: opts([["shopping", "Shopping"], ["home", "Home & Garden"], ["travel", "Travel"], ["dining", "Dining"], ["entertainment", "Entertainment"], ["gifts", "Gifts"], ["other", "Other"]]),
        },
        dealType,
        discount,
        offerFor,
      ],
    },
    {
      id: "entertainment",
      label: "Entertainment",
      icon: "ticket",
      filters: [
        {
          id: "ent_type",
          label: "Type",
          type: "toggle",
          options: opts([["movies", "Movies"], ["concerts", "Concerts"], ["theatre", "Theatre & Shows"], ["theme_parks", "Theme Parks"], ["sports", "Sports Events"], ["gaming", "Gaming"], ["museum", "Museums & Attractions"], ["escape_room", "Escape Room"], ["streaming", "Streaming"], ["other", "Other"]]),
        },
        {
          id: "ent_format",
          label: "Format",
          type: "toggle",
          singleSelect: true,
          options: opts([["inperson", "In-person"], ["online", "Online"]]),
        },
        dealType,
        discount,
        offerFor,
      ],
    },
    {
      id: "home_living",
      label: "Home & Living",
      icon: "armchair",
      filters: [
        {
          id: "home_category",
          label: "Category",
          type: "toggle",
          options: opts([["furniture", "Furniture"], ["appliances", "Appliances"], ["decor", "Decor"], ["bedding", "Bedding"], ["kitchenware", "Kitchenware"], ["gardening", "Gardening"], ["smart_home", "Smart Home"], ["renovation", "Renovation"], ["cleaning", "Cleaning"], ["other", "Other"]]),
        },
        dealType,
        redemption,
        discount,
        offerFor,
      ],
    },
    {
      id: "automotive",
      label: "Automotive",
      icon: "car",
      filters: [
        {
          id: "auto_type",
          label: "Service",
          type: "toggle",
          options: opts([["workshop", "Workshop & Servicing"], ["wash", "Car Wash & Detailing"], ["tyre", "Tyres & Rims"], ["insurance", "Insurance"], ["accessories", "Accessories"], ["ev_charging", "EV Charging"], ["vehicle", "Vehicle Purchase"], ["other", "Other"]]),
        },
        {
          id: "for_vehicle",
          label: "For Vehicle",
          type: "toggle",
          options: opts([["car", "Car"], ["motorcycle", "Motorcycle"], ["van", "Van"], ["truck", "Truck"]]),
        },
        dealType,
        discount,
        offerFor,
      ],
    },
    {
      id: "misc_offers",
      label: "Miscellaneous",
      icon: "box",
      filters: [
        {
          id: "misc_offer_category",
          label: "Category",
          type: "toggle",
          options: opts([["pet_care", "Pet Care"], ["printing", "Printing"], ["photography", "Photography"], ["gifts", "Gifts"], ["subscription", "Subscriptions"], ["other", "Other"]]),
        },
        dealType,
        redemption,
        discount,
        offerFor,
      ],
    },
  ],
};
