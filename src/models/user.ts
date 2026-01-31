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
    IPAddress: { type: String, trim: true },
    Device: { type: String, trim: true },
    others: { type: String, trim: true },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    // ✅ Incremental public ID
    userId: { type: String, required: true, unique: true, index: true },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String },

    // 🌍 Identity
    nationality: { type: String, trim: true },
    residence: { type: String, trim: true },

    // 📍 Address (structured)
    locality: { type: String, required: true, trim: true }, // legacy / display
    address: AddressSchema,

    // 📧 Email
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isEmailVerified: { type: Boolean, default: false },

    // 📞 Phone
    primaryNumber: { type: String, required: true, unique: true, trim: true },
    isPrimaryNumberVerified: { type: Boolean, default: false },

    secondaryNumber1: { type: String, trim: true },
    secondaryNumber2: { type: String, trim: true },

    // 🔐 Auth
    password: { type: String, required: true },
    role: { type: String, required: true },

    provider: {
      type: String,
      enum: ["credentials", "google", "apple"],
      default: "credentials",
    },

    // 🧾 Account state
    accountStatus: {
      type: String,
      enum: ["Pending", "Active", "Suspended"],
      default: "Pending",
    },
    isNewUser: { type: Boolean, default: true },

    // ✅ Consents
    isTermsAndConditionAccepted: { type: Boolean, default: false },
    isPrivacyAndPolicyAccepted: { type: Boolean, default: false },
    isCookiesPolicyAccepted: { type: Boolean, default: false },

    // 📊 Marketing
    marketingOptIn: { type: Boolean, default: false },

    // 🕵️ Audit / Device
    audit: AuditSchema,

    image: { type: String },
  },
  { timestamps: true }
);

// indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ primaryNumber: 1 }, { unique: true });
UserSchema.index({ userId: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
