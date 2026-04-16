"use server";

export async function sendOtp(data: { email: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-otp`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.error);
  return json;
}