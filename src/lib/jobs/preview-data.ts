/**
 * lib/jobs/preview-data.ts
 *
 * Static mock data for the /design-system/feature/batch-run demo page.
 * Pure data file — no DB imports, no side effects. Safe to import in Server Components.
 *
 * Each entry simulates one full job run:
 *  - The alert(s) that would be processed
 *  - The listing(s) that would be evaluated
 *  - The field-by-field match result for each listing
 *  - The step-by-step trace log the runner would produce
 *  - The JobRun DB document that _runner.ts would write
 *
 * TODO [integration]: When MONGODB_URI is wired, this file can be replaced with
 * a server action that queries JobRun.find().sort({ startedAt: -1 }).limit(10)
 * to show real job history instead of this static mock.
 */

import type { JobName, JobRunStatus } from "@/lib/jobs/_types";

// ── Shared types ──────────────────────────────────────────────────────────────

export interface MockAlert {
  id: string;
  name: string;
  userId: string;
  category: string;
  subCategory?: string;
  keywords?: string[];
  location?: string;
  priceMin?: number;
  priceMax?: number;
  frequency: "instant" | "daily" | "weekly";
  notifyVia: string[];
  lastMatchedListingIds: string[];
  noMatchSince?: string;
  isActive: boolean;
}

export interface MockListing {
  id: string;
  title: string;
  category: string;
  subCategory?: string;
  price: number;
  location: string;
  status: string;
  description: string;
}

export interface FieldMatch {
  field: string;
  value: string;
  alertCriteria: string;
  match: boolean;
}

export interface MockListingEval {
  listing: MockListing;
  fields: FieldMatch[];
  overallMatch: boolean;
}

export interface TraceLine {
  level: "info" | "match" | "nomatch" | "email" | "db" | "result";
  text: string;
}

export interface MockJobRun {
  jobName: JobName;
  startedAt: string;
  completedAt: string;
  status: JobRunStatus;
  stats: {
    alertsProcessed: number;
    matchesFound: number;
    emailsSent: number;
    errors: number;
  };
}

export interface JobPreviewEntry {
  jobName: string;
  schedule: string;
  scheduleLabel: string;
  frequency: string;
  emailType: string;
  file: string;
  description: string;
  alerts: MockAlert[];
  listings: MockListingEval[];
  trace: TraceLine[];
  jobRun: MockJobRun;
}

// ── Preview data ──────────────────────────────────────────────────────────────

