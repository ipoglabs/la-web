// scripts/backfill-services-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-services-seed-details.ts [--dry-run]
//
// One-off per reworked Services sub: the Services seed posts were copied from
// the mock catalog (lib/mock) with only a title and a price, so the reworked
// Services search filters had nothing to match. This fills, from each post's
// mock listing (same id as the post's adsId), only what's empty, so it is safe
// to re-run as more subs are added.
// - Home Services (2026-10-22): Service Type, Listed By, Price Per, Frequency,
//   Same-day / Emergency, Insured, Gas Safe / NICEIC No. (GB), Years of Experience
// - Business Services (2026-10-22): Service Type, Listed By, Price Per,
//   Service Mode, Years of Experience
// - Health & Fitness (2026-10-22): Service Type, Listed By, Service Mode,
//   Price Per, Free Trial
// - Tutoring (2026-10-22): Subjects, Level, Curriculum, Service Mode, Price Per,
//   Tutor Type, DBS Checked (GB), Free Trial Lesson, Years of Experience
// - Education & Learning (2026-10-22): Category, Course Name, Format,
//   Service Mode, Age Group, Duration, Start Date, Price Per, Certificate
// - Travel & Tourism (2026-10-22): Service Type, Destination, Destination Type,
//   Nights / Days, Inclusions, Price Per, ATOL Protected (GB)
// - Technology & Gadgets (2026-10-22): Service Type, Listed By, Brands / Devices,
//   Service Mode, Warranty / Turnaround (repairs), Rate Type
// - Other Services (2026-10-22): Service Type, Listed By, Service Mode, Price Per
// - Wanted (2026-10-22): Looking For, Service Mode, Budget Per, Needed By, and
//   Budget (budgetAmount, now what the price filter reads) from the seed's price
// - Food & Dining (2026-10-22): Service Type, Cuisine Type, Dietary Options,
//   Occasions, Delivery / Pickup, Price Per, Minimum Order, Food Hygiene Rating (GB).
//   Also moves the one real pre-DB-form post ("Home cook", subcategory
//   "Food & Dining", no country) to food_dining in IN so Services search shows it.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

interface SeedDetails {
  serviceType?: string;
  experience?: string;
  subject?: string;
  duration?: string;
  startDate?: string;
  destination?: string;
  dietaryOptions?: string[];
  budgetAmount?: number;
  attributes: Record<string, unknown>;
}

