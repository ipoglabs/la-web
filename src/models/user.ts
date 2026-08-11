import mongoose from "mongoose";
import { randomUUID } from "crypto";

const AddressSchema = new mongoose.Schema(
  {
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    postalCode: { type: String, trim: true },
  },
  { _id: false }
);

// Saved Locations (account-settings) — scopes which local listings a user
// sees. Kept `_id: true` (the default) so each entry has its own stable id
// for add/remove — see app/actions/profile/{add,remove}SavedLocation.ts.
const SavedLocationSchema = new mongoose.Schema({
  flagCode: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  region: { type: String, trim: true, default: "" },
  country: { type: String, required: true, trim: true },
  primary: { type: Boolean, default: false },
});

// Recent search history — kept per-user like SavedLocationSchema above so a
// signed-in visitor's searches (landing page bar, listings search) follow
// them across devices. Guests get equivalent behavior from localStorage
// (see lib/stores/recentSearchesStore.ts) since there's no account to
// persist to; MAX_RECENT_SEARCHES (lib/searchUtils.ts) caps both paths.
const RecentSearchSchema = new mongoose.Schema({
  keyword: { type: String, trim: true, default: "" },
  scopeCat: { type: String, trim: true },
  scopeLabel: { type: String, trim: true },
  scopeSub: { type: String, trim: true },
  scopeSubLabel: { type: String, trim: true },
  searchedAt: { type: Date, default: Date.now },
});

const AuditSchema = new mongoose.Schema(
  {
    action: { type: String },
    IPAddress: { type: String, trim: true },
    Device: { type: String, trim: true },
    by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    // Internal-only stable identifier — never selected by default (`select:
    // false`), so every existing query/lean read across the app (none of
    // which ask for it) keeps excluding it automatically; only a query that
    // explicitly opts in with `.select("+uuid")` will ever see it. Not the
    // same as `userId` below (the sequential, user-facing @handle) or Mongo's
    // own `_id` (already returned to clients in several places, e.g.
    // getCurrentUser/getPublicProfile `id`) — this exists specifically so an
    // opaque, non-enumerable, non-public identifier is available for
    // internal/cross-system use without ever reaching the client.
    uuid: { type: String, required: true, unique: true, default: randomUUID, select: false },

    // incremental public ID
    userId: { type: String, required: true, unique: true },

    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String },

    nationality: { type: String, trim: true },
    residency: { type: String, trim: true },

    locality: { type: String, trim: true },
    address: AddressSchema,
    savedLocations: { type: [SavedLocationSchema], default: [] },
    recentSearches: { type: [RecentSearchSchema], default: [] },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    isEmailVerified: { type: Boolean, default: false },

    // Apple's own identifier for this sign-in — either the `email` claim
    // from their id_token (a real address, or a "Hide My Email" private
    // relay address) or, when Apple gives us neither (seen in practice on
    // repeat sign-ins), their stable per-app `sub`. Deliberately NEVER
    // copied into `email` above — it isn't guaranteed to be a real,
    // reachable inbox — kept only so a returning Apple sign-in can be
    // matched back to this account (see apple-callback/route.ts). The
    // user's actual `email` is always separately collected + OTP-verified
    // during onboarding (see register/apple-email/AppleEmailStep.tsx)
    // before the account is created.
    appleEmailId: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    // sparse (not required): passwordless accounts created via email-only
    // magic-link/Google/Apple never collect a phone number. At least one
    // of email/primaryNumber is enforced below in the pre-validate hook.
    primaryNumber: { type: String, unique: true, sparse: true, trim: true },
    isPrimaryNumberVerified: { type: Boolean, default: false },

    secondaryNumber1: { type: String, trim: true },
    secondaryNumber2: { type: String, trim: true },

    // optional — passwordless accounts (magic-link/phone-OTP/Google/Apple,
    // see july16 register/login journey) never set this.
    password: { type: String },

    // Self-declared, user-editable "how I participate in the marketplace"
    // identity (individual/business/agency/other, or the first pick from
    // the multi-select roles[] below) — shown as a public badge, zero
    // permission implications. Deliberately NOT named `role` so it can
    // never be mistaken for (or wired into) an access-level check — real
    // admin access is a fixed verified-email allowlist, see lib/admin.ts.
    publicRole: { type: String, required: true },

    roleTitle: { type: String, trim: true },
    roleDescription: { type: String, trim: true },

    // Additive — from the july16 multi-select RoleStep (config/roles.ts).
    // `publicRole` above stays the single required string used elsewhere in
    // the app for display (set to the first selected role, or the implicit
    // BASE_ROLE "individual" default); these hold the full multi-select
    // picture alongside it.
    roles: { type: [String], default: [] },
    roleSpecialties: { type: mongoose.Schema.Types.Mixed, default: {} },
    customRole: { type: String, trim: true },

    // Private "why are you here" preference (config/roles.ts IntentId) —
    // never shown as a public badge, unlike roles/customRole above.
    intent: {
      type: String,
      enum: ["buying", "selling", "both", "browsing"],
      default: "both",
    },
    
    provider: {
      type: String,
      enum: ["credentials", "google", "apple"],
      default: "credentials",
    },

    accountStatus: {
      type: String,
      enum: ["Pending", "Active", "Suspended" , "Deleted"],
      default: "Pending",
    },

    isNewUser: { type: Boolean, default: true },

    isTermsAndConditionAccepted: { type: Boolean, default: false },
    isPrivacyAndPolicyAccepted: { type: Boolean, default: false },
    isCookiesPolicyAccepted: { type: Boolean, default: false },

    marketingOptIn: { type: Boolean, default: false },

    // moderation — real ad reports live on the separate AdReport collection
    // (src/components/report-ad/model.ts), wired into app/api/reports/*,
    // admin/listReportedAds.ts, admin/reviewReport.ts, lib/moderation.ts.
    isSuspended: { type: Boolean, default: false, index: true },

    // audit history
    audit: {
      type: [AuditSchema],
      default: [],
    },

isDeleted: { type: Boolean, default: false, index: true },
deletedAt: { type: Date },
deleteFeedback: { type: String, trim: true },

// Admin-only record of who this account used to be, captured at the moment
// of deletion — the live email/primaryNumber/fullName above get wiped/
// anonymized right after (see softDeleteAccount) so the identifier can be
// reused for re-registration. This snapshot is never selected by any
// public/user-facing read path (getCurrentUser, getPublicProfile,
// conversation populates, etc. all use explicit field allowlists) — only
// dev-tools's deleted-users lookup reads it.
deletedIdentitySnapshot: {
  email: { type: String, trim: true },
  primaryNumber: { type: String, trim: true },
  fullName: { type: String, trim: true },
},

    // Derived, not user-settable — kept in sync by the pre-validate hook
    // below on every save. True only once email, primaryNumber,
    // dateOfBirth, and locality are all present.
    isFullyRegistered: { type: Boolean, default: false },

    image: { type: String },
  },
  { timestamps: true }
);

// Since email and primaryNumber are each now optional+sparse (to support
// passwordless accounts created with only one identifier), enforce that at
// least one of them is always present — an account with neither would be
// unreachable/unloginable.
UserSchema.pre("validate", function (this: any) {
  if (!this.email && !this.primaryNumber) {
    throw new Error("At least one of email or primaryNumber is required.");
  }

  this.isFullyRegistered = Boolean(
    this.email && this.primaryNumber && this.dateOfBirth && this.locality
  );
});

export default mongoose.models.User || mongoose.model("User", UserSchema);