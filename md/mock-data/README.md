# LokalAds — Mock Data Backbone

> **This is the authoritative reference for all mock listing data in the project.**
> Every developer adding, editing, or consuming listings must read this document first.
>
> ⚠️ **PARTIALLY STALE (as of 2026-07-11).** This doc pre-dates the IN/GB/SG country
> architecture (the internal country key was originally `"uk"`, corrected to `"gb"`
> app-wide on 2026-07-13 for ISO 3166-1 compliance — see `md/architecture/database/01-schema.md`).
> Section 2 (Directory Structure) below has been corrected to match reality.
> Sections 3–13 (schema contract, taxonomy, ID conventions, keyDetails/goodToKnow keys,
> "Adding a New Listing/Subcategory") still describe the per-listing authoring contract
> correctly — that part hasn't changed — but any snippet referencing `index.ts` central
> barrel, `ALL_LISTINGS`, or `mock-listings.ts` is talking about deleted files. See
> `md/context.md` § Data Layer and [ListingDetail.md](../features/ListingDetail.md) for
> the current resolver architecture (`country-map.ts` / `COUNTRY_OVERRIDES`).

---

## Table of Contents

1. [Why This Exists](#1-why-this-exists)
2. [Directory Structure](#2-directory-structure)
3. [Schema Contract](#3-schema-contract)
   - [MockListingSeller](#mocklistingseller)
   - [MockListing](#mocklisting)
   - [Field Rules (all 16)](#field-rules)
4. [Seller Pool — `shared-sellers.ts`](#4-seller-pool)
5. [Category Taxonomy](#5-category-taxonomy)
6. [Mock Data Quality Standard](#6-mock-data-quality-standard)
7. [ID & advId Conventions](#7-id--advid-conventions)
8. [keyDetails Keys — Per Category](#8-keydetails-keys--per-category)
9. [goodToKnow Keys — Per Category](#9-goodtoknow-keys--per-category)
10. [Adding a New Listing](#10-adding-a-new-listing)
11. [Adding a New Subcategory](#11-adding-a-new-subcategory)
12. [Proposed Future Schema Fields](#12-proposed-future-schema-fields)
13. [Category Documents](#13-category-documents)

---

## 1. Why This Exists

LokalAds is a **multi-category classifieds platform** — think a modern, localised Gumtree.
The mock data system serves three equally important purposes:

| Purpose | What it enables |
|---|---|
| **UI development** | Every component (thumbnail card, detail page, map, seller card) renders from this data — no API needed during dev |
| **Use-case coverage** | Each subcategory entry demonstrates a specific real-world scenario so designers and PMs can evaluate UX flows |
| **Schema freeze** | Acts as the authoritative type contract — when the real API arrives, it must satisfy `MockListing` |

The data is deliberately **realistic and specific**, not lorem ipsum. A listing that says `"2022 Toyota Camry Hybrid — 22,000 miles, Full FSH"` is infinitely more useful for UI testing than `"Car Title Here"`.

---

## 2. Directory Structure (current, 2026-07-11)

```
lib/mock/
│
├── mock-listing-schema.ts     ← TypeScript interfaces + skeletons (source of truth — unchanged)
├── mock-searches.tsx          ← Search suggestion data
├── country-map.ts             ← Country-aware resolver (the real entry point for pages):
│                                  COUNTRY_OVERRIDES registry, getListingsForMarket(),
│                                  getCountsForMarket(), getSubcategoryIds(),
│                                  resolveListingContext(), getSimilarListings(),
│                                  getFeaturedForMarket() (homepage cross-category mix)
├── listing-map.ts             ← Generic (UK-flavoured) CATEGORY_MAP/ALL_MAP fallback,
│                                  used for any category not yet in COUNTRY_OVERRIDES,
│                                  and as the network-failure fallback in useListingSearch.ts
│
├── in/                        ← India market — one folder per category
│   ├── property/
│   │   ├── sellers.ts (or shared-sellers.ts, per category)
│   │   ├── <subcategory>.ts   ← e.g. to-rent.ts, to-buy.ts, room-rental.ts
│   │   └── index.ts           ← Category barrel: exports subcats + ALL_<CATEGORY>_LISTINGS
│   └── … (21 categories total)
│
├── uk/                        ← United Kingdom market — same per-category shape
│   ├── shared-sellers.ts      ← Shared seller pool used across ~20 UK category files
│   └── … (21 categories)
│
└── sg/                        ← Singapore market — same per-category shape
    └── … (21 categories)
```

**Superseded / deleted files — do not re-create these:**
- ~~`index.ts` central barrel~~ — deleted. There is no single barrel re-exporting every listing; consumers go through `country-map.ts`'s resolver functions instead.
- ~~`ALL_LISTINGS`~~ — deleted along with the barrel above.
- ~~`mock-listings.ts` (`RECENT_POSTS`, `TOP_PICKS`)~~ — deleted 2026-07-11. Homepage featured content is now generated per-market by `getFeaturedForMarket(country, offset, limit)` in `country-map.ts`, which pulls live from `COUNTRY_OVERRIDES` instead of a hand-curated array.

### Why does `property/` (in some markets) have its own `sellers.ts`?

Property listings were the first category built — before the shared sellers pool was designed.
Where a category folder has its own `sellers.ts`, keep it separate rather than merging into `shared-sellers.ts` — this is a legacy split, not a bug.

---

## 3. Schema Contract

### MockListingSeller

Declared in `mock-listing-schema.ts`. Mirrors the `Seller` interface consumed by `[listingId]/SellerCard.tsx`.

```ts
interface MockListingSeller {
  name:           string;   // Display name e.g. "Alice Chen"
  role:           string;   // "Private Seller" | "Car Dealer" | "Recruiter" | etc.
  location:       string;   // Display location e.g. "East London"
  tagline:        string;   // One-liner shown on seller card (max ~80 chars)
  memberSince:    string;   // Year joined e.g. "2021"
  activeListings: number;   // Realistic count for the seller type
  lastActive:     string;   // "Xh ago" | "Xm ago" | "1d ago"
  likes:          string;   // Formatted: "3.1K" | "0.2K" | "0"
  followers:      string;   // Formatted: "1.2K" | "0.1K" | "0"
  verified:       boolean;  // true = blue tick; false = no tick
  cover:          string;   // "/img/img{1-9}.jpg" — use img() helper
  avatar:         string;   // "/img/img{1-9}.jpg" — use img() helper
}
```

**Seller profile realism rules:**
- Private individuals: `verified: false`, `activeListings: 1–5`, `likes: "0.x K"`, `followers: "0.xK"`
- Established businesses: `verified: true`, `activeListings: 20+`, `likes: "5K+"`, `followers: "2K+"`
- New businesses: `verified: true`, `activeListings: 5–20`, likes/followers proportionate

---

### MockListing

Extends `FeaturedListingItem` (from `@/components/la-blocks/FeaturedListings`).

```ts
interface MockListing extends FeaturedListingItem {
  // From FeaturedListingItem (thumbnail card):
  id:            string;
  images:        { src: string; alt: string }[];
  priceLabel:    string;
  priceSuffix?:  string;
  title:         string;
  detailsLabel:  string;
  locationLabel: string;
  postedAt:      string;
  status:        string;

  // Extended (detail page):
  href:          string;
  advId:         string;
  description:   string;
  keyDetails:    { key: string; value: string }[];
  goodToKnow:    { key: string; value: string }[];
  coordinates:   { lat: number; lng: number };
  seller:        MockListingSeller;
}
```

---

### Field Rules

All 16 fields are **required** — no gaps, no `undefined`, no empty strings.

| # | Field | Rule |
|---|---|---|
| 1 | `id` | Kebab-case, URL-safe, unique across ALL listings. Pattern: `{cat}-{subcat}-{nn}` e.g. `prop-rent-01` |
| 2 | `href` | Always `"/listings/{id}"` — matches the `id` exactly |
| 3 | `advId` | 5-digit string. Unique across all listings. Category ranges defined in §7 |
| 4 | `images` | Min 1 item. `images[0]` = cover shown in thumbnail grid. Use `img(n)` helper |
| 5 | `priceLabel` | Currency + formatted number e.g. `"£2,400"`, `"£45/hr"`, `"POA"`, `"Free"`. Never a raw integer |
| 6 | `priceSuffix` | `"/ mo"` \| `"/ wk"` \| `"/ night"` \| `"/ hr"` \| `"/ yr"` \| `"/ day"` \| `"/ session"` — omit entirely for one-off sales/purchases |
| 7 | `title` | Sentence case. Format: `"Key Noun — Distinguishing Detail, Feature"`. Max ~80 chars |
| 8 | `detailsLabel` | ALL CAPS. Pipe `"•"` separator. 2–4 tokens. Category-specific format (see §8) |
| 9 | `locationLabel` | `"Area, City"` or `"City, Region"` e.g. `"Canary Wharf, London"` |
| 10 | `postedAt` | ISO 8601 string. Use `hrsAgo(n)` or `daysAgo(n)` helpers at runtime |
| 11 | `status` | `"active"` (default) \| `"closed"` \| `"off-market"`. Most listings = `"active"` |
| 12 | `description` | Sanitised HTML only: `<p>` `<strong>` `<em>` `<ul>` `<li>`. Min 2 paragraphs. No `<div>`, `<span>`, `<br>` |
| 13 | `keyDetails` | 4–6 rows. Keys must match the **subcategory** — never copy property keys into a vehicles listing |
| 14 | `goodToKnow` | 4–6 rows. Factual policy/availability info only — not feature descriptions |
| 15 | `coordinates` | Must be realistic and geographically consistent with `locationLabel` |
| 16 | `seller` | MUST reference a named constant from the SELLERS pool. Never inline an anonymous object |

---

## 4. Seller Pool

**File:** `lib/mock/shared-sellers.ts` (+ `lib/mock/property/sellers.ts` for property)

All sellers are accessed via `SELLERS.<key>` e.g. `SELLERS.dave`, `SELLERS.apex`.

### Current Pool — by category group

| Key | Name | Role | Used in |
|---|---|---|---|
| `alice` | Alice Chen | Private Landlord | property/ |
| `bob` | Bob Harrison | Property Agent | property/ |
| `sarah` | Sarah Patel | Letting Agent | property/ |
| `prime` | Prime Developments Ltd | New Build Developer | property/ |
| `james` | James O'Brien | Owner (selling) | property/ |
| `comm` | Meridian Commercial | Commercial Agent | property/ |
| `dave` | Dave Morris | Private Seller | vehicles/ |
| `apex` | Apex Car Sales | Car Dealer | vehicles/ |
| `moto` | MotoTraders Ltd | Motorcycle Dealer | vehicles/ |
| `fleet` | City Fleet Solutions | Fleet Dealer | vehicles/ |
| `recruitPro` | TalentBridge Recruitment | Recruiter | jobs/ |
| `techCo` | Nexus Tech Ltd | Employer | jobs/ |
| `retailCo` | Urban Retail Group | Employer | jobs/ |
| `ngoOrg` | GreenFutures Foundation | NGO | jobs/ |
| `handyFix` | FixIt Fast Ltd | Service Provider | services/ |
| `wellnessHub` | Revive Wellness Studio | Service Provider | services/ |
| `tutorAce` | Dr. Priya Sharma | Private Tutor | services/, education/ |
| `chefPro` | Marco Rossi | Private Chef | services/, food-dining/ |
| `bizConsult` | Apex Business Consulting | Service Provider | services/, business/ |
| `techRepair` | TechFix Express | Service Provider | services/, electronics-tech/ |
| `quickSell` | Lisa Harper | Private Seller | for-sale/ |
| `marketStall` | Bargain Box UK | Online Trader | for-sale/ |
| `pawsLove` | Helen Brooks | Breeder | pets/ |
| `petShop` | PetWorld London | Pet Store | pets/ |
| `pawsRescue` | Second Chance Animal Rescue | Rescue Centre | pets/ |
| `bizBroker` | Meridian Business Brokers | Business Broker | business/ |
| `startupHub` | London Startup Hub | Incubator | business/ |
| `localCouncil` | Southwark Council | Local Authority | community/ |
| `communityMgr` | Emma Clarke | Community Organiser | community/ |
| `eduPro` | Bright Minds Academy | Education Provider | education/ |
| `spaLux` | Serenity Spa London | Spa & Wellness | health-beauty/ |
| `gymPro` | IronCore Fitness | Gym | health-beauty/ |
| `foodPro` | Saffron Home Kitchen | Home Cook | food-dining/ |
| `cateringCo` | Grand Feast Catering | Caterer | food-dining/ |
| `travelPro` | Voyage Travel Co. | Travel Agency | travel-stays/ |
| `hotelMgr` | The Kensington Rooms | Hotel | travel-stays/ |
| `babyShop` | Little Stars Baby Boutique | Baby & Kids Store | baby-kids/ |
| `nurseAna` | Ana Costa | Childcare Provider | baby-kids/ |
| `sportStore` | Peak Performance Sports | Sports Retailer | sports-outdoors/ |
| `coachPro` | Coach Dan Freeman | Fitness Coach | sports-outdoors/ |
| `techSeller` | GadgetHub UK | Electronics Trader | electronics-tech/ |
| `techPrivate` | Ryan Kim | Private Seller | electronics-tech/ |
| `homeStore` | Nest & Nook Interiors | Furniture Store | home-furniture/ |
| `homePrivate` | Susan Wright | Private Seller | home-furniture/ |
| `fashionBtq` | Luxe Thread Boutique | Fashion Retailer | fashion-clothing/ |
| `fashionPrivate` | Chloe Nguyen | Private Seller | fashion-clothing/ |
| `dealsPro` | LokalAds Deals | Deals Curator | special-offers/ |
| `generic` | LokalAds Seller | Seller | fallback only |

### Rules for sellers
1. **Never create an inline anonymous seller object** inside a listing. Always use `SELLERS.<key>`.
2. **One seller key can serve multiple subcategories** within the same category group. E.g. `SELLERS.apex` is used for both `cars` and `vans` listings.
3. **Reusing across categories** is acceptable for general-purpose sellers (e.g. `SELLERS.generic`, `SELLERS.quickSell`).
4. **Adding a new seller**: add the profile to `shared-sellers.ts` with a descriptive comment grouping. Never duplicate an existing personality.

---

## 5. Category Taxonomy

18 top-level categories. Each has a dedicated folder under `lib/mock/`.

| # | Category | Folder | Export Prefix | Subcategories |
|---|---|---|---|---|
| 1 | Property | `property/` | `PROPERTY_` | to_rent · to_buy · room_rental · for_students · commercial · holiday_rental · land · wanted |
| 2 | Vehicles | `vehicles/` | `VEHICLES_` | cars · motorcycle · van · truck · boats · parts_accessories · wanted |
| 3 | Jobs | `jobs/` | `JOBS_` | full_time · part_time · freelance · internship · temp_seasonal · wanted |
| 4 | Services | `services/` | `SERVICES_` | home_services · business_services · health_fitness · tutoring · education_learning · travel_tourism · food_dining · tech_gadgets · other_services · wanted |
| 5 | For Sale | `for-sale/` | `FOR_SALE_` | electronics · home_furniture · office_supplies · fashion_accessories · sports_fitness · toys_games · books · music_media · baby_kids · health_beauty · garden_outdoors |
| 6 | Pets | `pets/` | `PETS_` | for_sale · adoption · service · accessories · lost_found · wanted |
| 7 | Business | `business/` | `BUSINESS_` | biz_for_sale · b2b_service · freelance_contractors · partnership · equipment_supplies · startup_support |
| 8 | Community | `community/` | `COMMUNITY_` | lost_found · events · volunteering · announcement · child_family · general_others |
| 9 | Special Offers | `special-offers/` | `SPECIAL_OFFERS_` | banking_finance · travel_tourism · retail_shopping · food_dining · electronics_gadgets · health_wellness · education_learning · holiday_seasonal |
| 10 | Education | `education/` | `EDUCATION_` | tutors · online_courses · study_materials · schools_colleges · language_classes |
| 11 | Health & Beauty | `health-beauty/` | `HEALTH_` | gyms_fitness · salons_spas · medical · beauty_products · wellness |
| 12 | Food & Dining | `food-dining/` | `FOOD_` | home_cooked · catering · tiffin_services · restaurant_deals · cloud_kitchens · baked_goods |
| 13 | Travel & Stays | `travel-stays/` | `TRAVEL_` | holiday_rentals · hotels_guesthouses · tour_packages · staycations · travel_services · travel_accessories |
| 14 | Baby & Kids | `baby-kids/` | `BABY_` | toys_games · baby_gear · kids_clothing · childcare · school_supplies · kids_activities |
| 15 | Sports & Outdoors | `sports-outdoors/` | `SPORTS_` | gym_fitness_equipment · team_sports · outdoor_adventure · water_sports · sportswear · fitness_coaching |
| 16 | Electronics & Tech | `electronics-tech/` | `TECH_` | mobile_tablets · laptops_computers · tvs_audio · gaming · cameras_photography · computer_parts · wearables_smart |
| 17 | Home & Furniture | `home-furniture/` | `HOME_` | sofas_seating · beds_bedroom · tables_dining · kitchen_appliances · storage_shelving · home_decor · garden_outdoor · diy_tools |
| 18 | Fashion & Clothing | `fashion-clothing/` | `FASHION_` | mens_clothing · womens_clothing · ethnic_traditional · shoes_footwear · bags_accessories · jewellery_watches · designer_luxury · vintage_secondhand |

### Intentional overlaps (by design, not a bug)

| Subcat A | Subcat B | Why both exist |
|---|---|---|
| `for-sale/electronics` | `electronics-tech/` | Generic marketplace sale vs. specialist tech category |
| `property/holiday_rental` | `travel-stays/holiday_rentals` | Owner posting their own property vs. travel platform/agency listing |
| `for-sale/baby_kids` | `baby-kids/` | Second-hand item in a catch-all marketplace vs. dedicated baby category |
| `services/food_dining` | `food-dining/` | Chef/caterer offering a service vs. ready-made food product listing |

---

## 6. Mock Data Quality Standard

### The 3-Scenario Rule

Every subcategory **must** have a minimum of **3 entries**, each covering a distinct real-world scenario:

| Entry | Scenario | Seller type |
|---|---|---|
| `*-01` | **Typical private individual** — realistic person, realistic mid-range price | Private seller (unverified) |
| `*-02` | **Professional / business** — dealer, agency, recruiter, or registered company | Verified business seller |
| `*-03` | **Edge case or variant** — premium/budget extreme, unusual arrangement, niche variant, or "wanted" perspective | Either |

### What makes a listing high quality

- **Title**: Specific. `"2022 Toyota Camry Hybrid — Full FSH, 1 Owner"` not `"Nice car for sale"`.
- **Description**: 2 proper `<p>` tags. First paragraph = what it is + key highlights. Second = context / why selling / availability. Optional `<ul>` for specs.
- **keyDetails**: 4–6 rows. Keys are **subcategory-specific** — never paste property keys into a vehicle listing.
- **goodToKnow**: 4–6 rows. Policy and availability only — not feature descriptions that belong in `keyDetails`.
- **Seller**: Matched to the listing's tone. A private car seller uses `SELLERS.dave`. A dealership uses `SELLERS.apex`.
- **Coordinates**: Must geographically match `locationLabel`. Use [latlong.net](https://www.latlong.net) to verify.
- **Price**: Format matches the category convention exactly (see §8).

### What to avoid

- ❌ Duplicate `id` or `advId` values anywhere in the codebase
- ❌ Identical `keyDetails` keys between unrelated categories
- ❌ `seller: SELLERS.generic` except as a last resort
- ❌ HTML in `description` beyond the allowed tags
- ❌ `postedAt` as a hardcoded date string — always use `hrsAgo()` or `daysAgo()`
- ❌ `coordinates` of `{ lat: 51.5074, lng: -0.1278 }` (Trafalgar Square) — that is the skeleton placeholder; replace it

---

## 7. ID & advId Conventions

### ID format: `{cat}-{subcat}-{nn}`

| Category | Cat prefix | Subcat examples |
|---|---|---|
| Property | `prop` | `prop-rent-01`, `prop-buy-03`, `prop-land-01` |
| Vehicles | `veh` | `veh-car-01`, `veh-moto-02`, `veh-truck-01` |
| Jobs | `job` | `job-ft-01`, `job-pt-02`, `job-intern-01` |
| Services | `svc` | `svc-home-01`, `svc-tech-02`, `svc-tutor-01` |
| For Sale | `sale` | `sale-elec-01`, `sale-furn-02`, `sale-book-01` |
| Pets | `pet` | `pet-sale-01`, `pet-adopt-02`, `pet-lost-01` |
| Business | `biz` | `biz-sale-01`, `biz-b2b-02`, `biz-partner-01` |
| Community | `comm` | `comm-lost-01`, `comm-event-02`, `comm-vol-01` |
| Special Offers | `deal` | `deal-bank-01`, `deal-travel-02`, `deal-retail-01` |
| Education | `edu` | `edu-tutor-01`, `edu-course-02`, `edu-lang-01` |
| Health & Beauty | `hb` | `hb-gym-01`, `hb-salon-02`, `hb-med-01` |
| Food & Dining | `food` | `food-home-01`, `food-cater-02`, `food-baked-01` |
| Travel & Stays | `travel` | `travel-rent-01`, `travel-hotel-02`, `travel-tour-01` |
| Baby & Kids | `baby` | `baby-toy-01`, `baby-gear-02`, `baby-care-01` |
| Sports & Outdoors | `sport` | `sport-gym-01`, `sport-team-02`, `sport-water-01` |
| Electronics | `tech` | `tech-mob-01`, `tech-lap-02`, `tech-cam-01` |
| Home & Furniture | `home` | `home-sofa-01`, `home-bed-02`, `home-diy-01` |
| Fashion | `fashion` | `fashion-men-01`, `fashion-shoes-02`, `fashion-vtg-01` |

### advId ranges (5-digit, no overlap)

| Category | Range |
|---|---|
| Property | 10001–10999 |
| Vehicles | 20001–20999 |
| Jobs | 30001–30999 |
| Services | 40001–40999 |
| For Sale | 50001–50999 |
| Pets | 60001–60999 |
| Business | 70001–70999 |
| Community | 71001–71999 |
| Special Offers | 72001–72999 |
| Education | 73001–73999 |
| Health & Beauty | 74001–74999 |
| Food & Dining | 75001–75999 |
| Travel & Stays | 76001–76999 |
| Baby & Kids | 77001–77999 |  ← Note: current files use 150xx — migrate to this range |
| Sports & Outdoors | 78001–78999 |
| Electronics & Tech | 79001–79999 |
| Home & Furniture | 80001–80999 |
| Fashion & Clothing | 81001–81999 |

---

## 8. keyDetails Keys — Per Category

These are the **standard keys** for `keyDetails` per subcategory group. Use these — don't invent new labels that mean the same thing.

### Property
| Subcat | Standard keys |
|---|---|
| to_rent | Furnishing · Security Deposit · Available From · Listed By · Min Tenancy · Pet Friendly |
| to_buy | Tenure · Property Type · Bedrooms · Bathrooms · EPC Rating · Chain Free |
| room_rental | Furnishing · Bills Included · Available From · House Rules · Current Occupants |
| for_students | Near University · Bills Included · Available From · Contract Length · Student-Only |
| commercial | Property Type · Floor Area · Lease Type · Available From · Planning Use |
| holiday_rental | Sleeps · Bedrooms · Available Dates · Min Stay · Check-In / Check-Out |
| land | Area (acres/m²) · Planning Permission · Access Road · Services Connected · Land Type |
| wanted | Budget · Area Preference · Property Type · Bedrooms · Move-in Date |

### Vehicles
| Subcat | Standard keys |
|---|---|
| cars | Make / Model · Year / Reg · Mileage · Fuel Type · Transmission · Body Type |
| motorcycle | Make / Model · Year / Reg · Engine CC · Mileage · Licence Category · Colour |
| van | Make / Model · Year / Reg · Mileage · Load Capacity · Wheelbase · Fuel Type |
| truck | Make / Model · Year / Reg · Gross Weight · Payload · Drive Config · Fuel Type |
| boats | Make / Model · Year · Length (ft) · Engine Type · Berths · Location |
| parts_accessories | Compatible With · Part Type · Condition · OEM / Aftermarket · Part Number |
| wanted | Type Wanted · Budget · Year Range · Preferred Fuel · Mileage Limit |

### Jobs
| Subcat | Standard keys |
|---|---|
| full_time | Job Title · Contract · Hours · Arrangement · Start Date · Experience Required |
| part_time | Job Title · Contract · Hours / Week · Arrangement · Start Date · Age Requirement |
| freelance | Skill / Role · Project Type · Duration · Rate · Remote / On-site · Tools Required |
| internship | Role · Duration · Paid / Unpaid · Days / Week · University Partner · Sector |
| temp_seasonal | Role · Start Date · End Date · Hours / Week · Pay Rate · Location |
| wanted | Role Sought · Availability · Experience · Preferred Arrangement · Notice Period |

### Services
| Subcat | Standard keys |
|---|---|
| home_services | Service Type · Coverage · Availability · Response Time · Qualifications |
| business_services | Service Type · Clients · Pricing Model · Min Engagement · Qualifications |
| health_fitness | Service Type · Sessions · Duration · Location · Qualifications |
| tutoring | Subject · Level · Sessions · Duration · Location (in-person / online) |
| tech_gadgets | Service Type · Devices Covered · Turnaround · Warranty on Repair · Callout |
| (others) | Service Type · Coverage · Availability · Response Time · Qualifications |

### For Sale, Pets, Business, Community, Special Offers, Education, Health & Beauty, Food & Dining, Travel & Stays, Baby & Kids, Sports & Outdoors, Electronics & Tech, Home & Furniture, Fashion & Clothing
→ See individual category documents in `md/mock-data/`.

---

## 9. goodToKnow Keys — Per Category

`goodToKnow` is for **policy, logistics, and availability** — not feature specs.

| Category type | Typical goodToKnow keys |
|---|---|
| Property | Available · Agent Fee · Smoking · Parking · Security |
| Vehicles | Condition · MOT Expiry · Service Hist. · Owners · Part Exchange |
| Jobs | Salary · Visa Sponsor · Equity · Notice · Apply Via |
| Services | Call-Out Fee · Payment · Insurance · Reviews · Book Via |
| For Sale (items) | Condition · Postage · Collection · Returns · Negotiable |
| Pets | Vaccinated · Microchipped · Neutered · Vet Records · Collection |
| Business | Reason for Sale · Staff · Lease · Turnover · NDA Required |
| Community | Free · Open To · Contact Via · Date · Location |
| Special Offers | Valid Until · Terms · How to Claim · For New / Existing · T&Cs |
| Food & Dining | Min Order · Delivery · Allergens · Lead Time · Payment |
| Travel & Stays | Check-In · Check-Out · Cancellation · Deposit · Includes |

---

## 10. Adding a New Listing

1. Open the relevant subcategory file e.g. `lib/mock/vehicles/cars.ts`
2. Copy the skeleton from `mock-listing-schema.ts` (`MOCK_VEHICLE_LISTING_SKELETON`)
3. Assign the next sequential `id` and `advId` in the appropriate range
4. Fill **every field** — no gaps
5. Use `SELLERS.<key>` — never inline an object
6. Use `hrsAgo(n)` or `daysAgo(n)` for `postedAt`
7. Check `coordinates` are realistic for the `locationLabel`
8. Run `npx tsc --noEmit` — should be 0 errors

---

## 11. Adding a New Subcategory

1. Create the file: `lib/mock/{category}/{subcategory-name}.ts`
2. File header template:
   ```ts
   import type { MockListing } from "../../mock-listing-schema";
   import { SELLERS } from "../../shared-sellers";

   const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
   const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
   const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();

   export const CATEGORY_SUBCAT: MockListing[] = [ /* ... */ ];
   ```
3. Add to `lib/mock/{market}/{category}/index.ts`:
   - Export statement
   - Import + spread into `ALL_{CATEGORY}_LISTINGS`
4. Confirm the category is registered in `COUNTRY_OVERRIDES` in `lib/mock/country-map.ts`
   for that market — this is what makes it show up via `getListingsForMarket()`,
   `resolveListingContext()`, `getSimilarListings()`, and `getFeaturedForMarket()`.
   (There is no separate central barrel/`ALL_LISTINGS` to update — that was removed
   2026-07-11 in favour of the country-aware resolver.)
5. Document `keyDetails` keys in this README (§8) and in the category doc

---

## 12. Proposed Future Schema Fields

These are **not yet implemented** but agreed as the next additions:

### `listingType?: "offer" | "wanted"`

Every category has a `wanted` subcategory where the poster is a **seeker**, not a seller. Currently there is no semantic way to distinguish this.

```ts
// Proposed addition to MockListing:
listingType?: "offer" | "wanted";   // default: "offer"
```

Unlocks:
- UI: "WANTED" badge on thumbnail card
- Search/filter: show only `wanted` posts
- Detail page: reversed seller/seeker copy ("This person is looking for…")

### `status` extension

Current: `"active" | "closed" | "off-market"`

Proposed extension:
```ts
status: "active" | "closed" | "off-market" | "sold" | "filled" | "found";
```

| New value | Use case |
|---|---|
| `"sold"` | Vehicle / item sold but kept visible for reference |
| `"filled"` | Job position filled |
| `"found"` | Lost pet / item found — community closure |

---

## 13. Category Documents

Individual category documents live alongside this README:

| Category | Document | Status |
|---|---|---|
| Property | [property.md](./property.md) | ✅ Complete |
| Vehicles | vehicles.md | ⏳ Pending |
| Jobs | jobs.md | ⏳ Pending |
| Services | services.md | ⏳ Pending |
| For Sale | for-sale.md | ⏳ Pending |
| Pets | pets.md | ⏳ Pending |
| Business | business.md | ⏳ Pending |
| Community | community.md | ⏳ Pending |
| Special Offers | special-offers.md | ⏳ Pending |
| Education | education.md | ⏳ Pending |
| Health & Beauty | health-beauty.md | ⏳ Pending |
| Food & Dining | food-dining.md | ⏳ Pending |
| Travel & Stays | travel-stays.md | ⏳ Pending |
| Baby & Kids | baby-kids.md | ⏳ Pending |
| Sports & Outdoors | sports-outdoors.md | ⏳ Pending |
| Electronics & Tech | electronics-tech.md | ⏳ Pending |
| Home & Furniture | home-furniture.md | ⏳ Pending |
| Fashion & Clothing | fashion-clothing.md | ⏳ Pending |
