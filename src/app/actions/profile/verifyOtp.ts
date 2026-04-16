"use server";

export async function verifyOtp(data: {
  email: string;
  otp: string;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-otp`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.error);
  return json;
}