'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import phoneImg from '@/app/assets/img/phone-image.svg'; // You can replace this with a phone SVG if preferred

const PhoneVerification: React.FC = () => {
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(45);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVerified && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown, isVerified]);

  const handleVerify = () => {
    if (phone.length >= 6) {
      setIsVerified(true);
      setCountdown(45);
      // Trigger backend SMS OTP here
    } else {
      alert('Please enter a valid phone number');
    }
  };

  const handleSubmitOTP = () => {
    if (otp.length === 3) {
      alert('OTP submitted');
    } else {
      alert('Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl bg-white p-10 rounded-2xl shadow-lg space-y-10">
        {/* Phone Input */}
        <div>
          <label className="block text-xl font-semibold text-black mb-2">Phone Number</label>
          <p className="text-base text-gray-500 mb-5">
            Please ensure that the phone number provided is correct
          </p>
          <div className="flex items-center gap-4">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="px-4 py-4 border border-black rounded-lg text-lg bg-white focus:outline-none"
            >
              <option value="+91">🇮🇳 +91 (India)</option>
              <option value="+65">🇸🇬 +65 (Singapore)</option>
              <option value="+44">🇬🇧 +44 (UK)</option>
            </select>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="flex-grow px-6 py-4 border border-black rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleVerify}
              className="px-6 py-4 bg-indigo-100 text-indigo-800 text-lg font-medium rounded-md hover:bg-indigo-200"
            >
              Verify
            </button>
          </div>
        </div>

        {/* OTP Verification UI */}
        {isVerified && (
          <div className="flex items-center bg-[#f5f6fa] rounded-lg p-8 border border-gray-300 gap-10">
            {/* Left: Illustration */}
            <div className="w-36 h-36 flex-shrink-0">
              <Image
                src={phoneImg}
                alt="Phone Icon"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Right: Content */}
            <div className="flex flex-col flex-grow">
              <p className="text-xl font-semibold text-gray-900 mb-2">Verify your phone</p>
              <p className="text-base text-gray-600 mb-5">
                An SMS with a 6-digit verification code was sent to your number. It will be valid for 30 minutes.
              </p>
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-mono text-lg">OTP-</span>
                <input
                  type="text"
                  maxLength={3}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter code"
                  className="w-60 px-6 py-3 border border-indigo-400 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSubmitOTP}
                  className="px-6 py-3 bg-indigo-600 text-white text-lg rounded-md hover:bg-indigo-700"
                >
                  Submit
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-3">
                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP available'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneVerification;
