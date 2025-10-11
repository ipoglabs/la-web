import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    // Step 1 – General Info
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
    nationality: { type: String, required: true },
    residency: { type: String, required: true },

    // Step 2 – Email Verification
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isEmailVerified: { type: Boolean, default: false },

    // Step 3 – Phone Verification
    primaryNumber: { type: String, required: true, unique: true, trim: true },
    secondaryNumber1: { type: String, trim: true },
    secondaryNumber2: { type: String, trim: true },
    isPhoneVerified: { type: Boolean, default: false },

    // Step 4 – Profile Setup
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // Other details
    image: { type: String },
    provider: { type: String, default: 'credentials' }, // 'google' | 'credentials'
    marketingOptIn: { type: Boolean, default: false }, // for "subscribe to updates"

  },
  { timestamps: true }
);

// ✅ Indexes (to ensure Mongo enforces uniqueness properly)
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ primaryNumber: 1 }, { unique: true });

// ✅ Avoid OverwriteModelError during Next.js hot reload
export default mongoose.models.User || mongoose.model('User', UserSchema);
