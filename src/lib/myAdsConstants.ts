/**
 * lib/myAdsConstants.ts
 *
 * Pure, zero-dependency constants shared between /my-ads's client
 * components (MyAdsEmptyState, MyAdsGoodToKnow) and its server actions
 * (setListingLifecycle.ts). Deliberately kept separate from
 * lib/myAdsStatus.ts, which imports the AdReport Mongoose model — a client
 * component importing anything from that file (even just a constant)
 * pulls the entire Mongoose/MongoDB dependency graph into the browser
 * bundle and fails to build (Node builtins like "tls"/"net" don't resolve
 * client-side).
 */

/** Fixed active-ad quota for every user — no paid tiers yet. Enforced live
 *  in setListingLifecycle.ts (resume/renew); shown to sellers in copy on
 *  /my-ads (MyAdsGoodToKnow, MyAdsEmptyState). */
export const MAX_ACTIVE_ADS = 5;
