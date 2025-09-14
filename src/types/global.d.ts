// types/global.d.ts
export {};

declare global {
  var otpStore: {
    [email: string]: {
      otp: string;
      expiresAt: number;
    };
  };
}
