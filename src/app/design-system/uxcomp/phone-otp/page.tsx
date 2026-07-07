import { PhoneOtpCard } from "@/components/phone-otp/PhoneOtpCard";

export const metadata = {
  title: "Phone OTP — Single Card Flow",
  description: "Progressive inline card — phone to OTP to done, no page transitions.",
};

export default function PhoneOtpV2Page() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-full py-16 px-4">
      <PhoneOtpCard />
    </div>
  );
}
