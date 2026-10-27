import type { FilterConfig, FilterOption, MainCategory } from "../types";

// Option values are the Baby & Kids forms' (posting/form-schema/defaults/baby-kids.ts):
// each sub's Type is `itemType` (Childcare: `careType`; Classes: `activityType`).
// Age matches the one band a thing suits, or any of the `ages` a service takes
// (lib/postFilterQuery.ts BABY_FORM_FILTERS, buildBabyClauses).

const opts = (entries: [string, string][]): FilterOption[] => entries.map(([value, label]) => ({ label, value }));

const AGE_BANDS: [string, string][] = [["0_2", "0–2 yrs"], ["3_5", "3–5 yrs"], ["6_9", "6–9 yrs"], ["10plus", "10+ yrs"]];
const ageGroup: FilterConfig = { id: "age_group", label: "Age", type: "toggle", options: opts(AGE_BANDS) };

const condition: FilterConfig = {
  id: "condition",
  label: "Condition",
  type: "toggle",
  options: opts([["new", "Brand New"], ["like-new", "Like New"], ["lightly-used", "Lightly Used"], ["used", "Well Used"], ["heavily-used", "Heavily Used"]]),
};

const delivery: FilterConfig = {
  id: "delivery",
  label: "Delivery",
  type: "toggle",
  singleSelect: true,
  options: opts([["delivery", "Delivery available"]]),
};

export const babyKids: MainCategory = {
  id: "baby_kids",
  label: "Baby & Kids",
  description: "Toys, clothing, childcare, baby gear, and school supplies.",
  icon: "baby",
  iconBg: "bg-yellow-100",
  iconColor: "text-yellow-600",
  subcategories: [
    {
      id: "toys_games",
      label: "Toys & Games",
      icon: "puzzle",
      filters: [
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: opts([["building", "Building & LEGO"], ["dolls_figures", "Dolls & Figures"], ["educational", "Educational"], ["board_games", "Board Games & Puzzles"], ["outdoor", "Outdoor & Ride-on"], ["baby_toddler", "Baby & Toddler"], ["electronic", "Electronic & Video"], ["soft", "Soft Toys"], ["other", "Other"]]),
        },
        ageGroup,
        condition,
        delivery,
      ],
    },
    {
      id: "baby_gear",
      label: "Baby Gear & Equipment",
      icon: "shopping-cart",
      filters: [
        {
          id: "item_type",
          label: "Type",
          type: "toggle",
          options: opts([["pram", "Pram / Stroller"], ["car_seat", "Car Seat"], ["cot", "Cot / Crib / Moses Basket"], ["high_chair", "High Chair"], ["monitor", "Baby Monitor"], ["carrier", "Baby Carrier"], ["bath_changing", "Bath & Changing"], ["feeding", "Feeding & Bottles"], ["safety", "Safety Gates & Proofing"], ["play", "Bouncers & Play"], ["other", "Other"]]),
        },
        condition,
        delivery,
      ],
    },
    {
      id: "kids_clothing",
      label: "Baby & Kids Clothing",
      icon: "shirt",
      filters: [
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: opts([["bundle", "Bundle"], ["tops", "Tops & T-shirts"], ["bottoms", "Trousers & Shorts"], ["dresses", "Dresses & Skirts"], ["outerwear", "Coats & Jackets"], ["sleepwear", "Sleepwear"], ["traditional", "Traditional & Festive"], ["shoes", "Shoes"], ["other", "Other"]]),
        },
        {
          id: "age_group",
          label: "Age",
          type: "toggle",
          options: opts([["infant", "0–12 months"], ["toddler", "1–3 yrs"], ["young", "4–7 yrs"], ["older", "8–14 yrs"]]),
        },
        {
          id: "gender",
          label: "For",
          type: "toggle",
          options: opts([["boy", "Boy"], ["girl", "Girl"], ["unisex", "Unisex"]]),
        },
        condition,
        delivery,
      ],
    },
    {
      id: "childcare",
      label: "Childcare & Nurseries",
      icon: "heart",
      filters: [
        {
          id: "care_type",
          label: "Care Type",
          type: "toggle",
          options: opts([["nursery", "Nursery / Daycare"], ["childminder", "Childminder"], ["nanny", "Nanny / Au Pair"], ["babysitting", "Babysitting"], ["afterschool", "After School"], ["holiday", "Holiday Care"]]),
        },
        ageGroup,
        {
          id: "hours",
          label: "Hours",
          type: "toggle",
          options: opts([["fullday", "Full Day"], ["halfday", "Half Day"], ["evenings", "Evenings"], ["weekends", "Weekends"], ["overnight", "Overnight"]]),
        },
        {
          id: "first_aid",
          label: "First Aid",
          type: "toggle",
          singleSelect: true,
          options: opts([["yes", "Paediatric first aid"]]),
        },
      ],
    },
    {
      id: "school_supplies",
      label: "School Supplies & Books",
      icon: "book-open",
      filters: [
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: opts([["uniform", "School Uniform"], ["bags", "Bags & Lunchboxes"], ["stationery", "Stationery"], ["books", "Books & Textbooks"], ["other", "Other"]]),
        },
        ageGroup,
        condition,
        delivery,
      ],
    },
    {
      id: "kids_activities",
      label: "Kids Classes & Activities",
      icon: "star",
      filters: [
        {
          id: "activity_type",
          label: "Activity",
          type: "toggle",
          options: opts([["sports", "Sports"], ["swimming", "Swimming"], ["arts", "Arts & Crafts"], ["music", "Music"], ["dance", "Dance"], ["coding", "Coding & STEM"], ["academic", "Tuition & Academic"], ["camps", "Holiday Camps"], ["other", "Other"]]),
        },
        ageGroup,
        {
          id: "mode",
          label: "Mode",
          type: "toggle",
          singleSelect: true,
          options: opts([["inperson", "In-person"], ["online", "Online"]]),
        },
        {
          id: "free_trial",
          label: "Free Trial",
          type: "toggle",
          singleSelect: true,
          options: opts([["yes", "Free trial class"]]),
        },
      ],
    },
  ],
};
