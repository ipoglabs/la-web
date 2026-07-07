/**
 * lib/category-map.ts
 *
 * Single source of truth for ALL category and subcategory labels used across:
 *   - Listing page breadcrumb dropdown
 *   - Breadcrumb display text
 *   - Any future category navigation (tabs, pills, menus)
 *
 * Keys match the `cat` and `sub` URL param values from ALERT_CONFIG ids.
 * URL shape: /listings?cat=property&sub=to_rent
 *
 * This file is intentionally separate from lib/mock/listing-map.ts.
 * Reason: listing-map.ts is mock-data scaffolding that will be replaced
 * by real API calls. These labels are permanent navigation/UI data.
 */

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY LABELS
// ─────────────────────────────────────────────────────────────────────────────
export const CATEGORY_LABELS: Record<string, string> = {
  property:                 "Property",
  vehicles:                 "Vehicles",
  jobs:                     "Jobs",
  services:                 "Services",
  pets:                     "Pets",
  business:                 "Business",
  community:                "Community",
  special_offers:           "Special Offers",
  education:                "Education",
  health_beauty:            "Health & Beauty",
  food_dining:              "Food & Dining",
  travel_stays:             "Travel & Stays",
  baby_kids:                "Baby & Kids",
  sports_outdoors:          "Sports & Outdoors",
  electronics_tech:         "Electronics & Tech",
  home_furniture:           "Home & Furniture",
  fashion_clothing:         "Fashion & Clothing",
  musical_instruments:      "Musical Instruments",
  books_media_collectibles: "Books, Media & Collectibles",
  tickets_vouchers:         "Tickets & Vouchers",
  free_giveaway:            "Free & Giveaway",
};

