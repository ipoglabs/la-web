import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // profile owner
    reviewerId: { type: String, required: true }, // logged-in user

    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },

  },
  { timestamps: true }
);

export default mongoose.models.Review ||
  mongoose.model("Review", ReviewSchema);