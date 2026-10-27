import type { FilterConfig, FilterOption, MainCategory } from "../types";

// Option values are the Sports & Outdoors forms' (posting/form-schema/defaults/sports-outdoors.ts):
// each sub's Type is `itemType`; Team Sports also saves `sport`, Outdoor and
// Water Sports `activity` (lib/postFilterQuery.ts SPORTS_FORM_FILTERS,
// buildSportsClauses).

const opts = (entries: [string, string][]): FilterOption[] => entries.map(([value, label]) => ({ label, value }));

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

export const sportsOutdoors: MainCategory = {
  id: "sports_outdoors",
  label: "Sports & Outdoors",
  description: "Equipment, fitness gear, sportswear, and outdoor activities.",
  icon: "trophy",
  iconBg: "bg-green-100",
  iconColor: "text-green-600",
  subcategories: [
    {
      id: "gym_fitness_equipment",
      label: "Fitness Equipment",
      icon: "dumbbell",
      filters: [
        {
          id: "item_type",
          label: "Type",
          type: "toggle",
          options: opts([["weights", "Weights & Dumbbells"], ["bench", "Bench / Rack"], ["home_gym", "Home Gym / Multi-gym"], ["treadmill", "Treadmill"], ["bike", "Exercise Bike"], ["rower", "Rowing Machine"], ["cross_trainer", "Cross Trainer"], ["yoga", "Yoga & Pilates"], ["accessories", "Bands & Accessories"], ["other", "Other"]]),
        },
        condition,
        delivery,
      ],
    },
    {
      id: "team_sports",
      label: "Team Sports",
      icon: "users",
      filters: [
        {
          id: "sport",
          label: "Sport",
          type: "toggle",
          options: opts([["football", "Football"], ["cricket", "Cricket"], ["basketball", "Basketball"], ["rugby", "Rugby"], ["hockey", "Hockey"], ["tennis", "Tennis"], ["badminton", "Badminton"], ["table_tennis", "Table Tennis"], ["golf", "Golf"], ["netball", "Netball / Volleyball"], ["other", "Other"]]),
        },
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: opts([["bat_racket", "Bat / Racket / Club"], ["ball", "Balls"], ["footwear", "Boots & Shoes"], ["protective", "Pads & Protection"], ["kit", "Kit & Clothing"], ["goals_nets", "Goals, Nets & Hoops"], ["bags", "Bags"], ["bundle", "Bundle / Full Kit"], ["other", "Other"]]),
        },
        condition,
        delivery,
      ],
    },
    {
      id: "outdoor_adventure",
      label: "Outdoor & Adventure",
      icon: "mountain",
      filters: [
        {
          id: "activity",
          label: "Activity",
          type: "toggle",
          options: opts([["hiking", "Hiking & Trekking"], ["camping", "Camping"], ["climbing", "Climbing"], ["cycling", "Cycling"], ["running", "Running"], ["fishing", "Fishing"], ["skating", "Skates & Scooters"], ["winter", "Ski & Snow"], ["other", "Other"]]),
        },
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: opts([["tent", "Tent & Shelter"], ["sleeping", "Sleeping Bag & Mat"], ["backpack", "Backpack"], ["cooking", "Stove & Cooking"], ["bike", "Bike"], ["bike_parts", "Bike Parts & Accessories"], ["clothing", "Clothing & Footwear"], ["climbing_gear", "Ropes & Climbing Gear"], ["fishing_gear", "Rods & Tackle"], ["other", "Other"]]),
        },
        {
          id: "bike_type",
          label: "Bike Type",
          type: "toggle",
          options: opts([["mountain", "Mountain"], ["road", "Road"], ["hybrid", "Hybrid / City"], ["gravel", "Gravel"], ["bmx", "BMX"], ["folding", "Folding"], ["electric", "Electric"], ["kids", "Kids"], ["other", "Other"]]),
        },
        condition,
        delivery,
      ],
    },
    {
      id: "water_sports",
      label: "Water Sports",
      icon: "waves",
      filters: [
        {
          id: "activity",
          label: "Activity",
          type: "toggle",
          options: opts([["swimming", "Swimming"], ["surfing", "Surfing"], ["paddleboarding", "Paddleboarding"], ["kayaking", "Kayaking & Canoeing"], ["diving", "Diving & Snorkelling"], ["sailing", "Sailing & Windsurfing"], ["other", "Other"]]),
        },
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: opts([["board", "Board"], ["kayak", "Kayak / Canoe"], ["paddle", "Paddle"], ["wetsuit", "Wetsuit & Swimwear"], ["safety", "Life Jacket & Safety"], ["diving_gear", "Mask, Fins & Dive Gear"], ["other", "Other"]]),
        },
        condition,
        delivery,
      ],
    },
    {
      id: "sportswear",
      label: "Sportswear & Footwear",
      icon: "shirt",
      filters: [
        {
          id: "gender",
          label: "For",
          type: "toggle",
          options: opts([["men", "Men"], ["women", "Women"], ["kids", "Kids"], ["unisex", "Unisex"]]),
        },
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: opts([["shoes", "Running & Training Shoes"], ["boots", "Boots & Cleats"], ["tops", "Tops & T-shirts"], ["bottoms", "Leggings, Shorts & Bottoms"], ["sports_bra", "Sports Bras"], ["outerwear", "Jackets & Hoodies"], ["swimwear", "Swimwear"], ["bundle", "Bundle"], ["other", "Other"]]),
        },
        condition,
        delivery,
      ],
    },
    {
      id: "fitness_coaching",
      label: "Fitness Classes & Coaching",
      icon: "zap",
      filters: [
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: opts([["pt", "Personal Training"], ["group", "Group Class / Bootcamp"], ["sports", "Sports Coaching"], ["running", "Running Coach"], ["yoga", "Yoga & Pilates"], ["martial", "Martial Arts & Boxing"], ["swimming", "Swimming Lessons"], ["other", "Other"]]),
        },
        {
          id: "mode",
          label: "Mode",
          type: "toggle",
          singleSelect: true,
          options: opts([["inperson", "In-person"], ["online", "Online"]]),
        },
        {
          id: "level",
          label: "Level",
          type: "toggle",
          options: opts([["beginner", "Beginner"], ["intermediate", "Intermediate"], ["advanced", "Advanced"]]),
        },
        {
          id: "free_trial",
          label: "Free Trial",
          type: "toggle",
          singleSelect: true,
          options: opts([["yes", "Free trial session"]]),
        },
      ],
    },
  ],
};
