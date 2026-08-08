import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    target: { type: String, required: true, index: true }, // email or phone
    channel: { type: String, enum: ["email", "phone"], required: true },

    code: { type: String, required: true },

    // TTL index — Mongo's background reaper deletes the document once this
    // timestamp has passed (expires: 0 = no extra grace period). Every OTP
    // that's ever requested but never completed (expired, abandoned flow,
    // typo'd target) previously stayed in this collection forever.
    expiresAt: { type: Date, required: true, expires: 0 },
    verified: { type: Boolean, default: false },

    attempts: { type: Number, default: 0 },
    lockedUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);