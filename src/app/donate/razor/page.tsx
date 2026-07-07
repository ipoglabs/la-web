"use client";

import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorPage() {
  const [loading, setLoading] = useState(false);

  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      // ✅ ALWAYS send valid JSON
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 50000, // ₹500 in paise
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Create order error:", data);
        alert(data.error || "Order creation failed");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,

        name: "Test Store",
        description: "Razorpay Payment",

        handler: async function (response: any) {
          // verify payment
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert("Payment Successful ✅");
          } else {
            alert("Payment verification failed ❌");
          }
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (resp: any) {
        console.error(resp.error);
        alert(resp.error.description || "Payment failed");
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay ₹500"}
      </button>
    </div>
  );
}