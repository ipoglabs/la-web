import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import jwt from "jsonwebtoken";

// Returns a short-lived JWT for Socket.io authentication
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = jwt.sign(
    { userId: session.userId },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" }
  );

  return NextResponse.json({ token });
}
