/**
 * lib/mock/listing-map.ts
 *
 * Maps (cat, sub) URL params → the correct MockListing[] array.
 * Used by the listings page to resolve which data to display.
 *
 * URL shape:  /listings?cat=property&sub=to_rent
 *
 * Category IDs come from ALERT_CONFIG (components/create-alert/config/).
 * Mock data exports come from lib/mock/<category>/index.ts.
 *
 * TODO [INTEGRATION]: replace each array with a real API call:
 *   fetchListings({ cat, sub, q, lat, lng, radius })
 */
import type { MockListing } from "./mock-listing-schema";

// ── Property ──────────────────────────────────────────────────────────────────
import {
  ALL_PROPERTY_LISTINGS,
  PROPERTY_RENT, PROPERTY_BUY, PROPERTY_ROOMS, PROPERTY_STUDENTS,
  PROPERTY_COMMERCIAL, PROPERTY_HOLIDAY, PROPERTY_LAND, PROPERTY_WANTED,
} from "./gb/property";

// ── Vehicles ──────────────────────────────────────────────────────────────────
import {
  ALL_VEHICLES_LISTINGS,
  VEHICLES_CARS, VEHICLES_MOTORCYCLE, VEHICLES_VAN, VEHICLES_TRUCK,
  VEHICLES_BOATS, VEHICLES_PARTS, VEHICLES_WANTED,
} from "./gb/vehicles";

// ── Jobs ──────────────────────────────────────────────────────────────────────
import {
  ALL_JOBS_LISTINGS,
  JOBS_FULL_TIME, JOBS_PART_TIME, JOBS_FREELANCE,
  JOBS_INTERNSHIP, JOBS_TEMP_SEASONAL, JOBS_WANTED,
} from "./gb/jobs";

// ── Services ──────────────────────────────────────────────────────────────────
import {
  ALL_SERVICES_LISTINGS,
  SERVICES_HOME, SERVICES_BUSINESS, SERVICES_HEALTH_FITNESS,
  SERVICES_TUTORING, SERVICES_EDUCATION, SERVICES_TRAVEL,
  SERVICES_FOOD, SERVICES_TECH, SERVICES_OTHER, SERVICES_WANTED,
} from "./gb/services";

// ── Pets ──────────────────────────────────────────────────────────────────────
import {
  ALL_PETS_LISTINGS,
  PETS_FOR_SALE, PETS_ADOPTION, PETS_SERVICE,
  PETS_ACCESSORIES, PETS_LOST_FOUND, PETS_WANTED,
} from "./gb/pets";

// ── Business ──────────────────────────────────────────────────────────────────
import {
  ALL_BUSINESS_LISTINGS,
  BUSINESS_FOR_SALE, BUSINESS_B2B, BUSINESS_FREELANCE,
  BUSINESS_PARTNERSHIP, BUSINESS_EQUIPMENT, BUSINESS_STARTUP,
} from "./gb/business";

// ── Community ─────────────────────────────────────────────────────────────────
import {
  ALL_COMMUNITY_LISTINGS,
  COMMUNITY_LOST_FOUND, COMMUNITY_EVENTS, COMMUNITY_VOLUNTEERING,
  COMMUNITY_ANNOUNCEMENT, COMMUNITY_CHILD_FAMILY, COMMUNITY_GENERAL,
} from "./gb/community";

// ── Special Offers ────────────────────────────────────────────────────────────
import {
  ALL_SPECIAL_OFFERS_LISTINGS,
  SPECIAL_OFFERS_BANKING, SPECIAL_OFFERS_TRAVEL, SPECIAL_OFFERS_RETAIL,
  SPECIAL_OFFERS_FOOD, SPECIAL_OFFERS_ELECTRONICS, SPECIAL_OFFERS_HEALTH,
  SPECIAL_OFFERS_EDUCATION, SPECIAL_OFFERS_SEASONAL,
} from "./gb/special_offers";

