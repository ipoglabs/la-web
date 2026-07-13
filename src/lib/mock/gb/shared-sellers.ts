/**
 * lib/mock/shared-sellers.ts
 *
 * Shared seller profiles imported by every mock-listing-*.ts file.
 * Add new sellers here — never duplicate inline in category files.
 *
 * Naming convention:  SELLERS.<key>
 *   property  — alice · bob · sarah · prime · james · comm
 *   vehicles  — dave · apex · moto · fleet
 *   jobs      — recruitPro · techCo · retailCo · ngoOrg
 *   services  — handyFix · wellnessHub · tutorAce · chefPro · bizConsult
 *   forSale   — quickSell · marketStall
 *   pets      — pawsLove · petShop
 *   business  — bizBroker · startupHub
 *   community — localCouncil · communityMgr
 *   sports    — sportStore · coachPro
 *   tech      — techSeller · techPrivate
 *   home      — homeStore · homePrivate
 *   fashion   — fashionBtq · fashionPrivate
 *   music     — musicStore · musicPrivate
 *   media     — mediaPrivate · collectorsDesk
 *   tickets   — ticketPrivate
 *   free      — giveawayPrivate
 *   general   — generic (fallback for any category)
 */

import type { Seller } from "@/types/listing";

const img = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;

export const SELLERS: Record<string, Seller> = {

  // ── Property ────────────────────────────────────────────────────────────────
  alice: {
    name: "Alice Chen", role: "Private Landlord", location: "East London",
    tagline: "Long-term landlord since 2015 — no agency fees, quick responses",
    memberSince: "2019", activeListings: 4,  lastActive: "2h ago",
    likes: "3.1K", followers: "1.2K", verified: true,
    cover: img(1), avatar: img(4),
  },
  bob: {
    name: "Bob Harrison", role: "Property Agent", location: "South London",
    tagline: "10+ years in London residential lettings and sales",
    memberSince: "2017", activeListings: 22, lastActive: "1h ago",
    likes: "7.4K", followers: "3.1K", verified: true,
    cover: img(2), avatar: img(5),
  },
  sarah: {
    name: "Sarah Patel", role: "Letting Agent", location: "North London",
    tagline: "Award-winning agency — transparent fees, no surprises",
    memberSince: "2020", activeListings: 18, lastActive: "30m ago",
    likes: "5.2K", followers: "2.7K", verified: true,
    cover: img(3), avatar: img(6),
  },
  prime: {
    name: "Prime Developments Ltd", role: "New Build Developer", location: "London",
    tagline: "Premium new-build homes across Greater London",
    memberSince: "2016", activeListings: 31, lastActive: "3h ago",
    likes: "12.1K", followers: "8.5K", verified: true,
    cover: img(7), avatar: img(8),
  },
  james: {
    name: "James O'Brien", role: "Owner", location: "West London",
    tagline: "Selling my family home — no chain, flexible on completion",
    memberSince: "2023", activeListings: 1,  lastActive: "5h ago",
    likes: "0.2K", followers: "0.1K", verified: false,
    cover: img(9), avatar: img(2),
  },
  comm: {
    name: "Meridian Commercial", role: "Commercial Agent", location: "City of London",
    tagline: "Specialists in London office, retail and industrial property",
    memberSince: "2015", activeListings: 47, lastActive: "1h ago",
    likes: "9.8K", followers: "4.3K", verified: true,
    cover: img(6), avatar: img(7),
  },

  // ── Vehicles ─────────────────────────────────────────────────────────────────
  dave: {
    name: "Dave Morris", role: "Private Seller", location: "South London",
    tagline: "Genuine private sale — one owner, always happy to answer questions",
    memberSince: "2022", activeListings: 2,  lastActive: "3h ago",
    likes: "0.2K", followers: "0.1K", verified: false,
    cover: img(1), avatar: img(3),
  },
  apex: {
    name: "Apex Car Sales", role: "Car Dealer", location: "North London",
    tagline: "London's trusted used car specialists since 2010",
    memberSince: "2018", activeListings: 47, lastActive: "1h ago",
    likes: "8.2K", followers: "3.4K", verified: true,
    cover: img(2), avatar: img(5),
  },
  moto: {
    name: "MotoTraders Ltd", role: "Motorcycle Dealer", location: "East London",
    tagline: "New and used motorcycles — all makes and models stocked",
    memberSince: "2019", activeListings: 31, lastActive: "2h ago",
    likes: "4.1K", followers: "1.8K", verified: true,
    cover: img(4), avatar: img(6),
  },
  fleet: {
    name: "City Fleet Solutions", role: "Fleet Dealer", location: "Croydon",
    tagline: "Ex-fleet and lease returns at transparent trade prices",
    memberSince: "2016", activeListings: 112, lastActive: "30m ago",
    likes: "11.3K", followers: "5.2K", verified: true,
    cover: img(8), avatar: img(2),
  },

  // ── Jobs ─────────────────────────────────────────────────────────────────────
  recruitPro: {
    name: "TalentBridge Recruitment", role: "Recruiter", location: "City of London",
    tagline: "Connecting top talent with London's leading employers since 2012",
    memberSince: "2018", activeListings: 64, lastActive: "1h ago",
    likes: "14.2K", followers: "7.8K", verified: true,
    cover: img(5), avatar: img(9),
  },
  techCo: {
    name: "Nexus Tech Ltd", role: "Employer", location: "Shoreditch, London",
    tagline: "Scaling fast — join our engineering team and build the future",
    memberSince: "2020", activeListings: 8,  lastActive: "2h ago",
    likes: "3.5K", followers: "2.1K", verified: true,
    cover: img(7), avatar: img(3),
  },
  retailCo: {
    name: "Urban Retail Group", role: "Employer", location: "Oxford Street, London",
    tagline: "One of the UK's largest retail groups — great staff benefits",
    memberSince: "2017", activeListings: 23, lastActive: "4h ago",
    likes: "6.1K", followers: "2.9K", verified: true,
    cover: img(1), avatar: img(6),
  },
  ngoOrg: {
    name: "GreenFutures Foundation", role: "NGO", location: "Bloomsbury, London",
    tagline: "Working for a sustainable world — join our passionate team",
    memberSince: "2019", activeListings: 5,  lastActive: "1d ago",
    likes: "2.2K", followers: "1.4K", verified: true,
    cover: img(4), avatar: img(8),
  },

  // ── Services ─────────────────────────────────────────────────────────────────
  handyFix: {
    name: "FixIt Fast Ltd", role: "Service Provider", location: "Greater London",
    tagline: "Trusted tradespeople — Gas Safe, NICEIC, and fully insured",
    memberSince: "2018", activeListings: 12, lastActive: "1h ago",
    likes: "6.3K", followers: "2.8K", verified: true,
    cover: img(2), avatar: img(7),
  },
  wellnessHub: {
    name: "Revive Wellness Studio", role: "Service Provider", location: "West London",
    tagline: "Holistic health and fitness — yoga, PT, and nutrition coaching",
    memberSince: "2021", activeListings: 7,  lastActive: "3h ago",
    likes: "4.7K", followers: "3.2K", verified: true,
    cover: img(3), avatar: img(1),
  },
  tutorAce: {
    name: "Dr. Priya Sharma", role: "Private Tutor", location: "North London",
    tagline: "Oxford-educated — A-Level Maths and Sciences specialist",
    memberSince: "2020", activeListings: 3,  lastActive: "5h ago",
    likes: "1.8K", followers: "0.9K", verified: true,
    cover: img(5), avatar: img(9),
  },
  chefPro: {
    name: "Marco Rossi", role: "Private Chef", location: "Central London",
    tagline: "Former Michelin kitchen — private dining, events, and meal prep",
    memberSince: "2022", activeListings: 4,  lastActive: "2h ago",
    likes: "2.4K", followers: "1.7K", verified: true,
    cover: img(6), avatar: img(4),
  },
  bizConsult: {
    name: "Apex Business Consulting", role: "Service Provider", location: "Canary Wharf",
    tagline: "Strategy, finance, and legal advisory for growing businesses",
    memberSince: "2017", activeListings: 9,  lastActive: "1h ago",
    likes: "5.9K", followers: "3.1K", verified: true,
    cover: img(8), avatar: img(2),
  },
  techRepair: {
    name: "TechFix Express", role: "Service Provider", location: "Central London",
    tagline: "Same-day phone, laptop, and smart device repairs — guaranteed",
    memberSince: "2019", activeListings: 6,  lastActive: "30m ago",
    likes: "7.1K", followers: "4.2K", verified: true,
    cover: img(9), avatar: img(5),
  },

  // ── For Sale ─────────────────────────────────────────────────────────────────
  quickSell: {
    name: "Lisa Harper", role: "Private Seller", location: "East London",
    tagline: "Decluttering — everything must go, reasonable offers welcome",
    memberSince: "2023", activeListings: 14, lastActive: "1h ago",
    likes: "0.3K", followers: "0.1K", verified: false,
    cover: img(1), avatar: img(4),
  },
  marketStall: {
    name: "Bargain Box UK", role: "Online Trader", location: "London",
    tagline: "Quality second-hand goods — every item tested before listing",
    memberSince: "2020", activeListings: 89, lastActive: "2h ago",
    likes: "9.4K", followers: "4.6K", verified: true,
    cover: img(3), avatar: img(7),
  },

  // ── Pets ─────────────────────────────────────────────────────────────────────
  pawsLove: {
    name: "Helen Brooks", role: "Breeder", location: "Surrey",
    tagline: "KC registered breeder — puppies raised with love in a family home",
    memberSince: "2019", activeListings: 3,  lastActive: "4h ago",
    likes: "1.4K", followers: "0.8K", verified: true,
    cover: img(2), avatar: img(6),
  },
  petShop: {
    name: "PetWorld London", role: "Pet Store", location: "Battersea, London",
    tagline: "Ethical pet store — we stock only the best for your furry friends",
    memberSince: "2017", activeListings: 41, lastActive: "1h ago",
    likes: "8.7K", followers: "5.1K", verified: true,
    cover: img(5), avatar: img(9),
  },
  pawsRescue: {
    name: "Second Chance Animal Rescue", role: "Rescue Centre", location: "South London",
    tagline: "Giving animals a second chance — adopt, don't shop",
    memberSince: "2016", activeListings: 17, lastActive: "3h ago",
    likes: "12.5K", followers: "9.3K", verified: true,
    cover: img(8), avatar: img(3),
  },

  // ── Business ─────────────────────────────────────────────────────────────────
  bizBroker: {
    name: "Meridian Business Brokers", role: "Business Broker", location: "City of London",
    tagline: "Confidential business sales and acquisitions since 2009",
    memberSince: "2015", activeListings: 28, lastActive: "2h ago",
    likes: "7.6K", followers: "3.8K", verified: true,
    cover: img(4), avatar: img(8),
  },
  startupHub: {
    name: "London Startup Hub", role: "Incubator", location: "Shoreditch, London",
    tagline: "Supporting early-stage founders — workspace, mentoring, and funding",
    memberSince: "2018", activeListings: 11, lastActive: "1d ago",
    likes: "5.3K", followers: "4.1K", verified: true,
    cover: img(7), avatar: img(2),
  },

  // ── Community ─────────────────────────────────────────────────────────────────
  localCouncil: {
    name: "Southwark Council", role: "Local Authority", location: "Southwark, London",
    tagline: "Official notices and community updates from Southwark Council",
    memberSince: "2016", activeListings: 35, lastActive: "1h ago",
    likes: "15.2K", followers: "12.1K", verified: true,
    cover: img(1), avatar: img(6),
  },
  communityMgr: {
    name: "Emma Clarke", role: "Community Organiser", location: "Brixton, London",
    tagline: "Bringing our neighbourhood together — events, volunteering, and more",
    memberSince: "2021", activeListings: 8,  lastActive: "6h ago",
    likes: "0.7K", followers: "0.4K", verified: false,
    cover: img(3), avatar: img(9),
  },

  // ── Education ─────────────────────────────────────────────────────────────────
  eduPro: {
    name: "Bright Minds Academy", role: "Education Provider", location: "Central London",
    tagline: "UK-accredited courses and certifications — online and in-person",
    memberSince: "2017", activeListings: 22, lastActive: "2h ago",
    likes: "6.8K", followers: "4.2K", verified: true,
    cover: img(2), avatar: img(7),
  },

  // ── Health & Beauty ──────────────────────────────────────────────────────────
  spaLux: {
    name: "Serenity Spa London", role: "Spa & Wellness", location: "Mayfair, London",
    tagline: "Award-winning luxury spa — treatments for body, mind and soul",
    memberSince: "2019", activeListings: 9,  lastActive: "3h ago",
    likes: "5.4K", followers: "3.7K", verified: true,
    cover: img(5), avatar: img(1),
  },
  gymPro: {
    name: "IronCore Fitness", role: "Gym", location: "Canary Wharf, London",
    tagline: "State-of-the-art gym — PT sessions, classes, and nutrition plans",
    memberSince: "2020", activeListings: 6,  lastActive: "1h ago",
    likes: "4.1K", followers: "2.9K", verified: true,
    cover: img(4), avatar: img(8),
  },

  // ── Food & Dining ────────────────────────────────────────────────────────────
  foodPro: {
    name: "Saffron Home Kitchen", role: "Home Cook", location: "Wembley, London",
    tagline: "Authentic South Asian home-cooked meals — fresh daily",
    memberSince: "2022", activeListings: 5,  lastActive: "4h ago",
    likes: "2.1K", followers: "1.3K", verified: true,
    cover: img(9), avatar: img(3),
  },
  cateringCo: {
    name: "Grand Feast Catering", role: "Caterer", location: "Ealing, London",
    tagline: "Full-service catering for weddings, corporate events and parties",
    memberSince: "2018", activeListings: 7,  lastActive: "2h ago",
    likes: "4.9K", followers: "2.6K", verified: true,
    cover: img(6), avatar: img(4),
  },

  // ── Travel & Stays ───────────────────────────────────────────────────────────
  travelPro: {
    name: "Voyage Travel Co.", role: "Travel Agency", location: "Covent Garden, London",
    tagline: "Bespoke travel experiences — from city breaks to world tours",
    memberSince: "2016", activeListings: 18, lastActive: "1h ago",
    likes: "8.3K", followers: "5.7K", verified: true,
    cover: img(7), avatar: img(2),
  },
  hotelMgr: {
    name: "The Kensington Rooms", role: "Hotel", location: "Kensington, London",
    tagline: "Boutique hotel in the heart of Kensington — comfort and style",
    memberSince: "2020", activeListings: 4,  lastActive: "3h ago",
    likes: "3.2K", followers: "2.1K", verified: true,
    cover: img(5), avatar: img(9),
  },

  // ── Baby & Kids ──────────────────────────────────────────────────────────────
  babyShop: {
    name: "Little Stars Baby Boutique", role: "Baby & Kids Store", location: "Chiswick, London",
    tagline: "Premium baby and kids products — safe, tested, and loved",
    memberSince: "2019", activeListings: 34, lastActive: "2h ago",
    likes: "5.6K", followers: "4.1K", verified: true,
    cover: img(1), avatar: img(5),
  },
  nurseAna: {
    name: "Ana Costa", role: "Childcare Provider", location: "Richmond, London",
    tagline: "Qualified nursery nurse — CACHE Level 3, DBS checked, first-aid certified",
    memberSince: "2021", activeListings: 2,  lastActive: "6h ago",
    likes: "0.4K", followers: "0.2K", verified: true,
    cover: img(3), avatar: img(7),
  },

  // ── Sports & Outdoors ────────────────────────────────────────────────────────
  sportStore: {
    name: "Peak Performance Sports", role: "Sports Retailer", location: "London",
    tagline: "Gear for every sport — from novice to elite athlete",
    memberSince: "2018", activeListings: 56, lastActive: "1h ago",
    likes: "10.2K", followers: "6.4K", verified: true,
    cover: img(2), avatar: img(6),
  },
  coachPro: {
    name: "Coach Dan Freeman", role: "Fitness Coach", location: "South London",
    tagline: "UEFA B licensed coach — personal training, football, and performance coaching",
    memberSince: "2020", activeListings: 4,  lastActive: "4h ago",
    likes: "1.9K", followers: "1.2K", verified: true,
    cover: img(8), avatar: img(4),
  },

  // ── Electronics & Tech ───────────────────────────────────────────────────────
  techSeller: {
    name: "GadgetHub UK", role: "Electronics Trader", location: "London",
    tagline: "Grade A refurbished tech — 12-month warranty, tested before dispatch",
    memberSince: "2017", activeListings: 73, lastActive: "30m ago",
    likes: "13.4K", followers: "7.2K", verified: true,
    cover: img(5), avatar: img(1),
  },
  techPrivate: {
    name: "Ryan Kim", role: "Private Seller", location: "London",
    tagline: "Tech enthusiast upgrading — everything sold with original accessories",
    memberSince: "2023", activeListings: 3,  lastActive: "5h ago",
    likes: "0.1K", followers: "0.1K", verified: false,
    cover: img(9), avatar: img(3),
  },

  // ── Home & Furniture ─────────────────────────────────────────────────────────
  homeStore: {
    name: "Nest & Nook Interiors", role: "Furniture Store", location: "London",
    tagline: "Quality furniture — new, ex-display, and pre-loved pieces",
    memberSince: "2019", activeListings: 45, lastActive: "1h ago",
    likes: "7.8K", followers: "4.3K", verified: true,
    cover: img(4), avatar: img(8),
  },
  homePrivate: {
    name: "Susan Wright", role: "Private Seller", location: "South London",
    tagline: "Moving house — selling quality furniture at fair prices",
    memberSince: "2024", activeListings: 9,  lastActive: "3h ago",
    likes: "0.2K", followers: "0.1K", verified: false,
    cover: img(7), avatar: img(2),
  },

  // ── Fashion & Clothing ───────────────────────────────────────────────────────
  fashionBtq: {
    name: "Luxe Thread Boutique", role: "Fashion Retailer", location: "Notting Hill, London",
    tagline: "Curated fashion — designer, vintage, and contemporary labels",
    memberSince: "2018", activeListings: 62, lastActive: "2h ago",
    likes: "11.7K", followers: "8.9K", verified: true,
    cover: img(6), avatar: img(1),
  },
  fashionPrivate: {
    name: "Chloe Nguyen", role: "Private Seller", location: "London",
    tagline: "Wardrobe edit — quality pieces priced to sell quickly",
    memberSince: "2023", activeListings: 18, lastActive: "4h ago",
    likes: "0.5K", followers: "0.3K", verified: false,
    cover: img(9), avatar: img(5),
  },

  // ── Musical Instruments ───────────────────────────────────────────────────────
  musicStore: {
    name: "Sounds Right London", role: "Music Retailer", location: "Islington, London",
    tagline: "New and second-hand instruments — repairs, lessons, and trade-ins welcome",
    memberSince: "2017", activeListings: 58, lastActive: "1h ago",
    likes: "9.2K", followers: "5.8K", verified: true,
    cover: img(4), avatar: img(8),
  },
  musicPrivate: {
    name: "Jamie Cole", role: "Musician", location: "East London",
    tagline: "Gigging musician upgrading gear — everything tested and in great condition",
    memberSince: "2022", activeListings: 5, lastActive: "4h ago",
    likes: "0.3K", followers: "0.2K", verified: false,
    cover: img(7), avatar: img(3),
  },

  // ── Books, Media & Collectibles ───────────────────────────────────────────────
  mediaPrivate: {
    name: "Nick Hartley", role: "Private Seller", location: "West London",
    tagline: "Lifelong reader and record collector — making space for new finds",
    memberSince: "2021", activeListings: 12, lastActive: "5h ago",
    likes: "0.2K", followers: "0.1K", verified: false,
    cover: img(2), avatar: img(6),
  },
  collectorsDesk: {
    name: "The Collectors Desk", role: "Memorabilia Dealer", location: "Brixton, London",
    tagline: "Trusted dealer in vintage media, sports memorabilia, and rare collectibles",
    memberSince: "2016", activeListings: 94, lastActive: "2h ago",
    likes: "11.8K", followers: "6.7K", verified: true,
    cover: img(5), avatar: img(1),
  },

  // ── Tickets & Vouchers ────────────────────────────────────────────────────────
  ticketPrivate: {
    name: "Chris Weston", role: "Private Seller", location: "London",
    tagline: "Genuine private ticket seller — face value or less, no bots",
    memberSince: "2023", activeListings: 2, lastActive: "1h ago",
    likes: "0.1K", followers: "0.1K", verified: false,
    cover: img(9), avatar: img(4),
  },

  // ── Free & Giveaway ───────────────────────────────────────────────────────────
  giveawayPrivate: {
    name: "Freecycle Poster", role: "Private Giver", location: "London",
    tagline: "Decluttering responsibly — free to a good home, collection only",
    memberSince: "2024", activeListings: 3, lastActive: "3h ago",
    likes: "0", followers: "0", verified: false,
    cover: img(1), avatar: img(3),
  },

  // ── Special Offers ───────────────────────────────────────────────────────────
  dealsPro: {
    name: "LokalAds Deals", role: "Deals Curator", location: "London",
    tagline: "Exclusive deals curated for LokalAds members — always verified",
    memberSince: "2016", activeListings: 150, lastActive: "1h ago",
    likes: "28.4K", followers: "15.1K", verified: true,
    cover: img(3), avatar: img(7),
  },

  // ── Generic fallback ─────────────────────────────────────────────────────────
  generic: {
    name: "LokalAds Seller", role: "Seller", location: "London",
    tagline: "LokalAds verified seller",
    memberSince: "2024", activeListings: 1, lastActive: "1h ago",
    likes: "0", followers: "0", verified: false,
    cover: img(1), avatar: img(2),
  },
};
