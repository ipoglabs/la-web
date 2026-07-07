import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    target: { type: String, required: true, index: true }, // email or phone
    channel: { type: String, enum: ["email", "phone"], required: true },

    code: { type: String, required: true },

    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },

    attempts: { type: Number, default: 0 },
    lockedUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);