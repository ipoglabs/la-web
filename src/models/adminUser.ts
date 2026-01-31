// src/models/adminUser.ts
import mongoose, { Schema, models, model } from "mongoose";

const AdminUserSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    designation: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 18, max: 100 },
    gender: { type: String, enum: ["male", "female", "other"], required: true },

    country: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },

    role: {
      type: String,
      enum: ["super_admin", "admin", "moderator", "support", "analyst"],
      required: true,
      index: true,
    },

    employeeId: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    password: { type: String, required: true, select: false },

    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
  },
  { timestamps: true }
);

export default models.AdminUser || model("AdminUser", AdminUserSchema);