// ── Education ─────────────────────────────────────────────────────────────────
import {
  ALL_EDUCATION_LISTINGS,
  EDUCATION_TUTORS, EDUCATION_ONLINE_COURSES, EDUCATION_STUDY_MATERIALS,
  EDUCATION_SCHOOLS, EDUCATION_LANGUAGES,
} from "./gb/education";

// ── Health & Beauty ───────────────────────────────────────────────────────────
import {
  ALL_HEALTH_BEAUTY_LISTINGS,
  HEALTH_GYMS, HEALTH_SALONS, HEALTH_MEDICAL,
  HEALTH_BEAUTY_PRODUCTS, HEALTH_WELLNESS,
} from "./gb/health_beauty";

// ── Food & Dining ─────────────────────────────────────────────────────────────
import {
  ALL_FOOD_DINING_LISTINGS,
  FOOD_HOME_COOKED, FOOD_CATERING, FOOD_TIFFIN,
  FOOD_RESTAURANT_DEALS, FOOD_CLOUD_KITCHENS, FOOD_BAKED,
} from "./gb/food_dining";

// ── Travel & Stays ────────────────────────────────────────────────────────────
import {
  ALL_TRAVEL_STAYS_LISTINGS,
  TRAVEL_HOLIDAY_RENTALS, TRAVEL_HOTELS, TRAVEL_TOURS,
  TRAVEL_STAYCATIONS, TRAVEL_SERVICES, TRAVEL_ACCESSORIES,
} from "./gb/travel_stays";

// ── Baby & Kids ───────────────────────────────────────────────────────────────
import {
  ALL_BABY_KIDS_LISTINGS,
  BABY_TOYS, BABY_GEAR, BABY_CLOTHING,
  BABY_CHILDCARE, BABY_SCHOOL_SUPPLIES, BABY_ACTIVITIES,
} from "./gb/baby_kids";

// ── Sports & Outdoors ─────────────────────────────────────────────────────────
import {
  ALL_SPORTS_OUTDOORS_LISTINGS,
  SPORTS_GYM_EQUIPMENT, SPORTS_TEAM, SPORTS_OUTDOOR,
  SPORTS_WATER, SPORTS_WEAR, SPORTS_COACHING,
} from "./gb/sports_outdoors";

// ── Electronics & Tech ────────────────────────────────────────────────────────
import {
  ALL_ELECTRONICS_TECH_LISTINGS,
  TECH_MOBILE, TECH_LAPTOPS, TECH_TV_AUDIO, TECH_GAMING,
  TECH_CAMERAS, TECH_PARTS, TECH_WEARABLES,
} from "./gb/electronics_tech";

// ── Home & Furniture ──────────────────────────────────────────────────────────
import {
  ALL_HOME_FURNITURE_LISTINGS,
  HOME_SOFAS, HOME_BEDS, HOME_TABLES, HOME_KITCHEN,
  HOME_STORAGE, HOME_DECOR, HOME_GARDEN, HOME_DIY,
} from "./gb/home_furniture";

// ── Fashion & Clothing ────────────────────────────────────────────────────────
import {
  ALL_FASHION_CLOTHING_LISTINGS,
  FASHION_MENS, FASHION_WOMENS, FASHION_ETHNIC, FASHION_SHOES,
  FASHION_BAGS, FASHION_JEWELLERY, FASHION_DESIGNER, FASHION_VINTAGE,
} from "./gb/fashion_clothing";

// ── Musical Instruments ────────────────────────────────────────────────────────
import {
  ALL_MUSICAL_INSTRUMENTS_LISTINGS,
  MUSIC_GUITARS, MUSIC_KEYBOARDS, MUSIC_DRUMS,
  MUSIC_DJ, MUSIC_WIND, MUSIC_ACCESSORIES,
} from "./gb/musical_instruments";

