import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Donation from "@/models/donation";

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

    const donation = await Donation.create({
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