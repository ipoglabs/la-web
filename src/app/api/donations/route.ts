import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Donation from "@/models/donation";
import { getAuthUser } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { donorName, donorEmail, amount, currency, method, description } = await req.json();

    if (!donorName || !donorEmail || !amount || !currency) {
      return NextResponse.json(
        { error: "Missing required donor/donation fields" },
        { status: 400 }
      );
    }

    // Server-derived from the session cookie, never trusted from the
    // request body — ties the donation to the logged-in account (if any)
    // regardless of what email the donor typed on the form, so
    // /donation-history can find it even for phone-only accounts. Guest
    // donations (not logged in) simply get no donorUserId.
    const session = await getAuthUser();

    const donation = await Donation.create({
      ...(session?.id ? { donorUserId: session.id } : {}),
      donorName,
      donorEmail,
      amount,
      currency,
      method: method ?? "unknown",
      description: description?.trim() || null,
      status: "pending",
    });

    return NextResponse.json({ id: donation._id.toString() });
  } catch (err) {
    console.error("Failed to create donation record:", err);
    return NextResponse.json(
      { error: "Could not create donation record" },
      { status: 500 }
    );
  }
}