// ── Books, Media & Collectibles ─────────────────────────────────────────────────
import {
  ALL_BOOKS_MEDIA_COLLECTIBLES_LISTINGS,
  MEDIA_BOOKS, MEDIA_VINYL, MEDIA_DVDS,
  MEDIA_BOARDGAMES, MEDIA_COLLECTIBLES,
} from "./gb/books_media_collectibles";

// ── Tickets & Vouchers ──────────────────────────────────────────────────────────
import {
  ALL_TICKETS_VOUCHERS_LISTINGS,
  TICKETS_EVENTS, TICKETS_SPORT, TICKETS_GIFTCARDS,
  TICKETS_EXPERIENCES, TICKETS_TRAVEL,
} from "./gb/tickets_vouchers";

// ── Free & Giveaway ─────────────────────────────────────────────────────────────
import {
  ALL_FREE_GIVEAWAY_LISTINGS,
  FREE_FURNITURE, FREE_CLOTHING, FREE_ELECTRONICS,
  FREE_FOOD, FREE_KIDS, FREE_GENERAL,
} from "./gb/free_giveaway";

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY & SUBCATEGORY LABELS
// Canonical source: lib/category-map.ts
// Re-exported here for backwards compatibility — prefer importing from
// @/lib/category-map directly in new code.
// ─────────────────────────────────────────────────────────────────────────────
export { CATEGORY_LABELS, SUBCATEGORY_LABELS } from "@/lib/category-map";

