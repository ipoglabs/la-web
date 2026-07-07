import { PhoneOtpCardV2 } from "@/components/phone-otp-v2/PhoneOtpCardV2";

export const metadata = {
  title: "Phone OTP v2 — PhoneNumberInput",
  description: "Same OTP flow as v1 but with SVG flag picker (PhoneNumberInput) instead of native select.",
};

export default function PhoneOtpV2Page() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-full py-16 px-4">
      <PhoneOtpCardV2 />
    </div>
  );
}
