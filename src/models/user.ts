import mongoose from "mongoose";

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

const OtpSchema = new mongoose.Schema(
  {
    channel: {
      type: String,
      enum: ["email", "phone"],
      required: true,
    },
    target: { type: String, required: true, trim: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
    lockedUntil: { type: Date, default: null },
  },
  { _id: false }
);

const AuditSchema = new mongoose.Schema(
  {
    action: { type: String },
    IPAddress: { type: String, trim: true },
    Device: { type: String, trim: true },
    by: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ReportSchema = new mongoose.Schema(
  {
    reason: { type: String, trim: true },
    by: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
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

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    isEmailVerified: { type: Boolean, default: false },

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

    role: { type: String, required: true },

    roleTitle: { type: String, trim: true },
    roleDescription: { type: String, trim: true },

    // Additive — from the july16 multi-select RoleStep (config/roles.ts).
    // `role` above stays the single required string used elsewhere in the
    // app for permissions (set to the first selected role, or the
    // implicit BASE_ROLE "individual" default); these hold the full
    // multi-select picture alongside it.
    roles: { type: [String], default: [] },
    roleSpecialties: { type: mongoose.Schema.Types.Mixed, default: {} },
    customRole: { type: String, trim: true },
    
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

    // moderation
    isSuspended: { type: Boolean, default: false, index: true },
    reported: { type: Boolean, default: false, index: true },

    reports: {
      type: [ReportSchema],
      default: [],
    },

    reportClearedAt: Date,
    reportClearedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" },

    // audit history
    audit: {
      type: [AuditSchema],
      default: [],
    },

isDeleted: { type: Boolean, default: false, index: true },
deletedAt: { type: Date },
deleteFeedback: { type: String, trim: true },

 otp: { type: OtpSchema, default: null },

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