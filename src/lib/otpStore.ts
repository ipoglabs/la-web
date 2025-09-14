type OtpRecord = {
  otp: string;
  expiresAt: number;
  verified?: boolean;
};

declare global {
  var otpStore: { [email: string]: OtpRecord } | undefined;
}

// Create global store if not already initialized
const otpStore: { [email: string]: OtpRecord } = global.otpStore || {};
if (!global.otpStore) global.otpStore = otpStore;

export default otpStore;
