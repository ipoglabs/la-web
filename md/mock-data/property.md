# Property Category — LokalAds Mock Data

> **Category #1 of 18** — The most complex category in the platform.
> Read [README.md](./README.md) first for global rules that apply here too.

---

## Table of Contents

1. [Category Overview](#1-category-overview)
2. [Who Posts in Property?](#2-who-posts-in-property)
3. [File Structure](#3-file-structure)
4. [Seller Pool (Property-Specific)](#4-seller-pool-property-specific)
5. [Subcategories — Deep Dive](#5-subcategories--deep-dive)
   - [to-rent](#to-rent)
   - [to-buy](#to-buy)
   - [room-rental](#room-rental)
   - [for-students](#for-students)
   - [commercial](#commercial)
   - [holiday-rental](#holiday-rental)
   - [land](#land)
   - [wanted](#wanted)
6. [ID & advId Reference](#6-id--advid-reference)
7. [Price Formatting Rules](#7-price-formatting-rules)
8. [detailsLabel Patterns](#8-detailslabel-patterns)
9. [Common keyDetails Mistakes](#9-common-keydetails-mistakes)
10. [Distinguishing Overlapping Categories](#10-distinguishing-overlapping-categories)
11. [Current Entry Count](#11-current-entry-count)

---

## 1. Category Overview

Property is the **flagship category** of any classifieds platform. It drives the highest traffic, the most repeat visits, and the most commercial value.

On LokalAds, Property covers the entire London residential and commercial market:
- **Residential for rent** — from studio flats to large family homes
- **Residential for sale** — first-time buyers to luxury detached
- **Room rental** — HMO, house shares, lodgings
- **Student accommodation** — near universities, short-contract leases
- **Commercial** — offices, retail units, industrial space
- **Holiday rental** — short-let properties posted by the owner (not a travel agent — that's `travel-stays/`)
- **Land** — development plots, agricultural land, building plots
- **Wanted** — buyers/tenants posting what they're looking for (reversed role)

### Design principle
Property listings have the **richest `keyDetails`** of any category because buyers/renters need specific facts before even visiting. Every subcategory has its own mandatory keys — never borrow keys from another subcategory.

---

## 2. Who Posts in Property?

| Poster type | Examples | Verified? | Seller key |
|---|---|---|---|
| Private landlord | Individual renting out one flat | ✗ Sometimes | `SELLERS.alice` |
| Letting agency | Professional lettings firm | ✅ Yes | `SELLERS.sarah` |
| Estate agent | Sales and lettings | ✅ Yes | `SELLERS.bob` |
| New-build developer | Selling direct off-plan or completed | ✅ Yes | `SELLERS.prime` |
| Private owner selling | Individual selling their home | ✗ Usually | `SELLERS.james` |
| Commercial agent | Office/retail/industrial leasing | ✅ Yes | `SELLERS.comm` |

**Key observation**: In `wanted` subcategory, the "seller" is actually the **buyer/tenant**. They are still represented via a `seller` field (the schema has no `buyer` concept yet — see [proposed `listingType`](./README.md#12-proposed-future-schema-fields)). Use `SELLERS.james` for a private individual seeking property.

---

## 3. File Structure

```
lib/mock/property/
│
├── sellers.ts          ← Property-exclusive sellers pool (alice, bob, sarah, prime, james, comm)
│                          These 6 sellers are NOT in shared-sellers.ts
│
├── to-rent.ts          → PROPERTY_RENT         (12 entries)
├── to-buy.ts           → PROPERTY_BUY          (12 entries)
├── room-rental.ts      → PROPERTY_ROOMS        (6 entries)
├── for-students.ts     → PROPERTY_STUDENTS     (4 entries)
├── commercial.ts       → PROPERTY_COMMERCIAL   (4 entries)
├── holiday-rental.ts   → PROPERTY_HOLIDAY      (4 entries)
├── land.ts             → PROPERTY_LAND         (3 entries)
├── wanted.ts           → PROPERTY_WANTED       (3 entries)
│
└── index.ts            ← Exports all above + ALL_PROPERTY_LISTINGS
```

### Import pattern for property files

Property subcategory files use their own sellers, not `shared-sellers.ts`:

```ts
// ✅ Correct — property files
import type { MockListing } from "../mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ❌ Wrong — don't import from shared-sellers in property/
import { SELLERS } from "../../shared-sellers";
```

---

## 4. Seller Pool (Property-Specific)

Defined in `lib/mock/property/sellers.ts`. The helpers (`img`, `daysAgo`, `hrsAgo`) are also exported from there.

| Key | Name | Role | When to use |
|---|---|---|---|
| `alice` | Alice Chen | Private Landlord | Private rentals; no agency, long-term tenancies |
| `bob` | Bob Harrison | Property Agent | Agency-managed sales and lettings |
| `sarah` | Sarah Patel | Letting Agent | Agency-managed lettings, student accommodation |
| `prime` | Prime Developments Ltd | New Build Developer | New build sales, off-plan, NHBC warranty listings |
| `james` | James O'Brien | Owner | Private sales, "wanted" posts (buyer seeking) |
| `comm` | Meridian Commercial | Commercial Agent | Office, retail, industrial, land |

### Profile highlights

```
alice  — Landlord since 2015 · 4 listings · verified · East London
bob    — Agent 10+ years · 22 listings · verified · South London
sarah  — Letting agent · 18 listings · verified · North London
prime  — Developer · 31 listings · verified · London-wide
james  — Private owner · 1 listing · not verified · West London
comm   — Commercial specialist · 47 listings · verified · City of London
```

---

## 5. Subcategories — Deep Dive

---

### to-rent

**Purpose**: Residential properties available for rent — flats, houses, studios, maisonettes.

**Typical users**: Young professionals, families, students (though students have their own subcat), couples relocating.

**Three-scenario rule**:

| Entry | Scenario | Seller |
|---|---|---|
| `prop-rent-01` | Studio / 1-bed in outer London — private landlord, affordable | `alice` |
| `prop-rent-02` | 2–3 bed in popular area — agency managed, mid-range | `bob` or `sarah` |
| `prop-rent-03` | Premium / large — high-end, furnished, central London | `sarah` or `bob` |

**Standard `keyDetails` keys:**

```ts
keyDetails: [
  { key: "Furnishing",       value: "Furnished / Part Furnished / Unfurnished" },
  { key: "Security Deposit", value: "£X,XXX (X weeks)"                         },
  { key: "Available From",   value: "Immediately / dd Mon yyyy"                },
  { key: "Listed By",        value: "Owner / Agent"                            },
  { key: "Min Tenancy",      value: "6 months / 12 months"                     },
  { key: "Pet Friendly",     value: "No / Negotiable / Yes"                    },
]
```

**Standard `goodToKnow` keys:**

```ts
goodToKnow: [
  { key: "Available",   value: "Immediately / date"           },
  { key: "Agent Fee",   value: "No / £XXX"                    },
  { key: "Smoking",     value: "Not Allowed / Outside Only"   },
  { key: "Parking",     value: "Available / Not available"    },
  { key: "Bills",       value: "Not included / Water included"},
]
```

**`priceLabel` format**: `"£X,XXX"` — always with `priceSuffix: "/ mo"`

**`detailsLabel` format**: `"{N} BEDS • {N} BATHS • {TYPE}"`
- Types: `FLAT` · `APARTMENT` · `HOUSE` · `STUDIO` · `MAISONETTE` · `TERRACED` · `SEMI-DETACHED` · `DETACHED`

**Validation checklist**:
- [ ] `priceSuffix: "/ mo"` present
- [ ] Deposit stated in `keyDetails`
- [ ] `Available From` in both `keyDetails` and `goodToKnow`
- [ ] `coordinates` matches the `locationLabel` borough/area

---

### to-buy

**Purpose**: Residential properties for sale — flats, houses, new builds.

**Typical users**: First-time buyers, upsizers/downsizers, investors, developers.

**Three-scenario rule**:

| Entry | Scenario | Seller |
|---|---|---|
| `prop-buy-01` | Private owner sale — family home, no chain | `james` |
| `prop-buy-02` | New build developer — Help to Buy, NHBC warranty | `prime` |
| `prop-buy-03` | Agency sale — leasehold flat, competitive area | `bob` |

**Standard `keyDetails` keys:**

```ts
keyDetails: [
  { key: "Tenure",       value: "Freehold / Leasehold (Xyr)" },
  { key: "Council Tax",  value: "Band X"                     },
  { key: "EPC Rating",   value: "A / B / C / D"              },
  { key: "Listed By",    value: "Owner / Agent / Developer"  },
  { key: "New Build",    value: "Yes / No"                   },
  // For leasehold add:
  { key: "Service Chg",  value: "£X,XXX / yr"               },
  { key: "Ground Rent",  value: "£XXX / yr"                  },
]
```

**Standard `goodToKnow` keys:**

```ts
goodToKnow: [
  { key: "Chain",      value: "No upper chain / Chain free" },
  { key: "Tenure",     value: "Freehold / Leasehold Xyr"   },
  { key: "EPC",        value: "Rating letter"               },
  { key: "Survey",     value: "RICS available / Not yet"    },
  { key: "Completion", value: "Flexible / Target date"      },
]
```

**`priceLabel` format**: `"£XXX,XXX"` — **no `priceSuffix`** (one-off purchase)

**`detailsLabel` format**: `"{N} BEDS • {N} BATHS • {TYPE}"`

**Key distinction from to-rent**: No `priceSuffix`, no deposit, EPC and tenure replace availability/bills.

---

### room-rental

**Purpose**: Individual rooms within shared houses, HMOs, lodgings with a live-in landlord.

**Typical users**: Young professionals, students (who haven't found a student-specific place), recent graduates, temporary workers.

**Three-scenario rule**:

| Entry | Scenario | Seller |
|---|---|---|
| `prop-room-01` | Room in house share — private individual renting out one room | `alice` |
| `prop-room-02` | Room in professionally managed HMO — agency or operator | `sarah` |
| `prop-room-03` | Lodgings with live-in landlord — bills included, all-in price | `alice` |

**Standard `keyDetails` keys:**

```ts
keyDetails: [
  { key: "Furnishing",         value: "Furnished / Unfurnished" },
  { key: "Bills Included",     value: "All / Gas + Electric / None" },
  { key: "Available From",     value: "Immediately / date"          },
  { key: "Current Occupants",  value: "2 professionals (mixed)"     },
  { key: "House Rules",        value: "No smoking, quiet after 11pm"},
  { key: "Deposit",            value: "£XXX (4 weeks)"             },
]
```

**`priceLabel` format**: `"£XXX"` with `priceSuffix: "/ mo"` or `"/ wk"`

**`detailsLabel` format**: `"ROOM • {BILLS} • {AREA}"`
- Examples: `"ROOM • BILLS INCLUDED • EAST LONDON"`, `"DOUBLE ROOM • PART BILLS • SHARED"`

**Important**: Room rental listings represent the **room**, not the whole house. Coordinates point to the exact address area, not a city-wide pin.

---

### for-students

**Purpose**: Student-specific accommodation — near universities, often short-contract, student bills packages.

**Typical users**: University students (undergrad and postgrad), international students, language school attendees.

**Three-scenario rule**:

| Entry | Scenario | Seller |
|---|---|---|
| `prop-stu-01` | Private student house — 3–5 beds, near university, group booking | `alice` or `sarah` |
| `prop-stu-02` | Purpose-built student accommodation (PBSA) — ensuite studio | `prime` or `sarah` |
| `prop-stu-03` | Room in family home — quiet study environment, International students welcomed | `alice` |

**Standard `keyDetails` keys:**

```ts
keyDetails: [
  { key: "Near University",  value: "UCL — 10 min walk / 5 min bus" },
  { key: "Bills Included",   value: "All inclusive / Utilities only" },
  { key: "Available From",   value: "Sep 2026 / Immediately"         },
  { key: "Contract",         value: "44 weeks (Sept–Jun)"            },
  { key: "Student-Only",     value: "Yes / No"                       },
  { key: "Bedrooms",         value: "5 (whole house let)"           },
]
```

**`priceLabel` format**: `"£XXX"` per person per month, `priceSuffix: "/ mo"` (per person) or `"/ wk"`

**`detailsLabel` format**: `"{N} BEDS • STUDENTS • {UNIVERSITY AREA}"`

**Critical UX note**: `title` should name the nearest university. e.g. `"5-Bed Student House — Near UCL, All Bills Included"`. This is the #1 search term for this subcat.

---

### commercial

**Purpose**: Offices, retail units, restaurants/cafes, industrial units, warehouses, serviced offices.

**Typical users**: Startups needing their first office, growing SMEs, retail brands expanding, entrepreneurs.

**Three-scenario rule**:

| Entry | Scenario | Seller |
|---|---|---|
| `prop-com-01` | Grade A office in city centre — commercial agent, £/sqft pricing | `comm` |
| `prop-com-02` | Ground floor retail unit — high street, shell condition | `comm` |
| `prop-com-03` | Serviced office / hot desk — flexible monthly, all-in price | `comm` or `bob` |

**Standard `keyDetails` keys:**

```ts
keyDetails: [
  { key: "Use Class",  value: "E (Office) / E (Retail) / B2 (Industrial)" },
  { key: "Floor Area", value: "X,XXX sq ft"                               },
  { key: "EPC Rating", value: "A / B / C"                                 },
  { key: "Lease Type", value: "Flexible 1–5 yr / FRI / Outside 1954 Act"  },
  { key: "Rates",      value: "£XX,XXX / yr or POA"                       },
]
```

**`priceLabel` format**: `"£X,XXX"` with `priceSuffix: "/ mo"` (rental). For freehold commercial: no suffix.

**`detailsLabel` format**: `"{SIZE} SQ FT • {TYPE} • {CONDITION}"`
- Examples: `"2,400 SQ FT • OFFICE • FITTED"`, `"850 SQ FT • RETAIL • SHELL"`

**UK planning use classes** (use correctly in `keyDetails`):
- `E` — commercial, business, service (offices, retail, restaurants, gyms)
- `B2` — general industrial
- `B8` — storage/distribution

---

### holiday-rental

**Purpose**: Short-let properties posted directly by the **property owner** — holiday cottages, city apartments, beach houses.

**Typical users**: Families planning holidays, couples on city breaks, groups seeking group accommodation.

**Relationship to `travel-stays/holiday-rentals`**:

> `property/holiday-rental` = **owner of the property** posting their own home/cottage
> `travel-stays/holiday-rentals` = **travel agency or platform listing** managing multiple properties

This is intentional — both exist. The framing and `seller` are different.

**Three-scenario rule**:

| Entry | Scenario | Seller |
|---|---|---|
| `prop-hol-01` | City apartment, short-let — owner listing their London flat | `james` |
| `prop-hol-02` | Rural cottage — private owner, countryside retreat | `alice` |
| `prop-hol-03` | Premium/unique — large house, pool, sleeps 8+ | `james` |

**Standard `keyDetails` keys:**

```ts
keyDetails: [
  { key: "Sleeps",           value: "X guests"                   },
  { key: "Bedrooms",         value: "X"                          },
  { key: "Available Dates",  value: "July–Sep 2026 / Year round" },
  { key: "Min Stay",         value: "2 nights / 1 week"          },
  { key: "Check-In",         value: "From 3pm"                   },
  { key: "Check-Out",        value: "By 11am"                    },
]
```

**`priceLabel` format**: `"£XXX"` with `priceSuffix: "/ night"` (most common)

**`detailsLabel` format**: `"SLEEPS X • {N} BEDS • {LOCATION TYPE}"`
- Examples: `"SLEEPS 6 • 3 BEDS • COUNTRYSIDE"`, `"SLEEPS 2 • 1 BED • CITY APARTMENT"`

---

### land

**Purpose**: Building plots, development land, agricultural land, garden plots.

**Typical users**: Developers, self-builders, investors, farmers.

**Three-scenario rule**:

| Entry | Scenario | Seller |
|---|---|---|
| `prop-land-01` | Residential building plot with planning permission | `comm` or `james` |
| `prop-land-02` | Agricultural land, no planning — investment/farming | `james` |
| `prop-land-03` | Development site, outline planning — commercial opportunity | `comm` |

**Standard `keyDetails` keys:**

```ts
keyDetails: [
  { key: "Area",               value: "X,XXX sq ft / X acres"              },
  { key: "Planning",           value: "Full permission / Outline / None"   },
  { key: "Approved Use",       value: "3 x residential units"              },
  { key: "Access",             value: "Road frontage / Right of way"       },
  { key: "Services",           value: "Electric connected / On boundary"   },
  { key: "Land Type",          value: "Greenfield / Brownfield / Garden"   },
]
```

**`priceLabel` format**: `"£XXX,XXX"` — **no `priceSuffix`** (land is purchased, not rented)

**`detailsLabel` format**: `"{AREA} • {PLANNING STATUS} • {LAND TYPE}"`
- Examples: `"0.5 ACRES • FULL PLANNING • RESIDENTIAL"`, `"2,400 SQ FT • NO PLANNING • GARDEN PLOT"`

**Price realism guide**:
- Building plot (London, with planning): £300K–£1.5M
- Agricultural land (per acre, outside London): £8K–£25K
- Development site (London, outline): £500K–£5M+

---

### wanted

**Purpose**: Buyers and tenants **advertising what they are looking for**. Reversed role — the poster is the seeker, not the seller.

**Typical users**: Cash buyers wanting a quick deal, families with specific school catchment needs, investors seeking off-market deals, tenants in urgent need.

**This is a unique subcategory** — the UX framing is entirely different:
- Title starts with `"WANTED:"` by convention
- `priceLabel` represents **budget**, not asking price
- `seller` represents the buyer/tenant (use `SELLERS.james` for individuals)
- `goodToKnow` focuses on buyer credentials (chain-free, mortgage in principle, cash buyer)

**Three-scenario rule**:

| Entry | Scenario | Seller |
|---|---|---|
| `prop-want-01` | Cash buyer — quick completion, flexible on condition | `james` |
| `prop-want-02` | Family buyer — school catchment essential, mortgage approved | `james` |
| `prop-want-03` | Investor seeking rental yield — off-market preferred | `james` or `bob` |

**Standard `keyDetails` keys:**

```ts
keyDetails: [
  { key: "Max Budget",    value: "£XXX,XXX"                        },
  { key: "Timeline",      value: "ASAP / X weeks exchange"         },
  { key: "Finance",       value: "Cash / Mortgage offer in place"  },
  { key: "Chain Free",    value: "Yes"                             },
  { key: "Property Type", value: "Flat / House / Any"             },
  { key: "Bedrooms",      value: "2+ / 4"                         },
]
```

**Standard `goodToKnow` keys:**

```ts
goodToKnow: [
  { key: "Buyer Status", value: "Cash / No chain"              },
  { key: "Mortgage",     value: "Offer in principal obtained"  },
  { key: "Solicitor",    value: "Instructed / Ready to instruct"},
  { key: "Decision",     value: "Within 48 hours"              },
  { key: "Contact",      value: "Respond via LokalAds"         },
]
```

**`priceLabel` format**: `"Up to £XXX,XXX"` — note the `"Up to"` prefix. No `priceSuffix`.

**`detailsLabel` format**: `"{N} BEDS • {PROPERTY TYPE}"` (no price range in detailsLabel)

---

## 6. ID & advId Reference

| Subcategory | ID prefix | advId range |
|---|---|---|
| to-rent | `prop-rent-` | 10001–10100 |
| to-buy | `prop-buy-` | 10101–10200 |
| room-rental | `prop-room-` | 10201–10300 |
| for-students | `prop-stu-` | 10301–10400 |
| commercial | `prop-com-` | 10401–10500 |
| holiday-rental | `prop-hol-` | 10501–10600 |
| land | `prop-land-` | 10601–10700 |
| wanted | `prop-want-` | 10701–10800 |

---

## 7. Price Formatting Rules

| Subcategory | Format | Suffix | Example |
|---|---|---|---|
| to-rent | `"£X,XXX"` | `"/ mo"` | `"£1,850"` + `"/ mo"` |
| to-buy | `"£XXX,XXX"` | none | `"£425,000"` |
| room-rental | `"£XXX"` | `"/ mo"` or `"/ wk"` | `"£850"` + `"/ mo"` |
| for-students | `"£XXX"` | `"/ mo"` (pp) or `"/ wk"` | `"£650"` + `"/ mo"` |
| commercial | `"£X,XXX"` | `"/ mo"` | `"£8,500"` + `"/ mo"` |
| holiday-rental | `"£XXX"` | `"/ night"` or `"/ wk"` | `"£185"` + `"/ night"` |
| land | `"£XXX,XXX"` | none | `"£350,000"` |
| wanted | `"Up to £XXX,XXX"` | none | `"Up to £500,000"` |

---

## 8. detailsLabel Patterns

```
to-rent:         "3 BEDS • 2 BATHS • FLAT"
to-buy:          "5 BEDS • 4 BATHS • DETACHED"
room-rental:     "DOUBLE ROOM • BILLS INCLUDED • EAST LONDON"
for-students:    "5 BEDS • STUDENTS • NEAR UCL"
commercial:      "2,400 SQ FT • OFFICE • FITTED"
holiday-rental:  "SLEEPS 6 • 3 BEDS • COUNTRYSIDE"
land:            "0.5 ACRES • FULL PLANNING • RESIDENTIAL"
wanted (rent):   "2 BEDS • FLAT OR HOUSE • LONDON"
wanted (buy):    "4 BEDS • DETACHED OR SEMI-DETACHED"
```

---

## 9. Common keyDetails Mistakes

These are real mistakes found in early mock data — use this as a checklist:

| ❌ Wrong | ✅ Correct | Why |
|---|---|---|
| `{ key: "MOT Expiry", value: "..." }` in a property listing | Use `{ key: "EPC Rating", ... }` | MOT is vehicles-only |
| `{ key: "Pet Friendly", value: "..." }` in commercial | Remove — not relevant | Commercial tenants don't bring pets |
| `{ key: "Available", value: "..." }` duplicated in both `keyDetails` AND `goodToKnow` with different values | Consistent value in both, or put in `keyDetails` only | Contradictory data confuses users |
| `{ key: "Price", value: "£2,400/mo" }` in `keyDetails` | Remove — price is already in `priceLabel` | Duplication is noise |
| `{ key: "Chain Free", value: "Yes" }` in a rental listing | Remove — chain only applies to sales | Wrong subcategory key |
| `{ key: "Deposit", value: "£1,200" }` in to-buy | Remove — deposits are for rentals | Wrong subcategory key |

---

## 10. Distinguishing Overlapping Categories

### property/holiday-rental vs travel-stays/holiday-rentals

| Dimension | `property/holiday-rental` | `travel-stays/holiday-rentals` |
|---|---|---|
| Who posts | Property owner | Travel agency / platform |
| Seller profile | `SELLERS.james` (private) | `SELLERS.travelPro` (agency) |
| Number of properties | One specific property | May represent many |
| Booking process | Direct with owner | Agency booking flow |
| UI label | "Listed by Owner" | "Listed by Agency" |
| Example | "Rent my Cornish cottage for summer" | "5 holiday cottages in Cornwall — from £150/night" |

### property/commercial vs services/business-services

| Dimension | `property/commercial` | `services/business-services` |
|---|---|---|
| What is being listed | A physical space (lease/sale) | A professional service offering |
| `priceLabel` | Rent per month or purchase price | Hourly/day/project rate |
| Example | "Office to let — 1,200 sq ft" | "Virtual CFO service — £150/hr" |

---

## 11. Current Entry Count

| Subcategory | File | Entries | Status |
|---|---|---|---|
| to-rent | `to-rent.ts` | 12 | ✅ Populated |
| to-buy | `to-buy.ts` | 12 | ✅ Populated |
| room-rental | `room-rental.ts` | 6 | ✅ Populated |
| for-students | `for-students.ts` | 4 | ✅ Populated |
| commercial | `commercial.ts` | 4 | ✅ Populated |
| holiday-rental | `holiday-rental.ts` | 4 | ✅ Populated |
| land | `land.ts` | 3 | ✅ Populated |
| wanted | `wanted.ts` | 3 | ✅ Populated |
| **Total** | | **48** | |

Combined export: `ALL_PROPERTY_LISTINGS` (48 entries)

Accessed via:
```ts
import { ALL_PROPERTY_LISTINGS, PROPERTY_RENT, PROPERTY_BUY } from "@/lib/mock";
// or per-subcategory:
import { PROPERTY_RENT } from "@/lib/mock/property/to-rent";
```
