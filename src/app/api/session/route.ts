// app/api/session/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, user: session }, { status: 200 });
}
