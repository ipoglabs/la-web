import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import AppleCompleteForm from "./AppleCompleteForm";

/** Mirrors register/google-complete/page.tsx exactly. */
export default async function AppleCompletePage() {
  const cookieStore = await cookies();
  const pendingToken = cookieStore.get("apple_pending")?.value;

  if (!pendingToken) {
    redirect("/login");
  }

  let appleData: { email: string; name: string; image: string };

  try {
    const decoded = jwt.verify(pendingToken, process.env.JWT_SECRET!) as any;
    appleData = JSON.parse(decoded.payload);
  } catch {
    redirect("/login");
  }

  return <AppleCompleteForm appleData={appleData} />;
}
