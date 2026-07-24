import mongoose from "mongoose";

/**
 * One document per signed-in device/browser. `sessionId` (a random opaque
 * id, NOT the JWT itself) is embedded in the session JWT's `sid` claim at
 * sign-time — see `lib/userSession.ts`. Revoking a device means setting
 * `revokedAt` here; the JWT itself stays cryptographically valid until its
 * own expiry, but every session-read path (`lib/auth.ts`, `lib/session.ts`,
 * `app/actions/getCurrentUser.ts`) checks this collection and treats a
 * revoked/missing session as logged out — this is what makes per-device
 * sign-out actually work against an otherwise-stateless JWT.
 */
const SessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sessionId: { type: String, required: true, unique: true },

    userAgent: { type: String, default: "" },
    deviceLabel: { type: String, default: "Unknown device" },
    ip: { type: String, default: "" },

    lastActiveAt: { type: Date, default: Date.now },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

SessionSchema.index({ userId: 1, revokedAt: 1 });

export default mongoose.models.Session || mongoose.model("Session", SessionSchema);
