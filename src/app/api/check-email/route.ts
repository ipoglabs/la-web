import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/user";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const trimmed = String(email || "").trim().toLowerCase();
    if (!trimmed) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Deleted accounts don't count as "taken" — matches the same
    // accountStatus exclusion used in the registration duplicate check.
    const existing = await User.findOne({
      email: trimmed,
      accountStatus: { $nin: ["Deleted"] },
    }).select("_id");

    return NextResponse.json({ exists: !!existing });
  } catch (err) {
    console.error("check-email error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}