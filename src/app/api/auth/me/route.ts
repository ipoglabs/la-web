// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (e) {
    console.error("GET /api/auth/me error:", e);
    return NextResponse.json(
      { error: "Failed to load current user" },
      { status: 500 }
    );
  }
}
