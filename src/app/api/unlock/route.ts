import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { key } = await req.json();

  if (key === process.env.COMING_SOON_SECRET) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}