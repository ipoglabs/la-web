// src/lib/phoneAttemptStore.ts
export type PhoneAttemptRecord = {
  attempts: number;           // failed verify attempts
  lockedUntil: number | null; // epoch ms when lock expires
};

declare global {
  // eslint-disable-next-line no-var
  var __phoneAttemptStore: Record<string, PhoneAttemptRecord> | undefined;
}

// Reuse across hot reloads in Next dev
const phoneAttemptStore: Record<string, PhoneAttemptRecord> =
  global.__phoneAttemptStore || {};

if (!global.__phoneAttemptStore) {
  global.__phoneAttemptStore = phoneAttemptStore;
}

export default phoneAttemptStore;
