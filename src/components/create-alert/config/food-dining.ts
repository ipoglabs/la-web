import type { FilterConfig, FilterOption, MainCategory } from "../types";
import { dealType } from "./shared";

// Option values are the Food & Dining forms' (posting/form-schema/defaults/food-dining.ts):
// Cuisine is `cuisines`, Dietary `dietaryOptions`, Delivery the Collection /
// Delivery `dealMethod` (lib/postFilterQuery.ts FOOD_FORM_FILTERS). Cuisine,
// Dietary and Order On list every market's values; lib/listing-filters.ts
// keeps each market's own.

const opts = (entries: [string, string][]): FilterOption[] => entries.map(([value, label]) => ({ label, value }));

const cuisine: FilterConfig = {
  id: "cuisine",
  label: "Cuisine",
  type: "toggle",
  options: opts([["north_indian", "North Indian"], ["south_indian", "South Indian"], ["mughlai", "Mughlai / Biryani"], ["indian", "Indian"], ["chinese", "Chinese"], ["malay", "Malay"], ["peranakan", "Peranakan"], ["japanese", "Japanese"], ["korean", "Korean"], ["thai", "Thai"], ["western", "Western"], ["british", "British"], ["american", "American"], ["italian", "Italian"], ["middle_eastern", "Middle Eastern"], ["african_caribbean", "African & Caribbean"], ["eastern_european", "Eastern European"], ["mexican", "Mexican"], ["fusion", "Fusion"], ["other", "Other"]]),
};

const dietary: FilterConfig = {
  id: "dietary",
  label: "Dietary",
  type: "toggle",
  options: opts([["veg", "Vegetarian"], ["vegan", "Vegan"], ["nonveg", "Non-Vegetarian"], ["jain", "Jain"], ["eggless", "Eggless"], ["halal", "Halal"], ["gluten_free", "Gluten-Free"]]),
};

const delivery: FilterConfig = {
  id: "delivery",
  label: "Delivery",
  type: "toggle",
  singleSelect: true,
  options: opts([["delivery", "Delivery available"]]),
};

const mealType = (entries: [string, string][]): FilterConfig => ({ id: "meal_type", label: "Meals", type: "toggle", options: opts(entries) });

export const foodDining: MainCategory = {
  id: "food_dining",
  label: "Food & Dining",
  description: "Home-cooked meals, catering, cloud kitchens, and restaurant deals.",
  icon: "utensils",
  iconBg: "bg-lime-100",
  iconColor: "text-lime-600",
  subcategories: [
    {
      id: "home_cooked",
      label: "Home Cooked Meals",
      icon: "cooking-pot",
      filters: [cuisine, dietary, mealType([["breakfast", "Breakfast"], ["lunch", "Lunch"], ["dinner", "Dinner"], ["snacks", "Snacks"]]), delivery],
    },
    {
      id: "catering",
      label: "Catering Services",
      icon: "cake",
      filters: [
        {
          id: "event_type",
          label: "Event Type",
          type: "toggle",
          options: opts([["wedding", "Weddings"], ["corporate", "Corporate"], ["birthday", "Birthdays"], ["party", "Private Parties"], ["religious", "Religious & Festive"], ["other", "Other"]]),
        },
        {
          id: "service_style",
          label: "Service Style",
          type: "toggle",
          options: opts([["buffet", "Buffet"], ["plated", "Plated / Sit-down"], ["boxed", "Boxed Meals"], ["live", "Live Counters"], ["food_truck", "Food Truck / Van"], ["drop_off", "Drop-off"]]),
        },
        cuisine,
        dietary,
      ],
    },
    {
      id: "tiffin_services",
      label: "Tiffin Services",
      icon: "package",
      filters: [
        dietary,
        {
          id: "plan",
          label: "Plan",
          type: "toggle",
          singleSelect: true,
          options: opts([["oneoff", "Trial / One-off"], ["daily", "Daily"], ["weekly", "Weekly"], ["monthly", "Monthly"]]),
        },
        mealType([["breakfast", "Breakfast"], ["lunch", "Lunch"], ["dinner", "Dinner"]]),
        cuisine,
      ],
    },
    {
      id: "restaurant_deals",
      label: "Restaurant Deals",
      icon: "tag",
      filters: [
        cuisine,
        dealType,
        mealType([["breakfast", "Breakfast"], ["brunch", "Brunch"], ["lunch", "Lunch"], ["dinner", "Dinner"], ["drinks", "Drinks"]]),
      ],
    },
    {
      id: "cloud_kitchens",
      label: "Cloud Kitchens",
      icon: "store",
      filters: [
        cuisine,
        dietary,
        {
          id: "delivery_app",
          label: "Order On",
          type: "toggle",
          options: opts([["swiggy", "Swiggy"], ["zomato", "Zomato"], ["deliveroo", "Deliveroo"], ["ubereats", "Uber Eats"], ["justeat", "Just Eat"], ["grabfood", "GrabFood"], ["foodpanda", "foodpanda"], ["direct", "Order Direct"]]),
        },
      ],
    },
    {
      id: "baked_goods",
      label: "Baked Goods & Desserts",
      icon: "cookie",
      filters: [
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: opts([["cakes", "Cakes"], ["cupcakes", "Cupcakes"], ["bread", "Bread"], ["cookies", "Cookies & Biscuits"], ["pastries", "Pastries"], ["brownies", "Brownies & Traybakes"], ["desserts", "Desserts"], ["savoury", "Savoury Bakes"], ["other", "Other"]]),
        },
        dietary,
        {
          id: "custom_orders",
          label: "Custom Orders",
          type: "toggle",
          singleSelect: true,
          options: opts([["yes", "Takes custom orders"]]),
        },
        delivery,
      ],
    },
  ],
};
