import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import GoogleCompleteForm from "./GoogleCompleteForm";

export default async function GoogleCompletePage() {
  const cookieStore = await cookies();
  const pendingToken = cookieStore.get("google_pending")?.value;

  if (!pendingToken) {
    redirect("/login");
  }

  let googleData: { email: string; name: string; image: string };

  try {
    const decoded = jwt.verify(pendingToken, process.env.JWT_SECRET!) as any;
    googleData = JSON.parse(decoded.payload);
  } catch {
    redirect("/login");
  }

  return <GoogleCompleteForm googleData={googleData} />;
}
