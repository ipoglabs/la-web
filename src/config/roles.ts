/**
 * config/roles.ts
 *
 * ONE SOURCE OF TRUTH for account-level "identity" roles — how a user
 * participates in the marketplace (Property Owner, Business Owner, Agent,
 * etc). Self-declared, multi-select, shown as badges on the profile.
 *
 * This is NOT the same concept as `AuthUser.role` in `types/auth.ts`
 * ("member" | "admin") — that is an access-level permission. This list is
 * an identity a user chooses to display, with zero permission implications
 * today.
 *
 * Groomed 2026-07-11/12 and validated against all 21 categories in
 * `config/categories/*.ts` — every role maps to at least 2 categories.
 * "Skilled Worker / Tradesperson" was split out from "Service Provider"
 * on 2026-07-12 so a plumber/carpenter/driver isn't forced to pick a label
 * that reads more like a consultant/professional than a hands-on tradesperson.
 *
 * 2026-07-12 (v2): "Individual Seller" pulled OUT of the selectable list
 * and made an implicit base identity (`BASE_ROLE`) — every account is one,
 * always, with zero UI to toggle it off. The 12 remaining roles are "extra
 * hats" a user can stack on top. This directly reflects the product's own
 * framing: everyone is a seller first, other roles are what else they do.
 * A free-text "say it in your own words" custom role (one slot, counted
 * against `MAX_ROLES_PER_ACCOUNT`) was added alongside the 12 for cases the
 * canonical list can't name precisely (e.g. "Egg Farm Owner").
 *
 * TODO [INTEGRATION]: When the real API/DB lands, persist selected role ids
 * on the user document (e.g. `roles: string[]`) plus the optional custom
 * role string, and validate both server-side — never trust an arbitrary
 * client-supplied role id or unsanitized custom text.
 *
 * 2026-07-12 (v3): Split "identity" from "intent". `BASE_ROLE` used to be
 * `individual_seller` / "Individual Seller" — wrong, because it forced
 * every account (including buy-only or just-browsing users) to publicly
 * wear a "Seller" label. It's now just "Individual" (an account type, not
 * an activity). Why someone is here (buying / selling / both / browsing) is
 * a separate, PRIVATE-only `intent` — never rendered as a public badge,
 * since it's a snapshot-in-time preference, not a credential.
 * Also added inline specialization (`specializable` + `specialtyPlaceholder`)
 * for the three roles whose canonical label is too generic to be useful on
 * its own (Skilled Worker/Tradesperson, Service Provider, Agent/Broker) —
 * e.g. "Skilled Worker/Tradesperson · Plumber". Surfaced inline, right where
 * the role is selected, instead of buried in the unrelated free-text field.
 */

export interface RoleItem {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  /** True if this role's label is generic enough to warrant an inline "what's your specialty" field once selected. */
  readonly specializable?: boolean;
  readonly specialtyPlaceholder?: string;
}

/**
 * The one identity every account has, always. Not part of `ROLES` — it
 * can't be selected or deselected, it's simply true. Rendered as the first
 * badge everywhere roles are shown. This is an account TYPE (a person, not
 * a registered business) — not an activity; see `IntentId` below for why
 * someone is actually here.
 */
export const BASE_ROLE: RoleItem = {
  id: "individual",
  label: "Individual",
  description: "Every LokalAds account starts here — the hats below add what else you do.",
};

export const ROLES: readonly RoleItem[] = [
  {
    id: "business_owner",
    label: "Business Owner",
    description: "Runs a registered shop, store, or small business (online or physical)",
  },
  {
    id: "property_owner",
    label: "Property Owner / Landlord",
    description: "Owns property they rent, lease, or sell",
  },
  {
    id: "agent_broker",
    label: "Agent / Broker",
    description: "Represents other people's property, business, or goods for a fee",
    specializable: true,
    specialtyPlaceholder: "e.g. Real Estate Agent, Insurance Broker",
  },
  {
    id: "service_provider",
    label: "Service Provider",
    description: "Offers a professional or specialist service — tutoring, consulting, coaching, therapy",
    specializable: true,
    specialtyPlaceholder: "e.g. Tutor, Consultant, Therapist",
  },
  {
    id: "skilled_worker",
    label: "Skilled Worker / Tradesperson",
    description: "Hands-on trade or repair work — plumbing, carpentry, electrical, driving, and similar",
    specializable: true,
    specialtyPlaceholder: "e.g. Plumber, Electrician, Carpenter",
  },
  {
    id: "host",
    label: "Host",
    description: "Offers a room, stay, or experience to travellers",
  },
  {
    id: "employer_recruiter",
    label: "Employer / Recruiter",
    description: "Posts jobs on behalf of a company or themselves",
  },
  {
    id: "job_seeker",
    label: "Job Seeker",
    description: "Looking for work, not offering it",
  },
  {
    id: "dealer_reseller",
    label: "Dealer / Reseller",
    description: "Buys and resells goods, often used or in volume",
  },
  {
    id: "educator_coach",
    label: "Educator / Coach",
    description: "Teaches, tutors, trains, or coaches",
  },
  {
    id: "community_member",
    label: "Community Member",
    description: "Posts for a cause, group, event, or gives things away free",
  },
  {
    id: "animal_care_provider",
    label: "Animal Care Provider",
    description: "Breeds, shelters, or cares for animals professionally",
  },
] as const;

export type RoleId = (typeof ROLES)[number]["id"];

/** Keeps a profile's badge row readable — not a technical limit, a UX one. Applies to canonical roles + the one custom-role slot combined (the implicit `BASE_ROLE` is never counted). */
export const MAX_ROLES_PER_ACCOUNT = 5;

/** Bounds for the free-text "say it in your own words" custom role. */
export const CUSTOM_ROLE_MIN_LENGTH = 2;
export const CUSTOM_ROLE_MAX_LENGTH = 40;

/** Bounds for the inline "what's your specialty" field on specializable roles. */
export const SPECIALTY_MAX_LENGTH = 40;

export function getRoleById(id: string): RoleItem | undefined {
  return ROLES.find((r) => r.id === id);
}

export function getRoleLabel(id: string): string {
  return getRoleById(id)?.label ?? id;
}

/**
 * Why someone is actually here today — buying, selling, both, or just
 * browsing. Deliberately NOT part of `ROLES`: it's a private preference
 * used to personalize the experience, never rendered as a public badge.
 * Unlike identity roles (durable credentials — "I am a Business Owner"),
 * intent is a snapshot that can go stale the moment it's frozen into
 * something public.
 */
export type IntentId = "buying" | "selling" | "both" | "browsing";

export interface IntentOption {
  readonly id: IntentId;
  readonly label: string;
}

export const INTENT_OPTIONS: readonly IntentOption[] = [
  { id: "buying", label: "Buying" },
  { id: "selling", label: "Selling" },
  { id: "both", label: "Buying / Selling" },
  { id: "browsing", label: "Something else" },
] as const;

/** Always set — "both" (Buying / Selling) is the required default for every account, since it's the only option that's never wrong. */
export const DEFAULT_INTENT: IntentId = "both";

export function getIntentLabel(id: IntentId): string {
  return INTENT_OPTIONS.find((o) => o.id === id)?.label ?? id;
}
