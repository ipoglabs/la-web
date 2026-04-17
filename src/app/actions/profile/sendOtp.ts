"use server";

import { cookies } from "next/headers";

export async function sendOtp(data: {
  channel: "email" | "phone";
  value: string;
}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const cookieStore = cookies();

  const res = await fetch(`${baseUrl}/api/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieStore.toString(), // ✅ CRITICAL FIX
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.error);
  return json;
}