// ─────────────────────────────────────────────────────────────────────────────
// DATA MAPS  (cat → sub → MockListing[])
// ─────────────────────────────────────────────────────────────────────────────
export const CATEGORY_MAP: Record<string, Record<string, MockListing[]>> = {
  property: {
    to_rent:        PROPERTY_RENT,
    to_buy:         PROPERTY_BUY,
    room_rental:    PROPERTY_ROOMS,
    for_students:   PROPERTY_STUDENTS,
    commercial:     PROPERTY_COMMERCIAL,
    holiday_rental: PROPERTY_HOLIDAY,
    land:           PROPERTY_LAND,
    wanted:         PROPERTY_WANTED,
  },
  vehicles: {
    cars:              VEHICLES_CARS,
    motorcycle:        VEHICLES_MOTORCYCLE,
    van:               VEHICLES_VAN,
    truck:             VEHICLES_TRUCK,
    boats:             VEHICLES_BOATS,
    parts_accessories: VEHICLES_PARTS,
    wanted:            VEHICLES_WANTED,
  },
  jobs: {
    full_time:    JOBS_FULL_TIME,
    part_time:    JOBS_PART_TIME,
    freelance:    JOBS_FREELANCE,
    internship:   JOBS_INTERNSHIP,
    temp_seasonal:JOBS_TEMP_SEASONAL,
    wanted:       JOBS_WANTED,
  },
  services: {
    home_services:      SERVICES_HOME,
    business_services:  SERVICES_BUSINESS,
    health_fitness:     SERVICES_HEALTH_FITNESS,
    tutoring:           SERVICES_TUTORING,
    education_learning: SERVICES_EDUCATION,
    travel_tourism:     SERVICES_TRAVEL,
    food_dining:        SERVICES_FOOD,
    tech_gadgets:       SERVICES_TECH,
    other_services:     SERVICES_OTHER,
    wanted:             SERVICES_WANTED,
  },
  pets: {
    for_sale:   PETS_FOR_SALE,
    adoption:   PETS_ADOPTION,
    service:    PETS_SERVICE,
    accessories:PETS_ACCESSORIES,
    lost_found: PETS_LOST_FOUND,
    wanted:     PETS_WANTED,
  },
  business: {
    biz_for_sale:          BUSINESS_FOR_SALE,
    b2b_service:           BUSINESS_B2B,
    freelance_contractors: BUSINESS_FREELANCE,
    partnership:           BUSINESS_PARTNERSHIP,
    equipment_supplies:    BUSINESS_EQUIPMENT,
    startup_support:       BUSINESS_STARTUP,
  },
  community: {
    lost_found:    COMMUNITY_LOST_FOUND,
    events:        COMMUNITY_EVENTS,
    volunteering:  COMMUNITY_VOLUNTEERING,
    announcement:  COMMUNITY_ANNOUNCEMENT,
    child_family:  COMMUNITY_CHILD_FAMILY,
    general_others:COMMUNITY_GENERAL,
  },
  special_offers: {
    banking_finance:    SPECIAL_OFFERS_BANKING,
    travel_tourism:     SPECIAL_OFFERS_TRAVEL,
    retail_shopping:    SPECIAL_OFFERS_RETAIL,
    food_dining:        SPECIAL_OFFERS_FOOD,
    electronics_gadgets:SPECIAL_OFFERS_ELECTRONICS,
    health_wellness:    SPECIAL_OFFERS_HEALTH,
    education_learning: SPECIAL_OFFERS_EDUCATION,
    holiday_seasonal:   SPECIAL_OFFERS_SEASONAL,
  },
  education: {
    tutors:          EDUCATION_TUTORS,
    online_courses:  EDUCATION_ONLINE_COURSES,
    study_materials: EDUCATION_STUDY_MATERIALS,
    schools_colleges:EDUCATION_SCHOOLS,
    language_classes:EDUCATION_LANGUAGES,
  },
  health_beauty: {
    gyms_fitness:    HEALTH_GYMS,
    salons_spas:     HEALTH_SALONS,
    medical:         HEALTH_MEDICAL,
    beauty_products: HEALTH_BEAUTY_PRODUCTS,
    wellness:        HEALTH_WELLNESS,
  },
  food_dining: {
    home_cooked:      FOOD_HOME_COOKED,
    catering:         FOOD_CATERING,
    tiffin_services:  FOOD_TIFFIN,
    restaurant_deals: FOOD_RESTAURANT_DEALS,
    cloud_kitchens:   FOOD_CLOUD_KITCHENS,
    baked_goods:      FOOD_BAKED,
  },
  travel_stays: {
    holiday_rentals:   TRAVEL_HOLIDAY_RENTALS,
    hotels_guesthouses:TRAVEL_HOTELS,
    tour_packages:     TRAVEL_TOURS,
    staycations:       TRAVEL_STAYCATIONS,
    travel_services:   TRAVEL_SERVICES,
    travel_accessories:TRAVEL_ACCESSORIES,
  },
  baby_kids: {
    toys_games:      BABY_TOYS,
    baby_gear:       BABY_GEAR,
    kids_clothing:   BABY_CLOTHING,
    childcare:       BABY_CHILDCARE,
    school_supplies: BABY_SCHOOL_SUPPLIES,
    kids_activities: BABY_ACTIVITIES,
  },
  sports_outdoors: {
    gym_fitness_equipment: SPORTS_GYM_EQUIPMENT,
    team_sports:           SPORTS_TEAM,
    outdoor_adventure:     SPORTS_OUTDOOR,
    water_sports:          SPORTS_WATER,
    sportswear:            SPORTS_WEAR,
    fitness_coaching:      SPORTS_COACHING,
  },
  electronics_tech: {
    mobile_tablets:     TECH_MOBILE,
    laptops_computers:  TECH_LAPTOPS,
    tvs_audio:          TECH_TV_AUDIO,
    gaming:             TECH_GAMING,
    cameras_photography:TECH_CAMERAS,
    computer_parts:     TECH_PARTS,
    wearables_smart:    TECH_WEARABLES,
  },
  home_furniture: {
    sofas_seating:     HOME_SOFAS,
    beds_bedroom:      HOME_BEDS,
    tables_dining:     HOME_TABLES,
    kitchen_appliances:HOME_KITCHEN,
    storage_shelving:  HOME_STORAGE,
    home_decor:        HOME_DECOR,
    garden_outdoor:    HOME_GARDEN,
    diy_tools:         HOME_DIY,
  },
  fashion_clothing: {
    mens_clothing:      FASHION_MENS,
    womens_clothing:    FASHION_WOMENS,
    ethnic_traditional: FASHION_ETHNIC,
    shoes_footwear:     FASHION_SHOES,
    bags_accessories:   FASHION_BAGS,
    jewellery_watches:  FASHION_JEWELLERY,
    designer_luxury:    FASHION_DESIGNER,
    vintage_secondhand: FASHION_VINTAGE,
  },
  musical_instruments: {
    guitars_bass:       MUSIC_GUITARS,
    keyboards_piano:    MUSIC_KEYBOARDS,
    drums_percussion:   MUSIC_DRUMS,
    dj_audio_gear:      MUSIC_DJ,
    wind_brass_strings: MUSIC_WIND,
    accessories:        MUSIC_ACCESSORIES,
  },
  books_media_collectibles: {
    books_comics:             MEDIA_BOOKS,
    vinyl_records:            MEDIA_VINYL,
    dvds_blu_ray:             MEDIA_DVDS,
    board_games_puzzles:      MEDIA_BOARDGAMES,
    collectibles_memorabilia: MEDIA_COLLECTIBLES,
  },
  tickets_vouchers: {
    event_tickets:  TICKETS_EVENTS,
    sport_tickets:  TICKETS_SPORT,
    gift_cards:     TICKETS_GIFTCARDS,
    experience_days:TICKETS_EXPERIENCES,
    travel_vouchers:TICKETS_TRAVEL,
  },
  free_giveaway: {
    furniture_free:  FREE_FURNITURE,
    clothing_free:   FREE_CLOTHING,
    electronics_free:FREE_ELECTRONICS,
    food_free:       FREE_FOOD,
    kids_items:      FREE_KIDS,
    general_free:    FREE_GENERAL,
  },
};

