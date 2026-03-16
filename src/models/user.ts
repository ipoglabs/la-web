import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    street1: { type: String, trim: true },
    street2: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    postalCode: { type: String, trim: true },
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
    userId: { type: String, required: true, unique: true, index: true },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String },

    nationality: { type: String, trim: true },
    residence: { type: String, trim: true },

    locality: { type: String, required: true, trim: true },
    address: AddressSchema,

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    isEmailVerified: { type: Boolean, default: false },

    primaryNumber: { type: String, required: true, unique: true, trim: true },
    isPrimaryNumberVerified: { type: Boolean, default: false },

    secondaryNumber1: { type: String, trim: true },
    secondaryNumber2: { type: String, trim: true },

    password: { type: String, required: true },

    role: { type: String, required: true },

    provider: {
      type: String,
      enum: ["credentials", "google", "apple"],
      default: "credentials",
    },

    accountStatus: {
      type: String,
      enum: ["Pending", "Active", "Suspended"],
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

    image: { type: String },
  },
  { timestamps: true }
);

// indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ primaryNumber: 1 }, { unique: true });
UserSchema.index({ userId: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);