// ─────────────────────────────────────────────────────────────────────────────
// SUBCATEGORY LABELS  — keyed by category → subcategory
// ─────────────────────────────────────────────────────────────────────────────
export const SUBCATEGORY_LABELS: Record<string, Record<string, string>> = {

  property: {
    to_rent:        "To Rent",
    to_buy:         "To Buy",
    room_rental:    "Room Rental",
    for_students:   "For Students",
    commercial:     "Commercial",
    holiday_rental: "Holiday Rental",
    land:           "Land",
    wanted:         "Wanted",
  },

  vehicles: {
    cars:              "Cars",
    motorcycle:        "Motorcycles",
    van:               "Vans",
    truck:             "Trucks",
    boats:             "Boats",
    parts_accessories: "Parts & Accessories",
    wanted:            "Wanted",
  },

  jobs: {
    full_time:     "Full-Time",
    part_time:     "Part-Time",
    freelance:     "Freelance",
    internship:    "Internship",
    temp_seasonal: "Temp / Seasonal",
    wanted:        "Wanted",
  },

  services: {
    home_services:      "Home Services",
    business_services:  "Business Services",
    health_fitness:     "Health & Fitness",
    tutoring:           "Tutoring",
    education_learning: "Education & Learning",
    travel_tourism:     "Travel & Tourism",
    food_dining:        "Food & Dining",
    tech_gadgets:       "Tech & Gadgets",
    other_services:     "Other Services",
    wanted:             "Wanted",
  },

  pets: {
    for_sale:    "For Sale",
    adoption:    "Adoption",
    service:     "Services",
    accessories: "Accessories",
    lost_found:  "Lost & Found",
    wanted:      "Wanted",
  },

  business: {
    biz_for_sale:          "Businesses For Sale",
    b2b_service:           "B2B Services",
    freelance_contractors: "Freelance & Contractors",
    partnership:           "Partnership",
    equipment_supplies:    "Equipment & Supplies",
    startup_support:       "Startup Support",
  },

  community: {
    lost_found:     "Lost & Found",
    events:         "Events",
    volunteering:   "Volunteering",
    announcement:   "Announcements",
    child_family:   "Child & Family",
    general_others: "General / Others",
  },

  special_offers: {
    banking_finance:     "Banking & Finance",
    travel_tourism:      "Travel & Tourism",
    retail_shopping:     "Retail & Shopping",
    food_dining:         "Food & Dining",
    electronics_gadgets: "Electronics & Gadgets",
    health_wellness:     "Health & Wellness",
    education_learning:  "Education",
    holiday_seasonal:    "Holiday & Seasonal",
  },

  education: {
    tutors:           "Tutors",
    online_courses:   "Online Courses",
    study_materials:  "Study Materials",
    schools_colleges: "Schools & Colleges",
    language_classes: "Language Classes",
  },

  health_beauty: {
    gyms_fitness:    "Gyms & Fitness",
    salons_spas:     "Salons & Spas",
    medical:         "Medical",
    beauty_products: "Beauty Products",
    wellness:        "Wellness",
  },

  food_dining: {
    home_cooked:      "Home-Cooked",
    catering:         "Catering",
    tiffin_services:  "Tiffin Services",
    restaurant_deals: "Restaurant Deals",
    cloud_kitchens:   "Cloud Kitchens",
    baked_goods:      "Baked Goods",
  },

  travel_stays: {
    holiday_rentals:    "Holiday Rentals",
    hotels_guesthouses: "Hotels & Guesthouses",
    tour_packages:      "Tour Packages",
    staycations:        "Staycations",
    travel_services:    "Travel Services",
    travel_accessories: "Travel Accessories",
  },

  baby_kids: {
    toys_games:      "Toys & Games",
    baby_gear:       "Baby Gear",
    kids_clothing:   "Kids Clothing",
    childcare:       "Childcare",
    school_supplies: "School Supplies",
    kids_activities: "Kids Activities",
  },

  sports_outdoors: {
    gym_fitness_equipment: "Gym & Fitness Equipment",
    team_sports:           "Team Sports",
    outdoor_adventure:     "Outdoor Adventure",
    water_sports:          "Water Sports",
    sportswear:            "Sportswear",
    fitness_coaching:      "Fitness Coaching",
  },

  electronics_tech: {
    mobile_tablets:      "Mobile & Tablets",
    laptops_computers:   "Laptops & Computers",
    tvs_audio:           "TVs & Audio",
    gaming:              "Gaming",
    cameras_photography: "Cameras & Photography",
    computer_parts:      "Computer Parts",
    wearables_smart:     "Wearables & Smart Devices",
  },

  home_furniture: {
    sofas_seating:     "Sofas & Seating",
    beds_bedroom:      "Beds & Bedroom",
    tables_dining:     "Tables & Dining",
    kitchen_appliances:"Kitchen Appliances",
    storage_shelving:  "Storage & Shelving",
    home_decor:        "Home Décor",
    garden_outdoor:    "Garden & Outdoor",
    diy_tools:         "DIY & Tools",
  },

  fashion_clothing: {
    mens_clothing:      "Men's Clothing",
    womens_clothing:    "Women's Clothing",
    ethnic_traditional: "Ethnic & Traditional",
    shoes_footwear:     "Shoes & Footwear",
    bags_accessories:   "Bags & Accessories",
    jewellery_watches:  "Jewellery & Watches",
    designer_luxury:    "Designer & Luxury",
    vintage_secondhand: "Vintage & Secondhand",
  },

  musical_instruments: {
    guitars_bass:       "Guitars & Bass",
    keyboards_piano:    "Keyboards & Piano",
    drums_percussion:   "Drums & Percussion",
    dj_audio_gear:      "DJ & Audio Gear",
    wind_brass_strings: "Wind, Brass & Strings",
    accessories:        "Accessories",
  },

  books_media_collectibles: {
    books_comics:             "Books & Comics",
    vinyl_records:            "Vinyl Records",
    dvds_blu_ray:             "DVDs & Blu-ray",
    board_games_puzzles:      "Board Games & Puzzles",
    collectibles_memorabilia: "Collectibles & Memorabilia",
  },

  tickets_vouchers: {
    event_tickets:   "Event Tickets",
    sport_tickets:   "Sport Tickets",
    gift_cards:      "Gift Cards",
    experience_days: "Experience Days",
    travel_vouchers: "Travel Vouchers",
  },

  free_giveaway: {
    furniture_free:   "Furniture",
    clothing_free:    "Clothing",
    electronics_free: "Electronics",
    food_free:        "Food",
    kids_items:       "Kids Items",
    general_free:     "General",
  },
};
