// Typing is now handled directly via Socket.io (client emits typing:start/stop).
// This route is kept as a no-op fallback for non-WS clients.
import { NextResponse } from "next/server";

export async function POST() {
  return new NextResponse(null, { status: 204 });
}