// ALL listings per category (used when no sub is given)
export const ALL_MAP: Record<string, MockListing[]> = {
  property:                 ALL_PROPERTY_LISTINGS,
  vehicles:                 ALL_VEHICLES_LISTINGS,
  jobs:                     ALL_JOBS_LISTINGS,
  services:                 ALL_SERVICES_LISTINGS,
  pets:                     ALL_PETS_LISTINGS,
  business:                 ALL_BUSINESS_LISTINGS,
  community:                ALL_COMMUNITY_LISTINGS,
  special_offers:           ALL_SPECIAL_OFFERS_LISTINGS,
  education:                ALL_EDUCATION_LISTINGS,
  health_beauty:            ALL_HEALTH_BEAUTY_LISTINGS,
  food_dining:              ALL_FOOD_DINING_LISTINGS,
  travel_stays:             ALL_TRAVEL_STAYS_LISTINGS,
  baby_kids:                ALL_BABY_KIDS_LISTINGS,
  sports_outdoors:          ALL_SPORTS_OUTDOORS_LISTINGS,
  electronics_tech:         ALL_ELECTRONICS_TECH_LISTINGS,
  home_furniture:           ALL_HOME_FURNITURE_LISTINGS,
  fashion_clothing:         ALL_FASHION_CLOTHING_LISTINGS,
  musical_instruments:      ALL_MUSICAL_INSTRUMENTS_LISTINGS,
  books_media_collectibles: ALL_BOOKS_MEDIA_COLLECTIBLES_LISTINGS,
  tickets_vouchers:         ALL_TICKETS_VOUCHERS_LISTINGS,
  free_giveaway:            ALL_FREE_GIVEAWAY_LISTINGS,
};

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve the listing array for given cat + sub URL params.
 * Returns all listings for the category when sub is absent.
 * Returns [] for unknown cat/sub (renders empty state).
 */
export function resolveListings(cat: string, sub?: string): MockListing[] {
  if (!cat) return [];
  if (sub) return CATEGORY_MAP[cat]?.[sub] ?? [];
  return ALL_MAP[cat] ?? [];
}


