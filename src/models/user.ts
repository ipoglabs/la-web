import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String },

    nationality: { type: String, required: false },
    residency: { type: String, required: false },
    country: { type: String, required: false },
    state: { type: String, required: false },

    locality: { type: String, required: true, trim: true }, // 👈 required

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isEmailVerified: { type: Boolean, default: false },

    primaryNumber: { type: String, required: true, unique: true, trim: true },
    secondaryNumber1: { type: String, trim: true },
    secondaryNumber2: { type: String, trim: true },
    isPhoneVerified: { type: Boolean, default: false },

    // username removed completely
    password: { type: String, required: true },
    role: { type: String, required: true },

    // 👇 NEW FIELDS FOR "other" role
    roleTitle: { type: String, required: false, trim: true },
    roleDescription: { type: String, required: false, trim: true },

    image: { type: String },
    provider: { type: String, default: "credentials" },
    marketingOptIn: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ primaryNumber: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
