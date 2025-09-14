import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date }, // Not required for Google users
    password: { type: String }, // Not required for Google users
    isEmailVerified: { type: Boolean, default: false },
    image: { type: String }, // From Google
    provider: { type: String, default: 'credentials' }, // 'google' or 'credentials'
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
