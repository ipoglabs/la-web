import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
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