// Values are the Services forms' (posting/form-schema/defaults/services.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── Home Services
  // "Certified Electrician — Same-Day Callouts, Bengaluru", ₹299 / visit
  "svc-in-home-01": { serviceType: "electrical", attributes: { listedBy: "company", priceUnit: "visit", frequency: ["once"], emergency: "yes" } },
  // "Deep Home Cleaning — 2BHK/3BHK, Trained Staff", ₹1,499 / job
  "svc-in-home-02": { serviceType: "cleaning", attributes: { listedBy: "company", priceUnit: "job", frequency: ["once"] } },
  // "Gas Safe Plumber & Heating Engineer — 24/7 London", from £80 / job, Gas Safe #123456, £2M public liability
  "svc-home-01": {
    serviceType: "plumbing",
    attributes: { listedBy: "company", priceUnit: "job", frequency: ["once"], emergency: "yes", insured: "yes", registrationNo: "Gas Safe 123456" },
  },
  // "NICEIC Electrician — Rewires, Consumer Units, Certificates", £60 / hr, NICEIC #7654321, £2M public liability
  "svc-home-02": {
    serviceType: "electrical",
    attributes: { listedBy: "company", priceUnit: "hour", frequency: ["once"], insured: "yes", registrationNo: "NICEIC 7654321" },
  },
  // "Self-Employed Painter & Decorator", £180 / day, 18 years, £1M public liability
  "svc-home-03": { serviceType: "painting", experience: "10+", attributes: { listedBy: "individual", priceUnit: "day", frequency: ["once"], insured: "yes" } },
  // "Licensed Electrician — Same-Day Callouts, Singapore", S$50 / visit
  "svc-sg-home-01": { serviceType: "electrical", attributes: { listedBy: "company", priceUnit: "visit", frequency: ["once"], emergency: "yes" } },
  // "Deep Home Cleaning — HDB/Condo, Trained Staff", S$120 / job
  "svc-sg-home-02": { serviceType: "cleaning", attributes: { listedBy: "company", priceUnit: "job", frequency: ["once"] } },

  // ── Business Services
  // "GST Filing & Accounting — Monthly Retainer for SMEs", ₹5,000 / mo, pan-India remote
  "svc-in-biz-01": { serviceType: "accounting", attributes: { listedBy: "company", priceUnit: "month", serviceMode: ["online"] } },
  // "Private Limited Company Registration — End-to-End", ₹12,000 / job
  "svc-in-biz-02": { serviceType: "company_registration", attributes: { listedBy: "company", priceUnit: "fixed" } },
  // "Small Business Accountancy & Tax Returns — Cloud-Based", £150 / mo, UK-wide remote
  "svc-biz-01": { serviceType: "accounting", attributes: { listedBy: "company", priceUnit: "month", serviceMode: ["online"] } },
  // "SEO & Google Ads Management", £500 / mo, UK-wide remote
  "svc-biz-02": { serviceType: "marketing", attributes: { listedBy: "agency", priceUnit: "month", serviceMode: ["online"] } },
  // "Virtual PA & Executive Assistant", £25 / hr, remote, 10 years PA/EA
  "svc-biz-03": { serviceType: "admin", experience: "10+", attributes: { listedBy: "company", priceUnit: "hour", serviceMode: ["online"] } },
  // "GST Filing & Accounting — Monthly Retainer for SMEs", S$300 / mo
  "svc-sg-biz-01": { serviceType: "accounting", attributes: { listedBy: "company", priceUnit: "month" } },
  // "Private Limited Company Incorporation — ACRA End-to-End", S$600 / job
  "svc-sg-biz-02": { serviceType: "company_registration", attributes: { listedBy: "company", priceUnit: "fixed" } },

  // ── Health & Fitness
  // "Certified Personal Trainer — Home & Gym Sessions", ₹800 / session
  "svc-in-health-01": { serviceType: "pt", attributes: { listedBy: "individual", serviceMode: ["homevisit", "inperson"], priceUnit: "session" } },
  // "Home Yoga Instructor — Beginners to Advanced", ₹500 / session
  "svc-in-health-02": { serviceType: "yoga", attributes: { listedBy: "individual", serviceMode: ["homevisit"], priceUnit: "session" } },
  // "Personal Trainer — 1-to-1 & Online Coaching", £50 / session, free 30-min consultation
  "svc-hf-01": { serviceType: "pt", attributes: { listedBy: "individual", serviceMode: ["inperson", "online"], priceUnit: "session", freeTrial: "yes" } },
  // "Morning Yoga & Pilates Studio", £15 / session, first class free
  "svc-hf-02": { serviceType: "yoga", attributes: { listedBy: "studio", serviceMode: ["inperson"], priceUnit: "session", freeTrial: "yes" } },
  // "Online Nutrition Coaching & Meal Planning", £85 / mo, free 20-min consult
  "svc-hf-03": { serviceType: "nutrition", attributes: { listedBy: "individual", serviceMode: ["online"], priceUnit: "month", freeTrial: "yes" } },
  // "Certified Personal Trainer — Home & Gym Sessions", S$70 / session
  "svc-sg-health-01": { serviceType: "pt", attributes: { listedBy: "individual", serviceMode: ["homevisit", "inperson"], priceUnit: "session" } },
  // "Home Yoga Instructor — Beginners to Advanced", S$60 / session
  "svc-sg-health-02": { serviceType: "yoga", attributes: { listedBy: "individual", serviceMode: ["homevisit"], priceUnit: "session" } },

  // ── Tutoring
  // "Physics & Chemistry Tutor — CBSE/ICSE Class 9-12", ₹600 / hr, 10 years, home visit or online
  "svc-in-tutor-01": {
    experience: "10+",
    attributes: { subjects: ["science"], levels: ["secondary", "higher-secondary"], curriculum: ["cbse", "icse"], serviceMode: ["homevisit", "online"], priceUnit: "hour" },
  },
  // "Spoken English & Grammar Tutor — All Ages", ₹450 / hr, home visit or online
  "svc-in-tutor-02": { attributes: { subjects: ["english"], levels: ["primary", "secondary", "adult"], serviceMode: ["homevisit", "online"], priceUnit: "hour" } },
  // "GCSE & A-Level Maths Tutor — 10 Yrs Exp", £35 / hr, North London / Online, free taster, Enhanced DBS
  "svc-tutor-01": {
    experience: "10+",
    attributes: { subjects: ["maths"], levels: ["gcse", "a_level"], serviceMode: ["homevisit", "online"], priceUnit: "hour", freeTrial: "yes", dbsChecked: "yes" },
  },
  // "French & Spanish Language Tutor — All Levels, Exam Prep", £30 / hr, online, beginner to A-Level
  "svc-tutor-02": { attributes: { subjects: ["languages"], levels: ["gcse", "a_level", "adult"], serviceMode: ["online"], priceUnit: "hour" } },
  // "11+ & Common Entrance Exam Prep", £45 / hr, SW London / Online, Enhanced DBS
  "svc-tutor-03": {
    attributes: { subjects: ["maths", "english", "other"], otherSubject: "11+ / Common Entrance", levels: ["primary"], serviceMode: ["homevisit", "online"], priceUnit: "hour", dbsChecked: "yes" },
  },
  // "Maths & Science Tutor — PSLE & O-Level, MOE-Trained", S$60 / hr, 8 years, home visit or online
  "svc-sg-tutor-01": {
    experience: "5-10",
    attributes: { subjects: ["maths", "science"], levels: ["primary", "o_level"], curriculum: ["moe"], tutorType: "teacher", serviceMode: ["homevisit", "online"], priceUnit: "hour" },
  },
  // "English & Composition Tutor — Primary & Secondary", S$50 / hr, home visit or online
  "svc-sg-tutor-02": { attributes: { subjects: ["english"], levels: ["primary", "o_level"], serviceMode: ["homevisit", "online"], priceUnit: "hour" } },
  // ── Education & Learning
  // "JEE Main & Advanced Coaching — Structured Yearly Batch", ₹45,000 / yr, 12 months
  "svc-in-edu-01": {
    subject: "JEE Main & Advanced",
    duration: "12 months",
    attributes: { courseCategory: "exam", courseFormat: "course", serviceMode: ["inperson"], ageGroup: ["teens"], priceUnit: "course" },
  },
  // "NEET Biology & Chemistry Coaching — Weekend Batch", ₹50,000 / yr, weekends only
  "svc-in-edu-02": {
    subject: "NEET Biology & Chemistry",
    attributes: { courseCategory: "exam", courseFormat: "course", serviceMode: ["inperson"], ageGroup: ["teens"], priceUnit: "course" },
  },
  // "AWS Cloud Practitioner & Solutions Architect — Bootcamp", £199 / course, 12 weeks, live online
  "svc-edu-01": {
    subject: "AWS Cloud Practitioner & Solutions Architect",
    duration: "12 weeks",
    attributes: { courseCategory: "tech", courseFormat: "course", serviceMode: ["online"], ageGroup: ["adults"], priceUnit: "course" },
  },
  // "PRINCE2 Foundation Training — 2-Day Intensive, Central London", £595 / course, exam voucher included
  "svc-edu-02": {
    subject: "PRINCE2 Foundation",
    duration: "2 days",
    attributes: { courseCategory: "business", courseFormat: "course", serviceMode: ["inperson"], ageGroup: ["adults"], priceUnit: "course", certificate: "yes" },
  },
  // "IELTS & English Language Coaching — Guaranteed Band Improvement", £40 / hr, online or Central London
  "svc-edu-03": {
    subject: "IELTS & English",
    attributes: { courseCategory: "languages", courseFormat: "onetoone", serviceMode: ["online", "inperson"], ageGroup: ["adults"], priceUnit: "class" },
  },
  // "PSLE Preparation Programme — Small-Group Classes", S$400 / mo, ongoing
  "svc-sg-edu-01": {
    subject: "PSLE Preparation",
    startDate: "Ongoing",
    attributes: { courseCategory: "exam", courseFormat: "class", serviceMode: ["inperson"], ageGroup: ["kids"], priceUnit: "month" },
  },
  // "O-Level Science Coaching — Weekend Batch", S$450 / mo, weekends only
  "svc-sg-edu-02": {
    subject: "O-Level Science",
    attributes: { courseCategory: "exam", courseFormat: "class", serviceMode: ["inperson"], ageGroup: ["teens"], priceUnit: "month" },
  },
  // ── Travel & Tourism
  // "4N/5D Goa Holiday Package — Hotel + Sightseeing Included", ₹15,000 / package, breakfast + airport transfers
  "svc-in-travel-01": {
    serviceType: "tour_package",
    destination: "Goa",
    attributes: { destinationType: "domestic", nights: 4, days: 5, inclusions: ["hotel", "meals", "transfers", "sightseeing"], priceUnit: "trip" },
  },
  // "3N/4D Kerala Backwaters Tour — Houseboat Stay Included", ₹22,000 / package
  "svc-in-travel-02": {
    serviceType: "tour_package",
    destination: "Kerala",
    attributes: { destinationType: "domestic", nights: 3, days: 4, inclusions: ["hotel", "transfers"], priceUnit: "trip" },
  },
  // "Bespoke Holiday Planning — Europe & Far East Specialists", from £100 / person, ATOL protected
  "svc-travel-01": { serviceType: "planning", destination: "Europe & Far East", attributes: { destinationType: "international", priceUnit: "person", atolProtected: "yes" } },
  // "Executive Airport Transfers — Heathrow, Gatwick, Stansted & City", £55 / trip
  "svc-travel-02": { serviceType: "transfer", destination: "London airports", attributes: { destinationType: "domestic", priceUnit: "trip" } },
  // "Guided Walking Tours of London — Hidden History, Street Art & More", £18 / person, Blue Badge guide
  "svc-travel-03": { serviceType: "tour_guide", destination: "London", attributes: { destinationType: "domestic", priceUnit: "person" } },
  // "4D3N Bali Getaway — Hotel + Sightseeing Included", S$680 / package, breakfast + airport transfers
  "svc-sg-travel-01": {
    serviceType: "tour_package",
    destination: "Bali",
    attributes: { destinationType: "international", nights: 3, days: 4, inclusions: ["hotel", "meals", "transfers", "sightseeing"], priceUnit: "trip" },
  },
  // "3D2N Bangkok Shopping & Food Tour", S$520 / package, hotel + transfers + guided tour
  "svc-sg-travel-02": {
    serviceType: "tour_package",
    destination: "Bangkok",
    attributes: { destinationType: "international", nights: 2, days: 3, inclusions: ["hotel", "transfers", "guide"], priceUnit: "trip" },
  },
  // ── Food & Dining
  // "Daily Home-Cooked Tiffin — North Indian Veg, Monthly Plan", ₹3,500 / mo, delivered daily
  "svc-in-food-01": {
    serviceType: "meal_prep",
    dietaryOptions: ["veg"],
    attributes: { cuisines: ["North Indian"], occasions: ["daily"], deliveryOption: "delivery", priceUnit: "month" },
  },
  // "Home Catering for Small Events — Veg & Non-Veg Menus", ₹250 / plate, min 20 plates
  "svc-in-food-02": {
    serviceType: "catering",
    dietaryOptions: ["veg", "nonveg"],
    attributes: { occasions: ["birthday", "party"], priceUnit: "plate", minOrder: 20 },
  },
  // "Private Chef for Dinner Parties — Fine Dining at Home", £300 / event, 4 to 30 guests
  "svc-food-01": { serviceType: "chef", attributes: { occasions: ["party", "birthday"], priceUnit: "order", minOrder: 4 } },
  // "Authentic South Asian Home-Cooked Meals — Weekly Tiffin, Wembley", £8 / meal, halal, free delivery, hygiene 5/5
  "svc-food-02": {
    serviceType: "home_cooked",
    dietaryOptions: ["halal", "veg"],
    attributes: { cuisines: ["South Asian"], occasions: ["daily"], deliveryOption: "delivery", priceUnit: "meal", hygieneRating: "5" },
  },
  // "Full-Service Event Catering — Weddings, Corporates & Private Parties", £45 / head, 30 guests minimum
  "svc-food-03": { serviceType: "catering", attributes: { occasions: ["wedding", "corporate", "party"], priceUnit: "plate", minOrder: 30 } },
  // "Daily Home-Cooked Peranakan Meals — Monthly Plan", S$280 / mo, delivered daily
  "svc-sg-food-01": { serviceType: "meal_prep", attributes: { cuisines: ["Peranakan"], occasions: ["daily"], deliveryOption: "delivery", priceUnit: "month" } },
  // "Home Catering for Small Events — Peranakan & Local Menus", S$18 / pax, min 20 pax
  "svc-sg-food-02": {
    serviceType: "catering",
    attributes: { cuisines: ["Peranakan", "Singaporean"], occasions: ["birthday", "party"], priceUnit: "plate", minOrder: 20 },
  },
  // ── Technology & Gadgets
  // "Laptop & Mobile Repair — Doorstep Service, Noida", ₹399 / visit, same day, 30-day warranty
  "svc-in-tech-01": {
    serviceType: "laptop_repair",
    attributes: { listedBy: "shop", serviceMode: ["homevisit"], warranty: "30d", turnaround: "same_day", priceUnit: "repair" },
  },
  // "Smart Home Setup — WiFi Cameras, Smart Lights, Alexa", ₹1,200 / job
  "svc-in-tech-02": { serviceType: "smart_home", attributes: { listedBy: "shop", brands: ["Alexa", "Google Home"], serviceMode: ["homevisit"], priceUnit: "project" } },
  // "Phone, Tablet & Laptop Repair — Same-Day London, No Fix No Fee", £35 / repair, walk-in, 90-day parts warranty
  "svc-tech-01": {
    serviceType: "phone_repair",
    attributes: { listedBy: "shop", brands: ["Apple", "Samsung", "Huawei", "Dell", "HP"], serviceMode: ["inperson"], warranty: "90d", turnaround: "same_day", priceUnit: "repair" },
  },
  // "Remote IT Support & Setup — Home & Small Business, Same Day", £75 / hr, remote + on-site London
  "svc-tech-02": { serviceType: "it_support", attributes: { listedBy: "individual", serviceMode: ["online", "homevisit"], priceUnit: "hour" } },
  // "Smart Home & Home Automation — Alexa, Hive, Ring & CCTV Install", £150 / job
  "svc-tech-03": {
    serviceType: "smart_home",
    attributes: { listedBy: "individual", brands: ["Alexa", "Google Home", "Hive", "Ring"], serviceMode: ["homevisit"], priceUnit: "project" },
  },
  // "Laptop & Mobile Repair — Doorstep Service, Singapore", S$60 / visit, 30-day warranty
  "svc-sg-tech-01": { serviceType: "laptop_repair", attributes: { listedBy: "shop", serviceMode: ["homevisit"], warranty: "30d", priceUnit: "repair" } },
  // "Smart Home Setup — WiFi Cameras, Smart Lights, Google Home", S$180 / job
  "svc-sg-tech-02": { serviceType: "smart_home", attributes: { listedBy: "shop", brands: ["Google Home", "Alexa"], serviceMode: ["homevisit"], priceUnit: "project" } },
  // ── Other Services (painting and cleaning have no type of their own here, so Other)
  // "Home Painting Service — Interior & Exterior, Delhi NCR", ₹15 / sq.ft
  "svc-in-other-01": { serviceType: "other", attributes: { listedBy: "company", serviceMode: ["homevisit"], priceUnit: "from" } },
  // "Carpentry & Furniture Repair — Home Visits", ₹500 / hr
  "svc-in-other-02": { serviceType: "repair", attributes: { listedBy: "individual", serviceMode: ["homevisit"], priceUnit: "hour" } },
  // "Professional Home Cleaning — Weekly, Fortnightly, or One-Off", £18 / hr
  "svc-other-01": { serviceType: "other", attributes: { listedBy: "company", serviceMode: ["homevisit"], priceUnit: "hour" } },
  // "Collection & Delivery Ironing Service — Same-Week, West London", £2 / item
  "svc-other-02": { serviceType: "laundry", attributes: { listedBy: "company", serviceMode: ["homevisit"], priceUnit: "item" } },
  // "Mobile Dog Grooming Van — No-Stress Salon at Your Door, East London", £45 / session
  "svc-other-03": { serviceType: "pet_care", attributes: { listedBy: "individual", serviceMode: ["homevisit"], priceUnit: "job" } },
  // "Home Painting Service — Interior & Exterior, Singapore", S$3 / sq.ft
  "svc-sg-other-01": { serviceType: "other", attributes: { listedBy: "company", serviceMode: ["homevisit"], priceUnit: "from" } },
  // "Carpentry & Furniture Repair — Home Visits", S$60 / hr
  "svc-sg-other-02": { serviceType: "repair", attributes: { listedBy: "individual", serviceMode: ["homevisit"], priceUnit: "hour" } },
  // ── Wanted
  // "WANTED: Reliable Plumber — Bathroom Leak Repair", budget ₹800 / job, this week
  "svc-in-want-01": { budgetAmount: 800, attributes: { serviceCategory: "home", serviceMode: ["homevisit"], priceUnit: "visit", neededBy: "Immediately" } },
  // "WANTED: Weekend Maths Tutor for Class 8 Student", budget ₹400 / hr
  "svc-in-want-02": { budgetAmount: 400, attributes: { serviceCategory: "tutoring", serviceMode: ["homevisit"], priceUnit: "hour" } },
  // "SEEKING: Local Garden Landscaper — Small Urban Garden, ASAP", budget £2,000
  "svc-want-01": { budgetAmount: 2000, attributes: { serviceCategory: "home", serviceMode: ["homevisit"], priceUnit: "total", neededBy: "Immediately" } },
  // "SEEKING: Reliable Dog Walker — 5 Days/Week, Dalston Area", £15 / hr
  "svc-want-02": { budgetAmount: 15, attributes: { serviceCategory: "other", serviceMode: ["homevisit"], priceUnit: "hour" } },
  // "SEEKING: Mobile Bridal Hair & Makeup — Wedding July 2026, Windsor", budget £500 (the wedding date has passed)
  "svc-want-03": { budgetAmount: 500, attributes: { serviceCategory: "other", serviceMode: ["homevisit"], priceUnit: "total" } },
  // "WANTED: Reliable Plumber — Kitchen Sink Repair", budget S$80 / job, this week
  "svc-sg-want-01": { budgetAmount: 80, attributes: { serviceCategory: "home", serviceMode: ["homevisit"], priceUnit: "visit", neededBy: "Immediately" } },
  // "WANTED: Weekend Maths Tutor for Secondary 2 Student", budget S$50 / hr
  "svc-sg-want-02": { budgetAmount: 50, attributes: { serviceCategory: "tutoring", serviceMode: ["homevisit"], priceUnit: "hour" } },
};

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: { $in: ["services", "Services"] }, adsId: { $in: Object.keys(DETAILS) } })
    .select({ _id: 1, adsId: 1, country: 1, serviceType: 1, experience: 1, subject: 1, duration: 1, startDate: 1, destination: 1, dietaryOptions: 1, budgetAmount: 1, attributes: 1 })
    .lean();
  const found = new Set(posts.map((p) => p.adsId));
  for (const id of Object.keys(DETAILS)) if (!found.has(id)) console.log(`${id}: no post`);

  for (const post of posts) {
    const id = post.adsId!;
    const details = DETAILS[id];
    const $set: Record<string, unknown> = {};
    if (details.serviceType && !post.serviceType) $set.serviceType = details.serviceType;
    if (details.experience && !post.experience) $set.experience = details.experience;
    if (details.subject && !post.subject) $set.subject = details.subject;
    if (details.duration && !post.duration) $set.duration = details.duration;
    if (details.startDate && !post.startDate) $set.startDate = details.startDate;
    if (details.destination && !post.destination) $set.destination = details.destination;
    if (details.dietaryOptions && !post.dietaryOptions?.length) $set.dietaryOptions = details.dietaryOptions;
    if (details.budgetAmount != null && post.budgetAmount == null) $set.budgetAmount = details.budgetAmount;
    for (const [key, value] of Object.entries(details.attributes)) {
      if (post.attributes?.[key] == null) $set[`attributes.${key}`] = value;
    }

    if (!Object.keys($set).length) continue;
    console.log(`${id} (${post.country}): ${dryRun ? "would set" : "set"} ${JSON.stringify($set)}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { $set });
  }

  // "Home cook": cuisineType and deliveryAvailable carry over to the new Cuisine
  // Type and Delivery / Pickup fields.
  const homeCooks = await Post.find({ category: { $in: ["services", "Services"] }, subcategory: "Food & Dining", name: "Home cook" })
    .select({ _id: 1, country: 1, cuisineType: 1, deliveryAvailable: 1, serviceType: 1, attributes: 1 })
    .lean();
  for (const post of homeCooks) {
    const $set: Record<string, unknown> = { subcategory: "food_dining" };
    if (!post.country) $set.country = "in";
    if (!post.serviceType) $set.serviceType = "home_cooked";
    if (post.cuisineType && post.attributes?.cuisines == null) $set["attributes.cuisines"] = [post.cuisineType];
    if (post.deliveryAvailable === "yes" && post.attributes?.deliveryOption == null) $set["attributes.deliveryOption"] = "delivery";
    console.log(`Home cook ${post._id}: ${dryRun ? "would set" : "set"} ${JSON.stringify($set)}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { $set });
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
