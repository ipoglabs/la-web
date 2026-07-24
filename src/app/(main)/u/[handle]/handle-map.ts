import { SELLERS } from "@/lib/mock/gb/property/sellers";

/**
 * `handle` → seller lookup. Kept in its own server-safe module (no "use
 * client") so both `page.tsx` (generateMetadata, runs on the server) and
 * `PublicProfileClient.tsx` (rendering) can share the same source of truth
 * without the metadata function importing a client component module.
 *
 * Not merged into the shared `SELLERS` pool itself — that pool has no
 * `handle` field, and adding one would ripple into 20+ category files
 * across every market. Extend this map as more demo profiles are needed.
 */
export const HANDLE_TO_SELLER = {
  "bob-harrison": SELLERS.bob,
  "alice-chen": SELLERS.alice,
  "sarah-patel": SELLERS.sarah,
  "james-obrien": SELLERS.james,
  "prime-developments": SELLERS.prime,
  "meridian-commercial": SELLERS.comm,
  // Demo alias: the logged-in mock user's own handle (private `/profile`
  // page's "Preview" button links here) — until real auth ties a logged-in
  // user's handle to their own seller record, alias it to Bob so that
  // existing "preview your own public profile" journey keeps working.
  anto27: SELLERS.bob,
} as const;

export type ProfileHandle = keyof typeof HANDLE_TO_SELLER;
