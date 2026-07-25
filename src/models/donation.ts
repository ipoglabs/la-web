import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    // Set server-side from the session when the donor is logged in (see
    // POST /api/donations) — never trust a client-supplied user id. Absent
    // for guest/anonymous donations. This, not donorEmail, is what
    // /donation-history matches against: donorEmail is just whatever the
    // donor typed on the (login-optional) /donate form, and phone-only
    // accounts have no email at all to match against.
    donorUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    method: { type: String, default: "unknown" },
    description: { type: String, trim: true },
    status: { type: String, default: "pending" },
    transactionId: { type: String },
  },
  { timestamps: true, collection: "donations" }
);

export default mongoose.models.Donation || mongoose.model("Donation", DonationSchema);