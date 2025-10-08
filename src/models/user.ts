import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    // Step 1 – General Info
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
    nationality: { type: String },
    residency: { type: String },

    // Step 2 – Email Verification
    email: { type: String, required: true, unique: true },
    isEmailVerified: { type: Boolean, default: false },

    // Step 3 – Phone Verification
    primaryNumber: { type: String, required: true, unique: true },
    secondaryNumber1: { type: String },
    secondaryNumber2: { type: String },
    isPhoneVerified: { type: Boolean, default: false },

    // Step 4 – Profile Setup
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // Common fields
    image: { type: String },
    provider: { type: String, default: 'credentials' }, // 'google' | 'credentials'
  },
  { timestamps: true }
);

// ✅ Avoid OverwriteModelError during hot reloads in Next.js
export default mongoose.models.User || mongoose.model('User', UserSchema);
