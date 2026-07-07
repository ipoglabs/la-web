import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import User from "@/models/user";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const email = String(body?.email || "").toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // ✅ check existing email
    const existing = await User.findOne({
      email,
      accountStatus: { $ne: "Deleted" },
    });

    return NextResponse.json({
      exists: !!existing,
    });

  } catch (err) {
    console.error("CHECK EMAIL ERROR:", err);

    return NextResponse.json(
      { error: "Failed to check email" },
      { status: 500 }
    );
  }
}