export const JOB_PREVIEW_DATA: JobPreviewEntry[] = [
  // ── 1. alert-match ──────────────────────────────────────────────────────────
  {
    jobName: "alert-match",
    schedule: "*/5 * * * *",
    scheduleLabel: "Every 5 minutes",
    frequency: "instant",
    emailType: "ALERT_MATCH",
    file: "lib/jobs/alert-match.job.ts",
    description:
      "Runs every 5 minutes. Processes all active instant alerts. For each, queries live listings matching the alert's criteria and excluding already-notified IDs.",

    alerts: [
      {
        id: "alert-001",
        name: "2-bed flat London",
        userId: "user-gopi",
        category: "property",
        subCategory: "rent",
        keywords: ["2-bed", "flat"],
        location: "London",
        priceMax: 2000,
        frequency: "instant",
        notifyVia: ["email"],
        lastMatchedListingIds: ["prop-rent-05", "prop-rent-07"],
        isActive: true,
      },
      {
        id: "alert-002",
        name: "Used Honda Civic",
        userId: "user-priya",
        category: "vehicles",
        subCategory: "cars",
        keywords: ["Honda", "Civic"],
        location: "Manchester",
        priceMax: 12000,
        frequency: "instant",
        notifyVia: ["email"],
        lastMatchedListingIds: [],
        noMatchSince: "2026-07-07T09:00:00Z",
        isActive: true,
      },
    ],

    listings: [
      {
        listing: {
          id: "prop-rent-09",
          title: "Modern 2-bed flat – Zone 2, London",
          category: "property",
          subCategory: "rent",
          price: 1850,
          location: "Bethnal Green, London",
          status: "live",
          description: "A bright 2-bed flat in East London. Newly refurbished, available now.",
        },
        fields: [
          { field: "status", value: "live", alertCriteria: "live only", match: true },
          { field: "category", value: "property", alertCriteria: "property", match: true },
          { field: "subCategory", value: "rent", alertCriteria: "rent", match: true },
          { field: "location", value: "Bethnal Green, London", alertCriteria: "contains 'London'", match: true },
          { field: "price", value: "£1,850", alertCriteria: "≤ £2,000", match: true },
          { field: "keywords", value: "title: '2-bed flat'", alertCriteria: "any of: 2-bed, flat", match: true },
          { field: "already notified", value: "prop-rent-09", alertCriteria: "not in lastMatchedListingIds", match: true },
        ],
        overallMatch: true,
      },
      {
        listing: {
          id: "prop-rent-11",
          title: "Studio apartment – Canary Wharf",
          category: "property",
          subCategory: "rent",
          price: 1600,
          location: "Canary Wharf, London",
          status: "live",
          description: "Modern studio, great transport links.",
        },
        fields: [
          { field: "status", value: "live", alertCriteria: "live only", match: true },
          { field: "category", value: "property", alertCriteria: "property", match: true },
          { field: "subCategory", value: "rent", alertCriteria: "rent", match: true },
          { field: "location", value: "Canary Wharf, London", alertCriteria: "contains 'London'", match: true },
          { field: "price", value: "£1,600", alertCriteria: "≤ £2,000", match: true },
          { field: "keywords", value: "title: 'studio apartment'", alertCriteria: "any of: 2-bed, flat", match: false },
          { field: "already notified", value: "prop-rent-11", alertCriteria: "not in lastMatchedListingIds", match: true },
        ],
        overallMatch: false,
      },
    ],

    trace: [
      { level: "info",    text: "[alert-match] started — 09:00:02" },
      { level: "db",      text: "→ DB: Alert.find({ isActive: true, frequency: 'instant' })" },
      { level: "info",    text: "→ 2 active instant alerts found" },
      { level: "info",    text: "" },
      { level: "info",    text: "Processing alert 'alert-001' — 2-bed flat London" },
      { level: "db",      text: "  → DB: Listing.find({ status:'live', category:'property', subCategory:'rent', location:/London/i, price:{$lte:2000}, _id:{$nin:[...2 ids]} })" },
      { level: "match",   text: "  → 1 match found" },
      { level: "match",   text: "    ✓ prop-rent-09 'Modern 2-bed flat – Zone 2, London' — all criteria met" },
      { level: "nomatch", text: "    ✗ prop-rent-11 'Studio apartment' — keyword miss (no '2-bed' or 'flat')" },
      { level: "email",   text: "  → sendEmail({ type:'ALERT_MATCH', alertName:'2-bed flat London', count:1 })" },
      { level: "email",   text: "  ✓ email queued" },
      { level: "db",      text: "  → DB: Alert.findByIdAndUpdate('alert-001', { $set:{ lastMatchedListingIds:[...3 ids], lastNotifiedAt:now }, $unset:{ noMatchSince:1 } })" },
      { level: "info",    text: "" },
      { level: "info",    text: "Processing alert 'alert-002' — Used Honda Civic" },
      { level: "db",      text: "  → DB: Listing.find({ status:'live', category:'vehicles', subCategory:'cars', location:/Manchester/i, price:{$lte:12000}, _id:{$nin:[]} })" },
      { level: "nomatch", text: "  → 0 matches" },
      { level: "db",      text: "  → noMatchSince already set (2026-07-07) — no update" },
      { level: "info",    text: "" },
      { level: "result",  text: "[alert-match] completed — 2 processed / 1 match / 1 email / 0 errors" },
    ],

    jobRun: {
      jobName: "alert-match",
      startedAt: "2026-07-08T09:00:02.001Z",
      completedAt: "2026-07-08T09:00:02.487Z",
      status: "completed",
      stats: { alertsProcessed: 2, matchesFound: 1, emailsSent: 1, errors: 0 },
    },
  },

  // ── 2. alert-digest-daily ───────────────────────────────────────────────────
  {
    jobName: "alert-digest-daily",
    schedule: "0 8 * * *",
    scheduleLabel: "Daily at 08:00",
    frequency: "daily",
    emailType: "ALERT_DIGEST (daily)",
    file: "lib/jobs/alert-digest.job.ts",
    description:
      "Runs every day at 08:00. Same match logic as alert-match, but batched — all new matches for a daily alert since the last run are grouped into a single ALERT_DIGEST email.",

    alerts: [
      {
        id: "alert-003",
        name: "Sofa under £300 London",
        userId: "user-ali",
        category: "furniture",
        keywords: ["sofa", "couch"],
        location: "London",
        priceMax: 300,
        frequency: "daily",
        notifyVia: ["email"],
        lastMatchedListingIds: ["furn-001"],
        isActive: true,
      },
    ],

    listings: [
      {
        listing: {
          id: "furn-004",
          title: "3-seater sofa – grey – excellent condition",
          category: "furniture",
          price: 180,
          location: "Hackney, London",
          status: "live",
          description: "Barely-used grey sofa, moving out sale.",
        },
        fields: [
          { field: "status", value: "live", alertCriteria: "live only", match: true },
          { field: "category", value: "furniture", alertCriteria: "furniture", match: true },
          { field: "location", value: "Hackney, London", alertCriteria: "contains 'London'", match: true },
          { field: "price", value: "£180", alertCriteria: "≤ £300", match: true },
          { field: "keywords", value: "title: 'sofa'", alertCriteria: "any of: sofa, couch", match: true },
          { field: "already notified", value: "furn-004", alertCriteria: "not in lastMatchedListingIds", match: true },
        ],
        overallMatch: true,
      },
      {
        listing: {
          id: "furn-005",
          title: "Dining table and chairs set",
          category: "furniture",
          price: 220,
          location: "Islington, London",
          status: "live",
          description: "Oak dining set, 4 chairs included.",
        },
        fields: [
          { field: "status", value: "live", alertCriteria: "live only", match: true },
          { field: "category", value: "furniture", alertCriteria: "furniture", match: true },
          { field: "location", value: "Islington, London", alertCriteria: "contains 'London'", match: true },
          { field: "price", value: "£220", alertCriteria: "≤ £300", match: true },
          { field: "keywords", value: "title: 'dining table'", alertCriteria: "any of: sofa, couch", match: false },
          { field: "already notified", value: "furn-005", alertCriteria: "not in lastMatchedListingIds", match: true },
        ],
        overallMatch: false,
      },
    ],

    trace: [
      { level: "info",    text: "[alert-digest-daily] started — 08:00:01" },
      { level: "db",      text: "→ DB: Alert.find({ isActive: true, frequency: 'daily' })" },
      { level: "info",    text: "→ 1 active daily alert found" },
      { level: "info",    text: "" },
      { level: "info",    text: "Processing alert 'alert-003' — Sofa under £300 London" },
      { level: "db",      text: "  → DB: Listing.find({ status:'live', category:'furniture', location:/London/i, price:{$lte:300}, _id:{$nin:['furn-001']} })" },
      { level: "match",   text: "  → 1 match found" },
      { level: "match",   text: "    ✓ furn-004 '3-seater sofa' — all criteria met" },
      { level: "nomatch", text: "    ✗ furn-005 'Dining table' — keyword miss (no 'sofa' or 'couch')" },
      { level: "email",   text: "  → sendEmail({ type:'ALERT_DIGEST', frequency:'daily', alertName:'Sofa under £300 London', count:1 })" },
      { level: "email",   text: "  ✓ email queued" },
      { level: "db",      text: "  → DB: Alert.findByIdAndUpdate('alert-003', { $set:{ lastMatchedListingIds:['furn-001','furn-004'], lastNotifiedAt:now }, $unset:{ noMatchSince:1 } })" },
      { level: "info",    text: "" },
      { level: "result",  text: "[alert-digest-daily] completed — 1 processed / 1 match / 1 email / 0 errors" },
    ],

    jobRun: {
      jobName: "alert-digest-daily",
      startedAt: "2026-07-08T08:00:01.003Z",
      completedAt: "2026-07-08T08:00:01.312Z",
      status: "completed",
      stats: { alertsProcessed: 1, matchesFound: 1, emailsSent: 1, errors: 0 },
    },
  },

  // ── 3. alert-digest-weekly ──────────────────────────────────────────────────
  {
    jobName: "alert-digest-weekly",
    schedule: "0 8 * * 1",
    scheduleLabel: "Monday at 08:00",
    frequency: "weekly",
    emailType: "ALERT_DIGEST (weekly)",
    file: "lib/jobs/alert-digest.job.ts",
    description:
      "Runs every Monday at 08:00. Identical logic to the daily digest but targets weekly alerts. Users who prefer one weekly summary instead of daily emails.",

    alerts: [
      {
        id: "alert-004",
        name: "Graphic design jobs",
        userId: "user-mei",
        category: "jobs",
        subCategory: "design",
        keywords: ["graphic design", "designer"],
        location: "Singapore",
        frequency: "weekly",
        notifyVia: ["email"],
        lastMatchedListingIds: [],
        isActive: true,
      },
    ],

    listings: [
      {
        listing: {
          id: "job-sg-031",
          title: "Senior Graphic Designer – SG startup",
          category: "jobs",
          subCategory: "design",
          price: 0,
          location: "Tanjong Pagar, Singapore",
          status: "live",
          description: "We are looking for a senior graphic designer to join our growing team.",
        },
        fields: [
          { field: "status", value: "live", alertCriteria: "live only", match: true },
          { field: "category", value: "jobs", alertCriteria: "jobs", match: true },
          { field: "subCategory", value: "design", alertCriteria: "design", match: true },
          { field: "location", value: "Singapore", alertCriteria: "contains 'Singapore'", match: true },
          { field: "keywords", value: "title: 'Graphic Designer'", alertCriteria: "any of: graphic design, designer", match: true },
          { field: "already notified", value: "job-sg-031", alertCriteria: "not in lastMatchedListingIds", match: true },
        ],
        overallMatch: true,
      },
    ],

    trace: [
      { level: "info",    text: "[alert-digest-weekly] started — Monday 08:00:02" },
      { level: "db",      text: "→ DB: Alert.find({ isActive: true, frequency: 'weekly' })" },
      { level: "info",    text: "→ 1 active weekly alert found" },
      { level: "info",    text: "" },
      { level: "info",    text: "Processing alert 'alert-004' — Graphic design jobs" },
      { level: "db",      text: "  → DB: Listing.find({ status:'live', category:'jobs', subCategory:'design', location:/Singapore/i, _id:{$nin:[]} })" },
      { level: "match",   text: "  → 1 match found" },
      { level: "match",   text: "    ✓ job-sg-031 'Senior Graphic Designer' — all criteria met" },
      { level: "email",   text: "  → sendEmail({ type:'ALERT_DIGEST', frequency:'weekly', alertName:'Graphic design jobs', count:1 })" },
      { level: "email",   text: "  ✓ email queued" },
      { level: "db",      text: "  → DB: Alert.findByIdAndUpdate('alert-004', { $set:{ lastMatchedListingIds:['job-sg-031'], lastNotifiedAt:now }, $unset:{ noMatchSince:1 } })" },
      { level: "info",    text: "" },
      { level: "result",  text: "[alert-digest-weekly] completed — 1 processed / 1 match / 1 email / 0 errors" },
    ],

    jobRun: {
      jobName: "alert-digest-weekly",
      startedAt: "2026-07-08T08:00:02.011Z",
      completedAt: "2026-07-08T08:00:02.284Z",
      status: "completed",
      stats: { alertsProcessed: 1, matchesFound: 1, emailsSent: 1, errors: 0 },
    },
  },

  // ── 4. alert-no-match ───────────────────────────────────────────────────────
  {
    jobName: "alert-no-match",
    schedule: "0 9 * * *",
    scheduleLabel: "Daily at 09:00",
    frequency: "instant / daily / weekly",
    emailType: "ALERT_NO_MATCHES",
    file: "lib/jobs/alert-no-match.job.ts",
    description:
      "Runs every day at 09:00. Finds active alerts where noMatchSince is 14+ days old and sends an ALERT_NO_MATCHES nudge email. After sending, noMatchSince is $unset so the 14-day clock resets. If no matches are found on the next cron cycle, the match jobs re-set noMatchSince and the countdown begins again.",

    alerts: [
      {
        id: "alert-005",
        name: "Vintage record player",
        userId: "user-tom",
        category: "electronics",
        keywords: ["record player", "turntable", "vinyl"],
        location: "Edinburgh",
        priceMax: 150,
        frequency: "instant",
        notifyVia: ["email"],
        lastMatchedListingIds: [],
        noMatchSince: "2026-06-24T09:00:00Z",
        isActive: true,
      },
    ],

    listings: [],

    trace: [
      { level: "info",    text: "[alert-no-match] started — 09:00:01" },
      { level: "db",      text: "→ DB: Alert.find({ isActive:true, noMatchSince:{ $lte: '2026-06-24T09:00:00Z' } })" },
      { level: "info",    text: "→ 1 alert with 14+ days of no matches found" },
      { level: "info",    text: "" },
      { level: "info",    text: "Processing alert 'alert-005' — Vintage record player" },
      { level: "info",    text: "  → noMatchSince: 2026-06-24 (14 days ago)" },
      { level: "email",   text: "  → sendEmail({ type:'ALERT_NO_MATCHES', alertName:'Vintage record player', alertId:'alert-005' })" },
      { level: "email",   text: "  ✓ email queued" },
      { level: "db",      text: "  → DB: Alert.findByIdAndUpdate('alert-005', { $unset: { noMatchSince: 1 } })" },
      { level: "db",      text: "  → noMatchSince cleared — 14-day clock reset" },
      { level: "info",    text: "" },
      { level: "result",  text: "[alert-no-match] completed — 1 processed / 0 matches / 1 email / 0 errors" },
    ],

    jobRun: {
      jobName: "alert-no-match",
      startedAt: "2026-07-08T09:00:01.007Z",
      completedAt: "2026-07-08T09:00:01.198Z",
      status: "completed",
      stats: { alertsProcessed: 1, matchesFound: 0, emailsSent: 1, errors: 0 },
    },
  },
];
