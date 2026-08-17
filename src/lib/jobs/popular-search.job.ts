/**
 * lib/jobs/popular-search.job.ts
 *
 * Runs nightly at 00:00 — cron: daily (0 0 * * *).
 *
 * 1. Aggregate SearchEvent docs from the last AGGREGATION_WINDOW_DAYS,
 *    grouped by (keyword, category, country, city).
 * 2. Bucket each group into every locationKey it feeds:
 *      - "<COUNTRY>"          — every event in that country, city-tagged or not (tier 0.6)
 *      - "<COUNTRY>:<City>"   — only events tagged with that city (tier 1.0)
 *      - "GLOBAL"             — every event, any country (tier 0.6)
 *    A country bucket is never empty just because most searches lack a city
 *    — see md/features/popular-searches.md Section 3.2.
 * 3. Score = count × recencyDecay(daysAgo since last seen) × locationTier,
 *    rank descending, keep top TOP_N, upsert one PopularSearch doc per key.
 * 4. Prune SearchEvent docs older than RETENTION_DAYS.
 */

import dbConnect from "@/lib/db";
import SearchEvent from "@/models/SearchEvent";
import PopularSearch, { type IPopularSearchItem } from "@/models/PopularSearch";
import type { JobResult } from "@/lib/jobs/_types";

const HALF_LIFE_DAYS = 7;
const AGGREGATION_WINDOW_DAYS = 30;
const TOP_N = 20;
const RETENTION_DAYS = 90;

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const CITY_TIER = 1.0;
const COUNTRY_TIER = 0.6;

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * MS_PER_DAY);
}

interface GroupedRow {
  _id: { keyword: string; category?: string; country: string; city?: string };
  count: number;
  lastSeen: Date;
}

interface BucketEntry {
  keyword: string;
  category?: string;
  count: number;
  lastSeen: Date;
}

function weightedScore(count: number, lastSeen: Date, tier: number): number {
  const age = (Date.now() - lastSeen.getTime()) / MS_PER_DAY;
  const recencyDecay = Math.exp(-age / HALF_LIFE_DAYS);
  return count * recencyDecay * tier;
}

function addToBucket(
  byLocation: Map<string, Map<string, BucketEntry>>,
  locationKey: string,
  row: GroupedRow,
): void {
  const bucket = byLocation.get(locationKey) ?? new Map<string, BucketEntry>();
  const itemKey = `${row._id.keyword.toLowerCase()}::${row._id.category ?? ""}`;
  const existing = bucket.get(itemKey);
  if (existing) {
    existing.count += row.count;
    if (row.lastSeen > existing.lastSeen) existing.lastSeen = row.lastSeen;
  } else {
    bucket.set(itemKey, {
      keyword: row._id.keyword,
      category: row._id.category,
      count: row.count,
      lastSeen: row.lastSeen,
    });
  }
  byLocation.set(locationKey, bucket);
}

export async function runPopularSearchJob(): Promise<JobResult> {
  await dbConnect();

  const grouped: GroupedRow[] = await SearchEvent.aggregate([
    { $match: { searchedAt: { $gte: daysAgo(AGGREGATION_WINDOW_DAYS) } } },
    {
      $group: {
        _id: { keyword: "$keyword", category: "$category", country: "$country", city: "$city" },
        count: { $sum: 1 },
        lastSeen: { $max: "$searchedAt" },
      },
    },
  ]);

  const byLocation = new Map<string, Map<string, BucketEntry>>();

  for (const row of grouped) {
    addToBucket(byLocation, row._id.country, row);
    addToBucket(byLocation, "GLOBAL", row);
    if (row._id.city) {
      addToBucket(byLocation, `${row._id.country}:${row._id.city}`, row);
    }
  }

  for (const [locationKey, bucket] of byLocation) {
    const tier = locationKey.includes(":") ? CITY_TIER : COUNTRY_TIER;

    const ranked: IPopularSearchItem[] = Array.from(bucket.values())
      .map((entry) => ({
        keyword: entry.keyword,
        category: entry.category,
        count: entry.count,
        score: weightedScore(entry.count, entry.lastSeen, tier),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, TOP_N);

    await PopularSearch.findOneAndUpdate(
      { locationKey },
      { $set: { items: ranked, computedAt: new Date() } },
      { upsert: true },
    );
  }

  await SearchEvent.deleteMany({ searchedAt: { $lt: daysAgo(RETENTION_DAYS) } });

  return {
    alertsProcessed: 0,
    matchesFound: 0,
    emailsSent: 0,
    whatsappSent: 0,
    errors: 0,
    eventsProcessed: grouped.length,
    locationsUpdated: byLocation.size,
  };
}
